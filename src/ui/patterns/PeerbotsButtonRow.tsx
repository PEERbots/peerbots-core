import React, { useEffect, useRef, useState } from "react";
import {
  DEFAULT_CONTROL_LABELS,
  usePeerbotsI18n,
  type ControlLabels,
} from "../../i18n";
import {
  PEERBOTS_COLORS,
  PEERBOTS_EMOTIONS,
  type PeerbotsColor,
  type PeerbotsEmotion,
  type RobotControlButton,
} from "../../templates/types";
import {
  createSaveAction,
  type RobotControlButtonAction,
} from "./control-views/types";
import { Button } from "../forms/Button";
import { Checkbox } from "../forms/Checkbox";
import { PeerbotsEmotionIcon } from "../forms/EmotionSelector";
import { Input } from "../forms/Input";
import {
  PEERBOTS_COLOR_MAP,
  PEERBOTS_FONT_COLOR_MAP,
} from "../forms/PeerbotsColorSelector";
import { Select } from "../forms/Select";
import { Icon } from "../foundations/Icon";
import { cn } from "../utils";

/**
 * Preserves text input cursor selection across controlled re-renders.
 */
export function useSelectionInput<
  T extends HTMLInputElement | HTMLTextAreaElement,
>(value: unknown) {
  const [cursor, setCursor] = useState<number | null>(null);
  const ref = useRef<T>(null);

  useEffect(() => {
    if (ref.current && cursor !== null) {
      ref.current.setSelectionRange(cursor, cursor);
    }
  }, [value, cursor]);

  const handleSelectionChange = (
    e: React.ChangeEvent<T> | React.SyntheticEvent<T, Event>,
  ) => {
    const target = e.target as T;
    setCursor(target.selectionStart);
  };

  return {
    ref,
    cursor,
    setCursor,
    handleSelectionChange,
  };
}

export type PeerbotsButtonRowLabels = Pick<
  ControlLabels,
  | "selectButton"
  | "sendMessage"
  | "buttonTitle"
  | "labelColor"
  | "buttonType"
  | "message"
  | "log"
  | "details"
  | "speech"
  | "robotColor"
  | "emotion"
  | "moveUp"
  | "moveDown"
  | "deleteButton"
>;

export interface PeerbotsButtonRowProps {
  /** Controlled button model */
  button?: RobotControlButton;
  /** Alias for `button` (backward-compatible with `app.peerbots.org`) */
  buttonInfo?: RobotControlButton;
  /** Optional stable identifier used to derive unique accessible control IDs */
  buttonId?: string;
  /** Whether this row is checked in multi-selection */
  selected?: boolean;
  /** Whether editing title automatically syncs speech/details (and vice versa) */
  syncVals?: boolean;
  /** Whether row editing and actions are disabled */
  disabled?: boolean;
  /** Action callback invoked for row selection, click, save, move, and delete */
  onAction: (action: RobotControlButtonAction) => void;
  /** Optional custom emotion icon overrides */
  emotionIcons?: Partial<Record<PeerbotsEmotion, string | React.ReactNode>>;
  /** Optional localized emotion names */
  emotionLabels?: Partial<Record<PeerbotsEmotion, string>>;
  /** Optional localized color names */
  colorLabels?: Partial<Record<PeerbotsColor, string>>;
  /** Optional localized UI labels */
  labels?: Partial<PeerbotsButtonRowLabels>;
  className?: string;
}

export function PeerbotsButtonRow({
  button,
  buttonInfo,
  buttonId,
  selected = false,
  syncVals = false,
  disabled = false,
  onAction,
  emotionIcons,
  emotionLabels,
  colorLabels,
  labels,
  className,
}: PeerbotsButtonRowProps) {
  const resolved = button ?? buttonInfo;
  const { labels: contextLabels } = usePeerbotsI18n();
  const generatedId = React.useId();
  const rowDomId = buttonId ? `pb-row-${buttonId}-${generatedId}` : generatedId;

  const resolvedLabels: PeerbotsButtonRowLabels = {
    selectButton:
      labels?.selectButton ??
      contextLabels?.control?.selectButton ??
      DEFAULT_CONTROL_LABELS.selectButton,
    sendMessage:
      labels?.sendMessage ??
      contextLabels?.control?.sendMessage ??
      DEFAULT_CONTROL_LABELS.sendMessage,
    buttonTitle:
      labels?.buttonTitle ??
      contextLabels?.control?.buttonTitle ??
      DEFAULT_CONTROL_LABELS.buttonTitle,
    labelColor:
      labels?.labelColor ??
      contextLabels?.control?.labelColor ??
      DEFAULT_CONTROL_LABELS.labelColor,
    buttonType:
      labels?.buttonType ??
      contextLabels?.control?.buttonType ??
      DEFAULT_CONTROL_LABELS.buttonType,
    message:
      labels?.message ??
      contextLabels?.control?.message ??
      DEFAULT_CONTROL_LABELS.message,
    log:
      labels?.log ??
      contextLabels?.control?.log ??
      DEFAULT_CONTROL_LABELS.log,
    details:
      labels?.details ??
      contextLabels?.control?.details ??
      DEFAULT_CONTROL_LABELS.details,
    speech:
      labels?.speech ??
      contextLabels?.control?.speech ??
      DEFAULT_CONTROL_LABELS.speech,
    robotColor:
      labels?.robotColor ??
      contextLabels?.control?.robotColor ??
      DEFAULT_CONTROL_LABELS.robotColor,
    emotion:
      labels?.emotion ??
      contextLabels?.control?.emotion ??
      DEFAULT_CONTROL_LABELS.emotion,
    moveUp:
      labels?.moveUp ??
      contextLabels?.control?.moveUp ??
      DEFAULT_CONTROL_LABELS.moveUp,
    moveDown:
      labels?.moveDown ??
      contextLabels?.control?.moveDown ??
      DEFAULT_CONTROL_LABELS.moveDown,
    deleteButton:
      labels?.deleteButton ??
      contextLabels?.control?.deleteButton ??
      contextLabels?.common?.delete ??
      DEFAULT_CONTROL_LABELS.deleteButton,
  };

  const titleValue = resolved?.details.title ?? "";
  const detailsValue =
    resolved?.type === "Log" ? (resolved.details.details ?? "") : "";
  const speechValue =
    resolved?.type === "Message" ? resolved.details.speech : "";

  const { ref: titleRef, handleSelectionChange: onTitleSelectionChange } =
    useSelectionInput<HTMLInputElement>(titleValue);
  const { ref: detailsRef, handleSelectionChange: onDetailsSelectionChange } =
    useSelectionInput<HTMLInputElement>(detailsValue);
  const { ref: speechRef, handleSelectionChange: onSpeechSelectionChange } =
    useSelectionInput<HTMLInputElement>(speechValue);

  if (!resolved) {
    return null;
  }

  const colorOptions = PEERBOTS_COLORS.map((colorName) => ({
    label: colorLabels?.[colorName] ?? colorName,
    value: colorName,
  }));

  const emotionOptions = PEERBOTS_EMOTIONS.map((emotionName) => ({
    label: emotionLabels?.[emotionName] ?? emotionName,
    value: emotionName,
  }));

  const labelBg =
    PEERBOTS_COLOR_MAP[resolved.labelColor] ?? resolved.labelColor;
  const labelFg = PEERBOTS_FONT_COLOR_MAP[resolved.labelColor] ?? "#020307";

  return (
    <div
      className={cn(
        "pb:grid pb:grid-cols-11 pb:items-center pb:gap-1 pb:p-1 pb:transition-all pb:rounded-md pb:border",
        selected
          ? "pb:border-gray-900 pb:bg-gray-50/70"
          : "pb:border-transparent",
        className,
      )}
    >
      {/* Column 1: Selection & Send */}
      <div className="pb:flex pb:items-center pb:gap-1 pb:justify-center">
        <Checkbox
          id={`${rowDomId}-select`}
          checked={selected}
          disabled={disabled}
          aria-label={`${resolvedLabels.selectButton}: ${resolved.details.title || rowDomId}`}
          onChange={(e) => {
            if (disabled) return;
            if (e.target.checked) {
              onAction({ type: "ADD TO SELECTION" });
            } else {
              onAction({ type: "REMOVE FROM SELECTION" });
            }
          }}
        />
        <Button
          variant="secondary"
          size="sm"
          isIconOnly
          disabled={disabled}
          onClick={() => {
            if (disabled) return;
            onAction({ type: "CLICK" });
            onAction({ type: "SELECT" });
          }}
          className="pb:p-1 pb:px-1.5 pb:h-8 pb:w-8 pb:shrink-0"
          title={resolvedLabels.sendMessage}
          aria-label={`${resolvedLabels.sendMessage}: ${resolved.details.title || rowDomId}`}
        >
          <Icon size="sm" aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
            />
          </Icon>
        </Button>
      </div>

      {/* Column 2-3: Title Input */}
      <div
        className="pb:col-span-2 pb:flex pb:rounded-md pb:h-8 pb:items-center pb:border pb:border-black/10 pb:transition-shadow pb:focus-within:ring-1 pb:focus-within:ring-black/20 pb:overflow-hidden"
        style={{
          background: labelBg,
          color: labelFg,
        }}
      >
        <Input
          id={`${rowDomId}-title`}
          className="pb:flex-1 pb:px-2 pb:bg-transparent pb:border-none pb:ring-0 pb:shadow-none pb:text-sm pb:h-full"
          style={{
            color: labelFg,
          }}
          ref={titleRef}
          type="text"
          disabled={disabled}
          placeholder={resolvedLabels.buttonTitle}
          aria-label={resolvedLabels.buttonTitle}
          onFocus={() => {
            if (!disabled) {
              onAction({ type: "SELECT" });
            }
          }}
          onSelect={onTitleSelectionChange}
          onChange={(e) => {
            onTitleSelectionChange(e);
            if (disabled) return;
            const newValue = e.target.value;
            if (resolved.type === "Log") {
              onAction(
                createSaveAction({
                  ...resolved,
                  details: {
                    ...resolved.details,
                    title: newValue,
                    ...(syncVals && { details: newValue }),
                  },
                }),
              );
            } else {
              onAction(
                createSaveAction({
                  ...resolved,
                  details: {
                    ...resolved.details,
                    title: newValue,
                    ...(syncVals && { speech: newValue }),
                  },
                }),
              );
            }
          }}
          value={resolved.details.title}
        />
      </div>

      {/* Column 4: Label Color */}
      <div className="pb:flex pb:px-0.5 pb:min-w-0">
        <Select
          id={`${rowDomId}-label-color`}
          className="pb:w-full pb:h-8 pb:min-h-0 pb:text-[10px] pb:px-1 pb:py-0"
          value={resolved.labelColor}
          disabled={disabled}
          aria-label={resolvedLabels.labelColor}
          options={colorOptions}
          onChange={(val) => {
            if (val && !disabled) {
              onAction(
                createSaveAction({
                  ...resolved,
                  labelColor: val as PeerbotsColor,
                }),
              );
            }
          }}
          onFocus={() => {
            if (!disabled) {
              onAction({ type: "SELECT" });
            }
          }}
        />
      </div>

      {/* Column 5: Type Selection */}
      <div className="pb:flex pb:px-0.5 pb:min-w-0">
        <Select
          id={`${rowDomId}-type`}
          className="pb:w-full pb:h-8 pb:min-h-0 pb:text-[10px] pb:px-1 pb:py-0 pb:font-normal"
          value={resolved.type}
          disabled={disabled}
          aria-label={resolvedLabels.buttonType}
          options={[
            { label: resolvedLabels.message, value: "Message" },
            { label: resolvedLabels.log, value: "Log" },
          ]}
          onFocus={() => {
            if (!disabled) {
              onAction({ type: "SELECT" });
            }
          }}
          onChange={(val) => {
            if (disabled) return;
            if (resolved.type === "Message" && val === "Log") {
              onAction(
                createSaveAction({
                  type: "Log",
                  labelColor: resolved.labelColor,
                  details: {
                    title: resolved.details.title,
                    details: resolved.details.speech,
                  },
                }),
              );
            } else if (resolved.type === "Log" && val === "Message") {
              onAction(
                createSaveAction({
                  type: "Message",
                  labelColor: resolved.labelColor,
                  details: {
                    title: resolved.details.title,
                    speech: resolved.details.details
                      ? resolved.details.details
                      : resolved.details.title,
                    color: resolved.labelColor,
                    emotion: "Neutral",
                  },
                }),
              );
            }
          }}
        />
      </div>

      {/* Column 6-7: Speech / Details */}
      <div className="pb:col-span-2 pb:flex pb:items-center pb:px-0.5 pb:min-w-0">
        {resolved.type === "Log" && (
          <Input
            id={`${rowDomId}-details`}
            className="pb:w-full pb:h-8 pb:text-sm pb:px-2 pb:bg-gray-50/70"
            ref={detailsRef}
            disabled={disabled}
            placeholder={resolvedLabels.details}
            aria-label={resolvedLabels.details}
            onFocus={() => {
              if (!disabled) {
                onAction({ type: "SELECT" });
              }
            }}
            onSelect={onDetailsSelectionChange}
            onChange={(e) => {
              onDetailsSelectionChange(e);
              if (disabled) return;
              const newValue = e.target.value;
              onAction(
                createSaveAction({
                  ...resolved,
                  details: {
                    ...resolved.details,
                    details: newValue,
                    ...(syncVals && { title: newValue }),
                  },
                }),
              );
            }}
            value={resolved.details.details ?? ""}
          />
        )}
        {resolved.type === "Message" && (
          <Input
            id={`${rowDomId}-speech`}
            className="pb:w-full pb:h-8 pb:text-sm pb:px-2 pb:bg-gray-100/50"
            ref={speechRef}
            disabled={disabled}
            placeholder={resolvedLabels.speech}
            aria-label={resolvedLabels.speech}
            onFocus={() => {
              if (!disabled) {
                onAction({ type: "SELECT" });
              }
            }}
            onSelect={onSpeechSelectionChange}
            onChange={(e) => {
              onSpeechSelectionChange(e);
              if (disabled) return;
              const newValue = e.target.value;
              onAction(
                createSaveAction({
                  ...resolved,
                  details: {
                    ...resolved.details,
                    speech: newValue,
                    ...(syncVals && { title: newValue }),
                  },
                }),
              );
            }}
            value={resolved.details.speech}
          />
        )}
      </div>

      {/* Column 8: Robot Face Color */}
      <div className="pb:flex pb:px-0.5 pb:min-w-0">
        {resolved.type === "Message" && (
          <Select
            id={`${rowDomId}-robot-color`}
            className="pb:w-full pb:h-8 pb:min-h-0 pb:text-[10px] pb:px-1 pb:py-0"
            value={resolved.details.color}
            disabled={disabled}
            aria-label={resolvedLabels.robotColor}
            options={colorOptions}
            onFocus={() => {
              if (!disabled) {
                onAction({ type: "SELECT" });
              }
            }}
            onChange={(val) => {
              if (val && !disabled) {
                onAction(
                  createSaveAction({
                    ...resolved,
                    details: {
                      ...resolved.details,
                      color: val as PeerbotsColor,
                    },
                  }),
                );
              }
            }}
          />
        )}
      </div>

      {/* Column 9-10: Emotion Selection */}
      <div className="pb:col-span-2 pb:flex pb:items-center pb:gap-1 pb:px-1 pb:min-w-0">
        {resolved.type === "Message" && (
          <>
            <div
              className="pb:rounded-full pb:h-7 pb:w-7 pb:p-1 pb:border-solid pb:border-black/20 pb:border pb:shrink-0 pb:shadow-xs pb:bg-white pb:flex pb:items-center pb:justify-center"
              style={{
                background:
                  PEERBOTS_COLOR_MAP[resolved.details.color] ??
                  resolved.details.color,
              }}
            >
              <PeerbotsEmotionIcon
                emotion={resolved.details.emotion}
                customIcon={emotionIcons?.[resolved.details.emotion]}
                decorative
              />
            </div>
            <Select
              id={`${rowDomId}-emotion`}
              className="pb:w-full pb:h-8 pb:min-h-0 pb:text-xs pb:px-1.5 pb:py-0"
              value={resolved.details.emotion}
              disabled={disabled}
              aria-label={resolvedLabels.emotion}
              options={emotionOptions}
              onFocus={() => {
                if (!disabled) {
                  onAction({ type: "SELECT" });
                }
              }}
              onChange={(val) => {
                if (val && !disabled) {
                  onAction(
                    createSaveAction({
                      ...resolved,
                      details: {
                        ...resolved.details,
                        emotion: val as PeerbotsEmotion,
                      },
                    }),
                  );
                }
              }}
            />
          </>
        )}
      </div>

      {/* Column 11: Row Actions */}
      <div className="pb:flex pb:items-center pb:gap-1 pb:justify-end">
        <Button
          variant="secondary"
          size="sm"
          isIconOnly
          disabled={disabled}
          className="pb:p-1 pb:w-7 pb:h-7"
          aria-label={resolvedLabels.moveUp}
          onClick={() => {
            if (disabled) return;
            onAction({ type: "SELECT" });
            onAction({ type: "MOVE", direction: "BACK" });
          }}
        >
          <Icon
            name="chevronUpTable"
            size="sm"
            aria-hidden="true"
            className="pb:w-3.5 pb:h-3.5"
          />
        </Button>
        <Button
          variant="secondary"
          size="sm"
          isIconOnly
          disabled={disabled}
          className="pb:p-1 pb:w-7 pb:h-7"
          aria-label={resolvedLabels.moveDown}
          onClick={() => {
            if (disabled) return;
            onAction({ type: "SELECT" });
            onAction({ type: "MOVE", direction: "FORWARD" });
          }}
        >
          <Icon
            name="chevronDownTable"
            size="sm"
            aria-hidden="true"
            className="pb:w-3.5 pb:h-3.5"
          />
        </Button>
        <Button
          variant="danger"
          size="sm"
          isIconOnly
          disabled={disabled}
          className="pb:p-1 pb:w-7 pb:h-7 pb:ms-1"
          aria-label={resolvedLabels.deleteButton}
          onClick={() => {
            if (disabled) return;
            onAction({ type: "DELETE" });
          }}
        >
          <Icon
            name="close"
            size="sm"
            aria-hidden="true"
            className="pb:w-3.5 pb:h-3.5"
          />
        </Button>
      </div>
    </div>
  );
}
