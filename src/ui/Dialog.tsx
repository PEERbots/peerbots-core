import React from "react";
import { Dialog as BaseDialog } from "@base-ui/react";
import { cn } from "./utils";

export interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean, event?: Event) => void;
  trigger?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({
  open,
  onOpenChange,
  trigger,
  children,
  className,
}: DialogProps) {
  return (
    <BaseDialog.Root
      open={open}
      onOpenChange={(open, eventDetails) => {
        onOpenChange?.(open, eventDetails?.event as Event | undefined);
      }}
    >
      {trigger &&
        (React.isValidElement(trigger) ? (
          <BaseDialog.Trigger render={trigger as React.ReactElement} />
        ) : (
          <BaseDialog.Trigger>{trigger}</BaseDialog.Trigger>
        ))}
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="pb:fixed pb:inset-0 pb:z-50 pb:bg-black/40 pb:transition-all pb:duration-200 data-[state=open]:pb:animate-in data-[state=closed]:pb:animate-out pb:data-[state=closed]:fade-out-0 pb:data-[state=open]:fade-in-0" />
        <BaseDialog.Popup
          className={cn(
            "pb:fixed pb:left-[50%] pb:top-[50%] pb:z-50 pb:grid pb:w-auto pb:max-w-[90vw] pb:translate-x-[-50%] pb:translate-y-[-50%] pb:gap-4 pb:border pb:bg-white pb:p-6 pb:shadow-lg pb:duration-200 data-[state=open]:pb:animate-in data-[state=closed]:pb:animate-out data-[state=closed]:pb:fade-out-0 data-[state=open]:pb:fade-in-0 data-[state=closed]:pb:zoom-out-95 data-[state=open]:pb:zoom-in-95 data-[state=closed]:pb:slide-out-to-left-1/2 data-[state=closed]:pb:slide-out-to-top-[48%] data-[state=open]:pb:slide-in-from-left-1/2 data-[state=open]:pb:slide-in-from-top-[48%] sm:rounded-lg",
            className,
          )}
        >
          {children}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}

export const DialogTitle = (
  props: React.ComponentProps<typeof BaseDialog.Title>,
) => <BaseDialog.Title {...props} />;
export const DialogDescription = (
  props: React.ComponentProps<typeof BaseDialog.Description>,
) => <BaseDialog.Description {...props} />;
export const DialogClose = (
  props: React.ComponentProps<typeof BaseDialog.Close>,
) => <BaseDialog.Close {...props} />;
