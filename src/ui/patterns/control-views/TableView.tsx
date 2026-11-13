import React, { useId, useMemo, useRef, useState } from "react";
import {
  DEFAULT_CONTROL_LABELS,
  DEFAULT_TABLE_LABELS,
  usePeerbotsI18n,
  type ControlLabels,
  type TableLabels,
} from "../../../i18n";
import {
  PEERBOTS_COLORS,
  PEERBOTS_EMOTIONS,
  type PeerbotsColor,
  type PeerbotsEmotion,
  type RobotControlButton,
  type Template,
  type TemplateHierarchy,
} from "../../../templates/types";
import { EmptyState } from "../../feedback/EmptyState";
import { Button } from "../../forms/Button";
import { Checkbox } from "../../forms/Checkbox";
import {
  EmotionSelector,
  PeerbotsEmotionIcon,
} from "../../forms/EmotionSelector";
import { Input } from "../../forms/Input";
import {
  PEERBOTS_COLOR_MAP,
  PeerbotsColorSelector,
} from "../../forms/PeerbotsColorSelector";
import { Select } from "../../forms/Select";
import { Switch } from "../../forms/Switch";
import { Icon } from "../../foundations/Icon";
import {
  Table,
  TableBody,
  TableBulkActionBar,
  TableCell,
  TableCellField,
  TableColumnApplyAllPopover,
  TableHead,
  TableHeader,
  TableRow,
  type TableResponsiveMode,
} from "../../layout/Table";
import type { TableDensity } from "../../layout/useTableState";
import { cn } from "../../utils";
import {
  createSaveAction,
  type PeerbotsButtonActionHandler,
} from "./types";

interface FlattenedTableEntry {
  buttonId: string;
  button: RobotControlButton;
  depth: number;
  isFirstSibling: boolean;
  isLastSibling: boolean;
}

/**
 * Flattens a template hierarchy while tracking sibling boundaries so
 * `Move Back` and `Move Forward` actions are accurately enabled/disabled.
 */
function flattenTemplateForTable(
  hierarchy: TemplateHierarchy,
  buttons: Record<string, RobotControlButton>,
): FlattenedTableEntry[] {
  const result: FlattenedTableEntry[] = [];
  const seen = new Set<string>();

  function walk(ids: string[], depth: number, ancestors: Set<string>) {
    const validSiblingIds: string[] = [];
    const localSeen = new Set<string>();
    for (const id of ids) {
      if (seen.has(id) || localSeen.has(id) || ancestors.has(id)) continue;
      if (!buttons[id]) continue;
      localSeen.add(id);
      validSiblingIds.push(id);
    }

    validSiblingIds.forEach((id, siblingIdx) => {
      if (seen.has(id)) return;
      seen.add(id);

      result.push({
        buttonId: id,
        button: buttons[id],
        depth,
        isFirstSibling: siblingIdx === 0,
        isLastSibling: siblingIdx === validSiblingIds.length - 1,
      });

      const children = hierarchy[id];
      if (Array.isArray(children) && children.length > 0) {
        const nextAncestors = new Set(ancestors);
        nextAncestors.add(id);
        walk(children, depth + 1, nextAncestors);
      }
    });
  }

  const rootIds = Array.isArray(hierarchy?.root) ? hierarchy.root : [];
  walk(rootIds, 0, new Set());
  return result;
}

export interface TableViewBatchSaveEntry {
  buttonId: string;
  button: RobotControlButton;
}

export interface TableViewProps {
  /** Canonical template containing `buttons` dictionary and `hierarchy` */
  template: Template;
  /** Action handler invoked for button clicks, selection, edits, moves, and deletes */
  onButtonAction: PeerbotsButtonActionHandler;
  /** Disables row editing, bulk actions, and button triggers */
  disabled?: boolean;

  /* --- Selection (Controlled or Uncontrolled) --- */
  /** Controlled multi-selected button IDs */
  selectedButtonIds?: readonly string[];
  /** Alias for `selectedButtonIds` (backward-compatible with `app.peerbots.org`) */
  multiSelectedButtonIds?: readonly string[];
  /** Initial selected button IDs when uncontrolled */
  defaultSelectedButtonIds?: readonly string[];
  /** Callback fired whenever the selected button IDs change */
  onSelectedButtonIdsChange?: (selectedIds: string[]) => void;
  /** Callback invoked when clearing multi-selection */
  onClearSelection?: () => void;

  /* --- Sync Speech with Title (Controlled or Uncontrolled) --- */
  /** Controlled Sync Speech with Title toggle */
  syncSpeech?: boolean;
  /** Alias for `syncSpeech` */
  syncTitleSpeech?: boolean;
  /** Initial Sync Speech with Title state when uncontrolled (@default true) */
  defaultSyncSpeech?: boolean;
  /** Alias for `defaultSyncSpeech` */
  defaultSyncTitleSpeech?: boolean;
  /** Callback invoked when the Sync Speech with Title toggle changes */
  onSyncSpeechChange?: (sync: boolean) => void;
  /** Alias for `onSyncSpeechChange` */
  onSyncTitleSpeechChange?: (sync: boolean) => void;

  /** Optional batch callback invoked alongside `SAVE` actions during column Apply-All */
  onBatchSave?: (updates: TableViewBatchSaveEntry[]) => void;

  /* --- Presentation & Localization --- */
  density?: TableDensity;
  responsiveMode?: TableResponsiveMode;
  emotionIcons?: Partial<Record<PeerbotsEmotion, string | React.ReactNode>>;
  emotionLabels?: Partial<Record<PeerbotsEmotion, string>>;
  colorLabels?: Partial<Record<PeerbotsColor, string>>;
  labels?: Partial<ControlLabels>;
  tableLabels?: Partial<TableLabels>;
  className?: string;
}

export function TableView({
  template,
  onButtonAction,
  disabled = false,
  selectedButtonIds,
  multiSelectedButtonIds,
  defaultSelectedButtonIds = [],
  onSelectedButtonIdsChange,
  onClearSelection,
  syncSpeech,
  syncTitleSpeech,
  defaultSyncSpeech,
  defaultSyncTitleSpeech,
  onSyncSpeechChange,
  onSyncTitleSpeechChange,
  onBatchSave,
  density = "compact",
  responsiveMode = "scroll",
  emotionIcons,
  emotionLabels,
  colorLabels,
  labels,
  tableLabels: propTableLabels,
  className,
}: TableViewProps) {
  const { labels: contextLabels } = usePeerbotsI18n();
  const syncSwitchId = useId();
  const lastClickedRowIndexRef = useRef<number | null>(null);
  const shiftKeyRef = useRef<boolean>(false);

  // Sync Speech with Title state (controlled or uncontrolled; defaults to true)
  const controlledSync = syncSpeech ?? syncTitleSpeech;
  const initialSync = defaultSyncSpeech ?? defaultSyncTitleSpeech ?? true;
  const [uncontrolledSync, setUncontrolledSync] = useState<boolean>(initialSync);
  const isSyncControlled = controlledSync !== undefined;
  const syncActive = isSyncControlled ? controlledSync : uncontrolledSync;

  const handleToggleSync = (nextValue: boolean) => {
    if (disabled) return;
    if (!isSyncControlled) {
      setUncontrolledSync(nextValue);
    }
    onSyncSpeechChange?.(nextValue);
    onSyncTitleSpeechChange?.(nextValue);
  };

  // Selection state (controlled or uncontrolled)
  const controlledSelection = selectedButtonIds ?? multiSelectedButtonIds;
  const [uncontrolledSelection, setUncontrolledSelection] = useState<string[]>(
    () => [...defaultSelectedButtonIds],
  );
  const isSelectionControlled = controlledSelection !== undefined;
  const activeSelectedIds = useMemo(
    () =>
      isSelectionControlled ? [...controlledSelection] : uncontrolledSelection,
    [isSelectionControlled, controlledSelection, uncontrolledSelection],
  );
  const selectedSet = useMemo(
    () => new Set(activeSelectedIds),
    [activeSelectedIds],
  );

  const updateSelectionState = (nextIds: string[]) => {
    if (!isSelectionControlled) {
      setUncontrolledSelection(nextIds);
    }
    onSelectedButtonIdsChange?.(nextIds);
  };

  // Labels resolution
  const resolvedLabels: ControlLabels = {
    ...DEFAULT_CONTROL_LABELS,
    ...contextLabels?.control,
    ...labels,
  };

  const resolvedTableLabels: TableLabels = {
    ...DEFAULT_TABLE_LABELS,
    ...contextLabels?.table,
    ...propTableLabels,
  };

  // Rows & derived slices
  const visibleRows = useMemo(
    () => flattenTemplateForTable(template.hierarchy, template.buttons),
    [template.hierarchy, template.buttons],
  );

  const allRowIds = useMemo(
    () => visibleRows.map((r) => r.buttonId),
    [visibleRows],
  );

  const selectedEntries = useMemo(
    () => visibleRows.filter((r) => selectedSet.has(r.buttonId)),
    [visibleRows, selectedSet],
  );

  const selectedRowIdsInView = useMemo(
    () => selectedEntries.map((r) => r.buttonId),
    [selectedEntries],
  );

  const messageEntries = useMemo(
    () => visibleRows.filter((r) => r.button.type === "Message"),
    [visibleRows],
  );
  const messageRowIds = useMemo(
    () => messageEntries.map((r) => r.buttonId),
    [messageEntries],
  );
  const selectedMessageEntries = useMemo(
    () => selectedEntries.filter((r) => r.button.type === "Message"),
    [selectedEntries],
  );
  const selectedMessageRowIds = useMemo(
    () => selectedMessageEntries.map((r) => r.buttonId),
    [selectedMessageEntries],
  );

  const selectedCount = selectedRowIdsInView.length;
  const allSelected =
    visibleRows.length > 0 && selectedCount === visibleRows.length;
  const someSelected = !allSelected && selectedCount > 0;

  const colorOptions = useMemo(
    () =>
      PEERBOTS_COLORS.map((colorName) => ({
        label: colorLabels?.[colorName] ?? colorName,
        value: colorName,
      })),
    [colorLabels],
  );

  const emotionOptions = useMemo(
    () =>
      PEERBOTS_EMOTIONS.map((emotionName) => ({
        label: emotionLabels?.[emotionName] ?? emotionName,
        value: emotionName,
      })),
    [emotionLabels],
  );

  const handleToggleAll = (checked: boolean) => {
    if (disabled) return;
    if (checked) {
      const nextSet = new Set(selectedSet);
      for (const entry of visibleRows) {
        if (!nextSet.has(entry.buttonId)) {
          nextSet.add(entry.buttonId);
          onButtonAction(entry.button, entry.buttonId, {
            type: "ADD TO SELECTION",
          });
        }
      }
      updateSelectionState(Array.from(nextSet));
    } else {
      for (const entry of selectedEntries) {
        onButtonAction(entry.button, entry.buttonId, {
          type: "REMOVE FROM SELECTION",
        });
      }
      updateSelectionState([]);
      onClearSelection?.();
    }
  };

  const handleClearSelection = () => {
    if (disabled) return;
    for (const entry of selectedEntries) {
      onButtonAction(entry.button, entry.buttonId, {
        type: "REMOVE FROM SELECTION",
      });
    }
    updateSelectionState([]);
    onClearSelection?.();
  };

  const handleToggleRow = (
    entry: FlattenedTableEntry,
    rowIndex: number,
    checked: boolean,
    shiftKey = false,
  ) => {
    if (disabled) return;

    if (
      shiftKey &&
      lastClickedRowIndexRef.current !== null &&
      lastClickedRowIndexRef.current !== rowIndex
    ) {
      const start = Math.min(lastClickedRowIndexRef.current, rowIndex);
      const end = Math.max(lastClickedRowIndexRef.current, rowIndex);
      const nextSet = new Set(selectedSet);

      for (let i = start; i <= end; i++) {
        const rangeEntry = visibleRows[i];
        if (!rangeEntry) continue;
        const wasSelected = nextSet.has(rangeEntry.buttonId);
        if (checked && !wasSelected) {
          nextSet.add(rangeEntry.buttonId);
          onButtonAction(rangeEntry.button, rangeEntry.buttonId, {
            type: "ADD TO SELECTION",
          });
        } else if (!checked && wasSelected) {
          nextSet.delete(rangeEntry.buttonId);
          onButtonAction(rangeEntry.button, rangeEntry.buttonId, {
            type: "REMOVE FROM SELECTION",
          });
        }
      }

      lastClickedRowIndexRef.current = rowIndex;
      updateSelectionState(Array.from(nextSet));
      return;
    }

    lastClickedRowIndexRef.current = rowIndex;
    const nextSet = new Set(selectedSet);
    if (checked) {
      nextSet.add(entry.buttonId);
      onButtonAction(entry.button, entry.buttonId, {
        type: "ADD TO SELECTION",
      });
    } else {
      nextSet.delete(entry.buttonId);
      onButtonAction(entry.button, entry.buttonId, {
        type: "REMOVE FROM SELECTION",
      });
    }
    updateSelectionState(Array.from(nextSet));
  };

  const dispatchBatchUpdates = (updates: TableViewBatchSaveEntry[]) => {
    if (disabled || updates.length === 0) return;
    for (const { buttonId, button: updated } of updates) {
      const original = template.buttons[buttonId];
      if (original) {
        onButtonAction(original, buttonId, createSaveAction(updated));
      }
    }
    onBatchSave?.(updates);
  };

  const columnLabels = useMemo(
    () => [
      resolvedLabels.selectButton,
      resolvedLabels.buttonTitle,
      resolvedLabels.buttonType,
      resolvedLabels.speechDetails,
      resolvedLabels.labelColor,
      resolvedLabels.robotColor,
      resolvedLabels.emotion,
      resolvedLabels.actions,
    ],
    [resolvedLabels],
  );

  return (
    <Table.Container
      variant="surface"
      radius="lg"
      ariaLabel={template.title || "Template buttons table"}
      className={className}
    >
      {/* Top Toolbar: Row Count Badge + Sync Speech with Title Switch */}
      <div className="pb:flex pb:flex-wrap pb:items-center pb:justify-between pb:gap-3 pb:px-4 pb:py-2.5 pb:bg-gray-50/80 pb:border-b pb:border-gray-200">
        <div className="pb:flex pb:items-center pb:gap-2">
          <span className="pb:inline-flex pb:items-center pb:px-2.5 pb:py-0.5 pb:rounded-full pb:text-xs pb:font-semibold pb:bg-white pb:text-gray-700 pb:border pb:border-gray-200 pb:shadow-2xs">
            {`${visibleRows.length} ${visibleRows.length === 1 ? "button" : "buttons"}`}
          </span>
        </div>

        <div className="pb:flex pb:items-center pb:gap-2">
          <label
            htmlFor={syncSwitchId}
            className="pb:text-xs pb:font-semibold pb:text-gray-700 pb:cursor-pointer pb:select-none"
          >
            {resolvedLabels.syncSpeechWithTitle}
          </label>
          <Switch
            id={syncSwitchId}
            name="syncSpeechWithTitle"
            aria-label={resolvedLabels.syncTitleSpeechAria}
            checked={syncActive}
            onChange={(checked) => handleToggleSync(Boolean(checked))}
            disabled={disabled}
          />
        </div>
      </div>

      {/* Bulk Action Bar when rows are selected */}
      {!disabled && selectedCount > 0 && (
        <TableBulkActionBar
          selectedCount={selectedCount}
          totalCount={visibleRows.length}
          onClearSelection={handleClearSelection}
          onSelectAllRows={
            selectedCount < visibleRows.length
              ? () => handleToggleAll(true)
              : undefined
          }
          labels={resolvedTableLabels}
        >
          <Button
            size="xs"
            variant="soft"
            color="neutral"
            aria-label="Move selected back"
            leftIcon={<Icon name="arrowUp" size="sm" aria-hidden="true" />}
            onClick={() => {
              selectedEntries.forEach((entry) => {
                onButtonAction(entry.button, entry.buttonId, {
                  type: "MOVE",
                  direction: "BACK",
                });
              });
            }}
          >
            Move Back
          </Button>
          <Button
            size="xs"
            variant="soft"
            color="neutral"
            aria-label="Move selected forward"
            leftIcon={<Icon name="arrowDown" size="sm" aria-hidden="true" />}
            onClick={() => {
              selectedEntries.forEach((entry) => {
                onButtonAction(entry.button, entry.buttonId, {
                  type: "MOVE",
                  direction: "FORWARD",
                });
              });
            }}
          >
            Move Forward
          </Button>
          <Button
            size="xs"
            variant="soft"
            color="danger"
            aria-label="Delete selected buttons"
            leftIcon={<Icon name="close" size="sm" aria-hidden="true" />}
            onClick={() => {
              const deletedIds = new Set(
                selectedEntries.map((e) => e.buttonId),
              );
              selectedEntries.forEach((entry) => {
                onButtonAction(entry.button, entry.buttonId, {
                  type: "DELETE",
                });
              });
              if (!isSelectionControlled) {
                setUncontrolledSelection((prev) =>
                  prev.filter((id) => !deletedIds.has(id)),
                );
              }
              onSelectedButtonIdsChange?.(
                activeSelectedIds.filter((id) => !deletedIds.has(id)),
              );
            }}
          >
            Delete
          </Button>
        </TableBulkActionBar>
      )}

      <Table.Root
        stickyHeader
        stickyRowHeader={false}
        responsiveMode={responsiveMode}
        columnLabels={columnLabels}
        className="pb:min-w-[820px]"
      >
        <TableHeader>
          <tr>
            {/* Selection Column */}
            <TableHead
              density={density}
              align="center"
              className="pb:w-11 pb:px-3"
            >
              <div className="pb:flex pb:items-center pb:justify-center">
                <Checkbox
                  aria-label={resolvedLabels.selectAll}
                  checked={allSelected}
                  indeterminate={someSelected}
                  disabled={disabled || visibleRows.length === 0}
                  onCheckedChange={handleToggleAll}
                />
              </div>
            </TableHead>

            {/* Title Column */}
            <TableHead density={density} className="pb:min-w-[220px]">
              {resolvedLabels.buttonTitle}
            </TableHead>

            {/* Type Column */}
            <TableHead density={density} className="pb:w-[116px]">
              {resolvedLabels.buttonType}
            </TableHead>

            {/* Speech / Details Column */}
            <TableHead density={density} className="pb:min-w-[220px]">
              {resolvedLabels.speechDetails}
            </TableHead>

            {/* Label Color Column + Apply All Swatch Popover */}
            <TableHead
              density={density}
              className="pb:w-[152px]"
              headerAction={
                !disabled && visibleRows.length > 0 ? (
                  <TableColumnApplyAllPopover<FlattenedTableEntry, PeerbotsColor>
                    columnTitle={resolvedLabels.labelColor}
                    allRows={visibleRows}
                    allRowIds={allRowIds}
                    selectedRows={selectedEntries}
                    selectedRowIds={selectedRowIdsInView}
                    labels={resolvedTableLabels}
                    config={{
                      defaultValue: "Light Blue",
                      renderControl: ({ value, onChange }) => (
                        <div className="pb:flex pb:flex-col pb:gap-2">
                          <span className="pb:text-xs pb:font-semibold pb:text-gray-700">
                            {`${resolvedLabels.labelColor}: ${colorLabels?.[value] ?? value}`}
                          </span>
                          <PeerbotsColorSelector
                            selectedColor={value}
                            onColorSelect={onChange}
                            size="sm"
                          />
                        </div>
                      ),
                      onApply: (nextColor, target) => {
                        const updates = target.rows.map((entry) => ({
                          buttonId: entry.buttonId,
                          button: {
                            ...entry.button,
                            labelColor: nextColor,
                          },
                        }));
                        dispatchBatchUpdates(updates);
                      },
                    }}
                  />
                ) : undefined
              }
            >
              {resolvedLabels.labelColor}
            </TableHead>

            {/* Robot Color Column + Apply All Swatch Popover */}
            <TableHead
              density={density}
              className="pb:w-[152px]"
              headerAction={
                !disabled && messageEntries.length > 0 ? (
                  <TableColumnApplyAllPopover<FlattenedTableEntry, PeerbotsColor>
                    columnTitle={resolvedLabels.robotColor}
                    allRows={messageEntries}
                    allRowIds={messageRowIds}
                    selectedRows={selectedMessageEntries}
                    selectedRowIds={selectedMessageRowIds}
                    labels={resolvedTableLabels}
                    config={{
                      defaultValue: "Light Blue",
                      renderControl: ({ value, onChange }) => (
                        <div className="pb:flex pb:flex-col pb:gap-2">
                          <span className="pb:text-xs pb:font-semibold pb:text-gray-700">
                            {`${resolvedLabels.robotColor}: ${colorLabels?.[value] ?? value}`}
                          </span>
                          <PeerbotsColorSelector
                            selectedColor={value}
                            onColorSelect={onChange}
                            size="sm"
                          />
                        </div>
                      ),
                      onApply: (nextColor, target) => {
                        const updates: TableViewBatchSaveEntry[] = [];
                        for (const entry of target.rows) {
                          if (entry.button.type === "Message") {
                            updates.push({
                              buttonId: entry.buttonId,
                              button: {
                                ...entry.button,
                                details: {
                                  ...entry.button.details,
                                  color: nextColor,
                                },
                              },
                            });
                          }
                        }
                        dispatchBatchUpdates(updates);
                      },
                    }}
                  />
                ) : undefined
              }
            >
              {resolvedLabels.robotColor}
            </TableHead>

            {/* Emotion Column + Apply All PNG Emotion Popover */}
            <TableHead
              density={density}
              className="pb:w-[176px]"
              headerAction={
                !disabled && messageEntries.length > 0 ? (
                  <TableColumnApplyAllPopover<
                    FlattenedTableEntry,
                    PeerbotsEmotion
                  >
                    columnTitle={resolvedLabels.emotion}
                    allRows={messageEntries}
                    allRowIds={messageRowIds}
                    selectedRows={selectedMessageEntries}
                    selectedRowIds={selectedMessageRowIds}
                    labels={resolvedTableLabels}
                    config={{
                      defaultValue: "Neutral",
                      renderControl: ({ value, onChange }) => (
                        <div className="pb:flex pb:flex-col pb:gap-2">
                          <span className="pb:text-xs pb:font-semibold pb:text-gray-700">
                            {`${resolvedLabels.emotion}: ${emotionLabels?.[value] ?? value}`}
                          </span>
                          <EmotionSelector
                            selectedEmotion={value}
                            onEmotionSelect={onChange}
                            emotionIcons={emotionIcons}
                            emotionLabels={emotionLabels}
                            size="sm"
                          />
                        </div>
                      ),
                      onApply: (nextEmotion, target) => {
                        const updates: TableViewBatchSaveEntry[] = [];
                        for (const entry of target.rows) {
                          if (entry.button.type === "Message") {
                            updates.push({
                              buttonId: entry.buttonId,
                              button: {
                                ...entry.button,
                                details: {
                                  ...entry.button.details,
                                  emotion: nextEmotion,
                                },
                              },
                            });
                          }
                        }
                        dispatchBatchUpdates(updates);
                      },
                    }}
                  />
                ) : undefined
              }
            >
              {resolvedLabels.emotion}
            </TableHead>

            {/* Actions Column */}
            <TableHead
              density={density}
              align="end"
              className="pb:w-[112px]"
            >
              {resolvedLabels.actions}
            </TableHead>
          </tr>
        </TableHeader>

        <TableBody>
          {visibleRows.length === 0 ? (
            <tr>
              <td colSpan={8} className="pb:p-6">
                <EmptyState
                  icon="tableCells"
                  title={resolvedLabels.emptyTemplateTitle}
                  description={resolvedLabels.emptyTemplateDescription}
                />
              </td>
            </tr>
          ) : (
            visibleRows.map((entry, rowIndex) => {
              const {
                buttonId,
                button,
                depth,
                isFirstSibling,
                isLastSibling,
              } = entry;
              const isSelected = selectedSet.has(buttonId);
              const rowName = button.details.title || buttonId;
              const labelColorHex =
                PEERBOTS_COLOR_MAP[button.labelColor] ?? button.labelColor;

              return (
                <TableRow
                  key={buttonId}
                  selected={isSelected}
                  disabled={disabled}
                >
                  {/* 1. Row Selection Checkbox */}
                  <TableCell
                    density={density}
                    hasLabel={false}
                    align="center"
                    className="pb:w-11 pb:px-3"
                  >
                    <div
                      className="pb:flex pb:items-center pb:justify-center"
                      onClickCapture={(e) => {
                        shiftKeyRef.current = e.shiftKey;
                      }}
                    >
                      <Checkbox
                        aria-label={`${resolvedLabels.selectButton}: ${rowName}`}
                        checked={isSelected}
                        disabled={disabled}
                        onCheckedChange={(checked) => {
                          const isShift = shiftKeyRef.current;
                          shiftKeyRef.current = false;
                          handleToggleRow(entry, rowIndex, checked, isShift);
                        }}
                      />
                    </div>
                  </TableCell>

                  {/* 2. Depth-Indented Title + Play Trigger */}
                  <TableCell density={density}>
                    <div
                      className="pb:flex pb:items-center pb:gap-1.5 pb:min-w-0"
                      style={
                        depth > 0
                          ? { paddingInlineStart: `${depth * 20}px` }
                          : undefined
                      }
                    >
                      {depth > 0 && (
                        <span
                          aria-hidden="true"
                          className="pb:text-gray-400 pb:text-xs pb:select-none pb:shrink-0"
                        >
                          ↳
                        </span>
                      )}
                      <Button
                        size="xs"
                        variant="ghost"
                        color="teal"
                        isIconOnly
                        disabled={disabled}
                        title={resolvedLabels.sendMessage}
                        aria-label={`${resolvedLabels.sendMessage}: ${rowName}`}
                        onClick={() => {
                          if (disabled) return;
                          onButtonAction(button, buttonId, { type: "CLICK" });
                          onButtonAction(button, buttonId, { type: "SELECT" });
                        }}
                        className="pb:shrink-0"
                      >
                        <Icon name="play" size="sm" aria-hidden="true" />
                      </Button>

                      <span
                        aria-hidden="true"
                        className="pb:w-2.5 pb:h-2.5 pb:rounded-full pb:border pb:border-black/20 pb:shrink-0"
                        style={{ backgroundColor: labelColorHex }}
                      />

                      <div className="pb:flex-1 pb:min-w-0">
                        <TableCellField
                          cellVariant="compact"
                          label={`${resolvedLabels.buttonTitle}: ${rowName}`}
                        >
                          <Input
                            size="sm"
                            variant="compact"
                            disabled={disabled}
                            placeholder={resolvedLabels.buttonTitle}
                            value={button.details.title}
                            onFocus={() => {
                              if (!disabled) {
                                onButtonAction(button, buttonId, {
                                  type: "SELECT",
                                });
                              }
                            }}
                            onChange={(e) => {
                              if (disabled) return;
                              const nextTitle = e.target.value;
                              if (button.type === "Log") {
                                onButtonAction(
                                  button,
                                  buttonId,
                                  createSaveAction({
                                    ...button,
                                    details: {
                                      ...button.details,
                                      title: nextTitle,
                                      ...(syncActive && { details: nextTitle }),
                                    },
                                  }),
                                );
                              } else {
                                onButtonAction(
                                  button,
                                  buttonId,
                                  createSaveAction({
                                    ...button,
                                    details: {
                                      ...button.details,
                                      title: nextTitle,
                                      ...(syncActive && { speech: nextTitle }),
                                    },
                                  }),
                                );
                              }
                            }}
                          />
                        </TableCellField>
                      </div>
                    </div>
                  </TableCell>

                  {/* 3. Button Type (Message vs Log) */}
                  <TableCell density={density}>
                    <TableCellField
                      cellVariant="compact"
                      label={`${resolvedLabels.buttonType}: ${rowName}`}
                    >
                      <Select
                        size="sm"
                        variant="compact"
                        disabled={disabled}
                        aria-label={`${resolvedLabels.buttonType}: ${rowName}`}
                        value={button.type}
                        options={[
                          { label: resolvedLabels.message, value: "Message" },
                          { label: resolvedLabels.log, value: "Log" },
                        ]}
                        onChange={(val) => {
                          if (disabled || !val) return;
                          if (button.type === "Message" && val === "Log") {
                            onButtonAction(
                              button,
                              buttonId,
                              createSaveAction({
                                type: "Log",
                                labelColor: button.labelColor,
                                details: {
                                  title: button.details.title,
                                  details: button.details.speech,
                                },
                              }),
                            );
                          } else if (
                            button.type === "Log" &&
                            val === "Message"
                          ) {
                            onButtonAction(
                              button,
                              buttonId,
                              createSaveAction({
                                type: "Message",
                                labelColor: button.labelColor,
                                details: {
                                  title: button.details.title,
                                  speech:
                                    button.details.details ||
                                    button.details.title,
                                  color: button.labelColor,
                                  emotion: "Neutral",
                                },
                              }),
                            );
                          }
                        }}
                      />
                    </TableCellField>
                  </TableCell>

                  {/* 4. Speech / Details (Disabled when Sync Speech with Title is ON) */}
                  <TableCell density={density}>
                    {button.type === "Message" ? (
                      <TableCellField
                        cellVariant="compact"
                        label={`${resolvedLabels.speech}: ${rowName}`}
                      >
                        <Input
                          size="sm"
                          variant="compact"
                          disabled={disabled || syncActive}
                          placeholder={resolvedLabels.speech}
                          value={button.details.speech}
                          onFocus={() => {
                            if (!disabled) {
                              onButtonAction(button, buttonId, {
                                type: "SELECT",
                              });
                            }
                          }}
                          onChange={(e) => {
                            if (disabled || syncActive) return;
                            onButtonAction(
                              button,
                              buttonId,
                              createSaveAction({
                                ...button,
                                details: {
                                  ...button.details,
                                  speech: e.target.value,
                                },
                              }),
                            );
                          }}
                        />
                      </TableCellField>
                    ) : (
                      <TableCellField
                        cellVariant="compact"
                        label={`${resolvedLabels.details}: ${rowName}`}
                      >
                        <Input
                          size="sm"
                          variant="compact"
                          disabled={disabled || syncActive}
                          placeholder={resolvedLabels.details}
                          value={button.details.details ?? ""}
                          onFocus={() => {
                            if (!disabled) {
                              onButtonAction(button, buttonId, {
                                type: "SELECT",
                              });
                            }
                          }}
                          onChange={(e) => {
                            if (disabled || syncActive) return;
                            onButtonAction(
                              button,
                              buttonId,
                              createSaveAction({
                                ...button,
                                details: {
                                  ...button.details,
                                  details: e.target.value,
                                },
                              }),
                            );
                          }}
                        />
                      </TableCellField>
                    )}
                  </TableCell>

                  {/* 5. Label Color */}
                  <TableCell density={density}>
                    <div className="pb:flex pb:items-center pb:gap-1.5">
                      <span
                        aria-hidden="true"
                        className="pb:w-3.5 pb:h-3.5 pb:rounded-full pb:border pb:border-black/20 pb:shrink-0"
                        style={{ backgroundColor: labelColorHex }}
                      />
                      <div className="pb:flex-1 pb:min-w-0">
                        <TableCellField
                          cellVariant="compact"
                          label={`${resolvedLabels.labelColor} (${rowName})`}
                        >
                          <Select
                            size="sm"
                            variant="compact"
                            disabled={disabled}
                            aria-label={`${resolvedLabels.labelColor}: ${rowName}`}
                            value={button.labelColor}
                            options={colorOptions}
                            onChange={(val) => {
                              if (!val || disabled) return;
                              onButtonAction(
                                button,
                                buttonId,
                                createSaveAction({
                                  ...button,
                                  labelColor: val as PeerbotsColor,
                                }),
                              );
                            }}
                          />
                        </TableCellField>
                      </div>
                    </div>
                  </TableCell>

                  {/* 6. Robot Color (Message rows only) */}
                  <TableCell density={density}>
                    {button.type === "Message" ? (
                      <div className="pb:flex pb:items-center pb:gap-1.5">
                        <span
                          aria-hidden="true"
                          className="pb:w-3.5 pb:h-3.5 pb:rounded-full pb:border pb:border-black/20 pb:shrink-0"
                          style={{
                            backgroundColor:
                              PEERBOTS_COLOR_MAP[button.details.color] ??
                              button.details.color,
                          }}
                        />
                        <div className="pb:flex-1 pb:min-w-0">
                          <TableCellField
                            cellVariant="compact"
                            label={`${resolvedLabels.robotColor} (${rowName})`}
                          >
                            <Select
                              size="sm"
                              variant="compact"
                              disabled={disabled}
                              aria-label={`${resolvedLabels.robotColor}: ${rowName}`}
                              value={button.details.color}
                              options={colorOptions}
                              onChange={(val) => {
                                if (!val || disabled) return;
                                onButtonAction(
                                  button,
                                  buttonId,
                                  createSaveAction({
                                    ...button,
                                    details: {
                                      ...button.details,
                                      color: val as PeerbotsColor,
                                    },
                                  }),
                                );
                              }}
                            />
                          </TableCellField>
                        </div>
                      </div>
                    ) : (
                      <span className="pb:text-xs pb:text-gray-400">—</span>
                    )}
                  </TableCell>

                  {/* 7. Emotion with Real PNG Icon (Message rows only) */}
                  <TableCell density={density}>
                    {button.type === "Message" ? (
                      <div className="pb:flex pb:items-center pb:gap-1.5">
                        <span
                          aria-hidden="true"
                          className="pb:rounded-full pb:h-6 pb:w-6 pb:p-0.5 pb:border pb:border-black/20 pb:shrink-0 pb:flex pb:items-center pb:justify-center"
                          style={{
                            backgroundColor:
                              PEERBOTS_COLOR_MAP[button.details.color] ??
                              button.details.color,
                          }}
                        >
                          <PeerbotsEmotionIcon
                            emotion={button.details.emotion}
                            customIcon={emotionIcons?.[button.details.emotion]}
                            decorative
                          />
                        </span>
                        <div className="pb:flex-1 pb:min-w-0">
                          <TableCellField
                            cellVariant="compact"
                            label={`${resolvedLabels.emotion} (${rowName})`}
                          >
                            <Select
                              size="sm"
                              variant="compact"
                              disabled={disabled}
                              aria-label={`${resolvedLabels.emotion}: ${rowName}`}
                              value={button.details.emotion}
                              options={emotionOptions}
                              onChange={(val) => {
                                if (!val || disabled) return;
                                onButtonAction(
                                  button,
                                  buttonId,
                                  createSaveAction({
                                    ...button,
                                    details: {
                                      ...button.details,
                                      emotion: val as PeerbotsEmotion,
                                    },
                                  }),
                                );
                              }}
                            />
                          </TableCellField>
                        </div>
                      </div>
                    ) : (
                      <span className="pb:text-xs pb:text-gray-400">—</span>
                    )}
                  </TableCell>

                  {/* 8. Row Actions (Move Back, Move Forward, Delete) */}
                  <TableCell density={density} align="end">
                    <div className="pb:inline-flex pb:items-center pb:gap-0.5">
                      <Button
                        size="xs"
                        variant="ghost"
                        color="neutral"
                        isIconOnly
                        disabled={disabled || isFirstSibling}
                        aria-label={`${resolvedLabels.moveUp}: ${rowName}`}
                        title={resolvedLabels.moveUp}
                        onClick={() => {
                          if (disabled || isFirstSibling) return;
                          onButtonAction(button, buttonId, { type: "SELECT" });
                          onButtonAction(button, buttonId, {
                            type: "MOVE",
                            direction: "BACK",
                          });
                        }}
                      >
                        <Icon name="arrowUp" size="sm" aria-hidden="true" />
                      </Button>

                      <Button
                        size="xs"
                        variant="ghost"
                        color="neutral"
                        isIconOnly
                        disabled={disabled || isLastSibling}
                        aria-label={`${resolvedLabels.moveDown}: ${rowName}`}
                        title={resolvedLabels.moveDown}
                        onClick={() => {
                          if (disabled || isLastSibling) return;
                          onButtonAction(button, buttonId, { type: "SELECT" });
                          onButtonAction(button, buttonId, {
                            type: "MOVE",
                            direction: "FORWARD",
                          });
                        }}
                      >
                        <Icon name="arrowDown" size="sm" aria-hidden="true" />
                      </Button>

                      <Button
                        size="xs"
                        variant="ghost"
                        color="danger"
                        isIconOnly
                        disabled={disabled}
                        aria-label={`${resolvedLabels.deleteButton}: ${rowName}`}
                        title={resolvedLabels.deleteButton}
                        onClick={() => {
                          if (disabled) return;
                          onButtonAction(button, buttonId, { type: "DELETE" });
                          if (selectedSet.has(buttonId)) {
                            const nextIds = activeSelectedIds.filter(
                              (id) => id !== buttonId,
                            );
                            updateSelectionState(nextIds);
                          }
                        }}
                      >
                        <Icon name="close" size="sm" aria-hidden="true" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table.Root>
    </Table.Container>
  );
}

export const PeerbotsTableView = TableView;
