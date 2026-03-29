import { ReactNode } from "react";
import { Heading } from "./Typography";
import { cn } from "./utils";
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
 * Provides a consistent look with white background, shadow, and rounded corners.
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
    <div className={cn("flex flex-col", contentClassName)}>{children}</div>
  );

  return (
    <div
      className={cn(
        "m-2 p-4 bg-white shadow-xl rounded-lg flex flex-1 flex-col",
        className,
      )}
    >
      {collapsible ? (
        <Collapsible
          title={
            typeof title === "string" ? (
              <Heading level={headingLevel} className="text-gray-600">
                {title}
              </Heading>
            ) : (
              title
            )
          }
          variant="ghost"
          defaultOpen={defaultOpen}
        >
          {content}
        </Collapsible>
      ) : (
        <>
          {title && (
            <div className="flex items-center justify-between mb-2 empty:hidden">
              {typeof title === "string" ? (
                <Heading level={headingLevel} className="text-gray-600">
                  {title}
                </Heading>
              ) : (
                title
              )}
            </div>
          )}
          {content}
        </>
      )}
    </div>
  );
}
