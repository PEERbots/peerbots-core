import { Checkbox as BaseCheckbox } from "@base-ui/react";
import React, { ComponentPropsWithoutRef } from "react";
import { cn } from "../utils";
import { Icon } from "../foundations/Icon";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  /** Whether the checkbox is in a mixed/indeterminate state */
  indeterminate?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    {
      className,
      id,
      checked,
      indeterminate = false,
      onChange,
      onCheckedChange,
      ...props
    },
    ref,
  ) => {
    return (
      <BaseCheckbox.Root
        ref={ref}
        id={id}
        checked={checked}
        indeterminate={indeterminate}
        onCheckedChange={(val) => {
          const isChecked = val === true;
          onCheckedChange?.(isChecked);
          if (onChange) {
            // Mocking a change event since Base UI uses onCheckedChange
            onChange({
              target: { checked: isChecked },
            } as React.ChangeEvent<HTMLInputElement>);
          }
        }}
        className={cn(
          "pb:flex pb:h-5 pb:w-5 pb:shrink-0 pb:items-center pb:justify-center pb:rounded pb:border pb:border-gray-300 pb:bg-white pb:shadow-sm pb:transition-all pb:focus-visible:outline-2 pb:focus-visible:outline-offset-2 pb:focus-visible:outline-dark-primary pb:disabled:cursor-not-allowed pb:disabled:opacity-50 pb:cursor-pointer",
          "pb:hover:border-primary pb:hover:bg-primary/5",
          "pb:data-[state=checked]:bg-primary pb:data-[state=checked]:border-primary pb:data-[state=checked]:text-white",
          "pb:data-[checked]:bg-primary pb:data-[checked]:border-primary pb:data-[checked]:text-white",
          "pb:data-[indeterminate]:bg-primary pb:data-[indeterminate]:border-primary pb:data-[indeterminate]:text-white",
          className,
        )}
        {...(props as ComponentPropsWithoutRef<typeof BaseCheckbox.Root>)}
      >
        <BaseCheckbox.Indicator keepMounted={indeterminate || undefined}>
          {indeterminate ? (
            <Icon name="minus" size="sm" strokeWidth={3} className="pb:text-dark-primary" />
          ) : (
            <Icon size="sm" strokeWidth={3} className="pb:text-dark-primary">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
              />
            </Icon>
          )}
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
    );
  },
);

Checkbox.displayName = "Checkbox";
