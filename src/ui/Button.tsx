import { Button as BaseButton } from "@base-ui/react";
import React from "react";
import { cn } from "./utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "ghostly-danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  render?: BaseButton.Props["render"];
  nativeButton?: boolean;
  isIconOnly?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      render,
      nativeButton,
      isIconOnly,
      ...props
    },
    ref,
  ) => {
    const isActuallyIconOnly =
      isIconOnly || (!children && (!!leftIcon || !!rightIcon));

    const variants = {
      primary:
        "bg-primary hover:bg-dark-primary text-gray-900 shadow-sm border border-transparent font-bold disabled:bg-gray-400 disabled:hover:bg-gray-300",
      secondary:
        "bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-200 border font-normal disabled:bg-gray-400 disabled:hover:bg-gray-300",
      danger:
        "bg-danger hover:opacity-80 text-gray-900 shadow-sm border border-transparent font-bold disabled:bg-gray-400 disabled:hover:bg-gray-300",
      ghost:
        "bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900 font-medium",
      "ghostly-danger":
        "bg-transparent hover:bg-danger/10 text-red-700 border border-red-700 font-medium disabled:border-gray-400 disabled:text-gray-400",
    };

    const sizes = {
      sm: isActuallyIconOnly ? "p-1 text-xs" : "px-2 py-1 text-xs",
      md: isActuallyIconOnly ? "p-2 text-sm" : "px-4 py-2 text-sm",
      lg: isActuallyIconOnly ? "p-3 text-base" : "px-6 py-3 text-base",
    };

    return (
      <BaseButton
        ref={ref}
        render={render}
        nativeButton={nativeButton}
        className={cn(
          "inline-flex items-center justify-center rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed cursor-pointer",
          variants[variant],
          sizes[size],
          className,
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className={cn(
              "animate-spin h-4 w-4",
              !isActuallyIconOnly && "mr-2 -ml-1",
            )}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {!isLoading && leftIcon && (
          <span
            className={cn(
              "inline-flex items-center justify-center",
              !isActuallyIconOnly && "mr-2 -ml-1",
            )}
          >
            {leftIcon}
          </span>
        )}
        {children}
        {!isLoading && rightIcon && (
          <span
            className={cn(
              "inline-flex items-center justify-center",
              !isActuallyIconOnly && "ml-2 -mr-1",
            )}
          >
            {rightIcon}
          </span>
        )}
      </BaseButton>
    );
  },
);

Button.displayName = "Button";
