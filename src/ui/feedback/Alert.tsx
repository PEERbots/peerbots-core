import React, { useState } from "react";
import { Button } from "../forms/Button";
import { Icon } from "../foundations/Icon";
import { cn } from "../utils";
import { ComponentRadius, FillVariant } from "../types";

export type AlertLevel = "Error" | "Warning" | "Success" | "Info";
export type AlertColor = "danger" | "warning" | "success" | "info" | "neutral";

export interface AlertAction {
  name: string;
  callback: () => void;
}

export interface AlertUIProps {
  /** Alert semantic color */
  color?: AlertColor;
  /** Legacy level prop for backward compatibility */
  level?: AlertLevel;
  /** Visual style variant */
  variant?: "soft" | "outline" | "solid";
  /** Optional alert title */
  title?: React.ReactNode;
  /** Alert message body */
  message?: React.ReactNode;
  /** Children as alternative to message */
  children?: React.ReactNode;
  /** Optional action button */
  action?: AlertAction;
  /** Callback fired when alert is dismissed */
  onClose?: () => void;
  /** Border radius scale */
  radius?: ComponentRadius;
  className?: string;
}

const levelColorMap: Record<AlertLevel, AlertColor> = {
  Error: "danger",
  Warning: "warning",
  Success: "success",
  Info: "info",
};

const iconMap: Record<AlertColor, { name: any; colorClass: string }> = {
  danger: { name: "exclamationCircle", colorClass: "pb:text-red-700" },
  warning: { name: "exclamationTriangle", colorClass: "pb:text-amber-800" },
  success: { name: "checkCircle", colorClass: "pb:text-emerald-800" },
  info: { name: "megaphone", colorClass: "pb:text-teal-800" },
  neutral: { name: "questionMarkCircle", colorClass: "pb:text-gray-700" },
};

const variantColorClasses: Record<string, Record<AlertColor, string>> = {
  soft: {
    danger: "pb:bg-red-50 pb:border-red-200 pb:text-red-900",
    warning: "pb:bg-amber-50 pb:border-amber-200 pb:text-amber-900",
    success: "pb:bg-emerald-50 pb:border-emerald-200 pb:text-emerald-900",
    info: "pb:bg-teal-50 pb:border-teal-200 pb:text-teal-900",
    neutral: "pb:bg-gray-50 pb:border-gray-200 pb:text-gray-900",
  },
  outline: {
    danger: "pb:bg-red-50/40 pb:border-2 pb:border-red-400 pb:text-red-950",
    warning: "pb:bg-amber-50/40 pb:border-2 pb:border-amber-400 pb:text-amber-950",
    success: "pb:bg-emerald-50/40 pb:border-2 pb:border-emerald-500 pb:text-emerald-950",
    info: "pb:bg-teal-50/40 pb:border-2 pb:border-teal-500 pb:text-teal-950",
    neutral: "pb:bg-gray-50/40 pb:border-2 pb:border-gray-300 pb:text-gray-950",
  },
  solid: {
    danger: "pb:bg-red-700 pb:border-transparent pb:text-white",
    warning: "pb:bg-amber-300 pb:border-transparent pb:text-gray-950 pb:font-medium",
    success: "pb:bg-emerald-700 pb:border-transparent pb:text-white",
    info: "pb:bg-teal-700 pb:border-transparent pb:text-white",
    neutral: "pb:bg-gray-900 pb:border-transparent pb:text-white",
  },
};

const radiusClasses: Record<ComponentRadius, string> = {
  none: "pb:rounded-none",
  sm: "pb:rounded-md",
  md: "pb:rounded-xl",
  lg: "pb:rounded-2xl",
  "2xl": "pb:rounded-2xl",
  pill: "pb:rounded-full",
};

export function Alert({
  color,
  level,
  variant = "soft",
  title,
  message,
  children,
  action,
  onClose,
  radius = "2xl",
  className,
}: AlertUIProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const resolvedColor: AlertColor =
    color || (level ? levelColorMap[level] : "info") || "info";

  const { name: iconName, colorClass } = iconMap[resolvedColor];
  const colorStyle = variantColorClasses[variant]?.[resolvedColor] || variantColorClasses.soft.info;

  const handleDismiss = () => {
    setVisible(false);
    onClose?.();
  };

  const body = children || message;

  return (
    <div
      role="alert"
      className={cn(
        "pb:flex pb:w-full pb:items-start pb:gap-3.5 pb:p-4.5 pb:border pb:shadow-xs pb:transition-all pb:duration-200",
        radiusClasses[radius] || radiusClasses["2xl"],
        colorStyle,
        className,
      )}
    >
      <div className="pb:shrink-0 pb:pt-0.5">
        <Icon
          name={iconName}
          className={cn(
            "pb:w-5 pb:h-5",
            variant === "solid" ? "pb:text-current" : colorClass,
          )}
        />
      </div>

      <div className="pb:flex-1 pb:min-w-0 pb:text-sm pb:leading-relaxed">
        {title && (
          <div className="pb:font-bold pb:text-base pb:mb-1 pb:leading-snug">
            {title}
          </div>
        )}
        <div className={cn(title && "pb:opacity-90")}>{body}</div>
      </div>

      {action && (
        <Button
          size="sm"
          variant={variant === "solid" ? "outline" : "solid"}
          color={resolvedColor === "danger" ? "danger" : "neutral"}
          onClick={() => {
            action.callback();
            handleDismiss();
          }}
          className="pb:shrink-0 pb:self-center"
        >
          {action.name}
        </Button>
      )}

      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss alert"
        className="pb:shrink-0 pb:p-1 pb:rounded-lg pb:opacity-70 pb:hover:opacity-100 pb:transition-opacity pb:cursor-pointer pb:self-start pb:-mr-1"
      >
        <Icon name="xCircle" className="pb:w-5 pb:h-5" />
      </button>
    </div>
  );
}
