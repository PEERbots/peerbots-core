import React, { useMemo, useState } from "react";
import { Popover as BasePopover } from "@base-ui/react";
import {
  DEFAULT_CONTROL_LABELS,
  usePeerbotsI18n,
  type ControlLabels,
} from "../../../i18n";
import { flattenHierarchy } from "../../../templates/hierarchy";
import type {
  PeerbotsColor,
  PeerbotsEmotion,
  Template,
} from "../../../templates/types";
import { EmptyState } from "../../feedback/EmptyState";
import type { IconName } from "../../foundations/Icon";
import { cn } from "../../utils";
import { PeerbotsButton } from "../PeerbotsButton";
import { SingleButtonEditPanel } from "./ButtonEditPopoverContent";
import { applyControlActionToTemplate } from "./applyControlAction";
import { createSaveAction, type PeerbotsButtonActionHandler } from "./types";

export interface ButtonViewProps {
  /** Canonical Peerbots template containing `buttons` and `hierarchy` */
  template: Template;
  /** Action callback invoked for button selection and activation */
  onButtonAction: PeerbotsButtonActionHandler;
  /** Optional full-template update callback (used for right-click Duplicate or Root toggle) */
  onTemplateChange?: (nextTemplate: Template) => void;
  /** Primary active/selected button ID */
  selectedButtonId?: string | null;
  /** Optional multi-selected button IDs to highlight */
  selectedButtonIds?: ReadonlyArray<string> | Set<string>;
  /** Disables button clicks and right-click editing when true */
  disabled?: boolean;
  /** Enables opening the concise edit popover on right-click (`onContextMenu`) (@default true) */
  enableContextEdit?: boolean;
  /** Optional icon name for `"Log"` buttons (@default "zap") */
  logIcon?: IconName;
  /** Optional custom emotion icon overrides */
  emotionIcons?: Partial<Record<PeerbotsEmotion, string | React.ReactNode>>;
  /** Optional localized emotion names */
  emotionLabels?: Partial<Record<PeerbotsEmotion, string>>;
  /** Optional localized color names */
  colorLabels?: Partial<Record<PeerbotsColor, string>>;
  /** Optional custom empty state rendered when template has no buttons */
  emptyState?: React.ReactNode;
  /** Optional empty-state heading override when `template` has zero buttons */
  emptyTitle?: React.ReactNode;
  /** Optional empty-state description override when `template` has zero buttons */
  emptyDescription?: React.ReactNode;
  /** Optional localized empty-state copy overrides */
  labels?: Partial<
    Pick<ControlLabels, "emptyTemplateTitle" | "emptyTemplateDescription">
  >;
  /** Additional grid container classes */
  className?: string;
}

/**
 * Responsive controller button grid view for triggering `RobotControlButton` entries in a `Template`.
 * Right-clicking any button (when `!disabled` and `enableContextEdit` is true) opens a concise
 * viewport-aware Edit Popover for inline editing of title, speech/notes, colors, emotion, and type.
 */
export function ButtonView({
  template,
  onButtonAction,
  onTemplateChange,
  selectedButtonId = null,
  selectedButtonIds,
  disabled = false,
  enableContextEdit = true,
  logIcon = "zap",
  emotionIcons,
  emotionLabels,
  colorLabels,
  emptyState,
  emptyTitle,
  emptyDescription,
  labels,
  className,
}: ButtonViewProps) {
  const { labels: contextLabels } = usePeerbotsI18n();
  const [editingState, setEditingState] = useState<{
    buttonId: string;
    anchorEl: HTMLElement | null;
  } | null>(null);

  const selectedSet = useMemo(() => {
    if (!selectedButtonIds) return new Set<string>();
    return selectedButtonIds instanceof Set
      ? selectedButtonIds
      : new Set(selectedButtonIds);
  }, [selectedButtonIds]);

  const visibleButtons = useMemo(() => {
    return flattenHierarchy(template.hierarchy)
      .map((entry) => ({
        ...entry,
        button: template.buttons[entry.buttonId],
      }))
      .filter((entry) => Boolean(entry.button));
  }, [template.hierarchy, template.buttons]);

  const editingButton =
    editingState && template.buttons[editingState.buttonId]
      ? template.buttons[editingState.buttonId]
      : undefined;

  if (visibleButtons.length === 0) {
    if (emptyState) {
      return <>{emptyState}</>;
    }
    const resolvedTitle =
      emptyTitle ??
      labels?.emptyTemplateTitle ??
      contextLabels?.control?.emptyTemplateTitle ??
      DEFAULT_CONTROL_LABELS.emptyTemplateTitle;
    const resolvedDescription =
      emptyDescription ??
      labels?.emptyTemplateDescription ??
      contextLabels?.control?.emptyTemplateDescription ??
      DEFAULT_CONTROL_LABELS.emptyTemplateDescription;

    return (
      <div className={cn("pb:p-4", className)}>
        <EmptyState
          icon="squares"
          title={resolvedTitle}
          description={resolvedDescription}
        />
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          "pb:grid pb:grid-cols-2 sm:pb:grid-cols-3 md:pb:grid-cols-4 pb:gap-2.5 pb:p-2",
          className,
        )}
      >
        {visibleButtons.map(({ buttonId, button }) => {
          const isSelected =
            buttonId === selectedButtonId || selectedSet.has(buttonId);
          return (
            <PeerbotsButton
              key={buttonId}
              button={button}
              selected={isSelected}
              disabled={disabled}
              logIcon={logIcon}
              emotionIcons={emotionIcons}
              emotionLabels={emotionLabels}
              onClick={() => {
                if (!disabled) {
                  onButtonAction(button, buttonId, { type: "SELECT" });
                  onButtonAction(button, buttonId, { type: "CLICK" });
                }
              }}
              onContextMenu={(e) => {
                if (disabled || !enableContextEdit) return;
                e.preventDefault();
                setEditingState({
                  buttonId,
                  anchorEl: e.currentTarget,
                });
              }}
            />
          );
        })}
      </div>

      {!disabled && enableContextEdit && (
        <BasePopover.Root
          open={Boolean(editingButton)}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) {
              setEditingState(null);
            }
          }}
        >
          <BasePopover.Portal>
            <BasePopover.Positioner
              anchor={editingState?.anchorEl}
              side="bottom"
              align="start"
              sideOffset={8}
              className="pb:z-50"
            >
              <BasePopover.Popup
                aria-label="Edit button"
                className="pb:z-50 pb:rounded-xl pb:bg-white pb:border pb:border-gray-200 pb:shadow-xl pb:p-3 pb:text-gray-900"
              >
                {editingButton && editingState && (
                  <SingleButtonEditPanel
                    button={editingButton}
                    isRoot={
                      Array.isArray(template.hierarchy?.root) &&
                      template.hierarchy.root.includes(editingState.buttonId)
                    }
                    emotionIcons={emotionIcons}
                    emotionLabels={emotionLabels}
                    colorLabels={colorLabels}
                    onSave={(nextButton) => {
                      const action = createSaveAction(nextButton);
                      onButtonAction(editingButton, editingState.buttonId, action);
                      if (onTemplateChange) {
                        onTemplateChange(
                          applyControlActionToTemplate(
                            template,
                            editingState.buttonId,
                            action,
                          ),
                        );
                      }
                    }}
                    onDelete={() => {
                      const idToDelete = editingState.buttonId;
                      setEditingState(null);
                      onButtonAction(editingButton, idToDelete, {
                        type: "DELETE",
                      });
                      if (onTemplateChange) {
                        onTemplateChange(
                          applyControlActionToTemplate(template, idToDelete, {
                            type: "DELETE",
                          }),
                        );
                      }
                    }}
                    onClose={() => setEditingState(null)}
                  />
                )}
              </BasePopover.Popup>
            </BasePopover.Positioner>
          </BasePopover.Portal>
        </BasePopover.Root>
      )}
    </>
  );
}

export const PeerbotsButtonView = ButtonView;
