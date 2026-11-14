import React from "react";
import { NumberField as BaseNumberField } from "@base-ui/react";
import { cn } from "../utils";
import { Icon } from "../foundations/Icon";

/**
 * Props for `<NumberField>` — accessible numeric input with optional stepper buttons and drag-scrubbing.
 */
export interface NumberFieldProps extends React.AriaAttributes {
  /** Controlled numeric value (`null` represents an empty input). */
  value?: number | null;
  /** Initial numeric value in uncontrolled mode. */
  defaultValue?: number;
  /** Minimum permitted numeric value. */
  min?: number;
  /** Maximum permitted numeric value. */
  max?: number;
  /** Step increment applied by stepper buttons and keyboard arrows. */
  step?: number;
  /** Callback invoked when the numeric value changes. */
  onChange?: (value: number | null, event: Event) => void;
  /** Disables editing and stepper buttons when `true`. */
  disabled?: boolean;
  /** Makes the numeric input read-only when `true`. */
  readOnly?: boolean;
  /** Additional classes applied to the root container. */
  className?: string;
  /** DOM `id` forwarded to the root element. */
  id?: string;
  /** Placeholder string shown when the input is empty. */
  placeholder?: string;
  /** Whether to render `-` / `+` stepper buttons (@default false). */
  showButtons?: boolean;
  /**
   * Size scale for height and step buttons.
   * @default "md"
   */
  size?: "sm" | "md";
  /**
   * Visual treatment (`"ghost"` hides border/fill until hover or focus, ideal for table cells).
   * @default "default"
   */
  variant?: "default" | "ghost" | "compact";
  /**
   * Whether the number field sizes compactly (`w-24`) instead of stretching to `100%`.
   * @default false
   */
  inline?: boolean;
}

export const NumberField = React.forwardRef<HTMLDivElement, NumberFieldProps>(
  (
    {
      className,
      value,
      defaultValue,
      min,
      max,
      step,
      onChange,
      disabled,
      readOnly,
      id: propsId,
      placeholder,
      showButtons = false,
      size = "md",
      variant = "default",
      inline = false,
      "aria-label": ariaLabel,
      ...props
    },
    ref,
  ) => {
    const isSmall = size === "sm" || variant === "compact";

    return (
      <div className={cn(inline ? "pb:inline-block pb:w-24" : "pb:w-full")}>
        <BaseNumberField.Root
          ref={ref}
          id={propsId}
          value={value}
          defaultValue={defaultValue}
          min={min}
          max={max}
          step={step}
          onValueChange={(val, details) => {
            if (onChange) {
              const event = details?.event || (details as unknown as Event);
              onChange(val, event);
            }
          }}
          disabled={disabled}
          readOnly={readOnly}
          className={cn("pb:flex pb:flex-col pb:gap-1", className)}
          {...props}
        >
          <BaseNumberField.Group
            className={cn(
              "pb:group pb:relative pb:flex pb:items-center pb:rounded-md pb:border-0 pb:transition-colors",
              variant === "ghost"
                ? "pb:bg-transparent pb:ring-1 pb:ring-inset pb:ring-transparent pb:hover:bg-gray-100/80 pb:hover:ring-gray-300 pb:focus-within:bg-white pb:focus-within:ring-2 pb:focus-within:ring-primary"
                : variant === "compact"
                  ? "pb:bg-white pb:ring-1 pb:ring-inset pb:ring-gray-200 pb:hover:ring-gray-300 pb:focus-within:ring-2 pb:focus-within:ring-primary pb:shadow-2xs"
                  : "pb:bg-primary/10 pb:ring-1 pb:ring-inset pb:ring-gray-300 pb:focus-within:ring-2 pb:focus-within:ring-primary pb:shadow-sm",
              disabled && "pb:opacity-50 pb:cursor-not-allowed",
            )}
          >
            {showButtons && (
              <BaseNumberField.Decrement
                aria-label="Decrement"
                className={cn(
                  "pb:relative pb:z-[2] pb:flex pb:items-center pb:justify-center pb:text-gray-500 pb:hover:text-gray-700 pb:hover:bg-gray-100/50 pb:rounded-s-md pb:border-e disabled:pb:opacity-30 pb:cursor-pointer pb:transition-opacity",
                  isSmall ? "pb:w-6 pb:h-7" : "pb:w-8 pb:h-9",
                  variant === "ghost"
                    ? "pb:border-transparent group-hover:pb:border-gray-200 group-focus-within:pb:border-gray-200"
                    : "pb:border-gray-300",
                )}
              >
                <Icon size="sm" className={cn(isSmall && "pb:w-3 pb:h-3")}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 12h-15"
                  />
                </Icon>
              </BaseNumberField.Decrement>
            )}

            <BaseNumberField.Input
              placeholder={placeholder}
              aria-label={ariaLabel || (typeof placeholder === "string" ? placeholder : "Number input")}
              className={cn(
                "pb:block pb:w-full pb:bg-transparent pb:border-0 pb:text-gray-900 pb:placeholder:text-gray-400 pb:focus:outline-none pb:focus:ring-0 pb:text-center pb:appearance-none pb:relative pb:z-0",
                isSmall
                  ? "pb:px-1.5 pb:py-1 pb:text-xs sm:pb:text-sm pb:leading-5"
                  : "pb:px-3 pb:py-1.5 pb:sm:text-sm pb:sm:leading-6",
                !showButtons && "pb:rounded-md",
              )}
            />

            {showButtons && (
              <BaseNumberField.Increment
                aria-label="Increment"
                className={cn(
                  "pb:relative pb:z-[2] pb:flex pb:items-center pb:justify-center pb:text-gray-500 pb:hover:text-gray-700 pb:hover:bg-gray-100/50 pb:rounded-e-md pb:border-s disabled:pb:opacity-30 pb:cursor-pointer pb:transition-opacity",
                  isSmall ? "pb:w-6 pb:h-7" : "pb:w-8 pb:h-9",
                  variant === "ghost"
                    ? "pb:border-transparent group-hover:pb:border-gray-200 group-focus-within:pb:border-gray-200"
                    : "pb:border-gray-300",
                )}
              >
                <Icon size="sm" className={cn(isSmall && "pb:w-3 pb:h-3")}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </Icon>
              </BaseNumberField.Increment>
            )}

            <BaseNumberField.ScrubArea className="pb:absolute pb:inset-0 pb:z-[1] pb:cursor-ew-resize pb:opacity-0 pb:hover:opacity-10 pb:transition-opacity pb:bg-primary/5 pb:rounded-md pb:pointer-events-none group-pb:hover:pointer-events-auto" />
          </BaseNumberField.Group>
        </BaseNumberField.Root>
      </div>
    );
  },
);

NumberField.displayName = "NumberField";
