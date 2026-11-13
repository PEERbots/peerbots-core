import { Field as BaseField } from "@base-ui/react";
import React from "react";
import { cn } from "../utils";
import { Label } from "./Label";

/**
 * Props for `<Field>` — accessible form-control wrapper providing label, description, tooltip, and validation error wiring.
 */
export interface FieldProps extends BaseField.Root.Props {
  /** Visible field label associated with the child control. */
  label?: string;
  /** Secondary helper text rendered below the control. */
  description?: string;
  /** Validation error message; marks the field `invalid` when truthy. */
  error?: string;
  /** Optional helper tooltip string displayed next to the label. */
  tooltip?: string;
  /** Form control element (`<Input>`, `<Select>`, `<Switch>`, etc.). */
  children: React.ReactNode;
  /** Optional leading icon rendered inside the label. */
  icon?: React.ReactNode;
  /** Placement of the label relative to the form control (@default "top"). */
  labelPlacement?: "top" | "left" | "right" | "start" | "end";
  /** Font weight of the label (@default "bold"). */
  labelWeight?: "bold" | "normal";
  /** Whether the field container should size to its content (`pb:w-auto`) instead of stretching to 100% width (@default false). */
  inline?: boolean;
}

/**
 * A wrapper component that provides a label, description, and error message for form controls.
 * Uses Base UI's Field primitives for accessibility.
 */
export const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  (
    {
      label,
      description,
      error,
      tooltip,
      children,
      className,
      icon,
      labelPlacement = "top",
      labelWeight = "bold",
      inline = false,
      ...props
    },
    ref,
  ) => {
    const isHorizontal =
      labelPlacement === "left" ||
      labelPlacement === "right" ||
      labelPlacement === "start" ||
      labelPlacement === "end";
    const labelOnEnd = labelPlacement === "right" || labelPlacement === "end";

    return (
      <BaseField.Root
        ref={ref}
        invalid={Boolean(error)}
        className={cn(
          "pb:flex",
          inline ? "pb:w-auto" : "pb:w-full",
          isHorizontal ? "pb:flex-col pb:gap-1" : "pb:flex-col pb:gap-1.5",
          className as string,
        )}
        {...props}
      >
        <div
          className={cn(
            "pb:flex",
            isHorizontal ? "pb:flex-row pb:items-center pb:gap-2" : "pb:flex-col pb:gap-1.5",
          )}
        >
          {labelOnEnd && <div className="pb:relative">{children}</div>}

          {label && (
            <BaseField.Label
              render={(props) => (
                <Label
                  tooltip={tooltip}
                  className={cn(
                    "pb:mb-0",
                    labelWeight === "normal" && "pb:font-normal",
                  )}
                  {...props}
                >
                  <span className="pb:flex pb:items-center pb:gap-1">
                    {icon && <span className="pb:flex-shrink-0">{icon}</span>}
                    {label}
                  </span>
                </Label>
              )}
            />
          )}

          {!labelOnEnd && <div className="pb:relative">{children}</div>}
        </div>

        {description && (
          <BaseField.Description
            className={cn(
              "pb:text-xs pb:text-gray-500",
              labelOnEnd && "pb:ms-7", // Aligns description with label text when child is on start
            )}
          >
            {description}
          </BaseField.Description>
        )}

        {error && (
          <BaseField.Error
            match={true}
            className={cn(
              "pb:text-xs pb:text-red-600 pb:font-medium",
              labelOnEnd && "pb:ms-7",
            )}
          >
            {error}
          </BaseField.Error>
        )}
      </BaseField.Root>
    );
  },
);

Field.displayName = "Field";
