import React from "react";
import { cn } from "../utils";
import { HelperTooltip } from "../feedback/Tooltip";

/**
 * Props for `<Label>` — styled `<label>` element with optional inline `<HelperTooltip>`.
 */
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** Label text or inline content. */
  children: React.ReactNode;
  /** Optional tooltip copy displayed in a trailing question-mark `<HelperTooltip>`. */
  tooltip?: string;
  /** Additional label classes. */
  className?: string;
}

export function Label({ children, tooltip, className, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        "pb:relative pb:block pb:text-sm pb:font-bold pb:leading-6 pb:text-gray-600 pb:mb-1 pb:group-focus-within:text-gray-800",
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
