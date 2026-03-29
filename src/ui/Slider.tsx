import React from "react";
import { Slider as BaseSlider } from "@base-ui/react";
import { cn } from "./utils";

export interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  disabled?: boolean;
  onChange?: (value: number | number[], event: Event) => void;
  className?: string;
  name?: string;
  icon?: React.ReactNode;
}

export const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
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
      name,
      icon,
      ...props
    },
    ref,
  ) => {
    const handleChange = (val: number | number[], event: Event) => {
      if (onChange) {
        onChange(val, event);
      }
    };

    return (
      <div className={cn("w-full flex items-center gap-4", className)}>
        {icon && <div className="text-gray-500 shrink-0">{icon}</div>}

        <div className="flex-grow flex items-center h-8 min-w-[120px]">
          <BaseSlider.Root
            ref={ref}
            min={min}
            max={max}
            step={step}
            value={
              value !== undefined
                ? Array.isArray(value)
                  ? value
                  : [value]
                : undefined
            }
            defaultValue={
              defaultValue !== undefined
                ? Array.isArray(defaultValue)
                  ? defaultValue
                  : [defaultValue]
                : undefined
            }
            disabled={disabled}
            orientation="horizontal"
            {...props}
            onValueChange={(val, details) => {
              const event =
                (details as { event?: Event })?.event ||
                (window.event as unknown as Event);
              handleChange(val as number | number[], event);
            }}
            className={cn(
              "relative flex items-center w-full h-full group touch-none select-none",
              disabled && "opacity-50 cursor-not-allowed",
              className,
            )}
          >
            <BaseSlider.Control className="flex items-center w-full h-full relative cursor-pointer">
              <BaseSlider.Track className="relative bg-gray-200 rounded-full w-full h-1.5 overflow-hidden transition-colors group-hover:bg-gray-300">
                <BaseSlider.Indicator className="absolute bg-primary rounded-full h-full" />
              </BaseSlider.Track>
              <BaseSlider.Thumb className="z-10 block w-4.5 h-4.5 bg-white shadow-md rounded-full border-2 border-primary focus:outline-none focus:ring-4 focus:ring-primary/20 cursor-grab active:cursor-grabbing hover:scale-110 active:scale-95 transition-transform" />
            </BaseSlider.Control>
          </BaseSlider.Root>
        </div>
        {/* Hidden input to support form submission if needed */}
        {name && <input type="hidden" name={name} value={value} />}
      </div>
    );
  },
);

Slider.displayName = "Slider";
