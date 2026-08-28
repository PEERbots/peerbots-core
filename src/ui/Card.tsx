import React from "react";
import { cn } from "./utils";

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  variant?:
    | "default"
    | "elevated"
    | "flat"
    | "outline"
    | "teal-tint"
    | "pink-tint";
  id?: string;
  as?: React.ElementType;
  href?: string;
  target?: string;
  rel?: string;
}

export const Card = React.forwardRef<HTMLElement, CardProps>(
  (
    {
      children,
      className,
      hoverable = true,
      padding = "md",
      variant = "default",
      id,
      as: Component = "div",
      href,
      target,
      rel,
      ...rest
    },
    ref,
  ) => {
    const baseStyles =
      "pb:rounded-2xl pb:overflow-hidden pb:transition-all pb:duration-300";

    const variants: Record<string, string> = {
      default: "pb:bg-white pb:border pb:border-gray-100 pb:shadow-xs",
      elevated: "pb:bg-white pb:border pb:border-gray-100 pb:shadow-md",
      flat: "pb:bg-gray-50/80 pb:border pb:border-gray-100/60",
      outline: "pb:bg-transparent pb:border-2 pb:border-gray-200",
      "teal-tint": "pb:bg-peerbots-teal/5 pb:border pb:border-peerbots-teal/20",
      "pink-tint": "pb:bg-peerbots-pink/5 pb:border pb:border-peerbots-pink/20",
    };

    const hoverStyles = hoverable
      ? "pb:hover:shadow-lg pb:hover:-translate-y-0.5 pb:hover:border-peerbots-teal/30 pb:focus-within:ring-2 pb:focus-within:ring-peerbots-teal"
      : "";

    const paddings: Record<string, string> = {
      none: "",
      sm: "pb:p-4",
      md: "pb:p-6 sm:pb:p-8",
      lg: "pb:p-8 sm:pb:p-10 md:pb:p-12",
      xl: "pb:p-10 sm:pb:p-12 md:pb:p-16",
    };

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
          variants[variant] || variants.default,
          hoverStyles,
          paddings[padding] || paddings.md,
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
