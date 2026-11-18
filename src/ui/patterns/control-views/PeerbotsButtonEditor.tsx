import React from "react";
import {
  DEFAULT_CONTROL_LABELS,
  usePeerbotsI18n,
  type ControlLabels,
} from "../../../i18n";
import type {
  PeerbotsColor,
  PeerbotsEmotion,
  RobotControlButton,
} from "../../../templates/types";
import { Text } from "../../foundations/Typography";
import { BasePanel } from "../../layout/BasePanel";
import { SingleButtonEditPanel } from "./ButtonEditPopoverContent";
import type { RobotControlButtonAction } from "./types";

export interface PeerbotsButtonEditorProps {
  /** Active button being edited (or `null`/`undefined` when none is selected). */
  button: RobotControlButton | null | undefined;
  /** ID of the button being edited. */
  buttonId: string;
  /** Optional callback fired when any edit action occurs (`SAVE`, `MOVE`, `DELETE`, `ADD_CHILD`, `DUPLICATE`, `CLICK`). */
  onButtonAction?: (
    button: RobotControlButton,
    buttonId: string,
    action: RobotControlButtonAction,
  ) => void;
  /** Granular save callback (called in addition to `onButtonAction` if provided). */
  onSave?: (nextButton: RobotControlButton) => void;
  /** Granular sibling reorder callback (defaults to dispatching `MOVE` via `onButtonAction` when `onButtonAction` is provided). */
  onMove?: (direction: "BACK" | "FORWARD") => void;
  /** Granular delete callback (defaults to dispatching `DELETE` via `onButtonAction` when `onButtonAction` is provided). */
  onDelete?: () => void;
  /** Optional callback to toggle whether this button is a top-level root entry. */
  onToggleRoot?: (isRoot: boolean) => void;
  /** Whether this button is currently a root entry. */
  isRoot?: boolean;
  /** Optional callback to add a child button. */
  onAddChild?: () => void;
  /** Optional callback to duplicate this button. */
  onDuplicate?: () => void;
  /** Optional callback to close the docked side panel. */
  onClose?: () => void;
  /** Optional panel heading override (defaults to `labels.editButton ?? "Edit Button"`). */
  title?: string;
  /** Render a live `PeerbotsButton` preview above the form (@default true). */
  showPreview?: boolean;
  /** Optional callback when the preview button is clicked (defaults to dispatching `CLICK` via `onButtonAction`). */
  onPreviewClick?: () => void;
  /** Controlled Sync Speech with Title toggle. */
  syncSpeech?: boolean;
  /** Initial Sync Speech with Title state when uncontrolled. */
  defaultSyncSpeech?: boolean;
  /** Callback invoked when the Sync Speech with Title toggle changes. */
  onSyncSpeechChange?: (sync: boolean) => void;
  emotionIcons?: Partial<Record<PeerbotsEmotion, string | React.ReactNode>>;
  emotionLabels?: Partial<Record<PeerbotsEmotion, string>>;
  colorLabels?: Partial<Record<PeerbotsColor, string>>;
  labels?: Partial<ControlLabels>;
  className?: string;
}

/**
 * Docked side-panel button editor that wraps {@link BasePanel} and {@link SingleButtonEditPanel}
 * so the side panel and Flow/ButtonView edit popovers share one unified form, i18n surface,
 * and validation behavior.
 */
export function PeerbotsButtonEditor({
  button,
  buttonId,
  onButtonAction,
  onSave,
  onMove,
  onDelete,
  onToggleRoot,
  isRoot,
  onAddChild,
  onDuplicate,
  onClose,
  title,
  showPreview = true,
  onPreviewClick,
  syncSpeech,
  defaultSyncSpeech,
  onSyncSpeechChange,
  emotionIcons,
  emotionLabels,
  colorLabels,
  labels,
  className,
}: PeerbotsButtonEditorProps) {
  const { labels: contextLabels } = usePeerbotsI18n();
  const resolvedLabels: ControlLabels = {
    ...DEFAULT_CONTROL_LABELS,
    ...contextLabels?.control,
    ...labels,
  };

  const panelTitle = title ?? resolvedLabels.editButton ?? "Edit Button";

  const handleSave = (nextButton: RobotControlButton) => {
    onSave?.(nextButton);
    if (button) {
      onButtonAction?.(button, buttonId, {
        type: "SAVE",
        newButton: nextButton,
      });
    }
  };

  const handleMove =
    onMove || onButtonAction
      ? (direction: "BACK" | "FORWARD") => {
          onMove?.(direction);
          if (button) {
            onButtonAction?.(button, buttonId, {
              type: "MOVE",
              direction,
            });
          }
        }
      : undefined;

  const handleDelete =
    onDelete || onButtonAction
      ? () => {
          onDelete?.();
          if (button) {
            onButtonAction?.(button, buttonId, {
              type: "DELETE",
            });
          }
        }
      : undefined;

  const handlePreviewClick = () => {
    if (onPreviewClick) {
      onPreviewClick();
      return;
    }
    if (button) {
      onButtonAction?.(button, buttonId, { type: "CLICK" });
    }
  };

  return (
    <BasePanel title={panelTitle} onClose={onClose} className={className}>
      {button ? (
        <SingleButtonEditPanel
          buttonId={buttonId}
          button={button}
          variant="panel"
          showPreview={showPreview}
          onPreviewClick={handlePreviewClick}
          isRoot={isRoot}
          onSave={handleSave}
          onToggleRoot={onToggleRoot}
          onAddChild={onAddChild}
          onDuplicate={onDuplicate}
          onMove={handleMove}
          onDelete={handleDelete}
          syncSpeech={syncSpeech}
          defaultSyncSpeech={defaultSyncSpeech}
          onSyncSpeechChange={onSyncSpeechChange}
          emotionIcons={emotionIcons}
          emotionLabels={emotionLabels}
          colorLabels={colorLabels}
          labels={labels}
        />
      ) : (
        <div className="pb:p-4 pb:text-center">
          <Text variant="small" className="pb:text-gray-500">
            {resolvedLabels.noButtonSelected ??
              "Select a button to edit its properties."}
          </Text>
        </div>
      )}
    </BasePanel>
  );
}
