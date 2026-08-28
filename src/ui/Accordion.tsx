import React, { useState, useId } from "react";
import { cn } from "./utils";
import { Icon } from "./Icon";
import { Text } from "./Typography";

export interface AccordionItem {
  id?: string;
  question?: string;
  title?: string;
  answer?: string;
  content?: string;
  description?: string;
  bodyHtml?: string;
  isOpenDefault?: boolean;
}

export interface AccordionProps {
  items?: AccordionItem[];
  allowMultiple?: boolean;
  className?: string;
  variant?: "default" | "bordered" | "flat";
}

export const Accordion: React.FC<AccordionProps> = ({
  items = [],
  allowMultiple = false,
  className,
  variant = "default",
}) => {
  const baseId = useId();
  const [openIndices, setOpenIndices] = useState<number[]>(() => {
    const initial: number[] = [];
    items.forEach((item, index) => {
      if (item.isOpenDefault) {
        initial.push(index);
      }
    });
    return initial;
  });

  const toggleItem = (index: number) => {
    if (allowMultiple) {
      setOpenIndices((prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index)
          : [...prev, index],
      );
    } else {
      setOpenIndices((prev) => (prev.includes(index) ? [] : [index]));
    }
  };

  return (
    <div className={cn("pb:w-full pb:space-y-3", className)}>
      {items.map((item, index) => {
        const isOpen = openIndices.includes(index);
        const headingText =
          item.question || item.title || `Section ${index + 1}`;
        const answerText =
          item.answer || item.content || item.description || "";
        const headerId = `${baseId}-header-${index}`;
        const panelId = `${baseId}-panel-${index}`;

        return (
          <div
            key={item.id || index}
            className={cn(
              "pb:rounded-2xl pb:border pb:transition-all pb:duration-200 pb:overflow-hidden",
              isOpen
                ? "pb:bg-white pb:border-peerbots-teal/40 pb:shadow-sm"
                : "pb:bg-white/80 pb:hover:bg-white pb:border-gray-200/80",
              variant === "bordered" && "pb:border-2",
              variant === "flat" && "pb:border-none pb:bg-gray-100",
            )}
          >
            <h3>
              <button
                type="button"
                id={headerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleItem(index)}
                className="pb:w-full pb:px-6 pb:py-4 sm:pb:py-5 pb:text-left pb:flex pb:items-center pb:justify-between pb:gap-4 pb:font-bold pb:text-gray-900 pb:hover:text-peerbots-darkteal pb:transition-colors pb:focus:outline-none pb:focus-visible:ring-2 pb:focus-visible:ring-peerbots-teal pb:rounded-2xl pb:cursor-pointer"
              >
                <span className="pb:text-base sm:pb:text-lg pb:font-bold pb:leading-snug">
                  {headingText}
                </span>
                <span
                  className={cn(
                    "pb:w-7 pb:h-7 pb:rounded-full pb:flex pb:items-center pb:justify-center pb:flex-shrink-0 pb:transition-transform pb:duration-200",
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
            </h3>

            {isOpen && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={headerId}
                className="pb:px-6 pb:pb-5 pb:pt-1 pb:text-gray-700 pb:leading-relaxed pb:border-t pb:border-gray-100"
              >
                {item.bodyHtml ? (
                  <div
                    className="pb:text-base pb:leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: item.bodyHtml }}
                  />
                ) : (
                  <Text variant="default" className="pb:text-base pb:text-gray-700 pb:leading-relaxed">
                    {answerText}
                  </Text>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
