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
              "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
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
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors data-[highlighted]:bg-gray-100 data-[highlighted]:text-gray-900",
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
    className={cn("-mx-1 my-1 h-px bg-gray-100", className)}
    {...props}
  />
));
DropdownSeparator.displayName = "DropdownSeparator";
