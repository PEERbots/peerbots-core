import React, { useMemo, useState } from "react";
import { usePeerbotsI18n } from "../../i18n";
import {
  DEFAULT_CONTROL_LABELS,
  type ControlLabels,
} from "../../i18n/types";
import { flattenHierarchy } from "../../templates/hierarchy";
import {
  PEERBOTS_COLORS,
  PEERBOTS_EMOTIONS,
  type PeerbotsColor,
  type PeerbotsEmotion,
  type RobotControlButton,
  type RobotControlButtonAction,
  type Template,
} from "../../templates/types";
import { Button } from "../forms/Button";
import { Checkbox } from "../forms/Checkbox";
import { Select } from "../forms/Select";
import { Switch } from "../forms/Switch";
import { Icon } from "../foundations/Icon";
import { cn } from "../utils";
import { PeerbotsButton } from "./PeerbotsButton";
import { PeerbotsButtonRow } from "./PeerbotsButtonRow";

export type PeerbotsTemplateView = "Buttons" | "Table" | (string & {});

export type PeerbotsButtonDisplayLabels = ControlLabels;

export interface PeerbotsButtonDisplayCustomViewProps {
  view: string;
  template: Template;
  disabled?: boolean;
  onButtonAction: (
    button: RobotControlButton,
    buttonId: string,
    action: RobotControlButtonAction,
  ) => void;
}

export interface PeerbotsButtonDisplayProps {
  /** Canonical template containing `buttons` dictionary and `hierarchy` */
  template: Template;
  /** Active presentation mode (`"Buttons"` grid or `"Table"` editor) */
  view?: PeerbotsTemplateView;
  /** Controlled active button ID highlighted in `"Buttons"` view */
  selectedButtonId?: string | null;
  /** Controlled multi-selected button IDs in `"Table"` view */
  multiSelectedButtonIds?: readonly string[];
  /** Callback invoked when clearing multi-selection in `"Table"` view */
  onClearSelection?: () => void;
  /** Controlled sync toggle between title and speech/details in `"Table"` view */
  syncTitleSpeech?: boolean;
  /** Uncontrolled initial sync toggle state in `"Table"` view */
  defaultSyncTitleSpeech?: boolean;
  /** Callback invoked when the sync toggle changes */
  onSyncTitleSpeechChange?: (sync: boolean) => void;
  /** Disables button clicks and row edits */
  disabled?: boolean;
  /** Action handler invoked for button clicks, selection, edits, moves, and deletes */
  onButtonAction: (
    button: RobotControlButton,
    buttonId: string,
    action: RobotControlButtonAction,
  ) => void;
  /** Optional custom emotion icon overrides */
  emotionIcons?: Partial<Record<PeerbotsEmotion, string | React.ReactNode>>;
  /** Optional localized emotion names */
  emotionLabels?: Partial<Record<PeerbotsEmotion, string>>;
  /** Optional localized color names */
  colorLabels?: Partial<Record<PeerbotsColor, string>>;
  /** Optional localized UI labels */
  labels?: Partial<PeerbotsButtonDisplayLabels>;
  /** Optional extension renderer for custom app-level views (e.g. `"Flow"`) */
  renderCustomView?: (
    props: PeerbotsButtonDisplayCustomViewProps,
  ) => React.ReactNode;
  className?: string;
}

/**
 * Pure, controlled, store-agnostic Peerbots template display supporting
 * responsive `"Buttons"` controller grid and `"Table"` hierarchy/bulk editor.
 */
export function PeerbotsButtonDisplay({
  template,
  view = "Buttons",
  selectedButtonId = null,
  multiSelectedButtonIds = [],
  onClearSelection,
  syncTitleSpeech: controlledSync,
  defaultSyncTitleSpeech = false,
  onSyncTitleSpeechChange,
  disabled = false,
  onButtonAction,
  emotionIcons,
  emotionLabels,
  colorLabels,
  labels,
  renderCustomView,
  className,
}: PeerbotsButtonDisplayProps) {
  const { labels: contextLabels } = usePeerbotsI18n();
  const [uncontrolledSync, setUncontrolledSync] = useState<boolean>(
    defaultSyncTitleSpeech,
  );

  const isSyncControlled = controlledSync !== undefined;
  const syncActive = isSyncControlled ? controlledSync : uncontrolledSync;

  const handleToggleSync = (nextValue: boolean) => {
    if (disabled) return;
    if (!isSyncControlled) {
      setUncontrolledSync(nextValue);
    }
    onSyncTitleSpeechChange?.(nextValue);
  };

  const resolvedLabels: ControlLabels = {
    selectButton:
      labels?.selectButton ??
      contextLabels?.control?.selectButton ??
      DEFAULT_CONTROL_LABELS.selectButton,
    selectAll:
      labels?.selectAll ??
      contextLabels?.control?.selectAll ??
      DEFAULT_CONTROL_LABELS.selectAll,
    selectedCount:
      labels?.selectedCount ??
      contextLabels?.control?.selectedCount ??
      DEFAULT_CONTROL_LABELS.selectedCount,
    sendMessage:
      labels?.sendMessage ??
      contextLabels?.control?.sendMessage ??
      DEFAULT_CONTROL_LABELS.sendMessage,
    buttonTitle:
      labels?.buttonTitle ??
      contextLabels?.control?.buttonTitle ??
      DEFAULT_CONTROL_LABELS.buttonTitle,
    sync:
      labels?.sync ??
      contextLabels?.control?.sync ??
      DEFAULT_CONTROL_LABELS.sync,
    syncTitleSpeechAria:
      labels?.syncTitleSpeechAria ??
      contextLabels?.control?.syncTitleSpeechAria ??
      DEFAULT_CONTROL_LABELS.syncTitleSpeechAria,
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
    speechDetails:
      labels?.speechDetails ??
      contextLabels?.control?.speechDetails ??
      DEFAULT_CONTROL_LABELS.speechDetails,
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
    applyAll:
      labels?.applyAll ??
      contextLabels?.control?.applyAll ??
      contextLabels?.common?.applyAll ??
      DEFAULT_CONTROL_LABELS.applyAll,
  };

  const flatButtons = useMemo(
    () => flattenHierarchy(template.hierarchy),
    [template.hierarchy],
  );

  if (view === "Buttons") {
    return (
      <div
        className={cn(
          "pb:grid pb:grid-cols-1 pb:sm:grid-cols-2 pb:md:grid-cols-4 pb:p-2 pb:sm:p-4",
          className,
        )}
      >
        {flatButtons.map(({ buttonId }) => {
          const button = template.buttons[buttonId];
          if (!button) return null;
          return (
            <PeerbotsButton
              key={buttonId}
              button={button}
              selected={buttonId === selectedButtonId}
              disabled={disabled}
              emotionIcons={emotionIcons}
              emotionLabels={emotionLabels}
              onClick={() => {
                if (!disabled) {
                  onButtonAction(button, buttonId, { type: "SELECT" });
                  onButtonAction(button, buttonId, { type: "CLICK" });
                }
              }}
            />
          );
        })}
      </div>
    );
  }

  if (view === "Table") {
    const colorOptions = PEERBOTS_COLORS.map((colorName) => ({
      label: colorLabels?.[colorName] ?? colorName,
      value: colorName,
    }));

    const emotionOptions = PEERBOTS_EMOTIONS.map((emotionName) => ({
      label: emotionLabels?.[emotionName] ?? emotionName,
      value: emotionName,
    }));

    const formattedSelectedCount = resolvedLabels.selectedCount.replace(
      "{count}",
      String(multiSelectedButtonIds.length),
    );

    return (
      <div className={cn("pb:w-full pb:overflow-x-auto", className)}>
        <div className="pb:flex pb:flex-col pb:gap-1 pb:min-w-[760px]">
          {/* Header Row */}
          <div className="pb:grid pb:grid-cols-11 pb:font-semibold pb:text-xs pb:uppercase pb:tracking-wider pb:pb-2 pb:mb-2 pb:border-b pb:border-gray-200 pb:sticky pb:top-0 pb:bg-white pb:items-center pb:z-10">
            <div className="pb:flex pb:justify-center" />
            <div className="pb:col-span-2 pb:px-2 pb:flex pb:items-center pb:justify-between">
              <span>{resolvedLabels.buttonTitle}</span>
              <div className="pb:flex pb:items-center pb:gap-1.5 pb:pe-2">
                <span className="pb:text-[10px] pb:font-bold">
                  {resolvedLabels.sync}
                </span>
                <Switch
                  name="syncTitleAndSpeech"
                  aria-label={resolvedLabels.syncTitleSpeechAria}
                  checked={syncActive}
                  onChange={(checked) => handleToggleSync(checked)}
                  disabled={disabled}
                />
              </div>
            </div>
            <div className="pb:px-2">{resolvedLabels.labelColor}</div>
            <div className="pb:px-2">{resolvedLabels.buttonType}</div>
            <div className="pb:col-span-2 pb:px-2">
              {resolvedLabels.speechDetails}
            </div>
            <div className="pb:px-2">{resolvedLabels.robotColor}</div>
            <div className="pb:px-2">{resolvedLabels.emotion}</div>
            <div />
            <div />
          </div>

          {/* Multi-Selection Bulk Action Bar */}
          {!disabled && multiSelectedButtonIds.length > 1 && (
            <div className="pb:grid pb:grid-cols-11 pb:items-center pb:rounded-lg pb:py-1.5 pb:px-2 pb:mb-2 pb:border pb:border-primary/30 pb:bg-primary/5 pb:shadow-xs">
              <div className="pb:flex pb:flex-col pb:items-center pb:justify-center pb:text-xs pb:font-bold pb:px-1 pb:text-center pb:leading-none pb:gap-1">
                <Checkbox
                  checked
                  aria-label={resolvedLabels.selectAll}
                  onChange={() => {
                    if (!disabled) {
                      onClearSelection?.();
                    }
                  }}
                  className="pb:h-4 pb:w-4 pb:bg-white"
                />
                <span>{formattedSelectedCount}</span>
              </div>
              <div className="pb:col-span-2" />
              <div className="pb:px-0.5">
                <Select
                  className="pb:w-full pb:h-8 pb:text-[10px] pb:bg-white"
                  value=""
                  aria-label={`${resolvedLabels.applyAll} ${resolvedLabels.labelColor}`}
                  placeholder={resolvedLabels.applyAll}
                  options={colorOptions}
                  onChange={(val) => {
                    if (val && !disabled) {
                      multiSelectedButtonIds.forEach((buttonId) => {
                        const targetBtn = template.buttons[buttonId];
                        if (targetBtn) {
                          onButtonAction(targetBtn, buttonId, {
                            type: "SAVE",
                            newButton: {
                              ...targetBtn,
                              labelColor: val as PeerbotsColor,
                            },
                          });
                        }
                      });
                    }
                  }}
                />
              </div>
              <div />
              <div className="pb:col-span-2" />
              <div className="pb:px-0.5">
                <Select
                  className="pb:w-full pb:h-8 pb:text-[10px] pb:bg-white"
                  value=""
                  aria-label={`${resolvedLabels.applyAll} ${resolvedLabels.robotColor}`}
                  placeholder={resolvedLabels.applyAll}
                  options={colorOptions}
                  onChange={(val) => {
                    if (val && !disabled) {
                      multiSelectedButtonIds.forEach((buttonId) => {
                        const targetBtn = template.buttons[buttonId];
                        if (targetBtn && targetBtn.type === "Message") {
                          onButtonAction(targetBtn, buttonId, {
                            type: "SAVE",
                            newButton: {
                              ...targetBtn,
                              details: {
                                ...targetBtn.details,
                                color: val as PeerbotsColor,
                              },
                            },
                          });
                        }
                      });
                    }
                  }}
                />
              </div>
              <div className="pb:col-span-2 pb:px-0.5">
                <Select
                  className="pb:w-full pb:h-8 pb:text-[10px] pb:bg-white"
                  value=""
                  aria-label={`${resolvedLabels.applyAll} ${resolvedLabels.emotion}`}
                  placeholder={resolvedLabels.applyAll}
                  options={emotionOptions}
                  onChange={(val) => {
                    if (val && !disabled) {
                      multiSelectedButtonIds.forEach((buttonId) => {
                        const targetBtn = template.buttons[buttonId];
                        if (targetBtn && targetBtn.type === "Message") {
                          onButtonAction(targetBtn, buttonId, {
                            type: "SAVE",
                            newButton: {
                              ...targetBtn,
                              details: {
                                ...targetBtn.details,
                                emotion: val as PeerbotsEmotion,
                              },
                            },
                          });
                        }
                      });
                    }
                  }}
                />
              </div>
              <div className="pb:flex pb:justify-center pb:gap-1">
                <Button
                  variant="secondary"
                  size="sm"
                  isIconOnly
                  aria-label={resolvedLabels.moveUp}
                  className="pb:h-8 pb:w-8 pb:p-0"
                  onClick={() => {
                    if (!disabled) {
                      multiSelectedButtonIds.forEach((buttonId) => {
                        const targetBtn = template.buttons[buttonId];
                        if (targetBtn) {
                          onButtonAction(targetBtn, buttonId, {
                            type: "MOVE",
                            direction: "BACK",
                          });
                        }
                      });
                    }
                  }}
                >
                  <Icon size="sm" name="arrowUp" aria-hidden="true" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  isIconOnly
                  aria-label={resolvedLabels.moveDown}
                  className="pb:h-8 pb:w-8 pb:p-0"
                  onClick={() => {
                    if (!disabled) {
                      multiSelectedButtonIds.forEach((buttonId) => {
                        const targetBtn = template.buttons[buttonId];
                        if (targetBtn) {
                          onButtonAction(targetBtn, buttonId, {
                            type: "MOVE",
                            direction: "FORWARD",
                          });
                        }
                      });
                    }
                  }}
                >
                  <Icon size="sm" name="arrowDown" aria-hidden="true" />
                </Button>
              </div>
            </div>
          )}

          {/* Flattened Hierarchy Rows */}
          {flatButtons.map(({ buttonId, depth }) => {
            const button = template.buttons[buttonId];
            if (!button) return null;
            return (
              <div
                key={buttonId}
                style={{ paddingInlineStart: `${depth * 24}px` }}
              >
                <PeerbotsButtonRow
                  button={button}
                  buttonId={buttonId}
                  selected={multiSelectedButtonIds.includes(buttonId)}
                  syncVals={syncActive}
                  disabled={disabled}
                  emotionIcons={emotionIcons}
                  emotionLabels={emotionLabels}
                  colorLabels={colorLabels}
                  labels={labels}
                  onAction={(action) => {
                    if (!disabled) {
                      onButtonAction(button, buttonId, action);
                    }
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (renderCustomView) {
    return (
      <>
        {renderCustomView({
          view,
          template,
          disabled,
          onButtonAction,
        })}
      </>
    );
  }

  return null;
}
