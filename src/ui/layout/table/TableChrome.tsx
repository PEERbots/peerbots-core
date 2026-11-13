import React from "react";
import { cn } from "../../utils";
import { Button } from "../../forms/Button";
import { Select } from "../../forms/Select";
import { SearchInput } from "../../forms/SearchInput";
import {
  DEFAULT_TABLE_LABELS,
  type TableLabels,
  usePeerbotsI18n,
} from "../../../i18n";
import type { TableDensity } from "../useTableState";
import { formatLabel } from "./types";

/* ============================================================================
 * 4. Toolbar, Bulk Action Bar, and Pagination Subcomponents
 * ========================================================================== */

export interface TableToolbarProps {
  /** Controlled search query */
  searchValue?: string;
  /** Callback when search query changes */
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;
  /** Optional filter controls (e.g. `<Field inline><Select ... /></Field>`) */
  filtersSlot?: React.ReactNode;
  /** Optional primary/secondary action buttons on the far end */
  actionsSlot?: React.ReactNode;
  /** Controlled row density */
  density?: TableDensity;
  /** Callback when row density changes */
  onDensityChange?: (density: TableDensity) => void;
  /** Number of modified/dirty rows to display as a status pill */
  modifiedCount?: number;
  /** Optional callback to reset modified rows */
  onResetModified?: () => void;
  labels?: Partial<TableLabels>;
  className?: string;
}

export function TableToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  filtersSlot,
  actionsSlot,
  density,
  onDensityChange,
  modifiedCount = 0,
  onResetModified,
  labels: propLabels,
  className,
}: TableToolbarProps) {
  const { labels: contextLabels } = usePeerbotsI18n();
  const labels: TableLabels = {
    ...DEFAULT_TABLE_LABELS,
    ...contextLabels?.table,
    ...propLabels,
  };

  return (
    <div
      className={cn(
        "pb:flex pb:flex-col sm:pb:flex-row sm:pb:items-center sm:pb:justify-between pb:gap-3 pb:p-3 sm:pb:px-4 pb:bg-white pb:border-b pb:border-gray-200",
        className,
      )}
    >
      <div className="pb:flex pb:flex-wrap pb:items-center pb:gap-3 pb:flex-1">
        {onSearchChange && (
          <div className="pb:w-full sm:pb:w-64">
            <SearchInput
              value={searchValue ?? ""}
              onChange={(e) => onSearchChange(e.target.value)}
              onClear={() => onSearchChange("")}
              placeholder={searchPlaceholder || labels.searchPlaceholder}
            />
          </div>
        )}
        {filtersSlot}
        {modifiedCount > 0 && (
          <div className="pb:inline-flex pb:items-center pb:gap-2 pb:px-2.5 pb:py-1 pb:rounded-full pb:bg-amber-50 pb:border pb:border-amber-200 pb:text-xs pb:font-medium pb:text-amber-900">
            <span className="pb:w-2 pb:h-2 pb:rounded-full pb:bg-amber-500" />
            <span>
              {`${modifiedCount} ${labels.modified.toLowerCase()}`}
            </span>
            {onResetModified && (
              <button
                type="button"
                onClick={onResetModified}
                className="pb:underline pb:font-bold pb:hover:text-amber-950 pb:cursor-pointer pb:ms-1"
              >
                Reset
              </button>
            )}
          </div>
        )}
      </div>

      <div className="pb:flex pb:flex-wrap pb:items-center pb:gap-2">
        {onDensityChange && density && (
          <div
            role="group"
            aria-label="Table density"
            className="pb:inline-flex pb:items-center pb:rounded-lg pb:bg-gray-100 pb:p-0.5 pb:text-xs"
          >
            {(["compact", "comfortable", "spacious"] as TableDensity[]).map(
              (d) => {
                const dLabel =
                  d === "compact"
                    ? labels.densityCompact
                    : d === "comfortable"
                      ? labels.densityComfortable
                      : labels.densitySpacious;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => onDensityChange(d)}
                    aria-pressed={density === d}
                    className={cn(
                      "pb:px-2 pb:py-1 pb:rounded-md pb:font-medium pb:transition-all pb:cursor-pointer",
                      density === d
                        ? "pb:bg-white pb:text-gray-900 pb:shadow-xs pb:font-bold"
                        : "pb:text-gray-600 pb:hover:text-gray-900",
                    )}
                  >
                    {dLabel}
                  </button>
                );
              },
            )}
          </div>
        )}
        {actionsSlot}
      </div>
    </div>
  );
}

export interface TableBulkActionBarProps {
  selectedCount: number;
  totalCount?: number;
  onClearSelection: () => void;
  onSelectAllRows?: () => void;
  children?: React.ReactNode;
  labels?: Partial<TableLabels>;
  className?: string;
}

export function TableBulkActionBar({
  selectedCount,
  totalCount,
  onClearSelection,
  onSelectAllRows,
  children,
  labels: propLabels,
  className,
}: TableBulkActionBarProps) {
  const { labels: contextLabels } = usePeerbotsI18n();
  const labels: TableLabels = {
    ...DEFAULT_TABLE_LABELS,
    ...contextLabels?.table,
    ...propLabels,
  };

  if (selectedCount <= 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "pb:flex pb:flex-wrap pb:items-center pb:justify-between pb:gap-3 pb:px-4 pb:py-2.5 pb:bg-primary/15 pb:border-b pb:border-peerbots-teal/30 pb:text-sm",
        className,
      )}
    >
      <div className="pb:flex pb:flex-wrap pb:items-center pb:gap-3">
        <span className="pb:inline-flex pb:items-center pb:gap-1.5 pb:font-bold pb:text-teal-950">
          <span className="pb:inline-flex pb:items-center pb:justify-center pb:w-5 pb:h-5 pb:rounded-full pb:bg-peerbots-darkteal pb:text-white pb:text-xs">
            {selectedCount}
          </span>
          <span>
            {formatLabel(labels.selectedCount, { count: selectedCount })}
          </span>
        </span>

        {onSelectAllRows &&
          totalCount !== undefined &&
          selectedCount < totalCount && (
            <Button
              variant="link"
              color="teal"
              size="xs"
              onClick={onSelectAllRows}
            >
              {formatLabel(labels.selectAllRows, { count: totalCount })}
            </Button>
          )}

        <Button
          variant="ghost"
          color="neutral"
          size="xs"
          onClick={onClearSelection}
        >
          {labels.clearSelection}
        </Button>
      </div>

      {children && (
        <div className="pb:flex pb:flex-wrap pb:items-center pb:gap-2">
          {children}
        </div>
      )}
    </div>
  );
}

export interface TablePaginationProps {
  /** 1-based current page */
  page: number;
  /** Rows per page */
  pageSize: number;
  /** Total number of items across all pages */
  totalItems: number;
  onPageChange: (nextPage: number) => void;
  onPageSizeChange?: (nextPageSize: number) => void;
  pageSizeOptions?: number[];
  labels?: Partial<TableLabels>;
  className?: string;
}

export function TablePagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 25, 50],
  labels: propLabels,
  className,
}: TablePaginationProps) {
  const { labels: contextLabels } = usePeerbotsI18n();
  const labels: TableLabels = {
    ...DEFAULT_TABLE_LABELS,
    ...contextLabels?.table,
    ...propLabels,
  };

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(totalItems, page * pageSize);

  return (
    <div
      className={cn(
        "pb:flex pb:flex-col sm:pb:flex-row sm:pb:items-center sm:pb:justify-between pb:gap-3 pb:px-4 pb:py-3 pb:bg-gray-50/80 pb:border-t pb:border-gray-200 pb:text-xs pb:text-gray-600",
        className,
      )}
    >
      <div className="pb:flex pb:items-center pb:gap-3">
        <span>
          {formatLabel(labels.showingRange, {
            start: startItem,
            end: endItem,
            total: totalItems,
          })}
        </span>
        {onPageSizeChange && (
          <div className="pb:flex pb:items-center pb:gap-1.5">
            <span>{labels.rowsPerPage}</span>
            <div className="pb:w-20">
              <Select
                aria-label={labels.rowsPerPage}
                options={pageSizeOptions.map((n) => ({
                  label: String(n),
                  value: n,
                }))}
                value={pageSize}
                onChange={(val) => {
                  if (val != null) onPageSizeChange(Number(val));
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="pb:flex pb:items-center pb:gap-2">
        <span className="pb:font-medium pb:text-gray-700 pb:me-1">
          {formatLabel(labels.pageOf, { page, totalPages })}
        </span>
        <Button
          size="xs"
          color="neutral"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label={labels.previousPage}
        >
          Prev
        </Button>
        <Button
          size="xs"
          color="neutral"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label={labels.nextPage}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

