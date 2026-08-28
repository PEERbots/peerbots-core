import { Button as BaseButton } from "@base-ui/react";
import React from "react";
import { cn } from "./utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement | HTMLAnchorElement> {
  variant?:
    | "primary"
    | "secondary"
    | "danger"
    | "ghost"
    | "ghostly-danger"
    | "marketing-pink"
    | "marketing-teal"
    | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  render?: BaseButton.Props["render"];
  nativeButton?: boolean;
  isIconOnly?: boolean;
  href?: string;
  target?: string;
  rel?: string;
}

export const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(
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
      href,
      target,
      rel,
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
        "pb:bg-gray-100 pb:hover:bg-gray-200 pb:text-gray-800 pb:border pb:border-gray-200 pb:font-normal pb:disabled:bg-gray-400 pb:disabled:hover:bg-gray-300",
      danger:
        "pb:bg-danger pb:hover:opacity-80 pb:text-gray-900 pb:shadow-sm pb:border pb:border-transparent pb:font-bold pb:disabled:bg-gray-400 pb:disabled:hover:bg-gray-300",
      ghost:
        "pb:bg-transparent pb:hover:bg-gray-100 pb:text-gray-700 pb:hover:text-gray-900 pb:font-medium",
      "ghostly-danger":
        "pb:bg-transparent pb:hover:bg-danger/10 pb:text-red-700 pb:border pb:border-red-700 pb:font-medium pb:disabled:border-gray-400 pb:disabled:text-gray-400",
      "marketing-pink":
        "pb:bg-peerbots-pink pb:text-white pb:hover:opacity-90 pb:focus:ring-peerbots-pink pb:shadow-md",
      "marketing-teal":
        "pb:bg-peerbots-teal pb:text-white pb:hover:opacity-90 pb:focus:ring-peerbots-teal pb:rounded-full pb:shadow-lg pb:hover:shadow-peerbots-teal/20",
      outline:
        "pb:bg-transparent pb:text-gray-700 pb:border-2 pb:border-gray-200 pb:hover:border-peerbots-teal pb:hover:text-peerbots-teal pb:focus:ring-peerbots-teal",
    };

    const sizes = {
      sm: isActuallyIconOnly ? "pb:p-1 pb:text-xs" : "pb:px-2 pb:py-1 pb:text-xs",
      md: isActuallyIconOnly ? "pb:p-2 pb:text-sm" : "pb:px-4 pb:py-2 pb:text-sm",
      lg: isActuallyIconOnly
        ? "pb:p-3 pb:text-base"
        : "pb:px-6 pb:py-3.5 pb:text-base sm:pb:text-lg",
    };

    const commonClasses = cn(
      "pb:inline-flex pb:items-center pb:justify-center pb:rounded-md pb:transition-all pb:duration-200 pb:focus:outline-none pb:focus:ring-2 pb:focus:ring-primary pb:focus:ring-offset-2 pb:disabled:cursor-not-allowed pb:cursor-pointer pb:font-medium",
      variants[variant] || variants.primary,
      sizes[size],
      className,
    );

    const content = (
      <>
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
      </>
    );

    if (href) {
      return (
        <a
          href={href}
          target={target}
          rel={rel}
          className={commonClasses}
          ref={ref as React.Ref<HTMLAnchorElement>}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </a>
      );
    }

    return (
      <BaseButton
        ref={ref as React.Ref<HTMLButtonElement>}
        render={render}
        nativeButton={nativeButton}
        className={commonClasses}
        disabled={disabled || isLoading}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {content}
      </BaseButton>
    );
  },
);

Button.displayName = "Button";

