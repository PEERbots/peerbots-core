import React, { useMemo } from "react";
import { cn } from "../../utils";
import type { SurfaceVariant, ComponentRadius } from "../../types";
import { Icon } from "../../foundations/Icon";
import {
  DEFAULT_TABLE_LABELS,
  type TableLabels,
  usePeerbotsI18n,
} from "../../../i18n";
import type {
  TableSortDirection,
  TableDensity,
} from "../useTableState";
import {
  type TableRowStatus,
  type TableResponsiveMode,
} from "./types";

/* ============================================================================
 * 2. Semantic Table Primitives (Composable Building Blocks)
 * ========================================================================== */

const surfaceVariantStyles: Record<SurfaceVariant, string> = {
  surface: "pb:bg-white pb:border pb:border-gray-200 pb:shadow-xs",
  outline: "pb:bg-white pb:border-2 pb:border-gray-300",
  glass:
    "pb:bg-white/90 pb:backdrop-blur-xl pb:border pb:border-white/50 pb:shadow-lg",
  flat: "pb:bg-gray-50/60 pb:border pb:border-gray-200",
};

const radiusVariantStyles: Record<ComponentRadius, string> = {
  none: "pb:rounded-none",
  sm: "pb:rounded-md",
  md: "pb:rounded-xl",
  lg: "pb:rounded-2xl",
  "2xl": "pb:rounded-2xl",
  pill: "pb:rounded-3xl",
};

export interface TableContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SurfaceVariant;
  radius?: ComponentRadius;
  maxHeight?: string | number;
  ariaLabel?: string;
  ariaLabelledBy?: string;
}

export const TableContainer = React.forwardRef<
  HTMLDivElement,
  TableContainerProps
>(
  (
    {
      children,
      className,
      variant = "surface",
      radius = "xl" as ComponentRadius,
      maxHeight,
      ariaLabel,
      ariaLabelledBy,
      style,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        tabIndex={0}
        role="region"
        aria-label={ariaLabel || (!ariaLabelledBy ? "Data table" : undefined)}
        aria-labelledby={ariaLabelledBy}
        style={{
          ...(maxHeight
            ? {
                maxBlockSize:
                  typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight,
              }
            : undefined),
          ...style,
        }}
        className={cn(
          "pb-table-wrapper pb:w-full pb:focus-visible:outline-2 pb:focus-visible:outline-offset-2 pb:focus-visible:outline-peerbots-teal",
          surfaceVariantStyles[variant] || surfaceVariantStyles.surface,
          radiusVariantStyles[radius] || radiusVariantStyles.lg,
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
TableContainer.displayName = "TableContainer";

export interface TableRootProps
  extends React.TableHTMLAttributes<HTMLTableElement> {
  stickyHeader?: boolean;
  stickyRowHeader?: boolean;
  responsiveMode?: TableResponsiveMode;
  columnLabels?: string[];
}

export const TableRoot = React.forwardRef<HTMLTableElement, TableRootProps>(
  (
    {
      children,
      className,
      stickyHeader = true,
      stickyRowHeader = true,
      responsiveMode = "stack",
      columnLabels,
      style,
      ...props
    },
    ref,
  ) => {
    const labelVars = useMemo(() => {
      if (!columnLabels) return {};
      const vars: Record<string, string> = {};
      columnLabels.forEach((label, i) => {
        const escaped = label.replace(/"/g, '\\"');
        vars[`--label-${i + 1}`] = `"${escaped}"`;
      });
      return vars;
    }, [columnLabels]);

    return (
      <table
        ref={ref}
        style={{ ...labelVars, ...style } as React.CSSProperties}
        className={cn(
          "pb-table pb:w-full pb:text-start pb:text-sm pb:text-gray-900",
          stickyHeader && "pb-table-sticky-header",
          stickyRowHeader && "pb-table-sticky-row-header",
          responsiveMode === "stack" && "pb-table-responsive-stack",
          className,
        )}
        {...props}
      >
        {children}
      </table>
    );
  },
);
TableRoot.displayName = "TableRoot";

export interface TableCaptionProps
  extends React.HTMLAttributes<HTMLTableCaptionElement> {
  srOnly?: boolean;
}

export const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  TableCaptionProps
>(({ children, className, srOnly = false, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn(
      srOnly
        ? "pb:sr-only"
        : "pb:px-4 pb:py-3 pb:text-start pb:text-xs pb:font-medium pb:text-gray-500 pb:border-b pb:border-gray-100",
      className,
    )}
    {...props}
  >
    {children}
  </caption>
));
TableCaption.displayName = "TableCaption";

export type TableHeaderProps =
  React.HTMLAttributes<HTMLTableSectionElement>;

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  TableHeaderProps
>(({ children, className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      "pb:bg-gray-50/95 pb:backdrop-blur-xs pb:text-xs pb:font-bold pb:uppercase pb:tracking-wider pb:text-gray-600",
      className,
    )}
    {...props}
  >
    {children}
  </thead>
));
TableHeader.displayName = "TableHeader";

export type TableBodyProps = React.HTMLAttributes<HTMLTableSectionElement>;

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  TableBodyProps
>(({ children, className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("pb:divide-y pb:divide-gray-200 pb:bg-white", className)}
    {...props}
  >
    {children}
  </tbody>
));
TableBody.displayName = "TableBody";

export type TableFooterProps =
  React.HTMLAttributes<HTMLTableSectionElement>;

export const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  TableFooterProps
>(({ children, className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "pb:bg-gray-50 pb:font-medium pb:text-gray-900 pb:border-t pb:border-gray-200",
      className,
    )}
    {...props}
  >
    {children}
  </tfoot>
));
TableFooter.displayName = "TableFooter";

export interface TableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean;
  status?: TableRowStatus;
  disabled?: boolean;
}

const rowStatusClasses: Record<TableRowStatus, string> = {
  default: "pb:bg-white pb:hover:bg-gray-50/80",
  modified: "pb:bg-amber-50/35 pb:hover:bg-amber-50/60",
  error: "pb:bg-red-50/40 pb:hover:bg-red-50/70",
  warning: "pb:bg-amber-50/50 pb:hover:bg-amber-50/80",
  success: "pb:bg-emerald-50/35 pb:hover:bg-emerald-50/60",
};

const rowStatusBgVar: Record<TableRowStatus, string> = {
  default: "#ffffff",
  modified: "#fffbeb",
  error: "#fef2f2",
  warning: "#fffbeb",
  success: "#ecfdf5",
};

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  (
    {
      children,
      className,
      selected = false,
      status = "default",
      disabled = false,
      style,
      ...props
    },
    ref,
  ) => {
    const resolvedBg = selected ? "#f0fdfa" : rowStatusBgVar[status];
    return (
      <tr
        ref={ref}
        aria-selected={selected || undefined}
        data-selected={selected ? "" : undefined}
        data-status={status !== "default" ? status : undefined}
        style={
          {
            "--pb-row-bg": resolvedBg,
            "--pb-row-header-mobile-bg": selected ? "#ccfbf1" : "#f8fafc",
            ...style,
          } as React.CSSProperties
        }
        className={cn(
          "pb:transition-colors pb:duration-100",
          selected
            ? "pb:bg-primary/10 pb:hover:bg-primary/15"
            : rowStatusClasses[status],
          disabled && !selected && "pb:bg-gray-50/70",
          className,
        )}
        {...props}
      >
        {children}
      </tr>
    );
  },
);
TableRow.displayName = "TableRow";

const densityPaddingMap: Record<
  TableDensity,
  { th: string; td: string }
> = {
  compact: {
    th: "pb:px-3 pb:py-2",
    td: "pb:px-3 pb:py-1.5",
  },
  comfortable: {
    th: "pb:px-4 pb:py-3",
    td: "pb:px-4 pb:py-2.5",
  },
  spacious: {
    th: "pb:px-5 pb:py-4",
    td: "pb:px-5 pb:py-4",
  },
};

export interface TableHeadProps
  extends Omit<React.ThHTMLAttributes<HTMLTableCellElement>, "align"> {
  align?: "start" | "center" | "end";
  density?: TableDensity;
  sortable?: boolean;
  sortDirection?: TableSortDirection;
  onSort?: () => void;
  tooltip?: string;
  headerAction?: React.ReactNode;
}

export const TableHead = React.forwardRef<
  HTMLTableCellElement,
  TableHeadProps
>(
  (
    {
      children,
      className,
      align = "start",
      density = "comfortable",
      sortable = false,
      sortDirection = null,
      onSort,
      tooltip,
      headerAction,
      scope = "col",
      ...props
    },
    ref,
  ) => {
    const ariaSort = sortable
      ? sortDirection === "asc"
        ? "ascending"
        : sortDirection === "desc"
          ? "descending"
          : "none"
      : undefined;

    return (
      <th
        ref={ref}
        scope={scope}
        aria-sort={ariaSort}
        className={cn(
          "pb:border-b pb:border-gray-200 pb:font-bold pb:text-gray-700 pb:select-none pb:align-middle",
          densityPaddingMap[density].th,
          align === "center" && "pb:text-center",
          align === "end" && "pb:text-end",
          align === "start" && "pb:text-start",
          className,
        )}
        {...props}
      >
        <div
          className={cn(
            "pb:flex pb:items-center pb:gap-1.5 pb:flex-nowrap",
            align === "center" && "pb:justify-center",
            align === "end" && "pb:justify-end",
            align === "start" && "pb:justify-between",
          )}
        >
          <div className="pb:flex pb:items-center pb:gap-1 pb:min-w-0">
            {sortable ? (
              <button
                type="button"
                onClick={onSort}
                className="pb:inline-flex pb:items-center pb:gap-1 pb:font-bold pb:uppercase pb:tracking-wider pb:text-gray-700 pb:hover:text-peerbots-darkteal pb:cursor-pointer pb:rounded pb:px-1 pb:-ms-1 pb:py-0.5 pb:transition-colors pb:focus-visible:outline-2 pb:focus-visible:outline-offset-2 pb:focus-visible:outline-peerbots-teal pb:whitespace-nowrap"
              >
                <span>{children}</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "pb:inline-flex pb:items-center pb:shrink-0",
                    sortDirection
                      ? "pb:text-peerbots-darkteal"
                      : "pb:text-gray-400",
                  )}
                >
                  {sortDirection === "asc" ? (
                    <Icon name="chevronUpTable" size="sm" className="pb:w-3.5 pb:h-3.5" />
                  ) : sortDirection === "desc" ? (
                    <Icon name="chevronDownTable" size="sm" className="pb:w-3.5 pb:h-3.5" />
                  ) : (
                    <Icon name="arrowsUpDown" size="sm" className="pb:w-3.5 pb:h-3.5" />
                  )}
                </span>
              </button>
            ) : (
              <span className="pb:whitespace-nowrap">{children}</span>
            )}

            {tooltip && (
              <span className="pb:relative pb:inline-flex pb:items-center">
                <button
                  type="button"
                  aria-label={tooltip}
                  className="pb-has-tooltip pb:inline-flex pb:items-center pb:text-gray-500 pb:hover:text-gray-700 pb:cursor-help pb:bg-transparent pb:border-0 pb:p-0 pb:rounded-full pb:focus-visible:outline-2 pb:focus-visible:outline-offset-1 pb:focus-visible:outline-peerbots-teal"
                >
                  <Icon name="questionMarkCircle" size="sm" className="pb:w-3.5 pb:h-3.5" />
                </button>
                <span
                  role="tooltip"
                  className="pb-tooltip pb:bottom-full pb:start-1/2 pb:-translate-x-1/2 pb:mb-1.5 pb:px-2.5 pb:py-1 pb:rounded-md pb:bg-gray-900 pb:text-white pb:text-[11px] pb:font-normal pb:normal-case pb:tracking-normal pb:whitespace-nowrap pb:shadow-md"
                >
                  {tooltip}
                </span>
              </span>
            )}
          </div>

          {headerAction && (
            <div className="pb:flex pb:items-center pb:shrink-0">
              {headerAction}
            </div>
          )}
        </div>
      </th>
    );
  },
);
TableHead.displayName = "TableHead";

export interface TableRowHeaderProps
  extends Omit<React.ThHTMLAttributes<HTMLTableCellElement>, "align"> {
  align?: "start" | "center" | "end";
  density?: TableDensity;
  modified?: boolean;
  modifiedLabel?: string;
}

/**
 * Semantic `<th scope="row">` cell inside `<tbody>`.
 * Remains sticky horizontally on desktop scroll and becomes the sticky card header on mobile.
 */
export const TableRowHeader = React.forwardRef<
  HTMLTableCellElement,
  TableRowHeaderProps
>(
  (
    {
      children,
      className,
      align = "start",
      density = "comfortable",
      modified = false,
      modifiedLabel = "Modified",
      ...props
    },
    ref,
  ) => (
    <th
      ref={ref}
      scope="row"
      className={cn(
        "pb:font-semibold pb:text-gray-900 pb:align-middle pb:border-b pb:border-gray-100",
        densityPaddingMap[density].td,
        align === "center" && "pb:text-center",
        align === "end" && "pb:text-end",
        align === "start" && "pb:text-start",
        className,
      )}
      {...props}
    >
      <div className="pb:flex pb:items-center pb:gap-2">
        {modified && (
          <span
            title={modifiedLabel}
            aria-label={modifiedLabel}
            className="pb:w-2 pb:h-2 pb:rounded-full pb:bg-peerbots-teal pb:shrink-0"
          />
        )}
        <div className="pb:min-w-0 pb:flex-1">{children}</div>
      </div>
    </th>
  ),
);
TableRowHeader.displayName = "TableRowHeader";

export interface TableCellProps
  extends Omit<React.TdHTMLAttributes<HTMLTableCellElement>, "align"> {
  align?: "start" | "center" | "end";
  density?: TableDensity;
  /** Whether this cell has a corresponding column label in responsive stacked view */
  hasLabel?: boolean;
  /** Whether this cell's value has been modified relative to baseline */
  modified?: boolean;
  modifiedLabel?: string;
  /** Optional cell-level action (such as "Copy value to column") */
  cellAction?: React.ReactNode;
}

export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  TableCellProps
>(
  (
    {
      children,
      className,
      align = "start",
      density = "comfortable",
      hasLabel = true,
      modified = false,
      modifiedLabel = "Modified",
      cellAction,
      ...props
    },
    ref,
  ) => (
    <td
      ref={ref}
      data-has-label={hasLabel ? "true" : undefined}
      className={cn(
        "pb:align-middle pb:text-gray-800 pb:border-b pb:border-gray-100 pb:group/cell",
        densityPaddingMap[density].td,
        align === "center" && "pb:text-center",
        align === "end" && "pb:text-end",
        align === "start" && "pb:text-start",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "pb:flex pb:items-center pb:gap-1.5",
          align === "center" && "pb:justify-center",
          align === "end" && "pb:justify-end",
        )}
      >
        {modified && (
          <span
            title={modifiedLabel}
            aria-label={modifiedLabel}
            className="pb:w-1.5 pb:h-1.5 pb:rounded-full pb:bg-peerbots-teal pb:shrink-0"
          />
        )}
        <div className="pb:min-w-0 pb:flex-1">{children}</div>
        {cellAction && (
          <div className="pb:shrink-0 pb:opacity-80 group-hover/cell:pb:opacity-100 focus-within:pb:opacity-100 pb:transition-opacity">
            {cellAction}
          </div>
        )}
      </div>
    </td>
  ),
);
TableCell.displayName = "TableCell";

