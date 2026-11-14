import { useMemo, useRef, useState } from "react";
import type { RobotControlButton, Template } from "../../../templates/types";
import type { TableViewBatchSaveEntry } from "./tableViewHelpers";
import { createSaveAction, type PeerbotsButtonActionHandler } from "./types";

export interface UseTemplateControlStateOptions {
  template: Template;
  visibleEntries: ReadonlyArray<{
    buttonId: string;
    button: RobotControlButton;
  }>;
  onButtonAction: PeerbotsButtonActionHandler;
  disabled?: boolean;
  selectedButtonIds?: readonly string[];
  multiSelectedButtonIds?: readonly string[];
  defaultSelectedButtonIds?: readonly string[];
  onSelectedButtonIdsChange?: (selectedIds: string[]) => void;
  onClearSelection?: () => void;
  syncSpeech?: boolean;
  syncTitleSpeech?: boolean;
  defaultSyncSpeech?: boolean;
  defaultSyncTitleSpeech?: boolean;
  onSyncSpeechChange?: (sync: boolean) => void;
  onSyncTitleSpeechChange?: (sync: boolean) => void;
  onBatchSave?: (updates: TableViewBatchSaveEntry[]) => void;
}

/**
 * Shared controlled/uncontrolled selection, Shift+Click range selection,
 * sync-speech toggle, and batch-save dispatcher for template control views
 * (`TableView`, `FlowView`, `ButtonView`).
 */
export function useTemplateControlState({
  template,
  visibleEntries,
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
}: UseTemplateControlStateOptions) {
  const lastClickedRowIndexRef = useRef<number | null>(null);

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

  const selectedEntries = useMemo(
    () => visibleEntries.filter((r) => selectedSet.has(r.buttonId)),
    [visibleEntries, selectedSet],
  );

  const handleToggleAll = (checked: boolean) => {
    if (disabled) return;
    if (checked) {
      const nextSet = new Set(selectedSet);
      for (const entry of visibleEntries) {
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
    entry: { buttonId: string; button: RobotControlButton },
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
        const rangeEntry = visibleEntries[i];
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

  const removeFromSelection = (idsToRemove: ReadonlySet<string>) => {
    if (!isSelectionControlled) {
      setUncontrolledSelection((prev) =>
        prev.filter((id) => !idsToRemove.has(id)),
      );
    }
    onSelectedButtonIdsChange?.(
      activeSelectedIds.filter((id) => !idsToRemove.has(id)),
    );
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

  return {
    syncActive,
    handleToggleSync,
    activeSelectedIds,
    selectedSet,
    selectedEntries,
    updateSelectionState,
    handleToggleAll,
    handleClearSelection,
    handleToggleRow,
    removeFromSelection,
    dispatchBatchUpdates,
  };
}
