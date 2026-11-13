import React, { useId, useState } from "react";
import { Icon } from "../foundations/Icon";
import { ButtonProps } from "../forms/Button";
import { cn } from "../utils";

/**
 * Props for {@link Collapsible}, a single standalone expandable disclosure section
 * wrapping arbitrary React `children`.
 *
 * **When to use `Collapsible` vs `Accordion`:**
 * - Use **`Collapsible`** for a **single standalone disclosure** wrapping custom JSX
 *   (e.g., "Advanced Settings", "Scoring Inspector", or collapsible `SettingsPanel` sections).
 *   Supports `size="sm" | "md" | "lg"` so it fits compactly inside sidebars as well as full cards.
 * - Use **`Accordion`** for a **coordinated vertical list of 2+ disclosure items** (`items` array)
 *   such as FAQs or multi-section guides with optional single-open mutual exclusivity (`allowMultiple={false}`).
 */
export interface CollapsibleProps {
  /** Header label or custom React node rendered inside the disclosure trigger button. */
  title: React.ReactNode;
  /** Arbitrary React content revealed when expanded. */
  children: React.ReactNode;
  /**
   * Visual surface style of the disclosure container.
   * @default "default"
   */
  variant?: ButtonProps["variant"] | "default" | "bordered" | "flat";
  /**
   * Density and typography scale of the disclosure trigger and content area:
   * - `"sm"` (or `"xs"`): Compact padding & `text-sm` trigger — ideal inside narrow `SettingsPanel` sidebars.
   * - `"md"` (default): Standard card disclosure padding & `text-base` trigger.
   * - `"lg"` (or `"xl"`): Spacious full-width section padding & `text-lg` trigger.
   * @default "md"
   */
  size?: "sm" | "md" | "lg" | ButtonProps["size"];
  /**
   * Initial expanded state when uncontrolled.
   * @default false
   */
  defaultOpen?: boolean;
  /** Controlled expanded state. */
  isOpen?: boolean;
  /** Callback fired whenever the user toggles the disclosure open or closed. */
  onToggle?: (open: boolean) => void;
  /** Optional additional CSS classes applied to the outer container. */
  className?: string;
}

const sizeStyles: Record<
  "sm" | "md" | "lg",
  {
    containerRadius: string;
    header: string;
    title: string;
    chevronBadge: string;
    chevronIcon: string;
    content: string;
  }
> = {
  sm: {
    containerRadius: "pb:rounded-xl",
    header: "pb:px-3.5 pb:py-2.5 sm:pb:px-4 sm:pb:py-2.5 pb:gap-2.5",
    title: "pb:text-sm pb:font-semibold pb:leading-snug",
    chevronBadge: "pb:w-6 pb:h-6",
    chevronIcon: "pb:w-3.5 pb:h-3.5",
    content: "pb:px-3.5 pb:pb-3.5 pb:pt-2 sm:pb:px-4 pb:text-sm",
  },
  md: {
    containerRadius: "pb:rounded-2xl",
    header: "pb:px-4 pb:py-3.5 sm:pb:px-5 sm:pb:py-3.5 pb:gap-3",
    title: "pb:text-base pb:font-bold pb:leading-snug",
    chevronBadge: "pb:w-7 pb:h-7",
    chevronIcon: "pb:w-4 pb:h-4",
    content: "pb:px-4 pb:pb-4 pb:pt-2.5 sm:pb:px-5 pb:text-sm sm:pb:text-base",
  },
  lg: {
    containerRadius: "pb:rounded-2xl",
    header: "pb:px-5 pb:py-4 sm:pb:px-6 sm:pb:py-4.5 pb:gap-4",
    title: "pb:text-base sm:pb:text-lg pb:font-bold pb:leading-snug",
    chevronBadge: "pb:w-8 pb:h-8",
    chevronIcon: "pb:w-4 pb:h-4",
    content: "pb:px-5 pb:pb-5 pb:pt-3 sm:pb:px-6 pb:text-base",
  },
};

/**
 * Single standalone expandable disclosure section wrapping arbitrary React `children`
 * (such as "Advanced Configuration", debug inspectors, or collapsible `SettingsPanel` drawers).
 *
 * For a coordinated multi-item list of 2+ sections with optional mutual exclusivity,
 * use {@link Accordion} (`<Accordion items={[...]} />`).
 */
export function Collapsible({
  title,
  children,
  variant = "default",
  size = "md",
  defaultOpen = false,
  isOpen: controlledIsOpen,
  onToggle,
  className,
}: CollapsibleProps) {
  const baseId = useId();
  const headerId = `${baseId}-collapsible-trigger`;
  const panelId = `${baseId}-collapsible-panel`;

  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : internalOpen;

  const normalizedSize: "sm" | "md" | "lg" =
    size === "xs" || size === "sm"
      ? "sm"
      : size === "lg" || size === "xl"
        ? "lg"
        : "md";

  const scale = sizeStyles[normalizedSize];

  const handleToggle = () => {
    const nextOpen = !isOpen;
    if (controlledIsOpen === undefined) {
      setInternalOpen(nextOpen);
    }
    onToggle?.(nextOpen);
  };

  return (
    <div
      data-size={normalizedSize}
      className={cn(
        "pb:w-full pb:border pb:transition-all pb:duration-300 pb:overflow-hidden pb:box-border",
        scale.containerRadius,
        isOpen
          ? "pb:bg-white pb:border-peerbots-teal/40 pb:shadow-xs"
          : "pb:bg-white/80 pb:hover:bg-white pb:border-gray-200/80",
        (variant === "bordered" || variant === "outline") && "pb:border-2",
        (variant === "flat" || variant === "ghost" || variant === "soft") &&
          "pb:border-none pb:bg-gray-100",
        className,
      )}
    >
      <button
        type="button"
        id={headerId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={handleToggle}
        className={cn(
          "pb:w-full pb:box-border pb:text-start pb:flex pb:items-center pb:justify-between pb:text-gray-900 pb:hover:text-peerbots-darkteal pb:transition-colors pb:focus:outline-none pb:focus-visible:ring-2 pb:focus-visible:ring-peerbots-teal pb:cursor-pointer",
          scale.header,
        )}
      >
        <div className={cn("pb:flex-1 pb:min-w-0", scale.title)}>
          {typeof title === "string" ? <span>{title}</span> : title}
        </div>
        <span
          className={cn(
            "pb:rounded-full pb:flex pb:items-center pb:justify-center pb:flex-shrink-0 pb:transition-transform pb:duration-300 pb:ease-in-out",
            scale.chevronBadge,
            isOpen
              ? "pb:bg-peerbots-teal pb:text-white pb:rotate-180"
              : "pb:bg-gray-100 pb:text-gray-600",
          )}
          aria-hidden="true"
        >
          <Icon name="chevronDownSmall" className={scale.chevronIcon} />
        </span>
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        className={cn(
          "pb:grid pb:transition-all pb:duration-300 pb:ease-in-out",
          isOpen
            ? "pb:grid-rows-[1fr] pb:opacity-100"
            : "pb:grid-rows-[0fr] pb:opacity-0",
        )}
      >
        <div className="pb:overflow-hidden">
          <div
            className={cn(
              "pb:w-full pb:box-border pb:text-gray-700 pb:leading-relaxed pb:border-t pb:border-gray-100",
              scale.content,
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
