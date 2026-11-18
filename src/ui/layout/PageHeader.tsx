import React from "react";
import { Heading, Text } from "../foundations/Typography";
import { cn } from "../utils";

export interface PageHeaderProps {
  /** Primary page title rendered as a semantic `<h1>` */
  title: React.ReactNode;
  /** Optional subtitle or explanatory text displayed below the title */
  description?: React.ReactNode;
  /** Optional right-aligned toolbar controls or actions */
  actions?: React.ReactNode;
  /** Additional classes for the header container */
  className?: string;
}

/**
 * Standardized compact page header for dashboard views.
 * Renders a semantic `<h1>` using `Heading` `size={5}` (`text-lg sm:text-xl font-bold`)
 * to preserve vertical viewport space while supporting optional descriptions and right-aligned actions.
 */
export function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("pb:mb-2", className)}>
      <div className="pb:flex pb:flex-wrap pb:items-center pb:justify-between pb:gap-2">
        <Heading
          level={1}
          size={5}
          className="pb:inline-block pb:tracking-tight pb:text-gray-900"
        >
          {title}
        </Heading>
        {actions && (
          <div className="pb:max-w-full pb:overflow-x-auto pb:ms-auto">
            {actions}
          </div>
        )}
      </div>
      {description && (
        <Text
          color="muted"
          className="pb:text-gray-600 pb:text-sm pb:mt-0.5 pb:max-w-2xl"
        >
          {description}
        </Text>
      )}
    </div>
  );
}

export default PageHeader;
