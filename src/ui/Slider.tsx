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
      <div className={cn("pb:w-full pb:flex pb:items-center pb:gap-4", className)}>
        {icon && <div className="pb:text-gray-500 pb:shrink-0">{icon}</div>}

        <div className="pb:flex-grow pb:flex pb:items-center pb:h-8 pb:min-w-[120px]">
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
              "pb:relative pb:flex pb:items-center pb:w-full pb:h-full pb:group pb:touch-none pb:select-none",
              disabled && "pb:opacity-50 pb:cursor-not-allowed",
              className,
            )}
          >
            <BaseSlider.Control className="pb:flex pb:items-center pb:w-full pb:h-full pb:relative pb:cursor-pointer">
              <BaseSlider.Track className="pb:relative pb:bg-gray-200 pb:rounded-full pb:w-full pb:h-1.5 pb:overflow-hidden pb:transition-colors group-pb:hover:bg-gray-300">
                <BaseSlider.Indicator className="pb:absolute pb:bg-primary pb:rounded-full pb:h-full" />
              </BaseSlider.Track>
              <BaseSlider.Thumb className="pb:z-10 pb:block pb:w-4.5 pb:h-4.5 pb:bg-white pb:shadow-md pb:rounded-full pb:border-2 pb:border-primary focus:pb:outline-none focus:pb:ring-4 focus:pb:ring-primary/20 pb:cursor-grab active:pb:cursor-grabbing pb:hover:scale-110 active:pb:scale-95 pb:transition-transform" />
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
