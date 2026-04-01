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
        "pb:bg-primary pb:hover:bg-dark-primary pb:text-gray-900 pb:shadow-sm pb:border pb:border-transparent pb:font-bold pb:disabled:bg-gray-400 pb:disabled:hover:bg-gray-300",
      secondary:
        "pb:bg-gray-100 pb:hover:bg-gray-200 pb:text-gray-800 pb:border pb:border-gray-200 pb:border pb:font-normal pb:disabled:bg-gray-400 pb:disabled:hover:bg-gray-300",
      danger:
        "pb:bg-danger pb:hover:opacity-80 pb:text-gray-900 pb:shadow-sm pb:border pb:border-transparent pb:font-bold pb:disabled:bg-gray-400 pb:disabled:hover:bg-gray-300",
      ghost:
        "pb:bg-transparent pb:hover:bg-gray-100 pb:text-gray-700 pb:hover:text-gray-900 pb:font-medium",
      "ghostly-danger":
        "pb:bg-transparent pb:hover:bg-danger/10 pb:text-red-700 pb:border pb:border-red-700 pb:font-medium pb:disabled:border-gray-400 pb:disabled:text-gray-400",
    };

    const sizes = {
      sm: isActuallyIconOnly ? "pb:p-1 pb:text-xs" : "pb:px-2 pb:py-1 pb:text-xs",
      md: isActuallyIconOnly ? "pb:p-2 pb:text-sm" : "pb:px-4 pb:py-2 pb:text-sm",
      lg: isActuallyIconOnly ? "pb:p-3 pb:text-base" : "pb:px-6 pb:py-3 pb:text-base",
    };

    return (
      <BaseButton
        ref={ref}
        render={render}
        nativeButton={nativeButton}
        className={cn(
          "pb:inline-flex pb:items-center pb:justify-center pb:rounded-md pb:transition-colors pb:focus:outline-none pb:focus:ring-2 pb:focus:ring-primary pb:focus:ring-offset-2 pb:disabled:cursor-not-allowed pb:cursor-pointer",
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
              "pb:animate-spin pb:h-4 pb:w-4",
              !isActuallyIconOnly && "pb:mr-2 pb:-ml-1",
            )}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="pb:opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="pb:opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {!isLoading && leftIcon && (
          <span
            className={cn(
              "pb:inline-flex pb:items-center pb:justify-center",
              !isActuallyIconOnly && "pb:mr-2 pb:-ml-1",
            )}
          >
            {leftIcon}
          </span>
        )}
        {children}
        {!isLoading && rightIcon && (
          <span
            className={cn(
              "pb:inline-flex pb:items-center pb:justify-center",
              !isActuallyIconOnly && "pb:ml-2 pb:-mr-1",
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
