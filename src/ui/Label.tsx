import React from "react";
import { cn } from "./utils";
import { HelperTooltip } from "./Tooltip";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  tooltip?: string;
  className?: string;
}

export function Label({ children, tooltip, className, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        "relative block text-sm font-bold leading-6 text-gray-600 mb-1 group-focus-within:text-gray-800",
        className,
      )}
      {...props}
    >
      <div className="pb:flex pb:items-center pb:gap-1">
        {children}
        {tooltip && <HelperTooltip content={tooltip} />}
      </div>
    </label>
  );
}
