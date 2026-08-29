import React from "react";
import { Button, Icon, IconProps } from ".";
import { Heading, Text } from "./Typography";
import { cn } from "./utils";

export interface EmptyStateAction {
  label: React.ReactNode;
  onClick?: () => void;
  render?: React.ReactElement;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  icon?: IconProps["name"] | React.ReactNode;
}

export interface EmptyStateProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: IconProps["name"] | React.ReactNode;
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  children?: React.ReactNode;
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
        "pb:flex pb:flex-col pb:items-center pb:justify-center pb:p-8 pb:text-center pb:rounded-xl pb:border pb:border-dashed pb:border-gray-200 pb:bg-white/50",
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
            className="pb:text-gray-600 pb:max-w-md pb:mb-6"
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
              variant={primaryAction.variant || "primary"}
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
              variant={secondaryAction.variant || "secondary"}
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
