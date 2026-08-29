import React, { useState, useId } from "react";
import { cn } from "./utils";
import { Icon } from "./Icon";
import { Text } from "./Typography";

export interface AccordionItem {
  id?: string;
  question?: React.ReactNode;
  title?: React.ReactNode;
  answer?: React.ReactNode;
  content?: React.ReactNode;
  description?: React.ReactNode;
  bodyHtml?: string;
  isOpenDefault?: boolean;
}

export interface AccordionProps {
  /** List of accordion items for multi-item list mode */
  items?: AccordionItem[];
  /** Allow multiple items to be opened simultaneously */
  allowMultiple?: boolean;
  /** Visual style variant */
  variant?: "default" | "bordered" | "flat";
  /** Single-item mode: title for the disclosure */
  title?: React.ReactNode;
  /** Single-item mode: content/children for the disclosure */
  children?: React.ReactNode;
  /** Single-item mode: default open state */
  defaultOpen?: boolean;
  /** Controlled open state for single-item mode */
  isOpen?: boolean;
  /** Controlled toggle callback for single-item mode */
  onToggle?: (open: boolean) => void;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  variant = "default",
  title,
  children,
  defaultOpen = false,
  isOpen: controlledIsOpen,
  onToggle,
  className,
  headerClassName,
  contentClassName,
}) => {
  const baseId = useId();

  // Normalize single-item props vs items array
  const resolvedItems: AccordionItem[] =
    items ||
    (title || children
      ? [
          {
            id: "single",
            title,
            content: children,
            isOpenDefault: defaultOpen,
          },
        ]
      : []);

  const [openIndices, setOpenIndices] = useState<number[]>(() => {
    const initial: number[] = [];
    resolvedItems.forEach((item, index) => {
      if (item.isOpenDefault || (index === 0 && defaultOpen)) {
        initial.push(index);
      }
    });
    return initial;
  });

  const toggleItem = (index: number) => {
    const isCurrentlyOpen =
      controlledIsOpen !== undefined && resolvedItems.length === 1
        ? controlledIsOpen
        : openIndices.includes(index);
    const willBeOpen = !isCurrentlyOpen;

    if (onToggle && resolvedItems.length === 1) {
      onToggle(willBeOpen);
    }

    if (controlledIsOpen === undefined) {
      if (allowMultiple) {
        setOpenIndices((prev) =>
          prev.includes(index)
            ? prev.filter((i) => i !== index)
            : [...prev, index],
        );
      } else {
        setOpenIndices((prev) => (prev.includes(index) ? [] : [index]));
      }
    }
  };

  return (
    <div className={cn("pb:w-full pb:space-y-3 pb:box-border", className)}>
      {resolvedItems.map((item, index) => {
        const isOpen =
          controlledIsOpen !== undefined && resolvedItems.length === 1
            ? controlledIsOpen
            : openIndices.includes(index);

        const headingContent =
          item.question || item.title || `Section ${index + 1}`;
        const bodyContent =
          item.content || item.answer || item.description;

        const headerId = `${baseId}-header-${index}`;
        const panelId = `${baseId}-panel-${index}`;

        return (
          <div
            key={item.id || index}
            className={cn(
              "pb:w-full pb:rounded-2xl pb:border pb:transition-all pb:duration-300 pb:overflow-hidden pb:box-border",
              isOpen
                ? "pb:bg-white pb:border-peerbots-teal/40 pb:shadow-xs"
                : "pb:bg-white/80 pb:hover:bg-white pb:border-gray-200/80",
              variant === "bordered" && "pb:border-2",
              variant === "flat" && "pb:border-none pb:bg-gray-100",
            )}
          >
            <div className="pb:w-full pb:m-0 pb:p-0">
              <button
                type="button"
                id={headerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleItem(index)}
                className={cn(
                  "pb:w-full pb:box-border pb:px-5 pb:py-4 sm:pb:px-6 sm:pb:py-4.5 pb:text-left pb:flex pb:items-center pb:justify-between pb:gap-4 pb:font-bold pb:text-gray-900 pb:hover:text-peerbots-darkteal pb:transition-colors pb:focus:outline-none pb:focus-visible:ring-2 pb:focus-visible:ring-peerbots-teal pb:cursor-pointer",
                  headerClassName,
                )}
              >
                <div className="pb:text-base sm:pb:text-lg pb:font-bold pb:leading-snug pb:flex-1 pb:min-w-0">
                  {typeof headingContent === "string" ? (
                    <span>{headingContent}</span>
                  ) : (
                    headingContent
                  )}
                </div>
                <span
                  className={cn(
                    "pb:w-7 pb:h-7 pb:rounded-full pb:flex pb:items-center pb:justify-center pb:flex-shrink-0 pb:transition-transform pb:duration-300 pb:ease-in-out",
                    isOpen
                      ? "pb:bg-peerbots-teal pb:text-white pb:rotate-180"
                      : "pb:bg-gray-100 pb:text-gray-600",
                  )}
                  aria-hidden="true"
                >
                  <Icon
                    name="chevronDownSmall"
                    className="pb:w-4 pb:h-4"
                  />
                </span>
              </button>
            </div>

            {/* Smooth animated expand / collapse container */}
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
                    "pb:w-full pb:box-border pb:px-5 pb:pb-5 pb:pt-2 sm:pb:px-6 pb:text-gray-700 pb:leading-relaxed pb:border-t pb:border-gray-100",
                    contentClassName,
                  )}
                >
                  {item.bodyHtml ? (
                    <div
                      className="pb:text-base pb:leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: item.bodyHtml }}
                    />
                  ) : typeof bodyContent === "string" ? (
                    <Text className="pb:text-base pb:text-gray-700 pb:leading-relaxed">
                      {bodyContent}
                    </Text>
                  ) : (
                    bodyContent
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
