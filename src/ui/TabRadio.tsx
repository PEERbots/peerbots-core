import { ReactNode } from "react";
import { cn } from "./utils";
import { Toggle, ToggleGroup } from "@base-ui/react";

export interface TabRadioOption<T extends string> {
  value: T;
  label: ReactNode;
  disabled?: boolean;
}

export interface TabRadioProps<T extends string> {
  options: readonly TabRadioOption<T>[];
  value: T | undefined | null;
  onChange: (value: T | undefined) => void;
  className?: string;
  variant?: "default" | "primary" | "danger";
  "aria-label"?: string;
}

const variantStyles = {
  default:
    "data-[pressed]:bg-white data-[pressed]:text-gray-900 data-[pressed]:shadow-sm data-[pressed]:ring-1 data-[pressed]:ring-gray-200",
  primary:
    "data-[pressed]:bg-primary/20 data-[pressed]:shadow-sm data-[pressed]:ring-1 data-[pressed]:ring-primary",
  danger:
    "data-[pressed]:bg-danger/20 data-[pressed]:shadow-sm data-[pressed]:ring-1 data-[pressed]:ring-danger",
};

export function TabRadio<T extends string>({
  options,
  value,
  onChange,
  className,
  variant = "default",
  "aria-label": ariaLabel,
}: TabRadioProps<T>) {
  return (
    <ToggleGroup
      value={value ? [value] : []}
      onValueChange={(val) => {
        onChange(val[0] as T | undefined);
      }}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex p-1 space-x-1 bg-gray-100 rounded-lg border border-gray-200",
        className,
      )}
    >
      {options.map((option) => {
        return (
          <Toggle
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            className={cn(
              "relative cursor-pointer px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center justify-center outline-none",
              "text-gray-600 hover:text-gray-900 hover:bg-gray-200",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-600",
              variantStyles[variant],
            )}
          >
            {option.label}
          </Toggle>
        );
      })}
    </ToggleGroup>
  );
}
