import React from "react";
import { Slider } from "./Slider";
import { NumberField } from "./NumberField";
import { cn } from "../utils";

export interface SliderWithNumberFieldProps extends React.AriaAttributes {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  disabled?: boolean;
  onChange?: (value: number, event: Event) => void;
  className?: string;
  inputWidth?: string;
  showButtons?: boolean;
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
      "aria-label": ariaLabel,
      ...props
    },
    ref,
  ) => {
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
