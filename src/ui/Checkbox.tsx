import { Checkbox as BaseCheckbox } from "@base-ui/react";
import React, { ComponentPropsWithoutRef } from "react";
import { cn } from "./utils";
import { Icon } from "./Icon";

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ className, id, checked, onChange, ...props }, ref) => {
    return (
      <BaseCheckbox.Root
        ref={ref}
        id={id}
        checked={checked}
        onCheckedChange={(val) => {
          if (onChange) {
            // Mocking a change event since Base UI uses onCheckedChange
            onChange({
              target: { checked: val === true },
            } as React.ChangeEvent<HTMLInputElement>);
          }
        }}
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded border border-gray-300 bg-white shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          "hover:border-primary hover:bg-primary/5",
          "data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-white",
          className,
        )}
        {...(props as ComponentPropsWithoutRef<typeof BaseCheckbox.Root>)}
      >
        <BaseCheckbox.Indicator>
          <Icon size="sm" strokeWidth={3} className="pb:text-dark-primary">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 12.75 6 6 9-13.5"
            />
          </Icon>
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
    );
  },
);

Checkbox.displayName = "Checkbox";
