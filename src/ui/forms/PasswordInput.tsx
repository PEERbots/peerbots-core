import React, { useState } from "react";
import { Icon } from "../foundations/Icon";
import { cn } from "../utils";
import { Input, type InputProps } from "./Input";

/**
 * Props for `<PasswordInput>` — password input primitive built on `<Input>` with a
 * leading lock icon and an accessible show/hide visibility toggle (`eye` / `eyeSlash`).
 */
export interface PasswordInputProps
  extends Omit<InputProps, "type" | "rightIcon"> {
  /** Whether to show the leading lock icon (@default true). */
  showLockIcon?: boolean;
  /** Controlled visibility state (`true` shows plain text). */
  revealed?: boolean;
  /** Initial visibility state when uncontrolled (@default false). */
  defaultRevealed?: boolean;
  /** Callback invoked when visibility is toggled. */
  onRevealedChange?: (revealed: boolean) => void;
  /** Accessible label when password is hidden (@default "Show password"). */
  showPasswordLabel?: string;
  /** Accessible label when password is visible (@default "Hide password"). */
  hidePasswordLabel?: string;
}

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(
  (
    {
      className,
      leftIcon,
      showLockIcon = true,
      revealed: controlledRevealed,
      defaultRevealed = false,
      onRevealedChange,
      showPasswordLabel = "Show password",
      hidePasswordLabel = "Hide password",
      placeholder = "Password",
      disabled,
      ...props
    },
    ref,
  ) => {
    const [uncontrolledRevealed, setUncontrolledRevealed] =
      useState(defaultRevealed);
    const isControlled = controlledRevealed !== undefined;
    const isRevealed = isControlled ? controlledRevealed : uncontrolledRevealed;

    const handleToggle = () => {
      if (disabled) return;
      const next = !isRevealed;
      if (!isControlled) {
        setUncontrolledRevealed(next);
      }
      onRevealedChange?.(next);
    };

    const resolvedLeftIcon =
      leftIcon !== undefined
        ? leftIcon
        : showLockIcon
          ? <Icon name="lockClosed" size="sm" aria-hidden="true" />
          : undefined;

    return (
      <Input
        ref={ref}
        type={isRevealed ? "text" : "password"}
        placeholder={placeholder}
        disabled={disabled}
        leftIcon={resolvedLeftIcon}
        rightIcon={
          <button
            type="button"
            disabled={disabled}
            onClick={handleToggle}
            aria-label={isRevealed ? hidePasswordLabel : showPasswordLabel}
            aria-pressed={isRevealed}
            className="pb:pointer-events-auto pb:inline-flex pb:items-center pb:justify-center pb:rounded pb:p-0.5 pb:text-gray-500 pb:hover:text-gray-800 pb:focus-visible:outline-2 pb:focus-visible:outline-offset-1 pb:focus-visible:outline-peerbots-darkteal pb:cursor-pointer pb:disabled:opacity-50 pb:disabled:cursor-not-allowed"
          >
            <Icon
              name={isRevealed ? "eyeSlash" : "eye"}
              size="sm"
              aria-hidden="true"
            />
          </button>
        }
        className={cn(className)}
        {...props}
      />
    );
  },
);

PasswordInput.displayName = "PasswordInput";
