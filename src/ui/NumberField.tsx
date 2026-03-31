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
      <div className="pb:w-full">
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
                className="pb:relative pb:z-20 pb:flex pb:items-center pb:justify-center pb:w-8 pb:h-9 pb:text-gray-500 hover:pb:text-gray-700 hover:pb:bg-gray-100/50 pb:rounded-l-md pb:border-r pb:border-gray-300 disabled:pb:opacity-30 pb:cursor-pointer"
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
                className="pb:relative pb:z-20 pb:flex pb:items-center pb:justify-center pb:w-8 pb:h-9 pb:text-gray-500 hover:pb:text-gray-700 hover:pb:bg-gray-100/50 pb:rounded-r-md pb:border-l pb:border-gray-300 disabled:pb:opacity-30 pb:cursor-pointer"
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

            <BaseNumberField.ScrubArea className="pb:absolute pb:inset-0 pb:z-10 pb:cursor-ew-resize pb:opacity-0 hover:pb:opacity-10 pb:transition-opacity pb:bg-primary/5 pb:rounded-md pb:pointer-events-none group-hover:pb:pointer-events-auto" />
          </div>
        </BaseNumberField.Root>
      </div>
    );
  },
);

NumberField.displayName = "NumberField";
