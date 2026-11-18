import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Input } from "../../forms/Input";
import { Select } from "../../forms/Select";
import {
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRoot,
  TableRow,
} from "./TablePrimitives";
import {
  TableCellField,
  TableColumnApplyAllPopover,
  TableCopyToColumnButton,
} from "./TableFieldControls";

interface SampleRow {
  id: string;
  label: string;
  color: string;
}

const SAMPLE_ROWS: SampleRow[] = [
  { id: "r1", label: "Hello", color: "Green" },
  { id: "r2", label: "Wave", color: "Blue" },
];

const meta: Meta<typeof TableCellField> = {
  title: "Layout/Table/TableFieldControls",
  component: TableCellField,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Inline form controls for editable tables: `TableCellField`, `TableColumnApplyAllPopover`, and `TableCopyToColumnButton`.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TableCellField>;

export const Default: Story = {
  render: () => {
    const [rows, setRows] = useState<SampleRow[]>(SAMPLE_ROWS);
    return (
      <TableContainer>
        <TableRoot>
          <TableHeader>
            <TableRow>
              <TableHead>Label</TableHead>
              <TableHead
                headerAction={
                  <TableColumnApplyAllPopover<SampleRow, string>
                    columnTitle="Color"
                    allRows={rows}
                    allRowIds={rows.map((r) => r.id)}
                    selectedRows={[rows[0]]}
                    selectedRowIds={["r1"]}
                    config={{
                      defaultValue: "Green",
                      renderControl: ({ value, onChange }) => (
                        <Select
                          size="sm"
                          value={value}
                          onChange={(val) => val && onChange(String(val))}
                          options={[
                            { label: "Green", value: "Green" },
                            { label: "Blue", value: "Blue" },
                            { label: "Yellow", value: "Yellow" },
                          ]}
                        />
                      ),
                      onApply: (nextColor, target) => {
                        const targetIds = new Set(target.rowIds);
                        setRows((prev) =>
                          prev.map((r) =>
                            targetIds.has(r.id) ? { ...r, color: nextColor } : r,
                          ),
                        );
                      },
                    }}
                  />
                }
              >
                Color
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <TableCellField label={`Label for ${row.id}`}>
                    <Input
                      value={row.label}
                      onChange={(e) =>
                        setRows((prev) =>
                          prev.map((r) =>
                            r.id === row.id
                              ? { ...r, label: e.target.value }
                              : r,
                          ),
                        )
                      }
                    />
                  </TableCellField>
                </TableCell>
                <TableCell>
                  <div className="pb:flex pb:items-center pb:gap-2">
                    <span>{row.color}</span>
                    <TableCopyToColumnButton
                      onClick={() =>
                        setRows((prev) =>
                          prev.map((r) => ({ ...r, color: row.color })),
                        )
                      }
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableRoot>
      </TableContainer>
    );
  },
};
