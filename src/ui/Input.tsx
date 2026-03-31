import { Input as BaseInput } from "@base-ui/react";
import React from "react";
import { cn } from "./utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputClasses = cn(
      "block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 bg-primary/10 appearance-none",
      leftIcon && "pl-10",
      rightIcon && "pr-10",
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
          <div className="pb:pointer-events-none pb:absolute pb:inset-y-0 pb:left-0 pb:flex pb:items-center pb:pl-3">
            <span className="pb:text-gray-500 sm:pb:text-sm">{leftIcon}</span>
          </div>
        )}
        <BaseInput ref={ref} id={id} className={inputClasses} {...props} />
        {rightIcon && (
          <div className="pb:pointer-events-none pb:absolute pb:inset-y-0 pb:right-0 pb:flex pb:items-center pb:pr-3">
            <span className="pb:text-gray-500 sm:pb:text-sm">{rightIcon}</span>
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
