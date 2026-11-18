import React, { useId } from "react";
import { cn } from "../utils";

export interface FieldGroupProps {
  /** Group label text or element */
  label?: React.ReactNode;
  /** Optional leading icon rendered alongside the group label */
  icon?: React.ReactNode;
  /** Optional descriptive helper text rendered below the grouped controls */
  description?: React.ReactNode;
  /** Composite form controls grouped inside this container */
  children: React.ReactNode;
  /** Optional additional CSS classes */
  className?: string;
  /** Optional explicit ID for the group label element */
  id?: string;
}

/**
 * Accessible grouping component for composite form controls (such as `SliderWithNumberField`)
 * containing multiple interactive inputs that should be associated with a shared group label
 * via `role="group"` and `aria-labelledby` rather than a single `<label htmlFor="...">`.
 */
export function FieldGroup({
  label,
  icon,
  description,
  children,
  className,
  id: customId,
}: FieldGroupProps) {
  const generatedId = useId();
  const labelId = customId || `field-group-${generatedId}`;

  return (
    <div
      role="group"
      aria-labelledby={label ? labelId : undefined}
      className={cn("pb:flex pb:flex-col pb:gap-1.5 pb:w-full", className)}
    >
      {label && (
        <span
          id={labelId}
          className="pb:text-sm pb:font-bold pb:leading-6 pb:text-gray-600 pb:flex pb:items-center pb:gap-1"
        >
          {icon && <span className="pb:shrink-0">{icon}</span>}
          {label}
        </span>
      )}
      {children}
      {description && (
        <span className="pb:text-xs pb:text-gray-500">{description}</span>
      )}
    </div>
  );
}

export default FieldGroup;
