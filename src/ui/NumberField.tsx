import React from "react";
import { NumberField as BaseNumberField } from "@base-ui/react";
import { cn } from "./utils";
import { Icon } from "./Icon";

export interface NumberFieldProps {
  value?: number | null;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number | null, event: Event) => void;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  id?: string;
  placeholder?: string;
  showButtons?: boolean;
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
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const numberId = propsId || generatedId;

    return (
      <div className="w-full">
        <BaseNumberField.Root
          ref={ref}
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
          className={cn("flex flex-col gap-1", className)}
          {...props}
        >
          <div
            className={cn(
              "group relative flex items-center rounded-md border-0 bg-primary/10 ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-primary shadow-sm",
              disabled && "opacity-50 cursor-not-allowed",
            )}
          >
            {showButtons && (
              <BaseNumberField.Decrement
                aria-label="Decrement"
                className="relative z-20 flex items-center justify-center w-8 h-9 text-gray-500 hover:text-gray-700 hover:bg-gray-100/50 rounded-l-md border-r border-gray-300 disabled:opacity-30 cursor-pointer"
              >
                <Icon size="sm">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 12h-15"
                  />
                </Icon>
              </BaseNumberField.Decrement>
            )}

            <BaseNumberField.Input
              id={numberId}
              placeholder={placeholder}
              className={cn(
                "block w-full bg-transparent border-0 px-3 py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 text-center appearance-none relative z-0",
                !showButtons && "rounded-md",
              )}
            />

            {showButtons && (
              <BaseNumberField.Increment
                aria-label="Increment"
                className="relative z-20 flex items-center justify-center w-8 h-9 text-gray-500 hover:text-gray-700 hover:bg-gray-100/50 rounded-r-md border-l border-gray-300 disabled:opacity-30 cursor-pointer"
              >
                <Icon size="sm">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </Icon>
              </BaseNumberField.Increment>
            )}

            <BaseNumberField.ScrubArea className="absolute inset-0 z-10 cursor-ew-resize opacity-0 hover:opacity-10 transition-opacity bg-primary/5 rounded-md pointer-events-none group-hover:pointer-events-auto" />
          </div>
        </BaseNumberField.Root>
      </div>
    );
  },
);

NumberField.displayName = "NumberField";
