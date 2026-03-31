import React from "react";
import { Slider } from "./Slider";
import { NumberField } from "./NumberField";
import { cn } from "./utils";

export interface SliderWithNumberFieldProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  disabled?: boolean;
  onChange?: (value: number, event: Event) => void;
  className?: string;
  inputWidth?: string;
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
      inputWidth = "w-20",
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

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-row items-center gap-4 w-full min-w-0 sm:flex-nowrap flex-wrap",
          className,
        )}
        {...props}
      >
        <div className="pb:flex-grow pb:min-w-[120px]">
          <Slider
            min={min}
            max={max}
            step={step}
            value={value}
            defaultValue={defaultValue}
            disabled={disabled}
            onChange={handleChange}
            className="pb:w-full"
          />
        </div>
        <div className={cn(inputWidth, "shrink-0")}>
          <NumberField
            value={value}
            defaultValue={defaultValue}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            onChange={(val, event) => {
              if (val !== null) {
                handleChange(val, event);
              }
            }}
            showButtons={false}
          />
        </div>
      </div>
    );
  },
);

SliderWithNumberField.displayName = "SliderWithNumberField";

export default SliderWithNumberField;
