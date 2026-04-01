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
          "pb:flex pb:h-5 pb:w-5 pb:shrink-0 pb:items-center pb:justify-center pb:rounded pb:border pb:border-gray-300 pb:bg-white pb:shadow-sm pb:transition-all pb:focus-visible:outline-none pb:focus-visible:ring-2 pb:focus-visible:ring-primary pb:focus-visible:ring-offset-2 pb:disabled:cursor-not-allowed pb:disabled:opacity-50",
          "pb:hover:border-primary pb:hover:bg-primary/5",
          "pb:data-[state=checked]:bg-primary pb:data-[state=checked]:border-primary pb:data-[state=checked]:text-white",
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
