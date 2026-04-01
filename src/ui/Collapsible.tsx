import React, { useState } from "react";
import { cn } from "./utils";
import { Button, ButtonProps } from "./Button";
import { Icon } from "./Icon";

export interface CollapsibleProps {
  title: React.ReactNode;
  children: React.ReactNode;
  /** The variant of the trigger button */
  variant?: ButtonProps["variant"];
  /** The size of the trigger button */
  size?: ButtonProps["size"];
  defaultOpen?: boolean;
  className?: string;
}

export function Collapsible({
  title,
  children,
  variant = "secondary",
  size = "md",
  defaultOpen = false,
  className,
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cn("w-full", className)}>
      <Button
        variant={variant}
        size={size}
        className="pb:w-full pb:justify-between pb:font-medium"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        rightIcon={
          <Icon className="pb:h-5 pb:w-5 pb:text-gray-600" strokeWidth="2.5">
            {isOpen ? (
              <path d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            ) : (
              <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            )}
          </Icon>
        }
      >
        <span>{title}</span>
      </Button>
      {isOpen && (
        <div className="pb:px-4 pb:pt-4 pb:pb-2 pb:text-sm pb:text-gray-500">{children}</div>
      )}
    </div>
  );
}
