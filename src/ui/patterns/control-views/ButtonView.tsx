import React, { useMemo } from "react";
import {
  DEFAULT_CONTROL_LABELS,
  usePeerbotsI18n,
  type ControlLabels,
} from "../../../i18n";
import { flattenHierarchy } from "../../../templates/hierarchy";
import type {
  PeerbotsEmotion,
  Template,
} from "../../../templates/types";
import { EmptyState } from "../../feedback/EmptyState";
import { cn } from "../../utils";
import { PeerbotsButton } from "../PeerbotsButton";
import type { PeerbotsButtonActionHandler } from "./types";

export interface ButtonViewProps {
  /** Canonical Peerbots template containing `buttons` and `hierarchy` */
  template: Template;
  /** Action callback invoked for button selection and activation */
  onButtonAction: PeerbotsButtonActionHandler;
  /** Primary active/selected button ID */
  selectedButtonId?: string | null;
  /** Optional multi-selected button IDs to highlight */
  selectedButtonIds?: ReadonlyArray<string> | Set<string>;
  /** Disables button clicks when true */
  disabled?: boolean;
  /** Optional custom emotion icon overrides */
  emotionIcons?: Partial<Record<PeerbotsEmotion, string | React.ReactNode>>;
  /** Optional localized emotion names */
  emotionLabels?: Partial<Record<PeerbotsEmotion, string>>;
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
 */
export function ButtonView({
  template,
  onButtonAction,
  selectedButtonId = null,
  selectedButtonIds,
  disabled = false,
  emotionIcons,
  emotionLabels,
  emptyState,
  emptyTitle,
  emptyDescription,
  labels,
  className,
}: ButtonViewProps) {
  const { labels: contextLabels } = usePeerbotsI18n();

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

export const PeerbotsButtonView = ButtonView;
