import React, { useId, useMemo } from "react";
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
  type Template,
} from "../../../templates/types";
import { EmptyState } from "../../feedback/EmptyState";
import { Button } from "../../forms/Button";
import { Checkbox } from "../../forms/Checkbox";
import { EmotionSelector } from "../../forms/EmotionSelector";
import { PeerbotsColorSelector } from "../../forms/PeerbotsColorSelector";
import { Switch } from "../../forms/Switch";
import { Icon } from "../../foundations/Icon";
import {
  Table,
  TableBody,
  TableBulkActionBar,
  TableColumnApplyAllPopover,
  TableHead,
  TableHeader,
  type TableResponsiveMode,
} from "../../layout/Table";
import type { TableDensity } from "../../layout/useTableState";
import {
  flattenTemplateForTable,
  type FlattenedTableEntry,
  type TableViewBatchSaveEntry,
} from "./tableViewHelpers";
import { TableViewRow } from "./TableViewRow";
import type { PeerbotsButtonActionHandler } from "./types";
import { useTemplateControlState } from "./useTemplateControlState";

export type { TableViewBatchSaveEntry } from "./tableViewHelpers";

/**
 * Props for {@link TableView}, the semantic Peerbots template table editor built on
 * the `@peerbots/core` `Table` suite.
 */
export interface TableViewProps {
  /** Canonical template containing `buttons` dictionary and `hierarchy`. */
  template: Template;
  /** Action handler invoked for button clicks, selection, edits, moves, and deletes. */
  onButtonAction: PeerbotsButtonActionHandler;
  /** Disables row editing, bulk actions, and button triggers when `true`. */
  disabled?: boolean;

  /* --- Selection (Controlled or Uncontrolled) --- */
  /** Primary active/last-triggered button ID highlighted with subtle row emphasis. */
  selectedButtonId?: string | null;
  /** Controlled multi-selected button IDs. */
  selectedButtonIds?: readonly string[];
  /** Alias for `selectedButtonIds` (backward-compatible with `app.peerbots.org`). */
  multiSelectedButtonIds?: readonly string[];
  /** Initial selected button IDs when uncontrolled. */
  defaultSelectedButtonIds?: readonly string[];
  /** Callback fired whenever the multi-selected button IDs change. */
  onSelectedButtonIdsChange?: (selectedIds: string[]) => void;
  /** Callback invoked when clearing multi-selection. */
  onClearSelection?: () => void;

  /* --- Sync Speech with Title (Controlled or Uncontrolled) --- */
  /** Controlled Sync Speech with Title toggle. */
  syncSpeech?: boolean;
  /** Alias for `syncSpeech`. */
  syncTitleSpeech?: boolean;
  /**
   * Initial Sync Speech with Title state when uncontrolled.
   * @default true
   */
  defaultSyncSpeech?: boolean;
  /** Alias for `defaultSyncSpeech`. */
  defaultSyncTitleSpeech?: boolean;
  /** Callback invoked when the Sync Speech with Title toggle changes. */
  onSyncSpeechChange?: (sync: boolean) => void;
  /** Alias for `onSyncSpeechChange`. */
  onSyncTitleSpeechChange?: (sync: boolean) => void;

  /** Optional batch callback invoked alongside `SAVE` actions during column Apply-All. */
  onBatchSave?: (updates: TableViewBatchSaveEntry[]) => void;

  /* --- Presentation & Localization --- */
  /**
   * Row vertical padding density preset.
   * @default "compact"
   */
  density?: TableDensity;
  /**
   * Responsive overflow behavior on narrow viewports.
   * @default "scroll"
   */
  responsiveMode?: TableResponsiveMode;
  /** Optional custom emotion icon overrides per `PeerbotsEmotion`. */
  emotionIcons?: Partial<Record<PeerbotsEmotion, string | React.ReactNode>>;
  /** Optional localized display names per `PeerbotsEmotion`. */
  emotionLabels?: Partial<Record<PeerbotsEmotion, string>>;
  /** Optional localized display names per `PeerbotsColor`. */
  colorLabels?: Partial<Record<PeerbotsColor, string>>;
  /** Optional localized control view UI strings. */
  labels?: Partial<ControlLabels>;
  /** Optional localized table primitive strings (bulk bar, apply-all popovers). */
  tableLabels?: Partial<TableLabels>;
  /** Optional additional CSS classes applied to `<Table.Container>`. */
  className?: string;
}

/**
 * Semantic tabular editor and live controller view for Peerbots templates.
 *
 * Renders sticky column headers, color-tinted controller button pills and color
 * select triggers (WCAG 2.1 AA contrast via `PEERBOTS_COLOR_MAP` + `PEERBOTS_FONT_COLOR_MAP`),
 * robot face expression preview tiles, Shift+Click multi-row selection, bulk
 * reordering/deletion, and column-wide Apply-All popovers.
 */
export function TableView({
  template,
  onButtonAction,
  disabled = false,
  selectedButtonId = null,
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

  const {
    syncActive,
    handleToggleSync,
    selectedSet,
    selectedEntries,
    handleToggleAll,
    handleClearSelection,
    handleToggleRow,
    removeFromSelection,
    dispatchBatchUpdates,
  } = useTemplateControlState({
    template,
    visibleEntries: visibleRows,
    onButtonAction,
    disabled,
    selectedButtonIds,
    multiSelectedButtonIds,
    defaultSelectedButtonIds,
    onSelectedButtonIdsChange,
    onClearSelection,
    syncSpeech,
    syncTitleSpeech,
    defaultSyncSpeech,
    defaultSyncTitleSpeech,
    onSyncSpeechChange,
    onSyncTitleSpeechChange,
    onBatchSave,
  });

  const allRowIds = useMemo(
    () => visibleRows.map((r) => r.buttonId),
    [visibleRows],
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
    () =>
      visibleRows.filter(
        (r) => selectedSet.has(r.buttonId) && r.button.type === "Message",
      ),
    [visibleRows, selectedSet],
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
              removeFromSelection(deletedIds);
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
        className="pb:min-w-[840px]"
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
            <TableHead density={density} className="pb:min-w-[230px]">
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
                    selectedRows={selectedEntries as FlattenedTableEntry[]}
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
              className="pb:w-[180px]"
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
            visibleRows.map((entry, rowIndex) => (
              <TableViewRow
                key={entry.buttonId}
                entry={entry}
                rowIndex={rowIndex}
                density={density}
                disabled={disabled}
                syncActive={syncActive}
                isSelected={selectedSet.has(entry.buttonId)}
                isActiveRow={selectedButtonId === entry.buttonId}
                colorOptions={colorOptions}
                emotionOptions={emotionOptions}
                emotionIcons={emotionIcons}
                resolvedLabels={resolvedLabels}
                onButtonAction={onButtonAction}
                onToggleRow={handleToggleRow}
                onDeleteRow={(id) => removeFromSelection(new Set([id]))}
              />
            ))
          )}
        </TableBody>
      </Table.Root>
    </Table.Container>
  );
}

/** Alias for {@link TableView}. */
export const PeerbotsTableView = TableView;
