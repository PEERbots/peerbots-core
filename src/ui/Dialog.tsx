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
        <BaseDialog.Backdrop className="fixed inset-0 z-50 bg-black/40 transition-all duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <BaseDialog.Popup
          className={cn(
            "fixed left-[50%] top-[50%] z-50 grid w-auto max-w-[90vw] translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
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
