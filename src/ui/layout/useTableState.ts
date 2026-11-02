import { useState, useMemo, useCallback } from "react";

export type TableSortDirection = "asc" | "desc" | null;
export type TableDensity = "compact" | "comfortable" | "spacious";
export type TableApplyScope = "all" | "selected";

export interface TableSelectionChangeDetails {
  type: "row" | "all" | "clear" | "range";
  rowId?: string;
  checked?: boolean;
}

export interface UseTableStateOptions<T> {
  /** Initial rows data */
  initialData: T[];
  /** Function to extract a unique ID from a row (defaults to `row.id`) */
  getRowId?: (row: T, index: number) => string;
  /** Initial selected row IDs */
  initialSelectedRowIds?: string[];
  /** Initial sort column ID / key */
  initialSortColumn?: string | null;
  /** Initial sort direction */
  initialSortDirection?: TableSortDirection;
  /** Initial search query */
  initialSearchQuery?: string;
  /** Custom filter predicate for search queries */
  filterFn?: (row: T, query: string) => boolean;
  /** Custom comparator for sorting */
  compareFn?: (a: T, b: T, columnId: string, direction: "asc" | "desc") => number;
  /** Initial row density */
  initialDensity?: TableDensity;
  /** Initial page index (1-based) */
  initialPage?: number;
  /** Initial page size (if omitted, pagination slicing is disabled unless enabled) */
  initialPageSize?: number;
  /** Whether to slice `paginatedData` by `page` and `pageSize` */
  paginate?: boolean;
  /** Optional row-level validation function returning column error messages */
  validateRow?: (row: T) => Partial<Record<keyof T & string, string>>;
}

export interface UseTableStateReturn<T> {
  /** Current full dataset (including any cell/column edits) */
  data: T[];
  /** Set or replace the dataset */
  setData: React.Dispatch<React.SetStateAction<T[]>>;
  /** Filtered and sorted rows (before pagination) */
  processedData: T[];
  /** Final rows to pass to `<Table data={...} />` (sliced if `paginate: true`) */
  visibleData: T[];
  /** Selected row IDs */
  selectedRowIds: string[];
  /** Update selected row IDs (compatible with `<Table onSelectionChange={...} />`) */
  onSelectionChange: (
    nextIds: string[],
    details?: TableSelectionChangeDetails,
  ) => void;
  /** Clear all selected rows */
  clearSelection: () => void;
  /** Select all rows in `processedData` */
  selectAllMatching: () => void;
  /** Currently sorted column ID */
  sortColumn: string | null;
  /** Current sort direction */
  sortDirection: TableSortDirection;
  /** Handler for `<Table onSortChange={...} />` */
  onSortChange: (columnId: string, direction: TableSortDirection) => void;
  /** Current search query */
  searchQuery: string;
  /** Update search query */
  setSearchQuery: (query: string) => void;
  /** Expanded row IDs */
  expandedRowIds: string[];
  /** Handler for `<Table onExpandChange={...} />` */
  onExpandChange: (nextExpandedIds: string[]) => void;
  /** Current row density */
  density: TableDensity;
  /** Update row density */
  setDensity: (density: TableDensity) => void;
  /** Current 1-based page number */
  page: number;
  /** Update current page */
  setPage: (page: number) => void;
  /** Current page size */
  pageSize: number;
  /** Update page size (resets to page 1) */
  setPageSize: (size: number) => void;
  /** Update a single field/cell in a specific row */
  updateCell: <K extends keyof T>(rowId: string, key: K, value: T[K]) => void;
  /** Update multiple fields on a specific row */
  updateRow: (rowId: string, partial: Partial<T>) => void;
  /**
   * Batch-apply a value to a column across `"all"` rows (or `"selected"` rows).
   * Directly powers the "Apply All to a Column" and "Copy Cell to Column" UX!
   */
  applyToColumn: <K extends keyof T>(
    key: K,
    value: T[K],
    target?: { scope?: TableApplyScope; rowIds?: string[] },
  ) => void;
  /** Reset specific rows (or all rows if `rowIds` omitted) back to `initialData` */
  resetRows: (rowIds?: string[]) => void;
  /** Delete rows by IDs and remove them from selection */
  deleteRows: (rowIds: string[]) => void;
  /** Append or prepend a new row */
  addRow: (row: T, position?: "start" | "end") => void;
  /** Set of row IDs that have been modified compared to `initialData` */
  dirtyRowIds: Set<string>;
  /** Check whether a specific cell in a row differs from its initial value */
  isCellModified: (row: T, columnId: string) => boolean;
  /** Get validation error message for a cell (if `validateRow` was provided) */
  getCellError: (row: T, columnId: string) => string | undefined;
  /** Set of row IDs that currently have validation errors */
  errorRowIds: Set<string>;
}

const defaultGetRowId = <T,>(row: T, index: number): string => {
  if (row && typeof row === "object" && "id" in row && row.id != null) {
    return String((row as Record<string, unknown>).id);
  }
  return String(index);
};

export function useTableState<T>({
  initialData,
  getRowId = defaultGetRowId,
  initialSelectedRowIds = [],
  initialSortColumn = null,
  initialSortDirection = null,
  initialSearchQuery = "",
  filterFn,
  compareFn,
  initialDensity = "comfortable",
  initialPage = 1,
  initialPageSize = 10,
  paginate = false,
  validateRow,
}: UseTableStateOptions<T>): UseTableStateReturn<T> {
  const [baselineData] = useState<T[]>(initialData);
  const [data, setData] = useState<T[]>(initialData);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>(
    initialSelectedRowIds,
  );
  const [sortColumn, setSortColumn] = useState<string | null>(
    initialSortColumn,
  );
  const [sortDirection, setSortDirection] = useState<TableSortDirection>(
    initialSortDirection,
  );
  const [searchQuery, setSearchQueryState] = useState<string>(
    initialSearchQuery,
  );
  const [expandedRowIds, setExpandedRowIds] = useState<string[]>([]);
  const [density, setDensity] = useState<TableDensity>(initialDensity);
  const [page, setPage] = useState<number>(initialPage);
  const [pageSize, setPageSizeState] = useState<number>(initialPageSize);

  const baselineMap = useMemo(() => {
    const map = new Map<string, T>();
    baselineData.forEach((row, idx) => {
      map.set(getRowId(row, idx), row);
    });
    return map;
  }, [baselineData, getRowId]);

  const setSearchQuery = useCallback((query: string) => {
    setSearchQueryState(query);
    setPage(1);
  }, []);

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size);
    setPage(1);
  }, []);

  const onSelectionChange = useCallback((nextIds: string[]) => {
    setSelectedRowIds(nextIds);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedRowIds([]);
  }, []);

  const onSortChange = useCallback(
    (columnId: string, direction: TableSortDirection) => {
      setSortColumn(direction ? columnId : null);
      setSortDirection(direction);
    },
    [],
  );

  const processedData = useMemo(() => {
    let result = [...data];

    // 1. Search filter
    const trimmedQuery = searchQuery.trim().toLowerCase();
    if (trimmedQuery) {
      result = result.filter((row) => {
        if (filterFn) {
          return filterFn(row, searchQuery.trim());
        }
        if (row && typeof row === "object") {
          return Object.values(row as Record<string, unknown>).some((val) =>
            val != null && String(val).toLowerCase().includes(trimmedQuery),
          );
        }
        return false;
      });
    }

    // 2. Sort
    if (sortColumn && sortDirection) {
      result.sort((a, b) => {
        if (compareFn) {
          return compareFn(a, b, sortColumn, sortDirection);
        }
        const valA = (a as Record<string, unknown>)?.[sortColumn];
        const valB = (b as Record<string, unknown>)?.[sortColumn];

        if (valA === valB) return 0;
        if (valA == null) return 1;
        if (valB == null) return -1;

        let cmp = 0;
        if (typeof valA === "number" && typeof valB === "number") {
          cmp = valA - valB;
        } else if (typeof valA === "boolean" && typeof valB === "boolean") {
          cmp = valA === valB ? 0 : valA ? -1 : 1;
        } else {
          cmp = String(valA).localeCompare(String(valB), undefined, {
            numeric: true,
            sensitivity: "base",
          });
        }
        return sortDirection === "asc" ? cmp : -cmp;
      });
    }

    return result;
  }, [data, searchQuery, filterFn, sortColumn, sortDirection, compareFn]);

  const visibleData = useMemo(() => {
    if (!paginate) return processedData;
    const start = (page - 1) * pageSize;
    return processedData.slice(start, start + pageSize);
  }, [processedData, paginate, page, pageSize]);

  const selectAllMatching = useCallback(() => {
    setSelectedRowIds(
      processedData.map((row, idx) => getRowId(row, idx)),
    );
  }, [processedData, getRowId]);

  const updateCell = useCallback(
    <K extends keyof T>(rowId: string, key: K, value: T[K]) => {
      setData((prev) =>
        prev.map((row, idx) =>
          getRowId(row, idx) === rowId ? { ...row, [key]: value } : row,
        ),
      );
    },
    [getRowId],
  );

  const updateRow = useCallback(
    (rowId: string, partial: Partial<T>) => {
      setData((prev) =>
        prev.map((row, idx) =>
          getRowId(row, idx) === rowId ? { ...row, ...partial } : row,
        ),
      );
    },
    [getRowId],
  );

  const applyToColumn = useCallback(
    <K extends keyof T>(
      key: K,
      value: T[K],
      target?: { scope?: TableApplyScope; rowIds?: string[] },
    ) => {
      setData((prev) => {
        const targetIdSet = target?.rowIds
          ? new Set(target.rowIds)
          : target?.scope === "selected" && selectedRowIds.length > 0
            ? new Set(selectedRowIds)
            : null;

        return prev.map((row, idx) => {
          const id = getRowId(row, idx);
          if (!targetIdSet || targetIdSet.has(id)) {
            return { ...row, [key]: value };
          }
          return row;
        });
      });
    },
    [getRowId, selectedRowIds],
  );

  const resetRows = useCallback(
    (rowIds?: string[]) => {
      if (!rowIds || rowIds.length === 0) {
        setData(baselineData);
        return;
      }
      const idSet = new Set(rowIds);
      setData((prev) =>
        prev.map((row, idx) => {
          const id = getRowId(row, idx);
          if (idSet.has(id) && baselineMap.has(id)) {
            return baselineMap.get(id)!;
          }
          return row;
        }),
      );
    },
    [baselineData, baselineMap, getRowId],
  );

  const deleteRows = useCallback(
    (rowIds: string[]) => {
      const idSet = new Set(rowIds);
      setData((prev) =>
        prev.filter((row, idx) => !idSet.has(getRowId(row, idx))),
      );
      setSelectedRowIds((prev) => prev.filter((id) => !idSet.has(id)));
    },
    [getRowId],
  );

  const addRow = useCallback((row: T, position: "start" | "end" = "end") => {
    setData((prev) => (position === "start" ? [row, ...prev] : [...prev, row]));
  }, []);

  const isCellModified = useCallback(
    (row: T, columnId: string): boolean => {
      const id = getRowId(row, 0);
      const baseline = baselineMap.get(id);
      if (!baseline) return true;
      return (
        (row as Record<string, unknown>)[columnId] !==
        (baseline as Record<string, unknown>)[columnId]
      );
    },
    [baselineMap, getRowId],
  );

  const dirtyRowIds = useMemo(() => {
    const dirty = new Set<string>();
    data.forEach((row, idx) => {
      const id = getRowId(row, idx);
      const baseline = baselineMap.get(id);
      if (!baseline) {
        dirty.add(id);
        return;
      }
      if (row && typeof row === "object") {
        const keys = Object.keys(row as Record<string, unknown>);
        const changed = keys.some(
          (k) =>
            (row as Record<string, unknown>)[k] !==
            (baseline as Record<string, unknown>)[k],
        );
        if (changed) {
          dirty.add(id);
        }
      }
    });
    return dirty;
  }, [data, baselineMap, getRowId]);

  const validationMap = useMemo(() => {
    const map = new Map<string, Partial<Record<keyof T & string, string>>>();
    if (!validateRow) return map;
    data.forEach((row, idx) => {
      const id = getRowId(row, idx);
      const errors = validateRow(row);
      const hasErrors = Object.values(errors).some((msg) => Boolean(msg));
      if (hasErrors) {
        map.set(id, errors);
      }
    });
    return map;
  }, [data, getRowId, validateRow]);

  const errorRowIds = useMemo(() => {
    return new Set<string>(validationMap.keys());
  }, [validationMap]);

  const getCellError = useCallback(
    (row: T, columnId: string): string | undefined => {
      const id = getRowId(row, 0);
      return validationMap.get(id)?.[columnId as keyof T & string];
    },
    [getRowId, validationMap],
  );

  return {
    data,
    setData,
    processedData,
    visibleData,
    selectedRowIds,
    onSelectionChange,
    clearSelection,
    selectAllMatching,
    sortColumn,
    sortDirection,
    onSortChange,
    searchQuery,
    setSearchQuery,
    expandedRowIds,
    onExpandChange: setExpandedRowIds,
    density,
    setDensity,
    page,
    setPage,
    pageSize,
    setPageSize,
    updateCell,
    updateRow,
    applyToColumn,
    resetRows,
    deleteRows,
    addRow,
    dirtyRowIds,
    isCellModified,
    getCellError,
    errorRowIds,
  };
}
