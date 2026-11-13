import React from "react";
import type {
  PeerbotsColor,
  PeerbotsEmotion,
  RobotControlButton,
} from "../../../templates/types";
import { Button } from "../../forms/Button";
import { EmotionSelector } from "../../forms/EmotionSelector";
import { Input } from "../../forms/Input";
import { PeerbotsColorSelector } from "../../forms/PeerbotsColorSelector";
import { TextArea } from "../../forms/TextArea";
import { cn } from "../../utils";

export interface SingleButtonEditPanelProps {
  /** Button currently being edited */
  button: RobotControlButton;
  /** Whether this button is currently listed in `hierarchy.root` */
  isRoot?: boolean;
  /** Called immediately whenever any field changes */
  onSave: (nextButton: RobotControlButton) => void;
  /** Optional handler to toggle whether this button is in `hierarchy.root` */
  onToggleRoot?: () => void;
  /** Optional handler to add a child button connected to this node */
  onAddChild?: (type: "Message" | "Log") => void;
  /** Optional handler to duplicate this button */
  onDuplicate?: () => void;
  /** Optional handler to delete this button */
  onDelete?: () => void;
  /** Optional handler to close the popover */
  onClose?: () => void;
  /** Optional custom emotion icons passed to `EmotionSelector` */
  emotionIcons?: Partial<Record<PeerbotsEmotion, string | React.ReactNode>>;
  /** Optional localized emotion names passed to `EmotionSelector` */
  emotionLabels?: Partial<Record<PeerbotsEmotion, string>>;
  /** Optional localized color names passed to `PeerbotsColorSelector` */
  colorLabels?: Partial<Record<PeerbotsColor, string>>;
  className?: string;
}

/**
 * Concise single-button editor panel shared by `FlowView` (node edit popover)
 * and `ButtonView` (right-click edit popover).
 */
export function SingleButtonEditPanel({
  button,
  isRoot,
  onSave,
  onToggleRoot,
  onAddChild,
  onDuplicate,
  onDelete,
  onClose,
  emotionIcons,
  emotionLabels,
  colorLabels,
  className,
}: SingleButtonEditPanelProps) {
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
        details: { ...button.details, title },
      });
    } else {
      onSave({
        ...button,
        details: { ...button.details, title },
      });
    }
  };

  const handleBodyChange = (text: string) => {
    if (button.type === "Message") {
      onSave({
        ...button,
        details: { ...button.details, speech: text },
      });
    } else {
      onSave({
        ...button,
        details: { ...button.details, details: text },
      });
    }
  };

  return (
    <div
      className={cn(
        "pb:w-[320px] pb:flex pb:flex-col pb:gap-2.5 pb:text-left",
        className,
      )}
    >
      {/* Header: Message/Log switcher + optional Root toggle + Close */}
      <div className="pb:flex pb:items-center pb:justify-between pb:gap-2 pb:pb-2 pb:border-b pb:border-gray-100">
        <div
          role="group"
          aria-label="Button type"
          className="pb:inline-flex pb:rounded-lg pb:bg-gray-100 pb:p-0.5 pb:border pb:border-gray-200"
        >
          {(["Message", "Log"] as const).map((kind) => {
            const active = button.type === kind;
            return (
              <button
                key={kind}
                type="button"
                aria-pressed={active}
                onClick={() => handleTypeSwitch(kind)}
                className={cn(
                  "pb:px-2.5 pb:py-1 pb:text-xs pb:font-semibold pb:rounded-md pb:cursor-pointer pb:transition-colors",
                  active
                    ? "pb:bg-white pb:text-gray-950 pb:shadow-xs"
                    : "pb:text-gray-600 hover:pb:text-gray-900",
                )}
              >
                {kind}
              </button>
            );
          })}
        </div>

        <div className="pb:flex pb:items-center pb:gap-1.5">
          {onToggleRoot && (
            <button
              type="button"
              aria-pressed={Boolean(isRoot)}
              onClick={onToggleRoot}
              className={cn(
                "pb:px-2 pb:py-0.5 pb:text-[11px] pb:font-semibold pb:rounded-full pb:border pb:cursor-pointer pb:transition-colors",
                isRoot
                  ? "pb:bg-teal-50 pb:text-teal-800 pb:border-teal-300"
                  : "pb:bg-gray-50 pb:text-gray-600 pb:border-gray-200 hover:pb:bg-gray-100",
              )}
            >
              {isRoot ? "✓ Root Entry" : "Child Only"}
            </button>
          )}
          {onClose && (
            <button
              type="button"
              aria-label="Close editor"
              onClick={onClose}
              className="pb:px-1.5 pb:py-0.5 pb:text-xs pb:font-semibold pb:text-gray-400 hover:pb:text-gray-700 pb:rounded pb:cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Title */}
      <label className="pb:flex pb:flex-col pb:gap-1">
        <span className="pb:text-[11px] pb:font-semibold pb:text-gray-600">
          {button.type === "Message" ? "Title" : "Event Title"}
        </span>
        <Input
          aria-label={button.type === "Message" ? "Title" : "Event Title"}
          value={button.details.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="pb:h-8 pb:text-xs"
        />
      </label>

      {/* Speech or Event Details */}
      <label className="pb:flex pb:flex-col pb:gap-1">
        <span className="pb:text-[11px] pb:font-semibold pb:text-gray-600">
          {button.type === "Message" ? "Robot Speech" : "Event Details"}
        </span>
        <TextArea
          aria-label={
            button.type === "Message" ? "Robot Speech" : "Event Details"
          }
          rows={2}
          value={
            button.type === "Message"
              ? button.details.speech
              : (button.details.details ?? "")
          }
          onChange={(e) => handleBodyChange(e.target.value)}
          className="pb:text-xs pb:min-h-[52px] pb:py-1.5"
        />
      </label>

      {/* Button Label Color */}
      <div className="pb:flex pb:flex-col pb:gap-1">
        <span className="pb:text-[11px] pb:font-semibold pb:text-gray-600">
          Button Label Color
        </span>
        <PeerbotsColorSelector
          size="sm"
          selectedColor={button.labelColor}
          ariaLabelPrefix="Button label color"
          onColorSelect={(labelColor) => onSave({ ...button, labelColor })}
        />
      </div>

      {/* Robot Face Color & Emotion (Messages only) */}
      {button.type === "Message" && (
        <div className="pb:flex pb:flex-col pb:gap-1.5">
          <span className="pb:text-[11px] pb:font-semibold pb:text-gray-600">
            Robot Face Color &amp; Emotion
          </span>
          <PeerbotsColorSelector
            size="sm"
            selectedColor={button.details.color}
            ariaLabelPrefix="Robot face color"
            onColorSelect={(color) =>
              onSave({
                ...button,
                details: { ...button.details, color },
              })
            }
          />
          <EmotionSelector
            size="sm"
            selectedEmotion={button.details.emotion}
            emotionIcons={emotionIcons}
            emotionLabels={emotionLabels}
            ariaLabel="Robot emotion"
            onEmotionSelect={(emotion) =>
              onSave({
                ...button,
                details: { ...button.details, emotion },
              })
            }
          />
        </div>
      )}

      {/* Footer Quick Actions */}
      {(onAddChild || onDuplicate || onDelete) && (
        <div className="pb:flex pb:items-center pb:justify-between pb:gap-2 pb:pt-2 pb:border-t pb:border-gray-100">
          <div className="pb:flex pb:items-center pb:gap-1">
            {onAddChild && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="pb:h-7 pb:px-2 pb:text-[11px]"
                  onClick={() => onAddChild("Message")}
                >
                  + Msg
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="pb:h-7 pb:px-2 pb:text-[11px]"
                  onClick={() => onAddChild("Log")}
                >
                  + Log
                </Button>
              </>
            )}
            {onDuplicate && (
              <Button
                size="sm"
                variant="outline"
                className="pb:h-7 pb:px-2 pb:text-[11px]"
                onClick={onDuplicate}
              >
                Duplicate
              </Button>
            )}
          </div>
          {onDelete && (
            <Button
              size="sm"
              variant="ghostly-danger"
              className="pb:h-7 pb:px-2 pb:text-[11px]"
              onClick={onDelete}
            >
              Delete
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export interface BatchButtonEditPanelProps {
  /** Selected buttons with their IDs */
  selectedButtons: Array<{ buttonId: string; button: RobotControlButton }>;
  /** Apply a partial labelColor update to all selected buttons */
  onApplyLabelColor: (color: PeerbotsColor) => void;
  /** Apply a face color update to all selected `"Message"` buttons */
  onApplyFaceColor: (color: PeerbotsColor) => void;
  /** Apply an emotion update to all selected `"Message"` buttons */
  onApplyEmotion: (emotion: PeerbotsEmotion) => void;
  /** Clear multi-selection */
  onClearSelection: () => void;
  /** Delete all selected buttons */
  onDeleteSelected?: () => void;
  emotionIcons?: Partial<Record<PeerbotsEmotion, string | React.ReactNode>>;
  emotionLabels?: Partial<Record<PeerbotsEmotion, string>>;
  colorLabels?: Partial<Record<PeerbotsColor, string>>;
  className?: string;
}

function getSharedValue<T>(values: T[]): T | undefined {
  if (values.length === 0) return undefined;
  const first = values[0];
  return values.every((v) => v === first) ? first : undefined;
}

/**
 * Selection-aware multi-button batch editor for `FlowView`.
 * - Updates `labelColor` across all selected buttons (`Message` + `Log`).
 * - Updates `details.color` and `details.emotion` only for `"Message"` buttons in the selection.
 */
export function BatchButtonEditPanel({
  selectedButtons,
  onApplyLabelColor,
  onApplyFaceColor,
  onApplyEmotion,
  onClearSelection,
  onDeleteSelected,
  emotionIcons,
  emotionLabels,
  colorLabels,
  className,
}: BatchButtonEditPanelProps) {
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

  const countSummary = [
    messageButtons.length > 0
      ? `${messageButtons.length} ${messageButtons.length === 1 ? "Message" : "Messages"}`
      : null,
    logCount > 0 ? `${logCount} ${logCount === 1 ? "Log" : "Logs"}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div
      className={cn(
        "pb:w-[300px] pb:bg-white pb:rounded-xl pb:border pb:border-gray-200 pb:shadow-lg pb:p-3 pb:flex pb:flex-col pb:gap-2.5",
        className,
      )}
    >
      <div className="pb:flex pb:items-center pb:justify-between pb:gap-2 pb:pb-2 pb:border-b pb:border-gray-100">
        <span className="pb:text-xs pb:font-bold pb:text-gray-900">
          Batch Edit Selection
        </span>
        <span className="pb:px-2 pb:py-0.5 pb:rounded-full pb:bg-teal-50 pb:text-teal-800 pb:text-[10px] pb:font-bold">
          {countSummary}
        </span>
      </div>

      <div className="pb:flex pb:flex-col pb:gap-1">
        <span className="pb:text-[11px] pb:font-semibold pb:text-gray-600">
          Button Label Color{" "}
          <span className="pb:text-teal-700">(All {selectedButtons.length})</span>
        </span>
        <PeerbotsColorSelector
          size="sm"
          selectedColor={sharedLabelColor}
          ariaLabelPrefix="Batch button label color"
          onColorSelect={onApplyLabelColor}
        />
      </div>

      {messageButtons.length > 0 && (
        <div className="pb:flex pb:flex-col pb:gap-1.5">
          <span className="pb:text-[11px] pb:font-semibold pb:text-gray-600">
            Robot Face &amp; Emotion{" "}
            <span className="pb:text-teal-700">
              ({messageButtons.length}{" "}
              {messageButtons.length === 1 ? "Message" : "Messages"})
            </span>
          </span>
          <PeerbotsColorSelector
            size="sm"
            selectedColor={sharedFaceColor}
            ariaLabelPrefix="Batch robot face color"
            onColorSelect={onApplyFaceColor}
          />
          <EmotionSelector
            size="sm"
            selectedEmotion={sharedEmotion ?? ""}
            emotionIcons={emotionIcons}
            emotionLabels={emotionLabels}
            ariaLabel="Batch robot emotion"
            onEmotionSelect={onApplyEmotion}
          />
        </div>
      )}

      <div className="pb:flex pb:items-center pb:justify-between pb:gap-2 pb:pt-2 pb:border-t pb:border-gray-100">
        <Button
          size="sm"
          variant="outline"
          className="pb:h-7 pb:px-2.5 pb:text-[11px]"
          onClick={onClearSelection}
        >
          Clear Selection
        </Button>
        {onDeleteSelected && (
          <Button
            size="sm"
            variant="ghostly-danger"
            className="pb:h-7 pb:px-2.5 pb:text-[11px]"
            onClick={onDeleteSelected}
          >
            Delete ({selectedButtons.length})
          </Button>
        )}
      </div>
    </div>
  );
}
