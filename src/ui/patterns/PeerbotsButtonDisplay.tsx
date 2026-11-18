import React, { Suspense, useCallback, useState } from "react";
import type { FlowDirection } from "../../flow/types";
import {
  DEFAULT_CONTROL_LABELS,
  usePeerbotsI18n,
  type ControlLabels,
  type TableLabels,
} from "../../i18n";
import type {
  PeerbotsColor,
  PeerbotsEmotion,
  Template,
} from "../../templates/types";
import { TabRadio } from "../forms/TabRadio";
import { cn } from "../utils";
import { ButtonView } from "./control-views/ButtonView";
import {
  TableView,
  type TableViewBatchSaveEntry,
} from "./control-views/TableView";
import type {
  PeerbotsButtonActionHandler,
  PeerbotsTemplateView,
} from "./control-views/types";

export type { PeerbotsTemplateView };

export type PeerbotsButtonDisplayLabels = ControlLabels;

/**
 * Context passed to {@link PeerbotsButtonDisplayProps.renderCustomView} when extending
 * `PeerbotsButtonDisplay` with application-specific presentation modes.
 */
export interface PeerbotsButtonDisplayCustomViewProps {
  /** Active view key string. */
  view: string;
  /** Canonical Peerbots template being displayed. */
  template: Template;
  /** Whether interactions and edits are disabled. */
  disabled?: boolean;
  /** Action dispatcher for button selection, activation, edits, moves, and deletes. */
  onButtonAction: PeerbotsButtonActionHandler;
}

export interface PeerbotsButtonDisplayProps {
  /** Canonical template containing `buttons` dictionary and `hierarchy` */
  template: Template;
  /** Controlled active presentation mode (`"Buttons"`, `"Table"`, or `"Flow"`) */
  view?: PeerbotsTemplateView;
  /** Initial presentation mode when uncontrolled (@default "Buttons") */
  defaultView?: PeerbotsTemplateView;
  /** Callback invoked when the active view changes */
  onViewChange?: (view: PeerbotsTemplateView) => void;
  /** Renders an inline `TabRadio` view switcher (`Buttons` / `Table` / `Flow`) */
  showViewSwitcher?: boolean;

  /** Controlled active button ID highlighted in `"Buttons"`, `"Table"`, and `"Flow"` views */
  selectedButtonId?: string | null;
  /** Controlled multi-selected button IDs in `"Table"` and `"Buttons"` views */
  selectedButtonIds?: readonly string[];
  /** Alias for `selectedButtonIds` (backward-compatible with `app.peerbots.org`) */
  multiSelectedButtonIds?: readonly string[];
  /** Initial multi-selected button IDs when uncontrolled */
  defaultSelectedButtonIds?: readonly string[];
  /** Callback fired whenever multi-selected button IDs change */
  onSelectedButtonIdsChange?: (selectedIds: string[]) => void;
  /** Callback invoked when clearing multi-selection in `"Table"` view */
  onClearSelection?: () => void;

  /** Controlled sync toggle between title and speech/details in `"Table"` view */
  syncSpeech?: boolean;
  /** Alias for `syncSpeech` */
  syncTitleSpeech?: boolean;
  /** Initial sync toggle state in `"Table"` view (@default true) */
  defaultSyncSpeech?: boolean;
  /** Alias for `defaultSyncSpeech` */
  defaultSyncTitleSpeech?: boolean;
  /** Callback invoked when the sync toggle changes */
  onSyncSpeechChange?: (sync: boolean) => void;
  /** Alias for `onSyncSpeechChange` */
  onSyncTitleSpeechChange?: (sync: boolean) => void;
  /** Optional batch callback invoked alongside `SAVE` actions during column Apply-All or FlowView batch edits */
  onBatchSave?: (updates: TableViewBatchSaveEntry[]) => void;
  /** Optional full-template update callback used by right-click editing in `ButtonView` and in-graph authoring in `FlowView` */
  onTemplateChange?: (nextTemplate: Template) => void;
  /** Optional hierarchy update callback used by `FlowView` edge wiring and sibling drag-reordering */
  onHierarchyChange?: (nextHierarchy: Template["hierarchy"]) => void;

  /** Controlled layout direction for `"Flow"` view */
  flowDirection?: FlowDirection;
  /** Initial layout direction for `"Flow"` view when uncontrolled (@default "TB") */
  defaultFlowDirection?: FlowDirection;
  /** Callback invoked when `"Flow"` layout direction changes */
  onFlowDirectionChange?: (direction: FlowDirection) => void;
  /** Callback invoked when connecting two nodes in `"Flow"` view */
  onAddConnection?: (sourceButtonId: string, targetButtonId: string) => void;
  /** Callback invoked when deleting a connection edge in `"Flow"` view */
  onRemoveConnection?: (sourceButtonId: string, targetButtonId: string) => void;
  /** Shows the ReactFlow `<MiniMap>` in `"Flow"` view (@default false) */
  showFlowMiniMap?: boolean;

  /** Disables button clicks, row edits, and flow graph edits */
  disabled?: boolean;
  /** Action handler invoked for button clicks, selection, edits, moves, and deletes */
  onButtonAction: PeerbotsButtonActionHandler;
  /** Optional custom emotion icon overrides */
  emotionIcons?: Partial<Record<PeerbotsEmotion, string | React.ReactNode>>;
  /** Optional localized emotion names */
  emotionLabels?: Partial<Record<PeerbotsEmotion, string>>;
  /** Optional localized color names */
  colorLabels?: Partial<Record<PeerbotsColor, string>>;
  /** Optional localized UI labels */
  labels?: Partial<PeerbotsButtonDisplayLabels>;
  /** Optional localized Table primitive labels */
  tableLabels?: Partial<TableLabels>;
  /** Optional extension renderer for custom app-level views */
  renderCustomView?: (
    props: PeerbotsButtonDisplayCustomViewProps,
  ) => React.ReactNode;
  className?: string;
}

const LazyFlowView = React.lazy(() =>
  import("@peerbots/core/flow").then((mod) => ({ default: mod.FlowView })),
);

/**
 * Pure, store-agnostic Peerbots template display orchestrator delegating
 * cleanly to `ButtonView`, `TableView` (PR #26 Table suite), and lazy-loaded `FlowView`.
 */
export function PeerbotsButtonDisplay({
  template,
  view: controlledView,
  defaultView = "Buttons",
  onViewChange,
  showViewSwitcher = false,
  selectedButtonId = null,
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
  onTemplateChange,
  onHierarchyChange,
  flowDirection,
  defaultFlowDirection = "TB",
  onFlowDirectionChange,
  onAddConnection,
  onRemoveConnection,
  showFlowMiniMap = false,
  disabled = false,
  onButtonAction,
  emotionIcons,
  emotionLabels,
  colorLabels,
  labels,
  tableLabels,
  renderCustomView,
  className,
}: PeerbotsButtonDisplayProps) {
  const { labels: contextLabels } = usePeerbotsI18n();
  const [uncontrolledView, setUncontrolledView] =
    useState<PeerbotsTemplateView>(defaultView);

  const isViewControlled = controlledView !== undefined;
  const activeView = isViewControlled ? controlledView : uncontrolledView;

  const handleViewChange = useCallback(
    (nextView: PeerbotsTemplateView | undefined) => {
      if (!nextView) return;
      if (!isViewControlled) {
        setUncontrolledView(nextView);
      }
      onViewChange?.(nextView);
    },
    [isViewControlled, onViewChange],
  );

  const resolvedLabels: ControlLabels = {
    ...DEFAULT_CONTROL_LABELS,
    ...contextLabels?.control,
    ...labels,
  };

  let viewContent: React.ReactNode = null;

  if (activeView === "Buttons") {
    viewContent = (
      <ButtonView
        template={template}
        selectedButtonId={selectedButtonId}
        selectedButtonIds={selectedButtonIds ?? multiSelectedButtonIds}
        disabled={disabled}
        onButtonAction={onButtonAction}
        onTemplateChange={onTemplateChange}
        emotionIcons={emotionIcons}
        emotionLabels={emotionLabels}
        colorLabels={colorLabels}
        labels={labels}
        className={!showViewSwitcher ? className : undefined}
      />
    );
  } else if (activeView === "Table") {
    viewContent = (
      <TableView
        template={template}
        onButtonAction={onButtonAction}
        disabled={disabled}
        selectedButtonId={selectedButtonId}
        selectedButtonIds={selectedButtonIds}
        multiSelectedButtonIds={multiSelectedButtonIds}
        defaultSelectedButtonIds={defaultSelectedButtonIds}
        onSelectedButtonIdsChange={onSelectedButtonIdsChange}
        onClearSelection={onClearSelection}
        syncSpeech={syncSpeech}
        syncTitleSpeech={syncTitleSpeech}
        defaultSyncSpeech={defaultSyncSpeech}
        defaultSyncTitleSpeech={defaultSyncTitleSpeech}
        onSyncSpeechChange={onSyncSpeechChange}
        onSyncTitleSpeechChange={onSyncTitleSpeechChange}
        onBatchSave={onBatchSave}
        emotionIcons={emotionIcons}
        emotionLabels={emotionLabels}
        colorLabels={colorLabels}
        labels={labels}
        tableLabels={tableLabels}
        className={!showViewSwitcher ? className : undefined}
      />
    );
  } else if (activeView === "Flow" && !renderCustomView) {
    viewContent = (
      <Suspense
        fallback={
          <div className="pb:w-full pb:min-h-[400px] pb:flex pb:items-center pb:justify-center pb:text-sm pb:text-gray-500">
            Loading flow view…
          </div>
        }
      >
        <LazyFlowView
          template={template}
          selectedButtonId={selectedButtonId}
          onButtonAction={onButtonAction}
          onTemplateChange={onTemplateChange}
          onHierarchyChange={onHierarchyChange}
          onAddConnection={onAddConnection}
          onRemoveConnection={onRemoveConnection}
          onBatchSave={onBatchSave}
          disabled={disabled}
          direction={flowDirection}
          defaultDirection={defaultFlowDirection}
          onDirectionChange={onFlowDirectionChange}
          showMiniMap={showFlowMiniMap}
          emotionIcons={emotionIcons}
          emotionLabels={emotionLabels}
          colorLabels={colorLabels}
          labels={labels}
          className={!showViewSwitcher ? className : undefined}
        />
      </Suspense>
    );
  } else if (renderCustomView) {
    viewContent = renderCustomView({
      view: activeView,
      template,
      disabled,
      onButtonAction,
    });
  }

  if (!showViewSwitcher) {
    return <>{viewContent}</>;
  }

  return (
    <div className={cn("pb:flex pb:flex-col pb:gap-3 pb:w-full", className)}>
      <div className="pb:flex pb:items-center pb:justify-end">
        <TabRadio<PeerbotsTemplateView>
          aria-label={resolvedLabels.selectView}
          options={[
            { value: "Buttons", label: resolvedLabels.buttonsView },
            { value: "Table", label: resolvedLabels.tableView },
            { value: "Flow", label: resolvedLabels.flowView },
          ]}
          value={activeView}
          onChange={handleViewChange}
        />
      </div>
      {viewContent}
    </div>
  );
}
