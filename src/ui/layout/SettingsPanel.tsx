import { ReactNode } from "react";
import { Heading } from "../foundations/Typography";
import { cn } from "../utils";
import { Card } from "./Card";
import { Collapsible } from "./Collapsible";

export interface SettingsPanelProps {
  /** The title of the section */
  title?: ReactNode;
  /** The content of the panel */
  children: ReactNode;
  /** Custom class for the panel wrapper */
  className?: string;
  /** Custom class for the content area */
  contentClassName?: string;
  /** Whether the panel is collapsible */
  collapsible?: boolean;
  /** Default state of the collapsible panel */
  defaultOpen?: boolean;
  /** The heading level for the title */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}

/**
 * A standardized panel for settings sections.
 * Built on top of Card and Collapsible for design system consistency.
 */
export function SettingsPanel({
  title,
  children,
  className,
  contentClassName,
  collapsible,
  defaultOpen = true,
  headingLevel = 3,
}: SettingsPanelProps) {
  const content = (
    <div className={cn("pb:flex pb:flex-col pb:gap-3", contentClassName)}>
      {children}
    </div>
  );

  if (collapsible) {
    return (
      <div className={cn("pb:w-full pb:mb-3", className)}>
        <Collapsible
          title={
            typeof title === "string" ? (
              <Heading level={headingLevel} className="pb:text-gray-800 pb:font-bold">
                {title}
              </Heading>
            ) : (
              title
            )
          }
          defaultOpen={defaultOpen}
        >
          {content}
        </Collapsible>
      </div>
    );
  }

  return (
    <Card
      variant="elevated"
      padding="sm"
      hoverable={false}
      className={cn("pb:w-full pb:mb-3 pb:flex pb:flex-col", className)}
    >
      {title && (
        <div className="pb:flex pb:items-center pb:justify-between pb:mb-3 pb:pb-2 pb:border-b pb:border-gray-100 empty:hidden">
          {typeof title === "string" ? (
            <Heading level={headingLevel} className="pb:text-gray-800 pb:font-bold">
              {title}
            </Heading>
          ) : (
            title
          )}
        </div>
      )}
      {content}
    </Card>
  );
}
