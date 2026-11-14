import React, { useId, useState } from "react";
import {
  DEFAULT_COMMON_LABELS,
  DEFAULT_CONTROL_LABELS,
  usePeerbotsI18n,
  type ControlLabels,
} from "../../../i18n";
import type {
  PeerbotsColor,
  PeerbotsEmotion,
  RobotControlButton,
} from "../../../templates/types";
import { Button } from "../../forms/Button";
import { EmotionSelector } from "../../forms/EmotionSelector";
import { Field } from "../../forms/Field";
import { Input } from "../../forms/Input";
import { PeerbotsColorSelector } from "../../forms/PeerbotsColorSelector";
import { Switch } from "../../forms/Switch";
import { Icon } from "../../foundations/Icon";
import { PeerbotsButton } from "../PeerbotsButton";
import { cn } from "../../utils";

export interface SingleButtonEditPanelProps {
  buttonId: string;
  button: RobotControlButton;
  isRoot?: boolean;
  onSave: (nextButton: RobotControlButton) => void;
  onToggleRoot?: (isRoot: boolean) => void;
  onAddChild?: () => void;
  onDuplicate?: () => void;
  onMove?: (direction: "BACK" | "FORWARD") => void;
  onDelete?: () => void;
  onClose?: () => void;
  /** Layout variant: `"popover"` (default floating card) or `"panel"` (embedded side-panel form). */
  variant?: "popover" | "panel";
  /** Render a live `PeerbotsButton` preview above the form fields. */
  showPreview?: boolean;
  /** Optional callback when the preview button is clicked. */
  onPreviewClick?: () => void;
  emotionIcons?: Partial<Record<PeerbotsEmotion, string | React.ReactNode>>;
  emotionLabels?: Partial<Record<PeerbotsEmotion, string>>;
  colorLabels?: Partial<Record<PeerbotsColor, string>>;
  labels?: Partial<ControlLabels>;
  /** Controlled Sync Speech with Title toggle. */
  syncSpeech?: boolean;
  /** Initial Sync Speech with Title state when uncontrolled. */
  defaultSyncSpeech?: boolean;
  /** Callback invoked when the Sync Speech with Title toggle changes. */
  onSyncSpeechChange?: (sync: boolean) => void;
  className?: string;
}

/**
 * Shared single-button editor used inside FlowView's NodeToolbar popover,
 * ButtonView's right-click context popover, and the docked `PeerbotsButtonEditor` side panel.
 *
 * Uses the exact `ControlLabels` naming from `TableView` and `PeerbotsButtonRow`,
 * includes the `Sync Speech with Title` switch, and renders `Robot Color` and
 * `Emotion` on separate rows.
 */
export function SingleButtonEditPanel({
  button,
  onSave,
  onAddChild,
  onDuplicate,
  onMove,
  onDelete,
  onClose,
  variant = "popover",
  showPreview = false,
  onPreviewClick,
  emotionIcons,
  emotionLabels,
  labels,
  syncSpeech,
  defaultSyncSpeech,
  onSyncSpeechChange,
  className,
}: SingleButtonEditPanelProps) {
  const { labels: contextLabels } = usePeerbotsI18n();
  const resolvedLabels: ControlLabels = {
    ...DEFAULT_CONTROL_LABELS,
    ...contextLabels?.control,
    ...labels,
  };
  const deleteLabel =
    contextLabels?.common?.delete ?? DEFAULT_COMMON_LABELS.delete;

  const syncSwitchId = useId();
  const [uncontrolledSync, setUncontrolledSync] = useState<boolean>(() => {
    if (defaultSyncSpeech !== undefined) return defaultSyncSpeech;
    if (button.type === "Message") {
      return (
        !button.details.speech || button.details.speech === button.details.title
      );
    }
    return (
      !button.details.details || button.details.details === button.details.title
    );
  });
  const isSyncControlled = syncSpeech !== undefined;
  const syncActive = isSyncControlled ? syncSpeech : uncontrolledSync;

  const handleToggleSync = (nextSync: boolean) => {
    if (!isSyncControlled) {
      setUncontrolledSync(nextSync);
    }
    onSyncSpeechChange?.(nextSync);
    if (nextSync) {
      if (
        button.type === "Message" &&
        button.details.speech !== button.details.title
      ) {
        onSave({
          ...button,
          details: { ...button.details, speech: button.details.title },
        });
      } else if (
        button.type === "Log" &&
        button.details.details !== button.details.title
      ) {
        onSave({
          ...button,
          details: { ...button.details, details: button.details.title },
        });
      }
    }
  };

  const handleTypeSwitch = (nextType: "Message" | "Log") => {
    if (button.type === nextType) return;
    if (nextType === "Message" && button.type === "Log") {
      onSave({
        type: "Message",
        labelColor: button.labelColor,
        details: {
          title: button.details.title,
          speech: button.details.details || button.details.title,
          color: button.labelColor,
          emotion: "Neutral",
          ...(button.details.metadata
            ? { metadata: button.details.metadata }
            : {}),
        },
      });
    } else if (nextType === "Log" && button.type === "Message") {
      onSave({
        type: "Log",
        labelColor: button.labelColor,
        details: {
          title: button.details.title,
          details: button.details.speech || "",
          ...(button.details.metadata
            ? { metadata: button.details.metadata }
            : {}),
        },
      });
    }
  };

  const handleTitleChange = (title: string) => {
    if (button.type === "Message") {
      onSave({
        ...button,
        details: {
          ...button.details,
          title,
          ...(syncActive ? { speech: title } : {}),
        },
      });
    } else {
      onSave({
        ...button,
        details: {
          ...button.details,
          title,
          ...(syncActive ? { details: title } : {}),
        },
      });
    }
  };

  const handleSpeechOrDetailsChange = (value: string) => {
    if (syncActive && value !== button.details.title) {
      if (!isSyncControlled) {
        setUncontrolledSync(false);
      }
      onSyncSpeechChange?.(false);
    }
    if (button.type === "Message") {
      onSave({
        ...button,
        details: { ...button.details, speech: value },
      });
    } else {
      onSave({
        ...button,
        details: { ...button.details, details: value },
      });
    }
  };

  const handleContainerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && onClose) {
      e.stopPropagation();
      onClose();
    }
  };

  return (
    <div
      className={cn(
        variant === "popover"
          ? "pb:w-[320px] pb:max-w-[calc(100vw-24px)] pb:rounded-xl pb:bg-white pb:border pb:border-gray-200 pb:shadow-xl pb:p-3 pb:flex pb:flex-col pb:gap-2.5 pb:text-left"
          : "pb:w-full pb:flex pb:flex-col pb:gap-2.5 pb:text-left",
        className,
      )}
      onKeyDown={handleContainerKeyDown}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {showPreview && (
        <div className="pb:pb-1">
          <PeerbotsButton
            buttonInfo={button}
            onClick={onPreviewClick ?? (() => {})}
            emotionIcons={emotionIcons}
          />
        </div>
      )}
      {/* Header: Type switcher + Root Entry toggle + Close */}
      <div className="pb:flex pb:items-center pb:justify-between pb:gap-2">
        <div
          className="pb:inline-flex pb:rounded-lg pb:bg-gray-100 pb:p-0.5 pb:gap-0.5"
          role="group"
          aria-label={resolvedLabels.buttonType}
        >
          <button
            type="button"
            onClick={() => handleTypeSwitch("Message")}
            className={cn(
              "pb:inline-flex pb:items-center pb:gap-1 pb:px-2 pb:py-1 pb:rounded-md pb:text-xs pb:font-semibold pb:cursor-pointer pb:transition-colors",
              button.type === "Message"
                ? "pb:bg-white pb:text-gray-900 pb:shadow-xs"
                : "pb:text-gray-600 pb:hover:text-gray-900",
            )}
          >
            {resolvedLabels.message}
          </button>
          <button
            type="button"
            onClick={() => handleTypeSwitch("Log")}
            className={cn(
              "pb:inline-flex pb:items-center pb:gap-1 pb:px-2 pb:py-1 pb:rounded-md pb:text-xs pb:font-semibold pb:cursor-pointer pb:transition-colors",
              button.type === "Log"
                ? "pb:bg-white pb:text-gray-900 pb:shadow-xs"
                : "pb:text-gray-600 pb:hover:text-gray-900",
            )}
          >
            <Icon name="zap" size="sm" />
            {resolvedLabels.log}
          </button>
        </div>

        <div className="pb:flex pb:items-center pb:gap-1.5">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close edit popover"
              className="pb:p-1 pb:rounded-md pb:text-gray-400 pb:hover:text-gray-700 pb:hover:bg-gray-100 pb:cursor-pointer"
            >
              <Icon name="x" size="sm" />
            </button>
          )}
        </div>
      </div>

      {/* Title */}
      <Field
        label={resolvedLabels.buttonTitle}
        tooltip={resolvedLabels.buttonTitleTooltip}
        labelPlacement="top"
      >
        <Input
          size="sm"
          value={button.details.title}
          placeholder={resolvedLabels.buttonTitle}
          onChange={(e) => handleTitleChange(e.target.value)}
        />
      </Field>

      {/* Sync Speech/Details with Title Switch */}
      <div className="pb:flex pb:items-center pb:justify-between pb:gap-2 pb:py-0.5">
        <label
          htmlFor={syncSwitchId}
          className="pb:text-[11px] pb:font-semibold pb:text-gray-600 pb:cursor-pointer pb:select-none"
        >
          {button.type === "Message"
            ? resolvedLabels.syncSpeechWithTitle
            : (resolvedLabels.syncDetailsWithTitle ?? "Sync Details with Title")}
        </label>
        <Switch
          id={syncSwitchId}
          name="syncSpeechWithTitle"
          aria-label={resolvedLabels.syncTitleSpeechAria}
          checked={syncActive}
          onChange={(checked) => handleToggleSync(Boolean(checked))}
        />
      </div>

      {/* Speech phrase or Event details */}
      <Field
        label={
          button.type === "Message"
            ? resolvedLabels.speech
            : resolvedLabels.details
        }
        tooltip={
          button.type === "Message"
            ? resolvedLabels.speechTooltip
            : resolvedLabels.detailsTooltip
        }
        labelPlacement="top"
      >
        <Input
          size="sm"
          value={
            button.type === "Message"
              ? button.details.speech
              : button.details.details
          }
          placeholder={
            button.type === "Message"
              ? resolvedLabels.speech
              : resolvedLabels.details
          }
          onChange={(e) => handleSpeechOrDetailsChange(e.target.value)}
        />
      </Field>

      {/* Robot Color (own row, Messages only) */}
      {button.type === "Message" && (
        <Field
          label={resolvedLabels.robotColor}
          tooltip={resolvedLabels.robotColorTooltip}
          labelPlacement="top"
        >
          <PeerbotsColorSelector
            size="sm"
            selectedColor={button.details.color}
            ariaLabelPrefix={resolvedLabels.robotColor}
            onColorSelect={(color) =>
              onSave({
                ...button,
                details: { ...button.details, color },
              })
            }
          />
        </Field>
      )}

      {/* Label Color */}
      <Field
        label={resolvedLabels.labelColor}
        tooltip={resolvedLabels.labelColorTooltip}
        labelPlacement="top"
      >
        <PeerbotsColorSelector
          size="sm"
          selectedColor={button.labelColor}
          ariaLabelPrefix={resolvedLabels.labelColor}
          onColorSelect={(labelColor) => onSave({ ...button, labelColor })}
        />
      </Field>

      {/* Emotion (own row, Messages only) */}
      {button.type === "Message" && (
        <Field
          label={resolvedLabels.emotion}
          tooltip={resolvedLabels.emotionTooltip}
          labelPlacement="top"
        >
          <EmotionSelector
            size="sm"
            selectedEmotion={button.details.emotion}
            emotionIcons={emotionIcons}
            emotionLabels={emotionLabels}
            ariaLabel={resolvedLabels.emotion}
            onEmotionSelect={(emotion) =>
              onSave({
                ...button,
                details: { ...button.details, emotion },
              })
            }
          />
        </Field>
      )}

      {/* Sibling reorder controls */}
      {onMove && (
        <div className="pb:flex pb:flex-col pb:gap-1 pb:pt-2 pb:border-t pb:border-gray-200">
          <span className="pb:text-[11px] pb:font-semibold pb:text-gray-600">
            {resolvedLabels.reorderButton ?? "Reorder"}
          </span>
          <div className="pb:flex pb:items-center pb:gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => onMove("BACK")}
            >
              {resolvedLabels.moveBackwards ?? "Backwards"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => onMove("FORWARD")}
            >
              {resolvedLabels.moveForwards ?? "Forwards"}
            </Button>
          </div>
        </div>
      )}

      {/* Footer actions */}
      {(onAddChild || onDuplicate || onDelete) && (
        <div className="pb:flex pb:items-center pb:justify-between pb:gap-2 pb:pt-2 pb:border-t pb:border-gray-200">
          <div className="pb:flex pb:items-center pb:gap-1">
            {onAddChild && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={onAddChild}
              >
                + Add
              </Button>
            )}
            {onDuplicate && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onDuplicate}
                title="Duplicate button"
              >
                Duplicate
              </Button>
            )}
          </div>
          {onDelete && (
            <Button
              type="button"
              variant="soft"
              color="danger"
              size="sm"
              onClick={onDelete}
              aria-label={resolvedLabels.deleteButton}
              className="pb:border pb:border-red-200 pb:gap-1"
            >
              <Icon name="close" size="sm" aria-hidden="true" />
              {deleteLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export interface BatchButtonEditPanelProps {
  selectedButtons: Array<{ buttonId: string; button: RobotControlButton }>;
  onApplyLabelColor: (labelColor: PeerbotsColor) => void;
  onApplyFaceColor: (faceColor: PeerbotsColor) => void;
  onApplyEmotion: (emotion: PeerbotsEmotion) => void;
  onDeleteSelected?: () => void;
  onClearSelection: () => void;
  emotionIcons?: Partial<Record<PeerbotsEmotion, string | React.ReactNode>>;
  emotionLabels?: Partial<Record<PeerbotsEmotion, string>>;
  colorLabels?: Partial<Record<PeerbotsColor, string>>;
  labels?: Partial<ControlLabels>;
  className?: string;
}

function getSharedValue<T>(values: T[]): T | undefined {
  if (values.length === 0) return undefined;
  const first = values[0];
  return values.every((v) => v === first) ? first : undefined;
}

/**
 * Multi-select batch editor docked in FlowView when 2+ nodes are selected.
 * - Updates `labelColor` across all selected buttons (`Message` + `Log`).
 * - Updates `Robot Color` and `Emotion` on separate rows scoped to selected `Message` buttons.
 */
export function BatchButtonEditPanel({
  selectedButtons,
  onApplyLabelColor,
  onApplyFaceColor,
  onApplyEmotion,
  onDeleteSelected,
  onClearSelection,
  emotionIcons,
  emotionLabels,
  labels,
  className,
}: BatchButtonEditPanelProps) {
  const { labels: contextLabels } = usePeerbotsI18n();
  const resolvedLabels: ControlLabels = {
    ...DEFAULT_CONTROL_LABELS,
    ...contextLabels?.control,
    ...labels,
  };

  const messageButtons = selectedButtons.filter(
    (entry): entry is { buttonId: string; button: Extract<RobotControlButton, { type: "Message" }> } =>
      entry.button.type === "Message",
  );
  const logCount = selectedButtons.length - messageButtons.length;

  const sharedLabelColor = getSharedValue(
    selectedButtons.map((entry) => entry.button.labelColor),
  );
  const sharedFaceColor = getSharedValue(
    messageButtons.map((entry) => entry.button.details.color),
  );
  const sharedEmotion = getSharedValue(
    messageButtons.map((entry) => entry.button.details.emotion),
  );

  const summaryParts: string[] = [];
  if (messageButtons.length > 0) {
    summaryParts.push(
      `${messageButtons.length} ${messageButtons.length === 1 ? resolvedLabels.message : `${resolvedLabels.message}s`}`,
    );
  }
  if (logCount > 0) {
    summaryParts.push(
      `${logCount} ${logCount === 1 ? resolvedLabels.log : `${resolvedLabels.log}s`}`,
    );
  }

  return (
    <div
      className={cn(
        "pb:w-[320px] pb:max-w-[calc(100vw-24px)] pb:rounded-xl pb:bg-white/95 pb:backdrop-blur pb:border pb:border-gray-200 pb:shadow-xl pb:p-3 pb:flex pb:flex-col pb:gap-2.5",
        className,
      )}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div className="pb:flex pb:items-center pb:justify-between pb:gap-2">
        <div className="pb:flex pb:items-center pb:gap-1.5">
          <span className="pb:text-xs pb:font-bold pb:text-gray-900">
            Batch Edit
          </span>
          <span className="pb:text-[11px] pb:font-semibold pb:px-2 pb:py-0.5 pb:rounded-full pb:bg-teal-50 pb:text-teal-800 pb:border pb:border-teal-200">
            {summaryParts.join(" · ")}
          </span>
        </div>
        <button
          type="button"
          onClick={onClearSelection}
          className="pb:text-[11px] pb:font-semibold pb:text-gray-500 pb:hover:text-gray-800 pb:cursor-pointer"
        >
          Clear
        </button>
      </div>

      {/* Label Color (all selected) */}
      <div className="pb:flex pb:flex-col pb:gap-1">
        <span className="pb:text-[11px] pb:font-semibold pb:text-gray-600">
          {resolvedLabels.labelColor}{" "}
          <span className="pb:text-teal-700">(All {selectedButtons.length})</span>
        </span>
        <PeerbotsColorSelector
          size="sm"
          selectedColor={sharedLabelColor}
          ariaLabelPrefix={resolvedLabels.labelColor}
          onColorSelect={onApplyLabelColor}
        />
      </div>

      {/* Robot Color (own row, Messages only) */}
      {messageButtons.length > 0 && (
        <div className="pb:flex pb:flex-col pb:gap-1">
          <span className="pb:text-[11px] pb:font-semibold pb:text-gray-600">
            {resolvedLabels.robotColor}{" "}
            <span className="pb:text-teal-700">
              ({messageButtons.length}{" "}
              {messageButtons.length === 1
                ? resolvedLabels.message
                : `${resolvedLabels.message}s`}
              )
            </span>
          </span>
          <PeerbotsColorSelector
            size="sm"
            selectedColor={sharedFaceColor}
            ariaLabelPrefix={resolvedLabels.robotColor}
            onColorSelect={onApplyFaceColor}
          />
        </div>
      )}

      {/* Emotion (own row, Messages only) */}
      {messageButtons.length > 0 && (
        <div className="pb:flex pb:flex-col pb:gap-1">
          <span className="pb:text-[11px] pb:font-semibold pb:text-gray-600">
            {resolvedLabels.emotion}{" "}
            <span className="pb:text-teal-700">
              ({messageButtons.length}{" "}
              {messageButtons.length === 1
                ? resolvedLabels.message
                : `${resolvedLabels.message}s`}
              )
            </span>
          </span>
          <EmotionSelector
            size="sm"
            selectedEmotion={sharedEmotion ?? ""}
            emotionIcons={emotionIcons}
            emotionLabels={emotionLabels}
            ariaLabel={resolvedLabels.emotion}
            onEmotionSelect={onApplyEmotion}
          />
        </div>
      )}

      {onDeleteSelected && (
        <div className="pb:flex pb:justify-end pb:pt-1.5 pb:border-t pb:border-gray-100">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onDeleteSelected}
            className="pb:text-red-600 pb:hover:text-red-700 pb:hover:bg-red-50"
          >
            <Icon name="close" size="sm" aria-hidden="true" />
            Delete ({selectedButtons.length})
          </Button>
        </div>
      )}
    </div>
  );
}
