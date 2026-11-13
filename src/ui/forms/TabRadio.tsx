import { ReactNode } from "react";
import { cn } from "../utils";
import { Toggle, ToggleGroup } from "@base-ui/react";

/**
 * Option descriptor for `<TabRadio>`.
 */
export interface TabRadioOption<T extends string> {
  /** Unique string value emitted when this segment is pressed. */
  value: T;
  /** Visible segment label or icon content. */
  label: ReactNode;
  /** Disables selecting this segment when `true`. */
  disabled?: boolean;
}

/**
 * Props for `<TabRadio>` — a compact segmented toggle control backed by `@base-ui/react` `ToggleGroup`
 * for choosing one option out of 2–5 mutually exclusive modes or enum values.
 *
 * **When to choose `<TabRadio>` vs `<ChipGroup>` vs `<TabSelection>`:**
 * - **`<TabRadio>`**: 2–5 static, mutually exclusive mode/view/setting segments in a single bordered pill track (e.g. `"Button" | "Table" | "Flow"`, `"TB" | "LR"`).
 * - **`<ChipGroup>`**: 3–12+ wrapping or scrollable filter pills supporting single-select OR multi-select (`multiple={true}`) and optional count badges.
 * - **`<TabSelection>`**: Dynamic workspace/collection tabs where users switch active views AND can add (`onAddClick`), rename (`onEdit`), or close (`onClose`) tabs.
 */
export interface TabRadioProps<T extends string> {
  /** Ordered list of 2–5 mutually exclusive segment options. */
  options: readonly TabRadioOption<T>[];
  /** Currently active segment value (`undefined` or `null` when none selected). */
  value: T | undefined | null;
  /** Callback fired when the pressed segment changes. */
  onChange: (value: T | undefined) => void;
  /** Additional classes applied to the outer segmented track. */
  className?: string;
  /** Active-segment highlight accent (@default "default"). */
  variant?: "default" | "primary" | "danger";
  /** Accessible group label for screen readers. */
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
