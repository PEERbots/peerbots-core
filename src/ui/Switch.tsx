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
      <div className={cn("pb:flex pb:items-center pb:gap-2", className)}>
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
            "pb:relative pb:inline-flex pb:h-6 pb:w-11 pb:flex-shrink-0 pb:cursor-pointer pb:rounded-full pb:border-2 pb:border-transparent pb:transition-colors pb:duration-200 pb:ease-in-out pb:focus:outline-none pb:focus:ring-2 pb:focus:ring-primary pb:focus:ring-offset-2",
            "pb:data-[checked]:bg-primary pb:data-[unchecked]:bg-gray-200",
            disabled && "pb:opacity-50 pb:cursor-not-allowed",
          )}
          {...props}
        >
          <BaseSwitch.Thumb
            className={cn(
              "pb:pointer-events-none pb:inline-block pb:h-5 pb:w-5 pb:transform pb:rounded-full pb:bg-white pb:shadow pb:ring-0 pb:transition pb:duration-200 pb:ease-in-out",
              "pb:data-[checked]:translate-x-5 pb:data-[unchecked]:translate-x-0",
            )}
          />
        </BaseSwitch.Root>
      </div>
    );
  },
);

Switch.displayName = "Switch";
