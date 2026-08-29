import React from "react";
import { cn } from "../utils";
import { BrandColor, ComponentColor, ComponentSize } from "../types";

const headingSizes: Record<number, string> = {
  1: "pb:text-4xl sm:pb:text-5xl pb:font-bold pb:leading-tight",
  2: "pb:text-3xl sm:pb:text-4xl pb:font-bold pb:leading-snug",
  3: "pb:text-2xl sm:pb:text-3xl pb:font-bold pb:leading-snug",
  4: "pb:text-xl sm:pb:text-2xl pb:font-bold pb:leading-snug",
  5: "pb:text-lg sm:pb:text-xl pb:font-bold",
  6: "pb:text-base sm:pb:text-lg pb:font-bold",
};

const headingColorClasses: Record<string, string> = {
  default: "",
  teal: "pb:text-peerbots-darkteal",
  pink: "pb:text-rose-800",
  primary: "pb:text-dark-primary",
  darkteal: "pb:text-peerbots-darkteal",
  darkblue: "pb:text-peerbots-darkblue",
  olive: "pb:text-[#636814]",
  dark: "pb:text-peerbots-dark",
  white: "pb:text-white",
  gradient:
    "pb:bg-clip-text pb:text-transparent pb:bg-gradient-to-r pb:from-peerbots-teal pb:via-peerbots-pink pb:to-peerbots-darkblue",
};

const textColorClasses: Record<string, string> = {
  default: "pb:text-slate-950",
  neutral: "pb:text-gray-800",
  muted: "pb:text-gray-600",
  error: "pb:text-red-700 pb:font-medium",
  success: "pb:text-emerald-800 pb:font-medium",
  teal: "pb:text-peerbots-darkteal",
  pink: "pb:text-rose-800",
  primary: "pb:text-dark-primary",
  darkteal: "pb:text-peerbots-darkteal",
  darkblue: "pb:text-peerbots-darkblue",
  olive: "pb:text-[#636814]",
  dark: "pb:text-peerbots-dark",
  white: "pb:text-white",
};

const textSizeClasses: Record<string, string> = {
  xs: "pb:text-xs pb:leading-normal",
  sm: "pb:text-sm pb:leading-relaxed",
  md: "pb:text-base pb:leading-relaxed",
  lg: "pb:text-lg pb:leading-relaxed",
  xl: "pb:text-xl pb:leading-relaxed",
  lead: "pb:text-lg sm:pb:text-xl pb:leading-relaxed pb:text-slate-700",
};

const weightClasses = {
  normal: "pb:font-normal",
  medium: "pb:font-medium",
  semibold: "pb:font-semibold",
  bold: "pb:font-bold",
};

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Semantic HTML heading level (h1 - h6) */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Visual heading scale override (defaults to level) */
  size?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Palette color or gradient text fill */
  color?: BrandColor | "gradient" | "default";
  /** Legacy variant prop (alias for color) */
  variant?: BrandColor | "gradient" | "default";
  /** Font weight */
  weight?: "normal" | "medium" | "semibold" | "bold";
  children?: React.ReactNode;
}

export const Heading = ({
  level = 1,
  size,
  color,
  variant,
  weight,
  className,
  children,
  ...props
}: HeadingProps) => {
  const visualScale = size !== undefined ? size : level;
  const resolvedColor = color || variant || "default";

  return React.createElement(
    `h${level}`,
    {
      className: cn(
        headingSizes[visualScale],
        headingColorClasses[resolvedColor] || "",
        weight && weightClasses[weight],
        className,
      ),
      ...props,
    },
    children,
  );
};

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  /** HTML rendering tag */
  as?: React.ElementType;
  /** Typography scale */
  size?: ComponentSize | "lead";
  /** Text color / intent */
  color?: ComponentColor | "muted" | "error" | "success" | "default";
  /** Legacy variant prop for convenience / backward compatibility */
  variant?: "default" | "muted" | "small" | "large" | "lead" | "error" | "success";
  /** Font weight */
  weight?: "normal" | "medium" | "semibold" | "bold";
  /** Text alignment */
  align?: "left" | "center" | "right";
  children?: React.ReactNode;
}

export const Text = ({
  as: Component = "p",
  size,
  color,
  variant,
  weight,
  align,
  className,
  children,
  ...props
}: TextProps) => {
  const resolvedSize =
    size ||
    (variant === "small"
      ? "sm"
      : variant === "large"
        ? "lg"
        : variant === "lead"
          ? "lead"
          : "md");

  const resolvedColor =
    color ||
    (variant === "muted"
      ? "muted"
      : variant === "error"
        ? "error"
        : variant === "success"
          ? "success"
          : "default");

  return React.createElement(
    Component,
    {
      className: cn(
        textSizeClasses[resolvedSize] || textSizeClasses.md,
        textColorClasses[resolvedColor] || textColorClasses.default,
        weight && weightClasses[weight],
        align && `pb:text-${align}`,
        className,
      ),
      ...props,
    },
    children,
  );
};
