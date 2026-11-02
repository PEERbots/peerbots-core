import React from "react";
import { Select as BaseSelect } from "@base-ui/react";
import { usePeerbotsI18n } from "../../i18n";
import { cn } from "../utils";
import { Icon } from "../foundations/Icon";

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SelectProps extends React.AriaAttributes {
  options: (string | SelectOption)[];
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (value: string | number | null, event: Event) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  id?: string;
  onFocus?: React.FocusEventHandler<HTMLButtonElement>;
  /**
   * Trigger height and padding scale.
   * @default "md"
   */
  size?: "sm" | "md";
  /**
   * Visual treatment (`"ghost"` hides border/fill until hover or focus, ideal for table cells).
   * @default "default"
   */
  variant?: "default" | "ghost" | "compact";
  /**
   * Whether the select trigger sizes to its content (`w-auto`) instead of stretching to `100%`.
   * @default false
   */
  inline?: boolean;
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
      placeholder,
      onFocus,
      size = "md",
      variant = "default",
      inline = false,
      "aria-label": ariaLabel,
      ...props
    },
    ref,
  ) => {
    const { labels } = usePeerbotsI18n();
    const resolvedPlaceholder =
      placeholder || labels?.common?.select || "Select...";
    const generatedId = React.useId();
    const selectId = propsId || generatedId;

    const normalizedOptions = React.useMemo(
      () =>
        options.map((option) => ({
          label: typeof option === "object" ? option.label : option,
          value: String(typeof option === "object" ? option.value : option),
        })),
      [options],
    );

    const isSmall = size === "sm" || variant === "compact";

    return (
      <div className={cn(inline ? "pb:inline-block pb:w-auto" : "pb:w-full")}>
        <BaseSelect.Root
          items={normalizedOptions}
          value={value === undefined ? undefined : String(value)}
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
            aria-label={ariaLabel || (typeof resolvedPlaceholder === "string" ? resolvedPlaceholder : "Select an option")}
            className={cn(
              "pb:flex pb:items-center pb:justify-between pb:gap-1.5 pb:rounded-md pb:border-0 pb:text-gray-900 pb:transition-colors pb:cursor-pointer pb:focus:outline-none",
              inline ? "pb:w-auto" : "pb:w-full",
              isSmall
                ? "pb:py-1 pb:ps-2 pb:pe-2 pb:text-xs sm:pb:text-sm pb:leading-5 pb:min-h-[28px]"
                : "pb:py-1.5 pb:ps-3 pb:pe-3 pb:sm:text-sm pb:sm:leading-6 pb:min-h-[36px]",
              variant === "ghost"
                ? "pb:bg-transparent pb:ring-1 pb:ring-inset pb:ring-transparent pb:hover:bg-gray-100/80 pb:hover:ring-gray-300 pb:focus:bg-white pb:focus:ring-2 pb:focus:ring-primary"
                : variant === "compact"
                  ? "pb:bg-white pb:ring-1 pb:ring-inset pb:ring-gray-200 pb:hover:ring-gray-300 pb:focus:ring-2 pb:focus:ring-primary pb:shadow-2xs"
                  : "pb:ring-1 pb:ring-inset pb:ring-gray-300 pb:focus:ring-2 pb:focus:ring-primary pb:bg-primary/10",
              disabled && "pb:opacity-50 pb:cursor-not-allowed",
              className,
            )}
            onFocus={onFocus}
            {...props}
          >
            <span className="pb:truncate">
              <BaseSelect.Value placeholder={resolvedPlaceholder} />
            </span>
            <BaseSelect.Icon className="pb:shrink-0 pb:text-gray-500">
              <Icon size="sm" className={cn(isSmall && "pb:w-3.5 pb:h-3.5")}>
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
              className="pb:z-[60] pb:min-w-[var(--anchor-width)]"
            >
              <BaseSelect.Popup className="pb:max-h-60 pb:overflow-auto pb:rounded-md pb:bg-white pb:py-1 pb:text-base pb:shadow-lg pb:ring-1 pb:ring-black/5 focus:pb:outline-none pb:sm:text-sm">
                {normalizedOptions.map((option, index) => (
                  <BaseSelect.Item
                    key={`${option.value}-${index}`}
                    value={option.value}
                    className="pb:relative pb:cursor-default pb:select-none pb:py-2 pb:ps-3 pb:pe-9 pb:text-gray-900 pb:hover:bg-gray-100 data-[highlighted]:pb:bg-gray-100 data-[selected]:pb:font-semibold"
                  >
                    <BaseSelect.ItemText>{option.label}</BaseSelect.ItemText>
                    <BaseSelect.ItemIndicator className="pb:absolute pb:inset-y-0 pb:end-0 pb:flex pb:items-center pb:pe-4 pb:text-primary">
                      <Icon size="sm">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </Icon>
                    </BaseSelect.ItemIndicator>
                  </BaseSelect.Item>
                ))}
              </BaseSelect.Popup>
            </BaseSelect.Positioner>
          </BaseSelect.Portal>
        </BaseSelect.Root>
      </div>
    );
  },
);

Select.displayName = "Select";
