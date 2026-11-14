import React from "react";
import type { SelectOption } from "../../forms/Select";
import type {
  TableSortDirection,
  TableApplyScope,
} from "../useTableState";

export type TableRowStatus =
  | "default"
  | "modified"
  | "error"
  | "warning"
  | "success";

export type TableResponsiveMode = "stack" | "scroll";
export type TableFieldVariant = "ghost" | "compact" | "default";

export const TableFieldVariantContext =
  React.createContext<TableFieldVariant>("compact");

export const formatLabel = (
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

