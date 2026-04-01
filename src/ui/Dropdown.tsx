import React from "react";
import { Menu as BaseMenu } from "@base-ui/react";
import { cn } from "./utils";

export interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  className?: string;
}

export function Dropdown({
  trigger,
  children,
  align = "end",
  className,
}: DropdownProps) {
  return (
    <BaseMenu.Root>
      {React.isValidElement(trigger) ? (
        <BaseMenu.Trigger render={trigger} />
      ) : (
        <BaseMenu.Trigger>{trigger}</BaseMenu.Trigger>
      )}
      <BaseMenu.Portal>
        <BaseMenu.Positioner align={align} sideOffset={5}>
          <BaseMenu.Popup
            className={cn(
              "pb:z-50 pb:min-w-[8rem] pb:overflow-hidden pb:rounded-md pb:border pb:bg-white pb:p-1 pb:shadow-md pb:data-[state=open]:animate-in pb:data-[state=closed]:animate-out pb:data-[state=closed]:fade-out-0 pb:data-[state=open]:fade-in-0 pb:data-[state=closed]:zoom-out-95 pb:data-[state=open]:zoom-in-95",
              className,
            )}
          >
            {children}
          </BaseMenu.Popup>
        </BaseMenu.Positioner>
      </BaseMenu.Portal>
    </BaseMenu.Root>
  );
}

export const DropdownItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseMenu.Item>
>(({ className, ...props }, ref) => (
  <BaseMenu.Item
    ref={ref}
    className={cn(
      "pb:relative pb:flex pb:cursor-default pb:select-none pb:items-center pb:rounded-sm pb:px-2 pb:py-1.5 pb:text-sm pb:outline-none pb:transition-colors pb:data-[highlighted]:bg-gray-100 pb:data-[highlighted]:text-gray-900",
      className,
    )}
    {...props}
  />
));
DropdownItem.displayName = "DropdownItem";

export const DropdownSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseMenu.Separator>
>(({ className, ...props }, ref) => (
  <BaseMenu.Separator
    ref={ref}
    className={cn("pb:-mx-1 pb:my-1 pb:h-px pb:bg-gray-100", className)}
    {...props}
  />
));
DropdownSeparator.displayName = "DropdownSeparator";
