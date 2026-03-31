import React from "react";
import { Select as BaseSelect } from "@base-ui/react";
import { cn } from "./utils";
import { Icon } from "./Icon";

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SelectProps {
  options: (string | SelectOption)[];
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (value: string | number | null, event: Event) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  id?: string;
  onFocus?: React.FocusEventHandler<HTMLButtonElement>;
}

export const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      className,
      options,
      id: propsId,
      value,
      defaultValue,
      onChange,
      disabled,
      placeholder = "Select...",
      onFocus,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const selectId = propsId || generatedId;

    return (
      <div className="pb:w-full">
        <BaseSelect.Root
          value={value === undefined ? null : String(value)}
          defaultValue={
            defaultValue === undefined ? undefined : String(defaultValue)
          }
          onValueChange={(
            val: string | null,
            details?: { event: Event } | null,
          ) => {
            if (onChange) {
              // Base UI Select passes eventDetails as the second argument, which has an 'event' property.
              const event = details?.event || (details as unknown as Event);
              onChange(val, event);
            }
          }}
          disabled={disabled}
        >
          <BaseSelect.Trigger
            ref={ref}
            id={selectId}
            className={cn(
              "flex w-full items-center justify-between rounded-md border-0 py-1.5 pl-3 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6 bg-primary/10 min-h-[36px]",
              disabled && "opacity-50 cursor-not-allowed",
              className,
            )}
            onFocus={onFocus}
            {...props}
          >
            <BaseSelect.Value placeholder={placeholder} />
            <BaseSelect.Icon>
              <Icon size="sm">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </Icon>
            </BaseSelect.Icon>
          </BaseSelect.Trigger>
          <BaseSelect.Portal>
            <BaseSelect.Positioner
              sideOffset={4}
              className="z-50 w-[var(--anchor-width)]"
            >
              <BaseSelect.Popup className="pb:max-h-60 pb:overflow-auto pb:rounded-md pb:bg-white pb:py-1 pb:text-base pb:shadow-lg pb:ring-1 pb:ring-black pb:ring-opacity-5 focus:pb:outline-none sm:pb:text-sm">
                {options.map((option, index) => {
                  const label =
                    typeof option === "object" ? option.label : option;
                  const value =
                    typeof option === "object" ? option.value : option;
                  return (
                    <BaseSelect.Item
                      key={`${value}-${index}`}
                      value={value}
                      className="pb:relative pb:cursor-default pb:select-none pb:py-2 pb:pl-3 pb:pr-9 pb:text-gray-900 hover:pb:bg-gray-100 data-[highlighted]:pb:bg-gray-100 data-[selected]:pb:font-semibold"
                    >
                      <BaseSelect.ItemText>{label}</BaseSelect.ItemText>
                      <BaseSelect.ItemIndicator className="pb:absolute pb:inset-y-0 pb:right-0 pb:flex pb:items-center pb:pr-4 pb:text-primary">
                        <Icon size="sm">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </Icon>
                      </BaseSelect.ItemIndicator>
                    </BaseSelect.Item>
                  );
                })}
              </BaseSelect.Popup>
            </BaseSelect.Positioner>
          </BaseSelect.Portal>
        </BaseSelect.Root>
      </div>
    );
  },
);

Select.displayName = "Select";
