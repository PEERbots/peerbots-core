import React, { useState, useMemo } from "react";
import { cn } from "../../utils";
import { Button } from "../../forms/Button";
import { Field, type FieldProps } from "../../forms/Field";
import { Input } from "../../forms/Input";
import { Select } from "../../forms/Select";
import { NumberField } from "../../forms/NumberField";
import { Switch } from "../../forms/Switch";
import { Icon } from "../../foundations/Icon";
import { Popover } from "../../feedback/Popover";
import {
  DEFAULT_TABLE_LABELS,
  type TableLabels,
  usePeerbotsI18n,
} from "../../../i18n";
import type { TableApplyScope } from "../useTableState";
import {
  TableFieldVariantContext,
  formatLabel,
  type TableFieldVariant,
  type TableColumnApplyAll,
  type TableColumnApplyAllTarget,
} from "./types";

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
      if (
        srOnlyLabel &&
        childProps["aria-label"] === undefined &&
        typeof label === "string"
      ) {
        injected["aria-label"] = label;
      }
      if (Object.keys(injected).length === 0) return child;
      return React.cloneElement(child, injected);
    });

    return (
      <Field
        ref={ref}
        label={srOnlyLabel ? undefined : label}
        style={{
          ...(maxWidth ? { maxWidth } : undefined),
          ...style,
        }}
        className={cn(
          "pb:gap-0.5",
          srOnlyLabel && "pb:[&_label]:sr-only",
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

