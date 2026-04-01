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
          className={cn("pb:flex pb:flex-col pb:gap-1", className)}
          {...props}
        >
          <div
            className={cn(
              "pb:group pb:relative pb:flex pb:items-center pb:rounded-md pb:border-0 pb:bg-primary/10 pb:ring-1 pb:ring-inset pb:ring-gray-300 pb:focus-within:ring-2 pb:focus-within:ring-primary pb:shadow-sm",
              disabled && "pb:opacity-50 pb:cursor-not-allowed",
            )}
          >
            {showButtons && (
              <BaseNumberField.Decrement
                aria-label="Decrement"
                className="pb:relative pb:z-20 pb:flex pb:items-center pb:justify-center pb:w-8 pb:h-9 pb:text-gray-500 pb:hover:text-gray-700 pb:hover:bg-gray-100/50 pb:rounded-l-md pb:border-r pb:border-gray-300 disabled:pb:opacity-30 pb:cursor-pointer"
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
                "pb:block pb:w-full pb:bg-transparent pb:border-0 pb:px-3 pb:py-1.5 pb:text-gray-900 pb:placeholder:text-gray-400 pb:focus:ring-0 pb:sm:text-sm pb:sm:leading-6 pb:text-center pb:appearance-none pb:relative pb:z-0",
                !showButtons && "pb:rounded-md",
              )}
            />

            {showButtons && (
              <BaseNumberField.Increment
                aria-label="Increment"
                className="pb:relative pb:z-20 pb:flex pb:items-center pb:justify-center pb:w-8 pb:h-9 pb:text-gray-500 pb:hover:text-gray-700 pb:hover:bg-gray-100/50 pb:rounded-r-md pb:border-l pb:border-gray-300 disabled:pb:opacity-30 pb:cursor-pointer"
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

            <BaseNumberField.ScrubArea className="pb:absolute pb:inset-0 pb:z-10 pb:cursor-ew-resize pb:opacity-0 pb:hover:opacity-10 pb:transition-opacity pb:bg-primary/5 pb:rounded-md pb:pointer-events-none group-pb:hover:pointer-events-auto" />
          </div>
        </BaseNumberField.Root>
      </div>
    );
  },
);

NumberField.displayName = "NumberField";
