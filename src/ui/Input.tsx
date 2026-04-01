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
      "pb:block pb:w-full pb:rounded-md pb:border-0 pb:px-1.5 pb:py-1.5 pb:text-gray-900 pb:shadow-sm pb:ring-1 pb:ring-inset pb:ring-gray-300 pb:placeholder:text-gray-400 pb:focus:ring-2 pb:focus:ring-inset pb:focus:ring-primary pb:sm:text-sm pb:sm:leading-6 pb:bg-primary/10 pb:appearance-none",
      leftIcon && "pb:pl-10",
      rightIcon && "pb:pr-10",
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
            <span className="pb:text-gray-500 pb:sm:text-sm">{leftIcon}</span>
          </div>
        )}
        <BaseInput ref={ref} id={id} className={inputClasses} {...props} />
        {rightIcon && (
          <div className="pb:pointer-events-none pb:absolute pb:inset-y-0 pb:right-0 pb:flex pb:items-center pb:pr-3">
            <span className="pb:text-gray-500 pb:sm:text-sm">{rightIcon}</span>
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
