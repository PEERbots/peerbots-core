import React, { useState } from "react";
import { Accordion } from "./Accordion";
import { ButtonProps } from "./Button";

export interface CollapsibleProps {
  title: React.ReactNode;
  children: React.ReactNode;
  /** The variant of the trigger or panel */
  variant?: ButtonProps["variant"] | "default" | "bordered" | "flat";
  /** The size of the trigger button */
  size?: ButtonProps["size"];
  defaultOpen?: boolean;
  isOpen?: boolean;
  onToggle?: (open: boolean) => void;
  className?: string;
}

export function Collapsible({
  title,
  children,
  variant = "default",
  defaultOpen = false,
  isOpen: controlledIsOpen,
  onToggle,
  className,
}: CollapsibleProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalOpen;

  const handleToggle = (nextOpen: boolean) => {
    if (controlledIsOpen === undefined) {
      setInternalOpen(nextOpen);
    }
    if (onToggle) {
      onToggle(nextOpen);
    }
  };

  const accordionVariant =
    variant === "bordered" || variant === "flat" ? variant : "default";

  return (
    <Accordion
      variant={accordionVariant}
      title={title}
      isOpen={isOpen}
      onToggle={handleToggle}
      defaultOpen={defaultOpen}
      className={className}
    >
      {children}
    </Accordion>
  );
}
