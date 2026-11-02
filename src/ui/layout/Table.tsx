import React, { useState, useRef, useId, useMemo } from "react";
import { cn } from "../utils";
import { SurfaceVariant, ComponentRadius } from "../types";
import { Checkbox } from "../forms/Checkbox";
import { Button } from "../forms/Button";
import { Field, FieldProps } from "../forms/Field";
import { Input } from "../forms/Input";
import { Select, SelectOption } from "../forms/Select";
import { NumberField } from "../forms/NumberField";
import { Switch } from "../forms/Switch";
import { Icon } from "../foundations/Icon";
import { Text } from "../foundations/Typography";
import { Popover } from "../feedback/Popover";
import { EmptyState } from "../feedback/EmptyState";
import { Skeleton } from "../feedback/Skeleton";
import { SearchInput } from "../patterns/SearchInput";
import {
  DEFAULT_TABLE_LABELS,
  TableLabels,
  usePeerbotsI18n,
} from "../../i18n";
import {
  TableSortDirection,
  TableDensity,
  TableApplyScope,
  TableSelectionChangeDetails,
} from "./useTableState";

export type TableRowStatus =
  | "default"
  | "modified"
  | "error"
  | "warning"
  | "success";

export type TableResponsiveMode = "stack" | "scroll";
export type TableFieldVariant = "ghost" | "compact" | "default";

const TableFieldVariantContext =
  React.createContext<TableFieldVariant>("compact");

const formatLabel = (
  template: string,
  vars: Record<string, string | number>,
): string => {
  let out = template;
  for (const [k, v] of Object.entries(vars)) {
    out = out.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
  }
  return out;
};

/* ============================================================================
 * 1. Column & Apply-All Configuration Types
 * ========================================================================== */

export interface TableColumnApplyAllTarget<T> {
  scope: TableApplyScope;
  rowIds: string[];
  rows: T[];
}

export interface TableColumnApplyAllRenderProps<V = any> {
  value: V;
  onChange: (nextValue: V) => void;
  apply: (overrideValue?: V) => void;
  close: () => void;
}

export interface TableColumnApplyAll<T = any, V = any> {
  /** Controlled current value in the Apply All control */
  value?: V;
  /** Initial value for the Apply All control */
  defaultValue?: V;
  /**
   * Callback fired when the user confirms applying a value to the column.
   * State management is handled externally by the consuming tool.
   */
  onApply: (value: V, target: TableColumnApplyAllTarget<T>) => void;
  /**
   * Custom renderer for the Field / control inside the Apply All popover.
   */
  renderControl?: (props: TableColumnApplyAllRenderProps<V>) => React.ReactNode;
  /**
   * Shorthand options for a `<Select>` Field inside the Apply All popover.
   */
  options?: (string | SelectOption)[];
  /**
   * Shorthand control type when `renderControl` is omitted.
   * @default "select" if `options` is provided, otherwise "text"
   */
  controlType?: "select" | "text" | "number" | "boolean";
  /** Optional Field label inside the popover */
  label?: string;
  /** Optional placeholder for text/select input */
  placeholder?: string;
  /** Optional trigger button text override */
  buttonLabel?: string;
}

export interface TableCellRenderContext<T> {
  row: T;
  rowId: string;
  rowIndex: number;
  columnId: string;
  isSelected: boolean;
  isModified: boolean;
  error?: string;
  /** Triggers the column's applyAll or onCopyCellToColumn with the given value */
  applyValueToColumn: (value: any) => void;
}

export interface TableHeaderRenderContext<T> {
  column: TableColumn<T>;
  sortDirection: TableSortDirection;
  selectedCount: number;
  totalCount: number;
}

export interface TableColumn<T, V = any> {
  /** Unique column identifier */
  id: string;
  /** Optional property key on `T` to read cell values from (defaults to `id`) */
  accessorKey?: keyof T & string;
  /** Column header display text or custom render function */
  header:
    | string
    | React.ReactNode
    | ((context: TableHeaderRenderContext<T>) => React.ReactNode);
  /**
   * Accessible plain-text label for responsive mobile card injection (`--label-N`)
   * and screen readers when `header` is a complex ReactNode.
   */
  headerLabel?: string;
  /** Optional tooltip shown in the column header */
  tooltip?: string;
  /**
   * Whether this column represents the primary row identifier (`<th scope="row">`).
   * Row headers stay sticky horizontally on scroll and become the card header in mobile stacked layout.
   */
  isRowHeader?: boolean;
  /** Whether this column can be sorted */
  sortable?: boolean;
  /** Horizontal alignment of header and cells */
  align?: "start" | "center" | "end";
  /** Optional CSS width (e.g. `"180px"`, `"25%"`) */
  width?: string | number;
  /** Optional CSS min-width (e.g. `"140px"`) */
  minWidth?: string | number;
  /**
   * Custom cell renderer (ideal for rendering `<Field>` or `<TableCellField>` components).
   */
  cell?: (context: TableCellRenderContext<T>) => React.ReactNode;
  /**
   * Configuration for the header "Apply All to Column" action/popover.
   */
  applyAll?: TableColumnApplyAll<T, V>;
  /**
   * Whether to show a quick "Apply this cell's value to column" button inside each cell
   * when `applyAll` or `onCopyCellToColumn` is configured.
   */
  showCellCopyAction?: boolean;
  /**
   * Callback when the user clicks the cell-level "Apply this value to column" button.
   * Falls back to `applyAll.onApply` if omitted.
   */
  onCopyCellToColumn?: (
    value: V,
    sourceRow: T,
    target: TableColumnApplyAllTarget<T>,
  ) => void;
  /** Additional className applied to `<th>` and `<td>` in this column */
  className?: string;
  /** Additional className applied only to `<th>` in this column */
  headerClassName?: string;
  /** Additional className applied only to `<td>` in this column */
  cellClassName?: string;
}

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

/* ============================================================================
 * 3. TableCellField & Column Apply-All Components
 * ========================================================================== */

export interface TableCellFieldProps extends FieldProps {
  /**
   * Visually hides the `<Field>` label inside the cell because the column header
   * already displays the label, while keeping the accessible label for screen readers.
   * @default true
   */
  srOnlyLabel?: boolean;
  /**
   * Visual treatment for the embedded form control inside the table cell:
   * - `"ghost"`: Borderless/transparent until hovered or focused (spreadsheet/inline-edit style).
   * - `"compact"`: Compact 28px height with subtle white surface and thin border.
   * - `"default"`: Standard full-sized form field.
   * Defaults to the parent `<Table fieldVariant={...}>` setting (`"compact"`).
   */
  cellVariant?: TableFieldVariant;
  /**
   * Optional maximum width for the field inside the cell (e.g. `"160px"`, `"12rem"`)
   * so dropdowns or short inputs don't stretch across wide columns.
   */
  maxWidth?: string | number;
}

/**
 * A specialized wrapper around `<Field>` optimized for embedding inside table cells.
 * Automatically injects compact sizing (`size="sm"`) and cell styling (`variant="compact" | "ghost"`)
 * into child `<Input>`, `<Select>`, or `<NumberField>` elements so controls don't bloat table rows.
 */
export const TableCellField = React.forwardRef<
  HTMLDivElement,
  TableCellFieldProps
>(
  (
    {
      srOnlyLabel = true,
      cellVariant,
      maxWidth,
      style,
      className,
      label,
      children,
      ...props
    },
    ref,
  ) => {
    const contextVariant = React.useContext(TableFieldVariantContext);
    const resolvedVariant = cellVariant ?? contextVariant;

    const enhancedChildren = React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) return child;
      const childProps = child.props as Record<string, unknown>;
      const injected: Record<string, unknown> = {};
      if (childProps.size === undefined && resolvedVariant !== "default") {
        injected.size = "sm";
      }
      if (childProps.variant === undefined && resolvedVariant !== "default") {
        injected.variant = resolvedVariant;
      }
      if (Object.keys(injected).length === 0) return child;
      return React.cloneElement(child, injected);
    });

    return (
      <Field
        ref={ref}
        label={label}
        style={{
          ...(maxWidth ? { maxWidth } : undefined),
          ...style,
        }}
        className={cn(
          "pb:gap-0.5",
          srOnlyLabel && "[&_label]:pb:sr-only",
          className,
        )}
        {...props}
      >
        {enhancedChildren}
      </Field>
    );
  },
);
TableCellField.displayName = "TableCellField";

export interface TableCopyToColumnButtonProps {
  onClick: () => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Compact action button for copying a single cell's value across the entire column
 * (or selected rows).
 */
export function TableCopyToColumnButton({
  onClick,
  label = DEFAULT_TABLE_LABELS.copyCellToColumn,
  disabled = false,
  className,
}: TableCopyToColumnButtonProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={cn(
        "pb:inline-flex pb:items-center pb:justify-center pb:p-1 pb:rounded-md pb:text-gray-400 pb:hover:text-peerbots-darkteal pb:hover:bg-primary/15 pb:transition-colors pb:cursor-pointer pb:focus-visible:outline-2 pb:focus-visible:outline-offset-1 pb:focus-visible:outline-peerbots-teal pb:disabled:opacity-40 pb:disabled:cursor-not-allowed",
        className,
      )}
    >
      <Icon name="arrowDownToLine" size="sm" className="pb:w-3.5 pb:h-3.5" />
    </button>
  );
}

export interface TableColumnApplyAllPopoverProps<T = any, V = any> {
  columnTitle: string;
  config: TableColumnApplyAll<T, V>;
  allRows: T[];
  allRowIds: string[];
  selectedRows: T[];
  selectedRowIds: string[];
  labels?: Partial<TableLabels>;
}

/**
 * Interactive popover anchored to a column header that allows users to set a value
 * using a `<Field>` component and apply it to all rows or selected rows in that column.
 */
export function TableColumnApplyAllPopover<T = any, V = any>({
  columnTitle,
  config,
  allRows,
  allRowIds,
  selectedRows,
  selectedRowIds,
  labels: propLabels,
}: TableColumnApplyAllPopoverProps<T, V>) {
  const { labels: contextLabels } = usePeerbotsI18n();
  const labels: TableLabels = {
    ...DEFAULT_TABLE_LABELS,
    ...contextLabels?.table,
    ...propLabels,
  };

  const [open, setOpen] = useState(false);

  const initialVal = useMemo(() => {
    if (config.value !== undefined) return config.value;
    if (config.defaultValue !== undefined) return config.defaultValue;
    if (config.options && config.options.length > 0) {
      const first = config.options[0];
      return (typeof first === "object" ? first.value : first) as unknown as V;
    }
    if (config.controlType === "boolean") return false as unknown as V;
    if (config.controlType === "number") return 0 as unknown as V;
    return "" as unknown as V;
  }, [config.value, config.defaultValue, config.options, config.controlType]);

  const [draftValue, setDraftValue] = useState<V>(initialVal);
  const currentValue = config.value !== undefined ? config.value : draftValue;

  const hasSelection = selectedRowIds.length > 0;
  const [scope, setScope] = useState<TableApplyScope>(
    hasSelection ? "selected" : "all",
  );

  // Sync default scope when selection presence changes
  const effectiveScope: TableApplyScope =
    hasSelection && scope === "selected" ? "selected" : "all";

  const handleApply = (overrideValue?: V) => {
    const valToApply =
      overrideValue !== undefined ? overrideValue : currentValue;
    const target: TableColumnApplyAllTarget<T> =
      effectiveScope === "selected"
        ? {
            scope: "selected",
            rowIds: selectedRowIds,
            rows: selectedRows,
          }
        : {
            scope: "all",
            rowIds: allRowIds,
            rows: allRows,
          };

    config.onApply(valToApply, target);
    setOpen(false);
  };

  const resolvedControlType =
    config.controlType || (config.options ? "select" : "text");

  const triggerLabel = config.buttonLabel || labels.applyAll;

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) {
          setScope(selectedRowIds.length > 0 ? "selected" : "all");
        }
        setOpen(nextOpen);
      }}
      title={`${labels.applyAll}: ${columnTitle}`}
      align="end"
      trigger={
        <button
          type="button"
          title={`${triggerLabel}: ${columnTitle}`}
          aria-label={`${triggerLabel} (${columnTitle})`}
          className="pb:inline-flex pb:items-center pb:gap-0.5 pb:px-1.5 pb:py-0.5 pb:rounded-md pb:text-[10px] pb:leading-tight pb:font-bold pb:normal-case pb:tracking-normal pb:whitespace-nowrap pb:bg-peerbots-teal/15 pb:text-teal-950 pb:hover:bg-peerbots-teal/25 pb:transition-colors pb:cursor-pointer pb:focus-visible:outline-2 pb:focus-visible:outline-offset-2 pb:focus-visible:outline-peerbots-teal"
        >
          <Icon name="arrowDownToLine" size="sm" className="pb:w-3 pb:h-3" />
          <span>{triggerLabel}</span>
        </button>
      }
    >
      <div className="pb:flex pb:flex-col pb:gap-3.5 pb:min-w-[230px]">
        {hasSelection ? (
          <div
            role="radiogroup"
            aria-label="Target rows"
            className="pb:grid pb:grid-cols-2 pb:gap-1 pb:p-1 pb:rounded-lg pb:bg-gray-100 pb:text-xs"
          >
            <button
              type="button"
              role="radio"
              aria-checked={effectiveScope === "selected"}
              onClick={() => setScope("selected")}
              className={cn(
                "pb:py-1 pb:px-2 pb:rounded-md pb:font-medium pb:transition-all pb:cursor-pointer",
                effectiveScope === "selected"
                  ? "pb:bg-white pb:text-gray-900 pb:shadow-xs pb:font-bold"
                  : "pb:text-gray-600 pb:hover:text-gray-900",
              )}
            >
              {formatLabel(labels.applyToSelectedRows, {
                count: selectedRowIds.length,
              })}
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={effectiveScope === "all"}
              onClick={() => setScope("all")}
              className={cn(
                "pb:py-1 pb:px-2 pb:rounded-md pb:font-medium pb:transition-all pb:cursor-pointer",
                effectiveScope === "all"
                  ? "pb:bg-white pb:text-gray-900 pb:shadow-xs pb:font-bold"
                  : "pb:text-gray-600 pb:hover:text-gray-900",
              )}
            >
              {formatLabel(labels.applyToAllRows, {
                count: allRowIds.length,
              })}
            </button>
          </div>
        ) : (
          <div className="pb:text-xs pb:text-gray-500 pb:bg-gray-50 pb:px-2.5 pb:py-1.5 pb:rounded-lg pb:border pb:border-gray-100">
            {formatLabel(labels.applyToAllRows, { count: allRowIds.length })}
          </div>
        )}

        <div>
          {config.renderControl ? (
            config.renderControl({
              value: currentValue,
              onChange: setDraftValue,
              apply: handleApply,
              close: () => setOpen(false),
            })
          ) : resolvedControlType === "select" && config.options ? (
            <Field label={config.label || columnTitle}>
              <Select
                options={config.options}
                value={currentValue as unknown as string | number}
                onChange={(val) => setDraftValue(val as unknown as V)}
                placeholder={config.placeholder}
              />
            </Field>
          ) : resolvedControlType === "number" ? (
            <Field label={config.label || columnTitle}>
              <NumberField
                value={Number(currentValue ?? 0)}
                onChange={(val) => setDraftValue(val as unknown as V)}
                showButtons
              />
            </Field>
          ) : resolvedControlType === "boolean" ? (
            <Field
              label={config.label || columnTitle}
              labelPlacement="end"
              labelWeight="normal"
            >
              <Switch
                checked={Boolean(currentValue)}
                onChange={(val: boolean) => setDraftValue(val as unknown as V)}
              />
            </Field>
          ) : (
            <Field label={config.label || columnTitle}>
              <Input
                value={String(currentValue ?? "")}
                onChange={(e) => setDraftValue(e.target.value as unknown as V)}
                placeholder={config.placeholder}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleApply();
                  }
                }}
              />
            </Field>
          )}
        </div>

        <div className="pb:flex pb:items-center pb:justify-end pb:gap-2 pb:pt-1">
          <Button
            size="xs"
            color="neutral"
            onClick={() => setOpen(false)}
          >
            {labels.cancel}
          </Button>
          <Button
            size="xs"
            color="primary"
            onClick={() => handleApply()}
          >
            {labels.apply}
          </Button>
        </div>
      </div>
    </Popover>
  );
}

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

/* ============================================================================
 * 5. Declarative Data-Driven Table / DataTable Component
 * ========================================================================== */

export interface DataTableProps<T = any> {
  /** Column definitions */
  columns: TableColumn<T, any>[];
  /** Row data array (controlled externally) */
  data: T[];
  /** Extracts a unique string ID for each row (defaults to `row.id ?? String(index)`) */
  getRowId?: (row: T, index: number) => string;
  /** Accessible caption or title for the table */
  caption?: React.ReactNode;
  /** Visually hide the caption while keeping it accessible to screen readers */
  hideCaption?: boolean;
  /** Accessible label for the scrollable table region */
  ariaLabel?: string;

  /* --- Row Selection (Controlled) --- */
  /** Enables checkbox row selection */
  selectable?: boolean;
  /** Controlled array or Set of selected row IDs */
  selectedRowIds?: ReadonlyArray<string> | Set<string>;
  /** Unified selection change handler */
  onSelectionChange?: (
    selectedIds: string[],
    details: TableSelectionChangeDetails,
  ) => void;
  /** Optional individual row selection callback */
  onSelectRow?: (
    rowId: string,
    checked: boolean,
    event?: React.SyntheticEvent,
  ) => void;
  /** Optional select-all callback */
  onSelectAllRows?: (checked: boolean, selectableRowIds: string[]) => void;
  /** Optional predicate to disable selection on specific rows */
  isRowSelectable?: (row: T, index: number) => boolean;

  /* --- Sorting (Controlled) --- */
  /** Currently sorted column ID */
  sortColumn?: string | null;
  /** Current sort direction */
  sortDirection?: TableSortDirection;
  /** Callback fired when a sortable column header is clicked */
  onSortChange?: (columnId: string, direction: TableSortDirection) => void;

  /* --- Row & Cell Status / Validation (Controlled) --- */
  /** Returns semantic row status (`"default" | "modified" | "error" | "warning" | "success"`) */
  getRowStatus?: (row: T, index: number) => TableRowStatus;
  /** Set or array of row IDs that have unsaved edits */
  dirtyRowIds?: ReadonlyArray<string> | Set<string>;
  /** Set or array of row IDs that have validation errors */
  errorRowIds?: ReadonlyArray<string> | Set<string>;
  /** Predicate indicating whether a specific cell has been modified */
  isCellModified?: (row: T, columnId: string) => boolean;
  /** Returns validation error string for a specific cell */
  getCellError?: (row: T, columnId: string) => string | undefined;

  /* --- Expandable Rows (Controlled) --- */
  /** Controlled expanded row IDs */
  expandedRowIds?: ReadonlyArray<string> | Set<string>;
  /** Callback when row expansion toggles */
  onExpandChange?: (expandedIds: string[]) => void;
  /** Renders the expanded detail panel below a row */
  renderExpandedRow?: (row: T, index: number) => React.ReactNode;

  /* --- Layout, Responsiveness & Appearance --- */
  /**
   * Responsive behavior on narrow containers (`@container (width < 600px)`):
   * - `"stack"`: Transforms rows into accessible cards with injected column labels and sticky row headers.
   * - `"scroll"`: Preserves horizontal scrolling with sticky headers.
   * @default "stack"
   */
  responsiveMode?: TableResponsiveMode;
  /** Keep `<thead>` sticky during vertical scroll (@default true) */
  stickyHeader?: boolean;
  /** Keep `<th scope="row">` sticky during horizontal scroll (@default true) */
  stickyRowHeader?: boolean;
  /** Row padding density (@default "comfortable") */
  density?: TableDensity;
  /**
   * Default visual treatment for `<TableCellField>` controls inside cells:
   * - `"compact"` (default): Sleek 28px height with subtle white surface and 1px border.
   * - `"ghost"`: Borderless/transparent until hovered or focused (spreadsheet/inline-edit style).
   * - `"default"`: Full-size form field appearance.
   * @default "compact"
   */
  fieldVariant?: TableFieldVariant;
  /** Container surface style (@default "surface") */
  variant?: SurfaceVariant;
  /** Container border radius (@default "lg") */
  radius?: ComponentRadius;
  /** Optional maximum height for vertical scrolling (e.g. `"480px"` or `500`) */
  maxHeight?: string | number;

  /* --- Loading & Empty States --- */
  /** Whether the table is loading data */
  isLoading?: boolean;
  /** Number of skeleton rows to render when `isLoading` is true (@default 4) */
  loadingRowCount?: number;
  /** Custom empty state node when `data.length === 0` */
  emptyState?: React.ReactNode;
  emptyTitle?: React.ReactNode;
  emptyDescription?: React.ReactNode;

  /* --- Optional Integrated Slots --- */
  /** Optional toolbar rendered at the top of the table container */
  toolbar?: React.ReactNode;
  /** Optional bulk actions rendered inside the `TableBulkActionBar` when rows are selected */
  bulkActions?: React.ReactNode;
  /** Whether to show the built-in `TableBulkActionBar` when rows are selected (@default true) */
  showBulkActionBar?: boolean;
  /** Optional pagination footer rendered at the bottom of the table container */
  pagination?: React.ReactNode;

  /* --- i18n & Styling --- */
  labels?: Partial<TableLabels>;
  className?: string;
  tableClassName?: string;
}

const defaultGetRowId = <T,>(row: T, index: number): string => {
  if (row && typeof row === "object" && "id" in row && row.id != null) {
    return String((row as Record<string, unknown>).id);
  }
  return String(index);
};

const toSet = (
  input?: ReadonlyArray<string> | Set<string>,
): Set<string> => {
  if (!input) return new Set();
  if (input instanceof Set) return input;
  return new Set(input);
};

export function DataTable<T = any>({
  columns,
  data,
  getRowId = defaultGetRowId,
  caption,
  hideCaption = false,
  ariaLabel,
  selectable = false,
  selectedRowIds,
  onSelectionChange,
  onSelectRow,
  onSelectAllRows,
  isRowSelectable,
  sortColumn = null,
  sortDirection = null,
  onSortChange,
  getRowStatus,
  dirtyRowIds,
  errorRowIds,
  isCellModified,
  getCellError,
  expandedRowIds,
  onExpandChange,
  renderExpandedRow,
  responsiveMode = "stack",
  stickyHeader = true,
  stickyRowHeader = true,
  density = "comfortable",
  fieldVariant = "compact",
  variant = "surface",
  radius = "lg",
  maxHeight,
  isLoading = false,
  loadingRowCount = 4,
  emptyState,
  emptyTitle,
  emptyDescription,
  toolbar,
  bulkActions,
  showBulkActionBar = true,
  pagination,
  labels: propLabels,
  className,
  tableClassName,
}: DataTableProps<T>) {
  const { labels: contextLabels } = usePeerbotsI18n();
  const labels: TableLabels = {
    ...DEFAULT_TABLE_LABELS,
    ...contextLabels?.table,
    ...propLabels,
  };

  const captionId = useId();
  const lastClickedRowIndexRef = useRef<number | null>(null);

  const selectedSet = useMemo(
    () => toSet(selectedRowIds),
    [selectedRowIds],
  );
  const dirtySet = useMemo(() => toSet(dirtyRowIds), [dirtyRowIds]);
  const errorSet = useMemo(() => toSet(errorRowIds), [errorRowIds]);
  const expandedSet = useMemo(
    () => toSet(expandedRowIds),
    [expandedRowIds],
  );

  const allRowsWithIds = useMemo(
    () =>
      data.map((row, index) => ({
        row,
        index,
        id: getRowId(row, index),
        selectable: isRowSelectable ? isRowSelectable(row, index) : true,
      })),
    [data, getRowId, isRowSelectable],
  );

  const selectableEntries = useMemo(
    () => allRowsWithIds.filter((entry) => entry.selectable),
    [allRowsWithIds],
  );

  const selectableRowIds = useMemo(
    () => selectableEntries.map((entry) => entry.id),
    [selectableEntries],
  );

  const selectedRows = useMemo(
    () =>
      allRowsWithIds
        .filter((entry) => selectedSet.has(entry.id))
        .map((entry) => entry.row),
    [allRowsWithIds, selectedSet],
  );

  const selectedInViewCount = useMemo(
    () =>
      selectableEntries.filter((entry) => selectedSet.has(entry.id)).length,
    [selectableEntries, selectedSet],
  );

  const allSelected =
    selectableEntries.length > 0 &&
    selectedInViewCount === selectableEntries.length;
  const someSelected =
    !allSelected && selectedInViewCount > 0;

  const handleToggleAll = (checked: boolean) => {
    const nextSelected = new Set(selectedSet);
    if (checked) {
      selectableRowIds.forEach((id) => nextSelected.add(id));
    } else {
      selectableRowIds.forEach((id) => nextSelected.delete(id));
    }
    const nextArray = Array.from(nextSelected);
    onSelectAllRows?.(checked, selectableRowIds);
    onSelectionChange?.(nextArray, {
      type: "all",
      checked,
    });
  };

  const handleToggleRow = (
    rowId: string,
    rowIndex: number,
    checked: boolean,
    event?: React.MouseEvent | React.ChangeEvent<HTMLInputElement>,
  ) => {
    const isShift =
      event && "shiftKey" in event && Boolean(event.shiftKey);

    if (
      isShift &&
      lastClickedRowIndexRef.current !== null &&
      lastClickedRowIndexRef.current !== rowIndex
    ) {
      const start = Math.min(lastClickedRowIndexRef.current, rowIndex);
      const end = Math.max(lastClickedRowIndexRef.current, rowIndex);
      const nextSelected = new Set(selectedSet);
      for (let i = start; i <= end; i++) {
        const entry = allRowsWithIds[i];
        if (entry && entry.selectable) {
          if (checked) {
            nextSelected.add(entry.id);
          } else {
            nextSelected.delete(entry.id);
          }
        }
      }
      lastClickedRowIndexRef.current = rowIndex;
      const nextArray = Array.from(nextSelected);
      onSelectRow?.(rowId, checked, event);
      onSelectionChange?.(nextArray, {
        type: "range",
        rowId,
        checked,
      });
      return;
    }

    lastClickedRowIndexRef.current = rowIndex;
    const nextSelected = new Set(selectedSet);
    if (checked) {
      nextSelected.add(rowId);
    } else {
      nextSelected.delete(rowId);
    }
    const nextArray = Array.from(nextSelected);
    onSelectRow?.(rowId, checked, event);
    onSelectionChange?.(nextArray, {
      type: "row",
      rowId,
      checked,
    });
  };

  const handleClearSelection = () => {
    onSelectionChange?.([], { type: "clear", checked: false });
  };

  const handleColumnSort = (columnId: string) => {
    if (!onSortChange) return;
    if (sortColumn !== columnId) {
      onSortChange(columnId, "asc");
    } else if (sortDirection === "asc") {
      onSortChange(columnId, "desc");
    } else {
      onSortChange(columnId, null);
    }
  };

  const handleToggleExpand = (rowId: string) => {
    if (!onExpandChange) return;
    const next = new Set(expandedSet);
    if (next.has(rowId)) {
      next.delete(rowId);
    } else {
      next.add(rowId);
    }
    onExpandChange(Array.from(next));
  };

  // Determine which column is the row header (`<th scope="row">`)
  const explicitRowHeaderIndex = columns.findIndex((c) => c.isRowHeader);
  const resolvedRowHeaderColIndex =
    explicitRowHeaderIndex >= 0
      ? explicitRowHeaderIndex
      : stickyRowHeader
        ? 0
        : -1;

  // Compute CSS variable `--label-N` for every rendered column (including selection & expand columns)
  const columnLabels = useMemo(() => {
    const list: string[] = [];
    if (selectable) {
      list.push(labels.selectRow);
    }
    if (renderExpandedRow) {
      list.push(labels.expandRow);
    }
    columns.forEach((col) => {
      if (col.headerLabel) {
        list.push(col.headerLabel);
      } else if (typeof col.header === "string") {
        list.push(col.header);
      } else {
        list.push(col.id);
      }
    });
    return list;
  }, [selectable, renderExpandedRow, columns, labels.selectRow, labels.expandRow]);

  const applyAllColumns = useMemo(
    () => columns.filter((c) => Boolean(c.applyAll)),
    [columns],
  );

  const totalColSpan =
    columns.length + (selectable ? 1 : 0) + (renderExpandedRow ? 1 : 0);

  return (
    <TableFieldVariantContext.Provider value={fieldVariant}>
      <TableContainer
        variant={variant}
        radius={radius}
        maxHeight={maxHeight}
        ariaLabel={ariaLabel}
        ariaLabelledBy={caption ? captionId : undefined}
        className={className}
      >
      {toolbar}

      {showBulkActionBar && selectable && selectedSet.size > 0 && (
        <TableBulkActionBar
          selectedCount={selectedSet.size}
          totalCount={selectableRowIds.length}
          onClearSelection={handleClearSelection}
          onSelectAllRows={
            selectedSet.size < selectableRowIds.length
              ? () => handleToggleAll(true)
              : undefined
          }
          labels={labels}
        >
          {bulkActions}
        </TableBulkActionBar>
      )}

      {/* Mobile Controls Bar: visible only when @container (width < 600px) hides <thead> in stack mode */}
      {responsiveMode === "stack" &&
        (selectable || applyAllColumns.length > 0) && (
          <div
            role="toolbar"
            aria-label={labels.mobileActionsLabel}
            className="pb-table-mobile-controls pb:flex-wrap pb:items-center pb:justify-between pb:gap-2 pb:px-3.5 pb:py-2.5 pb:bg-gray-50 pb:border-b pb:border-gray-200"
          >
            {selectable && (
              <label className="pb:inline-flex pb:items-center pb:gap-2 pb:text-xs pb:font-bold pb:text-gray-700 pb:cursor-pointer">
                <Checkbox
                  aria-label={labels.selectAll}
                  checked={allSelected}
                  indeterminate={someSelected}
                  onCheckedChange={handleToggleAll}
                  disabled={selectableEntries.length === 0}
                />
                <span>{labels.selectAll}</span>
              </label>
            )}

            {applyAllColumns.length > 0 && (
              <div className="pb:flex pb:flex-wrap pb:items-center pb:gap-1.5">
                {applyAllColumns.map((col) => {
                  const colTitle =
                    col.headerLabel ||
                    (typeof col.header === "string" ? col.header : col.id);
                  return (
                    <TableColumnApplyAllPopover
                      key={col.id}
                      columnTitle={colTitle}
                      config={col.applyAll!}
                      allRows={data}
                      allRowIds={allRowsWithIds.map((e) => e.id)}
                      selectedRows={selectedRows}
                      selectedRowIds={Array.from(selectedSet)}
                      labels={labels}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

      <TableRoot
        stickyHeader={stickyHeader}
        stickyRowHeader={stickyRowHeader}
        responsiveMode={responsiveMode}
        columnLabels={columnLabels}
        className={tableClassName}
      >
        {caption && (
          <TableCaption id={captionId} srOnly={hideCaption}>
            {caption}
          </TableCaption>
        )}

        <TableHeader>
          <tr>
            {selectable && (
              <TableHead
                density={density}
                className="pb:w-11 pb:px-3"
                align="center"
              >
                <div className="pb:flex pb:items-center pb:justify-center">
                  <Checkbox
                    aria-label={labels.selectAll}
                    checked={allSelected}
                    indeterminate={someSelected}
                    onCheckedChange={handleToggleAll}
                    disabled={selectableEntries.length === 0}
                  />
                </div>
              </TableHead>
            )}

            {renderExpandedRow && (
              <TableHead
                density={density}
                className="pb:w-10 pb:px-2"
                align="center"
              >
                <span className="pb:sr-only">{labels.expandRow}</span>
              </TableHead>
            )}

            {columns.map((col) => {
              const isSorted = sortColumn === col.id ? sortDirection : null;
              const colTitle =
                col.headerLabel ||
                (typeof col.header === "string" ? col.header : col.id);

              const renderedHeader =
                typeof col.header === "function"
                  ? col.header({
                      column: col,
                      sortDirection: isSorted,
                      selectedCount: selectedSet.size,
                      totalCount: data.length,
                    })
                  : col.header;

              return (
                <TableHead
                  key={col.id}
                  align={col.align}
                  density={density}
                  sortable={col.sortable}
                  sortDirection={isSorted}
                  onSort={
                    col.sortable ? () => handleColumnSort(col.id) : undefined
                  }
                  tooltip={col.tooltip}
                  style={{
                    width: col.width,
                    minWidth: col.minWidth,
                  }}
                  className={cn(col.className, col.headerClassName)}
                  headerAction={
                    col.applyAll ? (
                      <TableColumnApplyAllPopover
                        columnTitle={colTitle}
                        config={col.applyAll}
                        allRows={data}
                        allRowIds={allRowsWithIds.map((e) => e.id)}
                        selectedRows={selectedRows}
                        selectedRowIds={Array.from(selectedSet)}
                        labels={labels}
                      />
                    ) : undefined
                  }
                >
                  {renderedHeader}
                </TableHead>
              );
            })}
          </tr>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            Array.from({ length: loadingRowCount }).map((_, rIdx) => (
              <TableRow key={`skeleton-${rIdx}`}>
                {selectable && (
                  <TableCell
                    density={density}
                    hasLabel={false}
                    align="center"
                  >
                    <Skeleton className="pb:h-5 pb:w-5 pb:mx-auto" />
                  </TableCell>
                )}
                {renderExpandedRow && (
                  <TableCell
                    density={density}
                    hasLabel={false}
                    align="center"
                  >
                    <Skeleton className="pb:h-5 pb:w-5 pb:mx-auto" />
                  </TableCell>
                )}
                {columns.map((col, cIdx) =>
                  cIdx === resolvedRowHeaderColIndex ? (
                    <TableRowHeader key={col.id} density={density}>
                      <Skeleton className="pb:h-5 pb:w-32" />
                    </TableRowHeader>
                  ) : (
                    <TableCell
                      key={col.id}
                      density={density}
                      hasLabel={false}
                    >
                      <Skeleton className="pb:h-5 pb:w-full pb:max-w-[160px]" />
                    </TableCell>
                  ),
                )}
              </TableRow>
            ))
          ) : allRowsWithIds.length === 0 ? (
            <tr>
              <td colSpan={totalColSpan} className="pb:p-6">
                {emptyState || (
                  <EmptyState
                    icon="tableCells"
                    title={emptyTitle || labels.emptyTitle}
                    description={emptyDescription || labels.emptyDescription}
                  />
                )}
              </td>
            </tr>
          ) : (
            allRowsWithIds.map(({ row, index, id, selectable: rowCanSelect }) => {
              const isSelected = selectedSet.has(id);
              const isExpanded = expandedSet.has(id);
              const resolvedStatus: TableRowStatus = getRowStatus
                ? getRowStatus(row, index)
                : errorSet.has(id)
                  ? "error"
                  : dirtySet.has(id)
                    ? "modified"
                    : "default";

              return (
                <React.Fragment key={id}>
                  <TableRow
                    selected={isSelected}
                    status={resolvedStatus}
                    disabled={!rowCanSelect}
                  >
                    {selectable && (
                      <TableCell
                        density={density}
                        hasLabel={false}
                        align="center"
                        className="pb:w-11 pb:px-3"
                      >
                        <div className="pb:flex pb:items-center pb:justify-center">
                          <Checkbox
                            aria-label={`${labels.selectRow} ${id}`}
                            checked={isSelected}
                            disabled={!rowCanSelect}
                            onClick={(e) => {
                              // Capture Shift+click for range selection
                              if (e.shiftKey) {
                                e.preventDefault();
                                handleToggleRow(id, index, !isSelected, e);
                              }
                            }}
                            onCheckedChange={(checked) =>
                              handleToggleRow(id, index, checked)
                            }
                          />
                        </div>
                      </TableCell>
                    )}

                    {renderExpandedRow && (
                      <TableCell
                        density={density}
                        hasLabel={false}
                        align="center"
                        className="pb:w-10 pb:px-2"
                      >
                        <button
                          type="button"
                          aria-expanded={isExpanded}
                          aria-label={
                            isExpanded ? labels.collapseRow : labels.expandRow
                          }
                          onClick={() => handleToggleExpand(id)}
                          className="pb:p-1 pb:rounded-md pb:text-gray-500 pb:hover:text-gray-900 pb:hover:bg-gray-100 pb:transition-transform pb:cursor-pointer"
                        >
                          <Icon
                            name="chevronRight"
                            size="sm"
                            className={cn(
                              "pb:w-3.5 pb:h-3.5 pb:transition-transform pb:duration-150",
                              isExpanded && "pb:rotate-90",
                            )}
                          />
                        </button>
                      </TableCell>
                    )}

                    {columns.map((col, colIdx) => {
                      const key = (col.accessorKey || col.id) as keyof T &
                        string;
                      const rawValue =
                        row && typeof row === "object"
                          ? (row as Record<string, unknown>)[key]
                          : undefined;

                      const cellModified = isCellModified
                        ? isCellModified(row, col.id)
                        : false;
                      const cellError = getCellError
                        ? getCellError(row, col.id)
                        : undefined;

                      const triggerCopyValue = (valToCopy: any) => {
                        const target: TableColumnApplyAllTarget<T> =
                          selectedSet.size > 0
                            ? {
                                scope: "selected",
                                rowIds: Array.from(selectedSet),
                                rows: selectedRows,
                              }
                            : {
                                scope: "all",
                                rowIds: allRowsWithIds.map((e) => e.id),
                                rows: data,
                              };
                        if (col.onCopyCellToColumn) {
                          col.onCopyCellToColumn(valToCopy, row, target);
                        } else if (col.applyAll) {
                          col.applyAll.onApply(valToCopy, target);
                        }
                      };

                      const content = col.cell
                        ? col.cell({
                            row,
                            rowId: id,
                            rowIndex: index,
                            columnId: col.id,
                            isSelected,
                            isModified: cellModified,
                            error: cellError,
                            applyValueToColumn: triggerCopyValue,
                          })
                        : (rawValue as React.ReactNode);

                      const canCopyCell =
                        col.showCellCopyAction &&
                        Boolean(col.onCopyCellToColumn || col.applyAll);

                      const copyBtn = canCopyCell ? (
                        <TableCopyToColumnButton
                          label={labels.copyCellToColumn}
                          onClick={() => triggerCopyValue(rawValue)}
                        />
                      ) : undefined;

                      if (colIdx === resolvedRowHeaderColIndex) {
                        return (
                          <TableRowHeader
                            key={col.id}
                            align={col.align}
                            density={density}
                            modified={cellModified}
                            modifiedLabel={labels.modified}
                            style={{
                              width: col.width,
                              minWidth: col.minWidth,
                            }}
                            className={cn(col.className, col.cellClassName)}
                          >
                            {content}
                          </TableRowHeader>
                        );
                      }

                      return (
                        <TableCell
                          key={col.id}
                          align={col.align}
                          density={density}
                          hasLabel={true}
                          modified={cellModified}
                          modifiedLabel={labels.modified}
                          cellAction={copyBtn}
                          style={{
                            width: col.width,
                            minWidth: col.minWidth,
                          }}
                          className={cn(col.className, col.cellClassName)}
                        >
                          {content}
                        </TableCell>
                      );
                    })}
                  </TableRow>

                  {renderExpandedRow && isExpanded && (
                    <tr className="pb:bg-gray-50/70">
                      <td
                        colSpan={totalColSpan}
                        className="pb:p-4 pb:border-b pb:border-gray-200"
                      >
                        {renderExpandedRow(row, index)}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })
          )}
        </TableBody>
      </TableRoot>

      {pagination}
    </TableContainer>
    </TableFieldVariantContext.Provider>
  );
}

/* ============================================================================
 * 6. Unified `Table` Component (Supports both Data-Driven & Semantic Children)
 * ========================================================================== */

export type TablePrimitiveWrapperProps = TableRootProps & {
  variant?: SurfaceVariant;
  radius?: ComponentRadius;
  maxHeight?: string | number;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  containerClassName?: string;
  columns?: undefined;
  data?: undefined;
};

export type TableProps<T = any> =
  | DataTableProps<T>
  | TablePrimitiveWrapperProps;

function TableBase<T = any>(props: TableProps<T>) {
  if ("columns" in props && props.columns && "data" in props && props.data) {
    return <DataTable<T> {...(props as DataTableProps<T>)} />;
  }

  const {
    variant = "surface",
    radius = "lg",
    maxHeight,
    ariaLabel,
    ariaLabelledBy,
    containerClassName,
    children,
    ...rootProps
  } = props as TablePrimitiveWrapperProps;

  return (
    <TableContainer
      variant={variant}
      radius={radius}
      maxHeight={maxHeight}
      ariaLabel={ariaLabel}
      ariaLabelledBy={ariaLabelledBy}
      className={containerClassName}
    >
      <TableRoot {...rootProps}>{children}</TableRoot>
    </TableContainer>
  );
}

export const Table = Object.assign(TableBase, {
  Container: TableContainer,
  Root: TableRoot,
  Caption: TableCaption,
  Header: TableHeader,
  Body: TableBody,
  Footer: TableFooter,
  Row: TableRow,
  Head: TableHead,
  RowHeader: TableRowHeader,
  Cell: TableCell,
  CellField: TableCellField,
  ApplyAllPopover: TableColumnApplyAllPopover,
  CopyToColumnButton: TableCopyToColumnButton,
  Toolbar: TableToolbar,
  BulkActionBar: TableBulkActionBar,
  Pagination: TablePagination,
});
