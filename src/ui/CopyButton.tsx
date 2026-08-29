import React from "react";
import { Button, ButtonProps } from "./Button";
import { Icon } from "./Icon";
import { useClipboard } from "./useClipboard";
import { cn } from "./utils";

export interface CopyButtonProps extends Omit<ButtonProps, "onClick"> {
  /** The text value to copy to the clipboard. */
  value: string;
  /** Label displayed before copying. Default is `"Copy"`. Pass `null` or use `isIconOnly` for icon-only. */
  label?: React.ReactNode;
  /** Label displayed after copying. Default is `"Copied!"`. */
  successLabel?: React.ReactNode;
  /** Duration in milliseconds for the success state. Default is `2000`. */
  timeout?: number;
  /** Callback fired after successfully copying to clipboard. */
  onCopied?: (value: string) => void;
  /** Callback fired if copying fails. */
  onCopyError?: (error: Error) => void;
  /** Custom icon shown in default state. */
  copyIcon?: React.ReactNode;
  /** Custom icon shown in copied state. */
  successIcon?: React.ReactNode;
  /** Whether to show icons. Default is `true`. */
  showIcon?: boolean;
}

export const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(
  (
    {
      value,
      label = "Copy",
      successLabel = "Copied!",
      timeout = 2000,
      onCopied,
      onCopyError,
      copyIcon,
      successIcon,
      showIcon = true,
      variant = "secondary",
      size = "md",
      isIconOnly,
      className,
      ...props
    },
    ref,
  ) => {
    const { copy, copied } = useClipboard({
      timeout,
      onSuccess: onCopied,
      onError: onCopyError,
    });

    const currentIcon = copied
      ? successIcon || <Icon name="check" className="pb:text-green-600" />
      : copyIcon || <Icon name="clipboard" />;

    const currentLabel = copied ? successLabel : label;

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        isIconOnly={isIconOnly}
        onClick={() => copy(value)}
        leftIcon={showIcon ? currentIcon : undefined}
        className={cn(
          "pb:transition-all pb:duration-150",
          copied && "pb:border-green-300 pb:text-green-800",
          className,
        )}
        aria-live="polite"
        aria-label={
          isIconOnly
            ? typeof currentLabel === "string"
              ? currentLabel
              : "Copy"
            : undefined
        }
        {...props}
      >
        {isIconOnly ? null : currentLabel}
      </Button>
    );
  },
);

CopyButton.displayName = "CopyButton";
