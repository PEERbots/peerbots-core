import React, { useRef, useId, useMemo } from "react";
import { cn } from "../../utils";
import type { SurfaceVariant, ComponentRadius } from "../../types";
import { Checkbox } from "../../forms/Checkbox";
import { Button } from "../../forms/Button";
import { Icon } from "../../foundations/Icon";
import { Text } from "../../foundations/Typography";
import { EmptyState } from "../../feedback/EmptyState";
import { Skeleton } from "../../feedback/Skeleton";
import {
  DEFAULT_TABLE_LABELS,
  type TableLabels,
  usePeerbotsI18n,
} from "../../../i18n";
import type {
  TableSortDirection,
  TableDensity,
  TableSelectionChangeDetails,
} from "../useTableState";
import {
  TableFieldVariantContext,
  formatLabel,
  type TableRowStatus,
  type TableResponsiveMode,
  type TableFieldVariant,
  type TableColumn,
  type TableColumnApplyAllTarget,
} from "./types";
import {
  TableContainer,
  TableRoot,
  type TableRootProps,
  TableCaption,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableRowHeader,
  TableCell,
} from "./TablePrimitives";
import {
  TableCellField,
  TableCopyToColumnButton,
  TableColumnApplyAllPopover,
} from "./TableFieldControls";
import {
  TableToolbar,
  TableBulkActionBar,
  TablePagination,
} from "./TableChrome";

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
