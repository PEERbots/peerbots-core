import { Field as BaseField } from "@base-ui/react";
import React from "react";
import { cn } from "./utils";
import { Label } from "./Label";

export interface FieldProps extends BaseField.Root.Props {
  label?: string;
  description?: string;
  error?: string;
  tooltip?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  labelPlacement?: "top" | "left" | "right";
  labelWeight?: "bold" | "normal";
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
      ...props
    },
    ref,
  ) => {
    const isHorizontal =
      labelPlacement === "left" || labelPlacement === "right";
    const labelOnRight = labelPlacement === "right";

    return (
      <BaseField.Root
        ref={ref}
        className={cn(
          "flex w-full",
          isHorizontal ? "flex-col gap-1" : "flex-col gap-1.5",
          className as string,
        )}
        {...props}
      >
        <div
          className={cn(
            "flex",
            isHorizontal ? "flex-row items-center gap-2" : "flex-col gap-1.5",
          )}
        >
          {labelOnRight && <div className="relative">{children}</div>}

          {label && (
            <BaseField.Label
              render={(props) => (
                <Label
                  tooltip={tooltip}
                  className={cn(
                    "mb-0",
                    labelWeight === "normal" && "font-normal",
                  )}
                  {...props}
                >
                  <span className="flex items-center gap-1">
                    {icon && <span className="flex-shrink-0">{icon}</span>}
                    {label}
                  </span>
                </Label>
              )}
            />
          )}

          {!labelOnRight && <div className="relative">{children}</div>}
        </div>

        {description && (
          <BaseField.Description
            className={cn(
              "text-xs text-gray-500",
              labelOnRight && "ml-7", // Aligns description with label text when child is on left
            )}
          >
            {description}
          </BaseField.Description>
        )}

        {error && (
          <BaseField.Error
            className={cn(
              "text-xs text-red-600 font-medium",
              labelOnRight && "ml-7",
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
