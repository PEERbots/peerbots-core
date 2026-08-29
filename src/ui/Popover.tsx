import React from "react";
import { Popover as BasePopover } from "@base-ui/react";
import { cn } from "./utils";
import { Icon } from "./Icon";
import { SurfaceVariant } from "./types";

export interface PopoverProps {
  /** The element that triggers the popover when clicked */
  trigger: React.ReactNode;
  /** Popover body content */
  children: React.ReactNode;
  /** Optional header title */
  title?: React.ReactNode;
  /** Controlled open state */
  open?: boolean;
  /** Initial open state in uncontrolled mode */
  defaultOpen?: boolean;
  /** Callback fired when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Side where the popover appears */
  side?: "top" | "bottom" | "left" | "right";
  /** Alignment relative to the trigger */
  align?: "start" | "center" | "end";
  /** Distance from the trigger in pixels */
  sideOffset?: number;
  /** Surface visual variant */
  variant?: SurfaceVariant | "default";
  /** Whether to show a close button in the header */
  showCloseButton?: boolean;
  /** Whether to display a pointing arrow */
  showArrow?: boolean;
  className?: string;
}

const variantStyles: Record<string, string> = {
  surface: "pb:bg-white pb:border pb:border-gray-100 pb:shadow-xl",
  default: "pb:bg-white pb:border pb:border-gray-100 pb:shadow-xl",
  glass:
    "pb:bg-white/90 pb:backdrop-blur-2xl pb:border pb:border-white/50 pb:shadow-2xl",
  outline: "pb:bg-white pb:border-2 pb:border-gray-300 pb:shadow-md",
  flat: "pb:bg-gray-50 pb:border pb:border-gray-200 pb:shadow-lg",
};

export function Popover({
  trigger,
  children,
  title,
  open,
  defaultOpen,
  onOpenChange,
  side = "bottom",
  align = "center",
  sideOffset = 8,
  variant = "surface",
  showCloseButton = true,
  showArrow = true,
  className,
}: PopoverProps) {
  return (
    <BasePopover.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={(nextOpen) => {
        onOpenChange?.(nextOpen);
      }}
    >
      {React.isValidElement(trigger) ? (
        <BasePopover.Trigger render={trigger as React.ReactElement} />
      ) : (
        <BasePopover.Trigger>{trigger}</BasePopover.Trigger>
      )}

      <BasePopover.Portal>
        <BasePopover.Positioner
          side={side}
          align={align}
          sideOffset={sideOffset}
        >
          <BasePopover.Popup
            className={cn(
              "pb:z-50 pb:rounded-2xl pb:p-4 pb:min-w-[240px] pb:max-w-sm pb:text-gray-900 pb:transition-all pb:duration-150 data-[state=open]:pb:animate-in data-[state=closed]:pb:animate-out data-[state=closed]:pb:fade-out-0 data-[state=open]:pb:fade-in-0 data-[state=closed]:pb:zoom-out-95 data-[state=open]:pb:zoom-in-95",
              variantStyles[variant] || variantStyles.surface,
              className,
            )}
          >
            {(title || showCloseButton) && (
              <div className="pb:flex pb:items-center pb:justify-between pb:gap-3 pb:border-b pb:border-gray-100 pb:pb-2.5 pb:mb-3">
                {title ? (
                  <div className="pb:text-xs pb:font-bold pb:text-gray-900 pb:uppercase pb:tracking-wider">
                    {title}
                  </div>
                ) : (
                  <div />
                )}

                {showCloseButton && (
                  <BasePopover.Close
                    aria-label="Close popover"
                    className="pb:p-1 pb:rounded-lg pb:text-gray-400 pb:hover:text-gray-700 pb:hover:bg-gray-100 pb:transition-colors pb:cursor-pointer"
                  >
                    <Icon name="xCircle" className="pb:w-4 pb:h-4" />
                  </BasePopover.Close>
                )}
              </div>
            )}

            <div className="pb:text-sm">{children}</div>

            {showArrow && (
              <BasePopover.Arrow
                className={cn(
                  variant === "glass"
                    ? "pb:fill-white/90 pb:stroke-white/50"
                    : "pb:fill-white pb:stroke-gray-100",
                )}
              />
            )}
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
}

export const PopoverTitle = (
  props: React.ComponentProps<typeof BasePopover.Title>,
) => <BasePopover.Title {...props} />;

export const PopoverDescription = (
  props: React.ComponentProps<typeof BasePopover.Description>,
) => <BasePopover.Description {...props} />;

export const PopoverClose = (
  props: React.ComponentProps<typeof BasePopover.Close>,
) => <BasePopover.Close {...props} />;
