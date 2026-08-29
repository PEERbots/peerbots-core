import React from "react";
import { cn } from "../utils";
import { ComponentSize, ComponentRadius, SurfaceVariant } from "../types";

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  /**
   * Surface treatment / fill style.
   * @default "surface"
   */
  variant?: SurfaceVariant | "default" | "elevated";
  /**
   * Background color tinting.
   * @default "default"
   */
  color?: "default" | "teal" | "pink";
  /**
   * Card padding scale.
   * @default "md"
   */
  padding?: "none" | ComponentSize;
  /**
   * Border radius scale.
   * @default "2xl"
   */
  radius?: ComponentRadius;
  /** Whether the card shows interactive hover elevation */
  hoverable?: boolean;
  id?: string;
  as?: React.ElementType;
  href?: string;
  target?: string;
  rel?: string;
}

const variantStyles: Record<string, string> = {
  surface: "pb:bg-white pb:border pb:border-gray-200 pb:shadow-md",
  elevated: "pb:bg-white pb:border pb:border-gray-200 pb:shadow-md",
  default: "pb:bg-white pb:border pb:border-gray-200 pb:shadow-xs",
  glass:
    "pb:bg-white/90 pb:backdrop-blur-xl pb:border pb:border-white/40 pb:shadow-xl",
  flat: "pb:bg-gray-50/80 pb:border pb:border-gray-200",
  outline: "pb:bg-transparent pb:border-2 pb:border-gray-300",
};

const tintStyles: Record<string, string> = {
  default: "",
  teal: "pb:bg-peerbots-teal/5 pb:border pb:border-peerbots-darkteal/30",
  pink: "pb:bg-peerbots-pink/5 pb:border pb:border-rose-300",
};

const radiusClasses: Record<ComponentRadius, string> = {
  none: "pb:rounded-none",
  sm: "pb:rounded-md",
  md: "pb:rounded-xl",
  lg: "pb:rounded-2xl",
  "2xl": "pb:rounded-2xl",
  pill: "pb:rounded-full",
};

const paddingClasses: Record<string, string> = {
  none: "",
  xs: "pb:p-2.5",
  sm: "pb:p-4",
  md: "pb:p-6 sm:pb:p-8",
  lg: "pb:p-8 sm:pb:p-10 md:pb:p-12",
  xl: "pb:p-10 sm:pb:p-12 md:pb:p-16",
};

export const Card = React.forwardRef<HTMLElement, CardProps>(
  (
    {
      children,
      className,
      variant = "surface",
      color = "default",
      padding = "md",
      radius = "2xl",
      hoverable = true,
      id,
      as: Component = "div",
      href,
      target,
      rel,
      ...rest
    },
    ref,
  ) => {
    const baseStyles = "pb:overflow-hidden pb:transition-all pb:duration-300";

    const hoverStyles = hoverable
      ? "pb:hover:shadow-lg pb:hover:-translate-y-0.5 pb:hover:border-peerbots-teal/30 pb:focus-within:ring-2 pb:focus-within:ring-peerbots-teal"
      : "";

    const isLink = Boolean(href) || Component === "a";
    const TargetTag = href ? "a" : Component;

    return (
      <TargetTag
        id={id}
        href={href}
        target={target}
        rel={rel}
        ref={ref as any}
        className={cn(
          baseStyles,
          radiusClasses[radius] || radiusClasses["2xl"],
          color === "default"
            ? variantStyles[variant] || variantStyles.surface
            : tintStyles[color],
          hoverStyles,
          paddingClasses[padding] || paddingClasses.md,
          isLink && "pb:cursor-pointer pb:block",
          className,
        )}
        {...(rest as any)}
      >
        {children}
      </TargetTag>
    );
  },
);

Card.displayName = "Card";
