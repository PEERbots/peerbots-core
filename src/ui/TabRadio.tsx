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
    "pb:data-[pressed]:bg-white pb:data-[pressed]:text-gray-900 pb:data-[pressed]:shadow-sm pb:data-[pressed]:ring-1 pb:data-[pressed]:ring-gray-200",
  primary:
    "pb:data-[pressed]:bg-primary/20 pb:data-[pressed]:shadow-sm pb:data-[pressed]:ring-1 pb:data-[pressed]:ring-primary",
  danger:
    "pb:data-[pressed]:bg-danger/20 pb:data-[pressed]:shadow-sm pb:data-[pressed]:ring-1 pb:data-[pressed]:ring-danger",
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
        "pb:inline-flex pb:p-1 pb:space-x-1 pb:bg-gray-100 pb:rounded-lg pb:border pb:border-gray-200",
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
              "pb:relative pb:cursor-pointer pb:px-3 pb:py-1.5 pb:text-sm pb:font-medium pb:rounded-md pb:transition-all pb:flex pb:items-center pb:justify-center pb:outline-none",
              "pb:text-gray-600 pb:hover:text-gray-900 pb:hover:bg-gray-200",
              "pb:disabled:opacity-50 pb:disabled:cursor-not-allowed pb:disabled:hover:bg-transparent pb:disabled:hover:text-gray-600",
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
