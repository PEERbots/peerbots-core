import React from "react";
import { Popover as BasePopover } from "@base-ui/react";
import { cn } from "./utils";

export interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Popover({
  trigger,
  children,
  side = "bottom",
  align = "center",
  className,
  open,
  onOpenChange,
}: PopoverProps) {
  return (
    <BasePopover.Root open={open} onOpenChange={onOpenChange}>
      <BasePopover.Trigger>{trigger}</BasePopover.Trigger>
      <BasePopover.Portal>
        <BasePopover.Positioner side={side} align={align} sideOffset={5}>
          <BasePopover.Popup
            className={cn(
              "z-50 w-72 rounded-md border bg-white p-4 shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
              className,
            )}
          >
            {children}
            <BasePopover.Arrow className="pb:fill-white pb:stroke-gray-200" />
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
}
