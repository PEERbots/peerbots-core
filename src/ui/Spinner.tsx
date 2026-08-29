import React from "react";
import { cn } from "./utils";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Size variant of the spinner */
  size?: "xs" | "sm" | "md" | "lg";
  /** Color theme of the spinner */
  color?: "primary" | "teal" | "pink" | "neutral" | "white";
  /** Screen-reader accessible label */
  label?: string;
}

const sizeClasses = {
  xs: "pb:w-3.5 pb:h-3.5 pb:border-[1.5px]",
  sm: "pb:w-5 pb:h-5 pb:border-2",
  md: "pb:w-8 pb:h-8 pb:border-[2.5px]",
  lg: "pb:w-12 pb:h-12 pb:border-4",
};

const colorClasses = {
  primary: "pb:border-primary pb:border-t-transparent",
  teal: "pb:border-peerbots-teal pb:border-t-transparent",
  pink: "pb:border-peerbots-pink pb:border-t-transparent",
  neutral: "pb:border-gray-500 pb:border-t-transparent",
  white: "pb:border-white pb:border-t-transparent",
};

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  (
    {
      size = "md",
      color = "teal",
      label = "Loading...",
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-label={label}
        className={cn(
          "pb:inline-block pb:rounded-full pb:animate-spin pb:shrink-0",
          sizeClasses[size],
          colorClasses[color],
          className,
        )}
        {...props}
      >
        <span className="pb:sr-only">{label}</span>
      </div>
    );
  },
);

Spinner.displayName = "Spinner";
