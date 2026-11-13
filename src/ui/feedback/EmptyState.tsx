import React from "react";
import { Button } from "../forms/Button";
import { Icon, IconProps } from "../foundations/Icon";
import { Heading, Text } from "../foundations/Typography";
import { cn } from "../utils";
import { ComponentColor, FillVariant } from "../types";

/**
 * Action button descriptor rendered inside `<EmptyState>`.
 */
export interface EmptyStateAction {
  /** Button label content. */
  label: React.ReactNode;
  /** Click handler invoked when the action button is activated. */
  onClick?: () => void;
  /** Optional custom render element (e.g. an anchor or router `<Link>`) passed to `<Button>`. */
  render?: React.ReactElement;
  /** Visual fill treatment for the action button. */
  variant?: FillVariant;
  /** Brand or semantic color token for the action button. */
  color?: ComponentColor;
  /** Optional leading icon name from the registry or custom icon node. */
  icon?: IconProps["name"] | React.ReactNode;
}

/**
 * Props for `<EmptyState>` — a dashed placeholder surface for zero-data or empty-search states.
 */
export interface EmptyStateProps {
  /** Primary empty-state heading. */
  title: React.ReactNode;
  /** Explanatory helper copy below the title. */
  description?: React.ReactNode;
  /** Optional decorative icon name from `<Icon>` or custom illustration node. */
  icon?: IconProps["name"] | React.ReactNode;
  /** Primary call-to-action button (e.g. "Create Template"). */
  primaryAction?: EmptyStateAction;
  /** Optional secondary action button (e.g. "Clear Filters"). */
  secondaryAction?: EmptyStateAction;
  /** Additional custom content rendered beneath the action buttons. */
  children?: React.ReactNode;
  /** Additional container classes. */
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  primaryAction,
  secondaryAction,
  children,
  className,
}: EmptyStateProps) {
  const renderIcon = () => {
    if (!icon) return null;
    if (typeof icon === "string") {
      return (
        <Icon
          name={icon as IconProps["name"]}
          className="pb:w-16 pb:h-16 pb:mx-auto pb:text-gray-400 pb:mb-4"
        />
      );
    }
    return <div className="pb:flex pb:justify-center pb:mb-4">{icon}</div>;
  };

  return (
    <div
      className={cn(
        "pb:flex pb:flex-col pb:items-center pb:justify-center pb:p-8 pb:text-center pb:rounded-2xl pb:border pb:border-dashed pb:border-gray-200 pb:bg-white/50",
        className,
      )}
    >
      {renderIcon()}

      {typeof title === "string" ? (
        <Heading
          level={3}
          className="pb:font-bold pb:text-gray-800 pb:mb-2"
        >
          {title}
        </Heading>
      ) : (
        title
      )}

      {description &&
        (typeof description === "string" ? (
          <Text
            color="muted"
            className="pb:max-w-md pb:mb-6"
          >
            {description}
          </Text>
        ) : (
          <div className="pb:text-gray-600 pb:max-w-md pb:mb-6">{description}</div>
        ))}

      {(primaryAction || secondaryAction) && (
        <div className="pb:flex pb:flex-wrap pb:gap-3 pb:justify-center pb:items-center">
          {primaryAction && (
            <Button
              variant={primaryAction.variant || "solid"}
              color={primaryAction.color || "primary"}
              onClick={primaryAction.onClick}
              render={primaryAction.render}
              leftIcon={
                typeof primaryAction.icon === "string" ? (
                  <Icon name={primaryAction.icon as IconProps["name"]} />
                ) : (
                  primaryAction.icon
                )
              }
            >
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant={secondaryAction.variant || "solid"}
              color={secondaryAction.color || "neutral"}
              onClick={secondaryAction.onClick}
              render={secondaryAction.render}
              leftIcon={
                typeof secondaryAction.icon === "string" ? (
                  <Icon name={secondaryAction.icon as IconProps["name"]} />
                ) : (
                  secondaryAction.icon
                )
              }
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}

      {children}
    </div>
  );
}
