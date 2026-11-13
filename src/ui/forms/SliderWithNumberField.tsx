import React from "react";
import { Slider } from "./Slider";
import { NumberField } from "./NumberField";
import { cn } from "../utils";

/**
 * Props for `<SliderWithNumberField>` — synchronized range `<Slider>` paired with a precise `<NumberField>`.
 */
export interface SliderWithNumberFieldProps extends React.AriaAttributes {
  /** Minimum numeric bound (@default 0). */
  min?: number;
  /** Maximum numeric bound (@default 100). */
  max?: number;
  /** Step increment (@default 1). */
  step?: number;
  /** Controlled numeric value shared by both the slider and number field. */
  value?: number;
  /** Initial numeric value in uncontrolled mode. */
  defaultValue?: number;
  /** Disables both the slider and numeric input when `true`. */
  disabled?: boolean;
  /** Callback invoked whenever either the slider thumb or numeric input changes. */
  onChange?: (value: number, event: Event) => void;
  /** Additional container classes. */
  className?: string;
  /** Optional Tailwind width utility for the numeric input wrapper (e.g. `"w-24"`). */
  inputWidth?: string;
  /** Whether to display `-` / `+` stepper buttons on the numeric input (@default false). */
  showButtons?: boolean;
  /** Base DOM `id` used to derive linked slider and numeric input IDs. */
  id?: string;
}

export const SliderWithNumberField = React.forwardRef<
  HTMLDivElement,
  SliderWithNumberFieldProps
>(
  (
    {
      className,
      min = 0,
      max = 100,
      step = 1,
      value,
      defaultValue,
      disabled,
      onChange,
      inputWidth,
      showButtons = false,
      id,
      "aria-label": ariaLabel,
      ...props
    },
    ref,
  ) => {
    const reactId = React.useId();
    const uniqueId = id || reactId;
    const sliderId = `${uniqueId}-slider`;
    const numberId = `${uniqueId}-number`;

    const handleChange = (val: number | number[], event: Event) => {
      if (onChange) {
        const newValue = Array.isArray(val) ? val[0] : val;
        onChange(newValue, event);
      }
    };

    const defaultWidth = showButtons ? "pb:w-28" : "pb:w-20";
    const widthClass = inputWidth
      ? inputWidth.startsWith("pb:")
        ? inputWidth
        : `pb:${inputWidth}`
      : defaultWidth;

    return (
      <div
        ref={ref}
        className={cn(
          "pb:flex pb:items-center pb:gap-3 pb:w-full pb:min-w-0",
          className,
        )}
        {...props}
      >
        <div className="pb:flex-1 pb:min-w-0">
          <Slider
            id={sliderId}
            min={min}
            max={max}
            step={step}
            value={value}
            defaultValue={defaultValue}
            disabled={disabled}
            aria-label={ariaLabel ? `${ariaLabel} slider` : "Slider value"}
            onChange={handleChange}
            className="pb:w-full"
          />
        </div>
        <div className={cn(widthClass, "pb:shrink-0")}>
          <NumberField
            id={numberId}
            value={value}
            defaultValue={defaultValue}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            aria-label={ariaLabel ? `${ariaLabel} input` : "Numeric input"}
            onChange={(val, event) => {
              if (val !== null) {
                handleChange(val, event);
              }
            }}
            showButtons={showButtons}
          />
        </div>
      </div>
    );
  },
);

SliderWithNumberField.displayName = "SliderWithNumberField";

export default SliderWithNumberField;
