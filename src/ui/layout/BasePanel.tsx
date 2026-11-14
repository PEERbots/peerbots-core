import React from "react";
import { DEFAULT_COMMON_LABELS, usePeerbotsI18n } from "../../i18n";
import { Button } from "../forms/Button";
import { Heading } from "../foundations/Typography";
import { Icon } from "../foundations/Icon";
import { cn } from "../utils";

export interface BasePanelProps {
  /** Panel heading text. */
  title: string;
  /** Panel body content. */
  children: React.ReactNode;
  /** Optional callback invoked when the close button is clicked. When omitted, the close button is hidden. */
  onClose?: () => void;
  /** Accessible label for the close button (defaults to `"Close {title}"`). */
  closeLabel?: string;
  /** Heading semantic level (@default 3). */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Additional classes for the outer panel container. */
  className?: string;
  /** Additional classes for the header row. */
  headerClassName?: string;
}

/**
 * Reusable side-panel shell providing a consistent header, heading level,
 * and optional close button for docked authoring and analytics panels.
 */
export function BasePanel({
  title,
  children,
  onClose,
  closeLabel,
  headingLevel = 3,
  className,
  headerClassName,
}: BasePanelProps) {
  const { labels } = usePeerbotsI18n();
  const closeWord = labels?.common?.close ?? DEFAULT_COMMON_LABELS.close;
  const resolvedCloseLabel = closeLabel ?? `${closeWord} ${title}`;

  return (
    <div className={cn("pb:flex pb:flex-col pb:h-full", className)}>
      <div
        className={cn(
          "pb:flex pb:items-center pb:justify-between pb:gap-2 pb:mb-3",
          headerClassName,
        )}
      >
        <Heading
          level={headingLevel}
          className="pb:font-bold pb:tracking-tight pb:truncate"
        >
          {title}
        </Heading>
        {onClose && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            isIconOnly
            onClick={onClose}
            className="pb:rounded-full pb:shrink-0"
            aria-label={resolvedCloseLabel}
          >
            <Icon name="close" size="sm" aria-hidden="true" />
          </Button>
        )}
      </div>
      {children}
    </div>
  );
}
