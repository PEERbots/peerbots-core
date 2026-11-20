import React from "react";
import { Dialog as BaseDialog } from "@base-ui/react";
import { cn } from "../utils";

/**
 * Maximum width preset for `<Dialog>` popups.
 */
export type DialogSize = "sm" | "md" | "lg" | "xl" | "2xl" | "full" | "auto";

/**
 * Props for `<Dialog>` — an accessible modal dialog backed by `@base-ui/react`.
 */
export interface DialogProps {
  /** Controlled open state of the modal dialog. */
  open?: boolean;
  /** Callback invoked when the user opens or dismisses the dialog (Escape, backdrop click, or close button). */
  onOpenChange?: (open: boolean, event?: Event) => void;
  /** Optional trigger element or label that opens the dialog on click. */
  trigger?: React.ReactNode;
  /** Modal body content (commonly includes `<DialogTitle>`, `<DialogDescription>`, and `<DialogClose>`). */
  children: React.ReactNode;
  /** Additional classes applied to the modal popup surface. */
  className?: string;
  /** Width preset for the modal popup (@default "auto"). */
  size?: DialogSize;
}

const dialogSizeClasses: Record<DialogSize, string> = {
  auto: "pb:w-auto pb:max-w-[90vw]",
  sm: "pb:w-full pb:max-w-md",
  md: "pb:w-full pb:max-w-lg",
  lg: "pb:w-full pb:max-w-2xl",
  xl: "pb:w-[95vw] pb:max-w-5xl",
  "2xl": "pb:w-[95vw] pb:max-w-7xl",
  full: "pb:w-[95vw] pb:max-w-7xl",
};

export function Dialog({
  open,
  onOpenChange,
  trigger,
  children,
  className,
  size = "auto",
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
        <BaseDialog.Backdrop className="pb:fixed pb:inset-0 pb:z-50 pb:bg-black/40 pb:transition-all pb:duration-200 pb:data-[state=open]:animate-in pb:data-[state=closed]:animate-out pb:data-[state=closed]:fade-out-0 pb:data-[state=open]:fade-in-0" />
        <BaseDialog.Popup
          className={cn(
            "pb:fixed pb:left-[50%] pb:top-[50%] pb:z-50 pb:grid pb:translate-x-[-50%] pb:translate-y-[-50%] pb:gap-4 pb:border pb:border-gray-100 pb:bg-white pb:p-6 pb:shadow-2xl pb:duration-200 pb:data-[state=open]:animate-in pb:data-[state=closed]:animate-out pb:data-[state=closed]:fade-out-0 pb:data-[state=open]:fade-in-0 pb:data-[state=closed]:zoom-out-95 pb:data-[state=open]:zoom-in-95 pb:data-[state=closed]:slide-out-to-left-1/2 pb:data-[state=closed]:slide-out-to-top-[48%] pb:data-[state=open]:slide-in-from-left-1/2 pb:data-[state=open]:slide-in-from-top-[48%] pb:rounded-2xl",
            dialogSizeClasses[size],
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
