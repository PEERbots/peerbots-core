import React, { useState } from "react";
import { cn } from "./utils";
import { ComponentColor, ComponentRadius, ComponentSize, FillVariant } from "./types";

export interface ChipOption<T = string> {
  value: T;
  label: React.ReactNode;
  badge?: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface ChipGroupProps<T = string> {
  /** Array of selectable chip options */
  options: ChipOption<T>[];
  /** Controlled single selected value */
  value?: T;
  /** Uncontrolled initial single selected value */
  defaultValue?: T;
  /** Callback fired when single selection changes */
  onChange?: (value: T) => void;
  /** Enable multiple selection mode */
  multiple?: boolean;
  /** Controlled array of selected values (for multi mode) */
  values?: T[];
  /** Uncontrolled initial array of selected values (for multi mode) */
  defaultValues?: T[];
  /** Callback fired when multiple selection changes */
  onMultipleChange?: (values: T[]) => void;
  /** Color theme */
  color?: ComponentColor;
  /** Visual fill style */
  variant?: "solid" | "soft" | "outline";
  /** Size scale */
  size?: ComponentSize;
  /** Border radius scale */
  radius?: ComponentRadius;
  /** Enable horizontal scrollable rail */
  scrollable?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

const activeColorStyles: Record<string, Record<string, string>> = {
  solid: {
    primary:
      "pb:bg-primary pb:text-gray-900 pb:border-primary pb:shadow-sm pb:font-bold",
    teal: "pb:bg-peerbots-teal pb:text-white pb:border-peerbots-teal pb:shadow-sm pb:font-bold",
    pink: "pb:bg-peerbots-pink pb:text-white pb:border-peerbots-pink pb:shadow-sm pb:font-bold",
    darkblue:
      "pb:bg-peerbots-darkblue pb:text-white pb:border-peerbots-darkblue pb:shadow-sm pb:font-bold",
    neutral:
      "pb:bg-gray-800 pb:text-white pb:border-gray-800 pb:shadow-sm pb:font-bold",
    danger: "pb:bg-red-600 pb:text-white pb:border-red-600 pb:shadow-sm pb:font-bold",
  },
  soft: {
    primary:
      "pb:bg-primary/20 pb:text-teal-950 pb:border-primary/40 pb:font-bold",
    teal: "pb:bg-peerbots-teal/20 pb:text-peerbots-darkteal pb:border-peerbots-teal/40 pb:font-bold",
    pink: "pb:bg-peerbots-pink/20 pb:text-peerbots-pink pb:border-peerbots-pink/40 pb:font-bold",
    darkblue:
      "pb:bg-peerbots-darkblue/20 pb:text-peerbots-darkblue pb:border-peerbots-darkblue/40 pb:font-bold",
    neutral:
      "pb:bg-gray-200 pb:text-gray-900 pb:border-gray-300 pb:font-bold",
    danger: "pb:bg-red-100 pb:text-red-900 pb:border-red-300 pb:font-bold",
  },
  outline: {
    primary:
      "pb:bg-primary/10 pb:text-teal-900 pb:border-primary pb:font-bold pb:border-2",
    teal: "pb:bg-peerbots-teal/10 pb:text-peerbots-darkteal pb:border-peerbots-teal pb:font-bold pb:border-2",
    pink: "pb:bg-peerbots-pink/10 pb:text-peerbots-pink pb:border-peerbots-pink pb:font-bold pb:border-2",
    darkblue:
      "pb:bg-peerbots-darkblue/10 pb:text-peerbots-darkblue pb:border-peerbots-darkblue pb:font-bold pb:border-2",
    neutral:
      "pb:bg-gray-100 pb:text-gray-900 pb:border-gray-400 pb:font-bold pb:border-2",
    danger: "pb:bg-red-50 pb:text-red-900 pb:border-red-500 pb:font-bold pb:border-2",
  },
};

const inactiveStyles =
  "pb:bg-white pb:text-gray-600 pb:border-gray-200 pb:hover:border-gray-300 pb:hover:bg-gray-50/80 pb:hover:text-gray-900";

const radiusClasses: Record<ComponentRadius, string> = {
  none: "pb:rounded-none",
  sm: "pb:rounded-md",
  md: "pb:rounded-xl",
  lg: "pb:rounded-2xl",
  "2xl": "pb:rounded-2xl",
  pill: "pb:rounded-full",
};

const sizeClasses: Record<ComponentSize, { chip: string; text: string; badge: string }> = {
  xs: {
    chip: "pb:px-2 pb:py-0.5 pb:gap-1",
    text: "pb:text-[10px]",
    badge: "pb:text-[8px] pb:px-1 pb:py-0.5",
  },
  sm: {
    chip: "pb:px-3 pb:py-1 pb:gap-1.5",
    text: "pb:text-xs",
    badge: "pb:text-[9px] pb:px-1.5 pb:py-0.5",
  },
  md: {
    chip: "pb:px-3.5 pb:py-1.5 pb:gap-2",
    text: "pb:text-sm",
    badge: "pb:text-[10px] pb:px-1.5 pb:py-0.5",
  },
  lg: {
    chip: "pb:px-4.5 pb:py-2 pb:gap-2.5",
    text: "pb:text-base",
    badge: "pb:text-xs pb:px-2 pb:py-0.5",
  },
  xl: {
    chip: "pb:px-6 pb:py-2.5 pb:gap-3",
    text: "pb:text-lg",
    badge: "pb:text-xs pb:px-2.5 pb:py-1",
  },
};

export function ChipGroup<T = string>({
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  multiple = false,
  values: controlledValues,
  defaultValues,
  onMultipleChange,
  color = "teal",
  variant = "soft",
  size = "md",
  radius = "pill",
  scrollable = false,
  className,
  id,
  name,
}: ChipGroupProps<T>) {
  const [internalValue, setInternalValue] = useState<T | undefined>(
    defaultValue !== undefined ? defaultValue : options[0]?.value,
  );
  const [internalValues, setInternalValues] = useState<T[]>(
    defaultValues || [],
  );

  const activeValue = controlledValue !== undefined ? controlledValue : internalValue;
  const activeValues = controlledValues !== undefined ? controlledValues : internalValues;

  const handleSelect = (optionValue: T, disabled?: boolean) => {
    if (disabled) return;

    if (multiple) {
      const exists = activeValues.includes(optionValue);
      const nextValues = exists
        ? activeValues.filter((v) => v !== optionValue)
        : [...activeValues, optionValue];

      if (controlledValues === undefined) {
        setInternalValues(nextValues);
      }
      onMultipleChange?.(nextValues);
    } else {
      if (controlledValue === undefined) {
        setInternalValue(optionValue);
      }
      onChange?.(optionValue);
    }
  };

  const activeStyle =
    activeColorStyles[variant]?.[color] ||
    activeColorStyles[variant]?.teal ||
    activeColorStyles.soft.teal;

  const currentSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div
      id={id}
      role={multiple ? "group" : "radiogroup"}
      aria-label={name}
      className={cn(
        "pb:flex pb:items-center pb:gap-2 pb:box-border",
        scrollable
          ? "pb:overflow-x-auto pb:no-scrollbar pb:py-1 pb:px-0.5"
          : "pb:flex-wrap",
        className,
      )}
    >
      {options.map((option, idx) => {
        const isSelected = multiple
          ? activeValues.includes(option.value)
          : activeValue === option.value;

        return (
          <button
            key={idx}
            type="button"
            role={multiple ? "checkbox" : "radio"}
            aria-checked={isSelected}
            disabled={option.disabled}
            onClick={() => handleSelect(option.value, option.disabled)}
            className={cn(
              "pb:inline-flex pb:items-center pb:border pb:font-medium pb:transition-all pb:duration-150 pb:cursor-pointer pb:select-none pb:shrink-0 pb:focus:outline-none pb:focus-visible:ring-2 pb:focus-visible:ring-peerbots-teal pb:focus-visible:ring-offset-1",
              radiusClasses[radius] || radiusClasses.pill,
              currentSize.chip,
              currentSize.text,
              isSelected ? activeStyle : inactiveStyles,
              option.disabled &&
                "pb:opacity-40 pb:cursor-not-allowed pb:bg-gray-100 pb:text-gray-400 pb:border-gray-200",
            )}
          >
            {option.icon && (
              <span className="pb:shrink-0 pb:flex pb:items-center">
                {option.icon}
              </span>
            )}

            <span>{option.label}</span>

            {option.badge && (
              <span
                className={cn(
                  "pb:rounded-full pb:font-bold pb:leading-none pb:tracking-tight",
                  currentSize.badge,
                  isSelected
                    ? "pb:bg-black/15 pb:text-current"
                    : "pb:bg-gray-100 pb:text-gray-500",
                )}
              >
                {option.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
