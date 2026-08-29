import { Button as BaseButton } from "@base-ui/react";
import React from "react";
import { cn } from "../utils";
import {
  ComponentColor,
  FillVariant,
  ComponentSize,
  ComponentRadius,
} from "../types";

export type ButtonVariant =
  | FillVariant
  | "primary"
  | "secondary"
  | "danger"
  | "ghostly-danger"
  | "marketing-teal"
  | "marketing-pink"
  | "teal"
  | "pink";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement | HTMLAnchorElement> {
  /**
   * Visual fill style / treatment or legacy variant.
   * @default "solid"
   */
  variant?: ButtonVariant;
  /**
   * Palette color or semantic intent.
   * @default "primary"
   */
  color?: ComponentColor;
  /**
   * Button scale / padding.
   * @default "md"
   */
  size?: ComponentSize;
  /**
   * Border radius geometry.
   * @default "md" (rounded-xl)
   */
  radius?: ComponentRadius;
  /** Loading spinner indicator state */
  isLoading?: boolean;
  /** Icon placed before children */
  leftIcon?: React.ReactNode;
  /** Icon placed after children */
  rightIcon?: React.ReactNode;
  render?: BaseButton.Props["render"];
  nativeButton?: boolean;
  isIconOnly?: boolean;
  href?: string;
  target?: string;
  rel?: string;
}

const variantColorMap: Record<FillVariant, Record<string, string>> = {
  solid: {
    primary:
      "pb:bg-primary pb:text-gray-900 pb:hover:bg-dark-primary pb:hover:text-white pb:shadow-xs pb:font-bold",
    neutral:
      "pb:bg-gray-100 pb:text-gray-900 pb:hover:bg-gray-200 pb:border pb:border-gray-300 pb:font-medium",
    teal: "pb:bg-peerbots-teal pb:text-gray-900 pb:hover:bg-peerbots-darkteal pb:hover:text-white pb:shadow-md pb:font-bold",
    pink: "pb:bg-peerbots-pink pb:text-gray-950 pb:hover:bg-rose-700 pb:hover:text-white pb:shadow-md pb:font-bold",
    darkblue:
      "pb:bg-peerbots-darkblue pb:text-white pb:hover:opacity-90 pb:shadow-md pb:font-bold",
    danger:
      "pb:bg-red-600 pb:text-white pb:hover:bg-red-700 pb:shadow-xs pb:font-bold",
    success:
      "pb:bg-emerald-700 pb:text-white pb:hover:bg-emerald-800 pb:shadow-xs pb:font-bold",
    warning:
      "pb:bg-amber-500 pb:text-gray-900 pb:hover:bg-amber-600 pb:shadow-xs pb:font-bold",
  },
  soft: {
    primary:
      "pb:bg-primary/20 pb:text-teal-950 pb:hover:bg-primary/30 pb:font-bold",
    neutral:
      "pb:bg-gray-100 pb:text-gray-800 pb:hover:bg-gray-200 pb:font-medium",
    teal: "pb:bg-peerbots-teal/20 pb:text-teal-950 pb:hover:bg-peerbots-teal/30 pb:font-bold",
    pink: "pb:bg-peerbots-pink/20 pb:text-rose-950 pb:hover:bg-peerbots-pink/30 pb:font-bold",
    darkblue:
      "pb:bg-peerbots-darkblue/15 pb:text-peerbots-darkblue pb:hover:bg-peerbots-darkblue/25 pb:font-bold",
    danger:
      "pb:bg-red-50 pb:text-red-800 pb:hover:bg-red-100 pb:font-bold",
    success:
      "pb:bg-emerald-50 pb:text-emerald-800 pb:hover:bg-emerald-100 pb:font-bold",
    warning:
      "pb:bg-amber-50 pb:text-amber-900 pb:hover:bg-amber-100 pb:font-bold",
  },
  outline: {
    primary:
      "pb:bg-transparent pb:border-2 pb:border-teal-700 pb:text-teal-900 pb:hover:bg-primary/10 pb:font-bold",
    neutral:
      "pb:bg-transparent pb:border-2 pb:border-gray-300 pb:text-gray-800 pb:hover:border-gray-400 pb:hover:bg-gray-50 pb:font-medium",
    teal: "pb:bg-transparent pb:border-2 pb:border-peerbots-darkteal pb:text-peerbots-darkteal pb:hover:bg-peerbots-teal/10 pb:font-bold",
    pink: "pb:bg-transparent pb:border-2 pb:border-rose-700 pb:text-rose-800 pb:hover:bg-peerbots-pink/10 pb:font-bold",
    darkblue:
      "pb:bg-transparent pb:border-2 pb:border-peerbots-darkblue pb:text-peerbots-darkblue pb:hover:bg-peerbots-darkblue/10 pb:font-bold",
    danger:
      "pb:bg-transparent pb:border-2 pb:border-red-600 pb:text-red-700 pb:hover:bg-red-50 pb:font-bold",
    success:
      "pb:bg-transparent pb:border-2 pb:border-emerald-600 pb:text-emerald-700 pb:hover:bg-emerald-50 pb:font-bold",
    warning:
      "pb:bg-transparent pb:border-2 pb:border-amber-600 pb:text-amber-900 pb:hover:bg-amber-50 pb:font-bold",
  },
  ghost: {
    primary:
      "pb:bg-transparent pb:text-teal-900 pb:hover:bg-primary/10 pb:font-bold",
    neutral:
      "pb:bg-transparent pb:text-gray-800 pb:hover:bg-gray-100 pb:hover:text-gray-900 pb:font-medium",
    teal: "pb:bg-transparent pb:text-peerbots-darkteal pb:hover:bg-peerbots-teal/10 pb:font-bold",
    pink: "pb:bg-transparent pb:text-rose-800 pb:hover:bg-peerbots-pink/10 pb:font-bold",
    darkblue:
      "pb:bg-transparent pb:text-peerbots-darkblue pb:hover:bg-peerbots-darkblue/10 pb:font-bold",
    danger:
      "pb:bg-transparent pb:text-red-700 pb:hover:bg-red-50 pb:font-bold",
    success:
      "pb:bg-transparent pb:text-emerald-700 pb:hover:bg-emerald-50 pb:font-bold",
    warning:
      "pb:bg-transparent pb:text-amber-900 pb:hover:bg-amber-50 pb:font-bold",
  },
  link: {
    primary:
      "pb:bg-transparent pb:p-0 pb:text-teal-800 pb:hover:underline pb:font-medium",
    neutral:
      "pb:bg-transparent pb:p-0 pb:text-gray-700 pb:hover:text-gray-900 pb:hover:underline pb:font-medium",
    teal: "pb:bg-transparent pb:p-0 pb:text-peerbots-darkteal pb:hover:underline pb:font-medium",
    pink: "pb:bg-transparent pb:p-0 pb:text-rose-800 pb:hover:underline pb:font-medium",
    darkblue:
      "pb:bg-transparent pb:p-0 pb:text-peerbots-darkblue pb:hover:underline pb:font-medium",
    danger:
      "pb:bg-transparent pb:p-0 pb:text-red-600 pb:hover:underline pb:font-medium",
    success:
      "pb:bg-transparent pb:p-0 pb:text-emerald-600 pb:hover:underline pb:font-medium",
    warning:
      "pb:bg-transparent pb:p-0 pb:text-amber-600 pb:hover:underline pb:font-medium",
  },
};

const radiusClasses: Record<ComponentRadius, string> = {
  none: "pb:rounded-none",
  sm: "pb:rounded-md",
  md: "pb:rounded-xl",
  lg: "pb:rounded-2xl",
  "2xl": "pb:rounded-2xl",
  pill: "pb:rounded-full",
};

export const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(
  (
    {
      className,
      variant = "solid",
      color,
      size = "md",
      radius = "md",
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
    // Resolve legacy variants to orthogonal (FillVariant, ComponentColor, ComponentRadius)
    let resolvedVariant: FillVariant = "solid";
    let resolvedColor: ComponentColor = color || "primary";
    let resolvedRadius: ComponentRadius = radius;

    if (variant === "secondary") {
      resolvedVariant = "solid";
      resolvedColor = color || "neutral";
    } else if (variant === "danger") {
      resolvedVariant = "solid";
      resolvedColor = color || "danger";
    } else if (variant === "ghostly-danger") {
      resolvedVariant = "ghost";
      resolvedColor = color || "danger";
    } else if (variant === "marketing-teal" || variant === "teal") {
      resolvedVariant = "solid";
      resolvedColor = color || "teal";
      resolvedRadius = radius === "md" ? "pill" : radius;
    } else if (variant === "marketing-pink" || variant === "pink") {
      resolvedVariant = "solid";
      resolvedColor = color || "pink";
      resolvedRadius = radius === "md" ? "pill" : radius;
    } else if (
      variant === "solid" ||
      variant === "soft" ||
      variant === "outline" ||
      variant === "ghost" ||
      variant === "link"
    ) {
      resolvedVariant = variant;
    }

    const isActuallyIconOnly =
      isIconOnly || (!children && (!!leftIcon || !!rightIcon));

    const sizes: Record<ComponentSize, string> = {
      xs: isActuallyIconOnly
        ? "pb:p-1 pb:text-xs"
        : "pb:px-2.5 pb:py-1 pb:text-xs",
      sm: isActuallyIconOnly
        ? "pb:p-1.5 pb:text-xs"
        : "pb:px-3.5 pb:py-1.5 pb:text-xs",
      md: isActuallyIconOnly
        ? "pb:p-2 pb:text-sm"
        : "pb:px-4.5 pb:py-2.5 pb:text-sm",
      lg: isActuallyIconOnly
        ? "pb:p-3 pb:text-base"
        : "pb:px-6 pb:py-3.5 pb:text-base sm:pb:text-lg",
      xl: isActuallyIconOnly
        ? "pb:p-3.5 pb:text-lg"
        : "pb:px-8 pb:py-4 pb:text-lg sm:pb:text-xl",
    };

    const variantStyles =
      variantColorMap[resolvedVariant]?.[resolvedColor] ||
      variantColorMap[resolvedVariant]?.primary ||
      variantColorMap.solid.primary;

    const commonClasses = cn(
      "pb:inline-flex pb:items-center pb:justify-center pb:transition-all pb:duration-150 pb:focus:outline-none pb:focus-visible:ring-2 pb:focus-visible:ring-peerbots-teal pb:focus-visible:ring-offset-2 pb:disabled:cursor-not-allowed pb:disabled:opacity-50 pb:cursor-pointer pb:font-medium",
      radiusClasses[resolvedRadius],
      variantStyles,
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
