import React from "react";
import { Switch as BaseSwitch } from "@base-ui/react";
import { cn } from "./utils";

export interface SwitchProps extends React.AriaAttributes {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean, event: Event) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      checked,
      defaultChecked,
      onChange,
      disabled,
      className,
      id: externalId,
      ...props
    },
    ref,
  ) => {
    const autoId = React.useId();
    const id = externalId ?? autoId;
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <BaseSwitch.Root
          ref={ref}
          id={id}
          checked={checked}
          defaultChecked={defaultChecked}
          onCheckedChange={(checked, eventDetails) => {
            onChange?.(checked, eventDetails?.event as Event);
          }}
          disabled={disabled}
          className={cn(
            "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            "data-[checked]:bg-primary data-[unchecked]:bg-gray-200",
            disabled && "opacity-50 cursor-not-allowed",
          )}
          {...props}
        >
          <BaseSwitch.Thumb
            className={cn(
              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
              "data-[checked]:translate-x-5 data-[unchecked]:translate-x-0",
            )}
          />
        </BaseSwitch.Root>
      </div>
    );
  },
);

Switch.displayName = "Switch";
