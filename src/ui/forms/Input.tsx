import { Input as BaseInput } from "@base-ui/react";
import React from "react";
import { cn } from "../utils";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  /**
   * Input height and padding scale.
   * @default "md"
   */
  size?: "sm" | "md";
  /**
   * Visual treatment (`"ghost"` hides border/fill until hover or focus, ideal for table cells).
   * @default "default"
   */
  variant?: "default" | "ghost" | "compact";
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      leftIcon,
      rightIcon,
      id,
      size = "md",
      variant = "default",
      ...props
    },
    ref,
  ) => {
    const inputClasses = cn(
      "pb:block pb:w-full pb:rounded-md pb:border-0 pb:text-gray-900 pb:placeholder:text-gray-400 pb:focus:outline-none pb:appearance-none pb:transition-colors",
      size === "sm" || variant === "compact"
        ? "pb:px-2 pb:py-1 pb:text-xs sm:pb:text-sm pb:leading-5 pb:min-h-[28px]"
        : "pb:px-1.5 pb:py-1.5 pb:sm:text-sm pb:sm:leading-6",
      variant === "ghost"
        ? "pb:bg-transparent pb:shadow-none pb:ring-1 pb:ring-inset pb:ring-transparent pb:hover:bg-gray-100/80 pb:hover:ring-gray-300 pb:focus:bg-white pb:focus:ring-2 pb:focus:ring-inset pb:focus:ring-primary"
        : variant === "compact"
          ? "pb:bg-white pb:shadow-2xs pb:ring-1 pb:ring-inset pb:ring-gray-200 pb:hover:ring-gray-300 pb:focus:ring-2 pb:focus:ring-inset pb:focus:ring-primary"
          : "pb:shadow-sm pb:ring-1 pb:ring-inset pb:ring-gray-300 pb:focus:ring-2 pb:focus:ring-inset pb:focus:ring-primary pb:bg-primary/10",
      leftIcon && (size === "sm" ? "pb:ps-8" : "pb:ps-10"),
      rightIcon && (size === "sm" ? "pb:pe-8" : "pb:pe-10"),
      className,
    );

    if (!leftIcon && !rightIcon) {
      return (
        <BaseInput ref={ref} id={id} className={inputClasses} {...props} />
      );
    }

    return (
      <div className="pb:relative">
        {leftIcon && (
          <div className="pb:pointer-events-none pb:absolute pb:inset-y-0 pb:start-0 pb:flex pb:items-center pb:ps-3">
            <span className="pb:text-gray-500 pb:sm:text-sm">{leftIcon}</span>
          </div>
        )}
        <BaseInput ref={ref} id={id} className={inputClasses} {...props} />
        {rightIcon && (
          <div className="pb:pointer-events-none pb:absolute pb:inset-y-0 pb:end-0 pb:flex pb:items-center pb:pe-3">
            <span className="pb:text-gray-500 pb:sm:text-sm">{rightIcon}</span>
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
