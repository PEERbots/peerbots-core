import React, { useId, useRef } from "react";
import { Button } from "../forms/Button";
import { Icon } from "../foundations/Icon";
import { cn } from "../utils";

/**
 * Descriptor for a single open workspace tab in {@link TabSelection}.
 */
export interface TabItem {
  /** Unique tab identifier. */
  id: string;
  /** Visible text label displayed on the tab pill. */
  label: string;
  /** Optional callback fired when clicking the active tab's Close (`×`) action button. */
  onClose?: () => void;
  /** Optional callback fired when clicking the active tab's Edit/Rename action button. */
  onEdit?: () => void;
}

/**
 * Props for {@link TabSelection}, a dynamic workspace tab bar supporting per-tab
 * rename/close actions and a trailing `+` add-tab button.
 *
 * **When to use `TabSelection` vs `TabRadio` vs `ChipGroup`:**
 * - Use **`TabSelection`** for **dynamic, user-managed workspace or template tabs** (1–N open
 *   documents/templates) that users can create (`+`), rename (`onEdit`), or close (`onClose`).
 * - Use **`TabRadio`** for **compact, fixed 2–4 mutually exclusive mode/view switches**
 *   (e.g., `Buttons | Table | Flow` or `Top-Bottom | Left-Right`).
 * - Use **`ChipGroup`** for **multi-select or wrapping filter pills / facet tags** (3–15+ options,
 *   optional count badges, single or `multiple` selection).
 */
export interface TabSelectionProps {
  /** Ordered list of open workspace tabs. */
  tabs: TabItem[];
  /** Currently active tab ID (or `null` when none is selected). */
  activeTabId: string | null;
  /** Callback fired when a user activates a tab. */
  onTabClick: (id: string) => void;
  /** Optional callback fired when clicking the trailing `+` button to create a new tab. */
  onAddClick?: () => void;
  /**
   * Accessible name applied to the ARIA `tablist`.
   * @default "Workspace tabs"
   */
  ariaLabel?: string;
  /** Optional additional CSS classes applied to the scrollable tab bar container. */
  className?: string;
}

/**
 * Accessible horizontal workspace tab bar with per-tab Edit/Close sibling controls
 * and an optional `+` Create New Tab button.
 *
 * Uses `<div role="tablist" aria-owns={...}>` owning strictly `<button type="button" role="tab">`
 * elements while placing Edit/Close `<Button>` controls as siblings inside each tab pill—preventing
 * invalid nested `<button>` markup AND satisfying ARIA `tablist` required-children rules.
 */
export function TabSelection({
  tabs,
  activeTabId,
  onTabClick,
  onAddClick,
  ariaLabel = "Workspace tabs",
  className = "",
}: TabSelectionProps) {
  const baseId = useId();
  const tabButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const tabDomIds = tabs.map((tab, idx) => `${baseId}-tab-${idx}-${tab.id}`);

  const handleTabKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (tabs.length <= 1) return;
    let nextIndex: number | null = null;

    if (e.key === "ArrowRight") {
      nextIndex = (index + 1) % tabs.length;
    } else if (e.key === "ArrowLeft") {
      nextIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = tabs.length - 1;
    }

    if (nextIndex !== null) {
      e.preventDefault();
      const nextTab = tabs[nextIndex];
      if (nextTab) {
        tabButtonRefs.current[nextIndex]?.focus();
        onTabClick(nextTab.id);
      }
    }
  };

  return (
    <div
      className={cn(
        "pb:flex pb:items-center pb:gap-1.5 pb:overflow-x-auto pb:py-1 pb:text-sm pb:whitespace-nowrap",
        className,
      )}
    >
      {tabs.length > 0 && (
        <div
          role="tablist"
          aria-label={ariaLabel}
          aria-owns={tabDomIds.join(" ")}
        />
      )}

      {tabs.map((tab, index) => {
        const isActive = tab.id === activeTabId;
        const tabDomId = tabDomIds[index];
        const hasActions = isActive && Boolean(tab.onEdit || tab.onClose);

        return (
          <div
            key={tab.id}
            className={cn(
              "pb:inline-flex pb:items-center pb:shrink-0 pb:rounded-lg pb:border pb:transition-colors",
              isActive
                ? "pb:bg-primary/25 pb:text-gray-950 pb:border-peerbots-darkteal/40 pb:border-b-2 pb:border-b-peerbots-darkteal pb:shadow-2xs"
                : "pb:text-gray-700 pb:bg-gray-100 hover:pb:bg-gray-200 hover:pb:text-gray-950 pb:border-gray-200",
            )}
          >
            <button
              ref={(el) => {
                tabButtonRefs.current[index] = el;
              }}
              id={tabDomId}
              type="button"
              role="tab"
              aria-selected={isActive}
              tabIndex={
                isActive || (activeTabId === null && index === 0) ? 0 : -1
              }
              onClick={() => onTabClick(tab.id)}
              onKeyDown={(e) => handleTabKeyDown(e, index)}
              className={cn(
                "pb:px-3 pb:py-1.5 pb:text-sm pb:cursor-pointer pb:rounded-lg pb:transition-colors pb:focus:outline-none pb:focus-visible:ring-2 pb:focus-visible:ring-peerbots-darkteal",
                hasActions && "pb:pe-1.5 pb:rounded-e-none",
                isActive
                  ? "pb:font-bold pb:text-gray-950"
                  : "pb:font-medium pb:text-gray-700 pb:bg-gray-100 hover:pb:bg-gray-200 hover:pb:text-gray-950",
              )}
            >
              {tab.label}
            </button>

            {hasActions && (
              <span className="pb:inline-flex pb:items-center pb:pe-1 pb:gap-0.5">
                {tab.onEdit && (
                  <Button
                    variant="ghost"
                    color="neutral"
                    size="xs"
                    isIconOnly
                    aria-label={`Edit Tab: ${tab.label}`}
                    title={`Edit ${tab.label}`}
                    onClick={() => {
                      tab.onEdit?.();
                    }}
                    leftIcon={<Icon name="edit" size="sm" aria-hidden="true" />}
                  />
                )}
                {tab.onEdit && tab.onClose && (
                  <span
                    aria-hidden="true"
                    className="pb:text-gray-400 pb:text-xs pb:select-none"
                  >
                    |
                  </span>
                )}
                {tab.onClose && (
                  <Button
                    variant="ghost"
                    color="danger"
                    size="xs"
                    isIconOnly
                    aria-label={`Close Tab: ${tab.label}`}
                    title={`Close ${tab.label}`}
                    onClick={() => {
                      tab.onClose?.();
                    }}
                    leftIcon={
                      <Icon name="close" size="sm" aria-hidden="true" />
                    }
                  />
                )}
              </span>
            )}
          </div>
        );
      })}

      {onAddClick && (
        <Button
          color="primary"
          size="xs"
          isIconOnly
          aria-label="Create New Tab"
          title="Create New Tab"
          onClick={onAddClick}
          leftIcon={<Icon name="plus" size="sm" aria-hidden="true" />}
          className="pb:shrink-0"
        />
      )}
    </div>
  );
}
