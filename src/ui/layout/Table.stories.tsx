import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import {
  Table,
  DataTable,
  TableColumn,
  TableCellField,
  TableFieldVariant,
  TableToolbar,
  TableBulkActionBar,
  TablePagination,
  TableColumnApplyAllPopover,
  TableCopyToColumnButton,
} from "./Table";
import { useTableState, TableSortDirection } from "./useTableState";
import { Field } from "../forms/Field";
import { Input } from "../forms/Input";
import { Select } from "../forms/Select";
import { NumberField } from "../forms/NumberField";
import { Switch } from "../forms/Switch";
import { Checkbox } from "../forms/Checkbox";
import { Button } from "../forms/Button";
import { Heading, Text } from "../foundations/Typography";
import { Icon } from "../foundations/Icon";

const meta: Meta<typeof DataTable> = {
  title: "Layout/Table",
  component: DataTable,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "**Three-Layer Table Architecture in `@peerbots/core`:**\n\n1. **Layout Layer (`Table.*` primitives — `Table`, `TableHead`, `TableBody`, `TableRow`, `TableHeaderCell`, `TableCell`, `TableCellField`)**: Composable semantic HTML `<table>` building blocks with sticky headers, pinned columns, density scales, and accessible cell-field label injection.\n2. **Generic Data-Grid Pattern Layer (`DataTable` + `TableToolbar` + `TableBulkActionBar` + `TableColumnApplyAllPopover` + `useTableState`)**: Declarative column-driven data grid with sorting, search filtering, pagination, Shift+Click multi-selection, and batch column Apply-All.\n3. **Domain Pattern Layer (`Patterns/Template Views/TableView`)**: Specialized Peerbots template editor built on `Table.*` with colored button/robot pills, emotion preview tiles, and `PeerbotsControlAction` dispatch.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DataTable>;

/* ============================================================================
 * Sample Datasets
 * ========================================================================== */

interface RobotFleetRow {
  id: string;
  name: string;
  model: string;
  location: string;
  battery: number;
  status: "Online" | "Charging" | "Maintenance";
}

const initialFleetData: RobotFleetRow[] = [
  {
    id: "bot-01",
    name: "Mochi-01",
    model: "Peerbot Mini v2",
    location: "Classroom A",
    battery: 94,
    status: "Online",
  },
  {
    id: "bot-02",
    name: "Kibo-04",
    model: "Peerbot Express",
    location: "Therapy Lab 2",
    battery: 62,
    status: "Online",
  },
  {
    id: "bot-03",
    name: "Nova-07",
    model: "Peerbot Pro",
    location: "Robotics Studio",
    battery: 18,
    status: "Charging",
  },
  {
    id: "bot-04",
    name: "Pebble-02",
    model: "Peerbot Mini v2",
    location: "Classroom B",
    battery: 100,
    status: "Online",
  },
  {
    id: "bot-05",
    name: "Echo-09",
    model: "Peerbot Express",
    location: "Main Atrium",
    battery: 45,
    status: "Maintenance",
  },
];

/* ============================================================================
 * 1. Default Story — Standard Data Table with Selection, Sorting & Sticky Headers
 * ========================================================================== */

export const Default: Story = {
  render: () => {
    const table = useTableState<RobotFleetRow>({
      initialData: initialFleetData,
      initialSortColumn: "name",
      initialSortDirection: "asc",
    });

    const columns: TableColumn<RobotFleetRow>[] = [
      {
        id: "name",
        header: "Robot Name",
        isRowHeader: true,
        sortable: true,
        minWidth: "150px",
      },
      {
        id: "model",
        header: "Hardware Model",
        sortable: true,
        minWidth: "160px",
      },
      {
        id: "location",
        header: "Location",
        sortable: true,
        minWidth: "150px",
      },
      {
        id: "battery",
        header: "Battery",
        sortable: true,
        align: "end",
        cell: ({ row }) => (
          <span
            className={
              row.battery < 25
                ? "pb:font-bold pb:text-red-600"
                : "pb:font-medium pb:text-gray-800"
            }
          >
            {row.battery}%
          </span>
        ),
      },
      {
        id: "status",
        header: "Status",
        sortable: true,
        cell: ({ row }) => {
          const badgeColors = {
            Online: "pb:bg-emerald-50 pb:text-emerald-800 pb:border-emerald-200",
            Charging: "pb:bg-amber-50 pb:text-amber-900 pb:border-amber-200",
            Maintenance: "pb:bg-red-50 pb:text-red-800 pb:border-red-200",
          };
          return (
            <span
              className={`pb:inline-flex pb:items-center pb:px-2.5 pb:py-0.5 pb:rounded-full pb:text-xs pb:font-bold pb:border ${badgeColors[row.status]}`}
            >
              {row.status}
            </span>
          );
        },
      },
    ];

    return (
      <div className="pb:space-y-3">
        <Table
          caption="Active Peerbots Fleet Directory (Shift+Click checkboxes to select a range)"
          columns={columns}
          data={table.visibleData}
          selectable
          selectedRowIds={table.selectedRowIds}
          onSelectionChange={table.onSelectionChange}
          sortColumn={table.sortColumn}
          sortDirection={table.sortDirection}
          onSortChange={table.onSortChange}
          density={table.density}
          toolbar={
            <TableToolbar
              searchValue={table.searchQuery}
              onSearchChange={table.setSearchQuery}
              searchPlaceholder="Search robots, models, locations..."
              density={table.density}
              onDensityChange={table.setDensity}
            />
          }
          bulkActions={
            <>
              <Button
                size="xs"
                color="teal"
                onClick={() =>
                  table.applyToColumn("status", "Online", {
                    scope: "selected",
                  })
                }
              >
                Set Online
              </Button>
              <Button
                size="xs"
                color="danger"
                variant="soft"
                onClick={() => table.deleteRows(table.selectedRowIds)}
              >
                Remove Selected
              </Button>
            </>
          }
        />
      </div>
    );
  },
};

/* ============================================================================
 * 1.5 Variations Story — Interactive Guide to All Subcomponents & Configurations
 * ========================================================================== */

export const Variations: Story = {
  render: () => {
    const [demoSearch, setDemoSearch] = useState("");
    const [demoDensity, setDemoDensity] = useState<
      "compact" | "comfortable" | "spacious"
    >("compact");
    const [demoSelectedCount, setDemoSelectedCount] = useState(3);
    const [demoPage, setDemoPage] = useState(1);
    const [demoPageSize, setDemoPageSize] = useState(10);
    const [appliedBanner, setAppliedBanner] = useState<string | null>(null);
    const [ghostVal, setGhostVal] = useState("happy");
    const [compactVal, setCompactVal] = useState("calm");
    const [defaultVal, setDefaultVal] = useState("curious");

    return (
      <div className="pb:flex pb:flex-col pb:gap-10 pb:p-2 pb:max-w-5xl">
        {/* Section 1: Subcomponent Map */}
        <div className="pb:space-y-3">
          <Heading level={3} color="darkblue">
            Table Architecture & Subcomponent Guide
          </Heading>
          <Text size="sm" color="muted">
            <code>Table</code> can be used either as a{" "}
            <strong>declarative data-driven component</strong> (passing{" "}
            <code>columns</code> + <code>data</code>) or assembled from{" "}
            <strong>composable primitives</strong> (<code>Table.Container</code>,{" "}
            <code>Table.Toolbar</code>, <code>Table.BulkActionBar</code>,{" "}
            <code>Table.Root</code>, <code>Table.Head</code>,{" "}
            <code>Table.RowHeader</code>, <code>Table.Cell</code>,{" "}
            <code>Table.CellField</code>, <code>Table.Pagination</code>). All UI
            subcomponents are stateless and controlled via props.
          </Text>
        </div>

        {/* Section 2: Table.Toolbar & Table.BulkActionBar */}
        <div className="pb:space-y-3">
          <Heading
            level={4}
            className="pb:text-xs pb:font-bold pb:text-gray-700 pb:uppercase pb:tracking-wider"
          >
            1. Top Chrome: <code>Table.Toolbar</code> &{" "}
            <code>Table.BulkActionBar</code>
          </Heading>
          <Text size="xs" color="muted">
            Attach above any table to provide search filtering, custom filter{" "}
            <code>Field</code>s, unsaved-change indicators, density toggles, and
            contextual batch actions when rows are selected.
          </Text>

          <Table.Container variant="surface" ariaLabel="Toolbar and bulk action demo">
            <TableToolbar
              searchValue={demoSearch}
              onSearchChange={setDemoSearch}
              searchPlaceholder="Search by robot or cue..."
              density={demoDensity}
              onDensityChange={setDemoDensity}
              modifiedCount={2}
              onResetModified={() => setAppliedBanner("Reset 2 modified rows")}
              actionsSlot={
                <Button size="xs" color="primary">
                  + New Entry
                </Button>
              }
            />
            <TableBulkActionBar
              selectedCount={demoSelectedCount}
              totalCount={12}
              onSelectAllRows={() => setDemoSelectedCount(12)}
              onClearSelection={() => setDemoSelectedCount(0)}
            >
              {demoSelectedCount === 0 ? null : (
                <>
                  <Button
                    size="xs"
                    color="teal"
                    onClick={() =>
                      setAppliedBanner(
                        `Exported ${demoSelectedCount} selected rows`,
                      )
                    }
                  >
                    Export Selected
                  </Button>
                  <Button
                    size="xs"
                    color="danger"
                    variant="soft"
                    onClick={() => setDemoSelectedCount(0)}
                  >
                    Delete
                  </Button>
                </>
              )}
            </TableBulkActionBar>
            {demoSelectedCount === 0 && (
              <div className="pb:p-3 pb:text-xs pb:text-gray-600 pb:flex pb:items-center pb:justify-between">
                <span>Bulk Action Bar is hidden when 0 rows are selected.</span>
                <Button
                  size="xs"
                  color="neutral"
                  onClick={() => setDemoSelectedCount(3)}
                >
                  Simulate Selecting 3 Rows
                </Button>
              </div>
            )}
          </Table.Container>
        </div>

        {/* Section 3: Table.Head, Sorting, Tooltips & Table.ApplyAllPopover */}
        <div className="pb:space-y-3">
          <Heading
            level={4}
            className="pb:text-xs pb:font-bold pb:text-gray-700 pb:uppercase pb:tracking-wider"
          >
            2. Column Headers: <code>Table.Head</code> &{" "}
            <code>Table.ApplyAllPopover</code>
          </Heading>
          <Text size="xs" color="muted">
            <code>Table.Head</code> supports 3-state sorting (
            <code>&quot;asc&quot; | &quot;desc&quot; | null</code>), accessible
            tooltips, and a <code>headerAction</code> slot for{" "}
            <code>Table.ApplyAllPopover</code> (supporting{" "}
            <code>controlType=&quot;select&quot; | &quot;number&quot; | &quot;boolean&quot; | &quot;text&quot;</code>{" "}
            or a custom <code>renderControl</code>).
          </Text>

          {appliedBanner && (
            <div className="pb:px-3 pb:py-2 pb:rounded-lg pb:bg-teal-50 pb:border pb:border-teal-200 pb:text-xs pb:font-medium pb:text-teal-950">
              Action callback fired: <strong>{appliedBanner}</strong>
            </div>
          )}

          <Table.Container ariaLabel="Header variations demo">
            <Table.Root stickyHeader={false} responsiveMode="scroll">
              <Table.Header>
                <Table.Row>
                  <Table.Head sortable sortDirection="asc" onSort={() => {}}>
                    Sorted Asc
                  </Table.Head>
                  <Table.Head
                    sortable
                    sortDirection={null}
                    tooltip="Explains what this column controls"
                    onSort={() => {}}
                  >
                    With Tooltip
                  </Table.Head>
                  <Table.Head
                    headerAction={
                      <TableColumnApplyAllPopover
                        columnTitle="Emotion"
                        allRows={initialCueRows}
                        allRowIds={["1", "2", "3", "4", "5"]}
                        selectedRows={initialCueRows.slice(0, 2)}
                        selectedRowIds={["1", "2"]}
                        config={{
                          options: emotionOptions,
                          defaultValue: "happy",
                          onApply: (val, target) =>
                            setAppliedBanner(
                              `Set Emotion="${val}" on ${target.scope} (${target.rowIds.length} rows)`,
                            ),
                        }}
                      />
                    }
                  >
                    Select Apply-All
                  </Table.Head>
                  <Table.Head
                    headerAction={
                      <TableColumnApplyAllPopover
                        columnTitle="Speed"
                        allRows={initialCueRows}
                        allRowIds={["1", "2", "3", "4", "5"]}
                        selectedRows={[]}
                        selectedRowIds={[]}
                        config={{
                          controlType: "number",
                          defaultValue: 1.0,
                          onApply: (val, target) =>
                            setAppliedBanner(
                              `Set Speed=${val}x on ${target.scope} (${target.rowIds.length} rows)`,
                            ),
                        }}
                      />
                    }
                  >
                    Number Apply-All
                  </Table.Head>
                </Table.Row>
              </Table.Header>
            </Table.Root>
          </Table.Container>
        </div>

        {/* Section 4: TableCellField Variants & Cell Copy Action */}
        <div className="pb:space-y-3">
          <Heading
            level={4}
            className="pb:text-xs pb:font-bold pb:text-gray-700 pb:uppercase pb:tracking-wider"
          >
            3. Cell Field Styles: <code>Table.CellField</code> (
            <code>ghost</code> vs <code>compact</code> vs <code>default</code>) &{" "}
            <code>Table.CopyToColumnButton</code>
          </Heading>
          <Text size="xs" color="muted">
            Use <code>Table.CellField</code> (or set{" "}
            <code>fieldVariant=&quot;ghost&quot; | &quot;compact&quot; | &quot;default&quot;</code>{" "}
            on <code>&lt;Table&gt;</code>) to keep dropdowns and text inputs
            compact inside table rows while preserving screen-reader labels and
            validation errors.
          </Text>

          <Table
            ariaLabel="CellField style comparison"
            responsiveMode="scroll"
            columnLabels={[
              "Variant",
              "Select Dropdown",
              "Text Input",
              "Number Input",
              "With Validation Error",
            ]}
          >
            <Table.Header>
              <Table.Row>
                <Table.Head>cellVariant</Table.Head>
                <Table.Head>Select Control</Table.Head>
                <Table.Head>Input Control</Table.Head>
                <Table.Head>NumberField</Table.Head>
                <Table.Head>Validation & Copy</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.RowHeader>
                  <code>&quot;ghost&quot;</code>
                  <div className="pb:text-[11px] pb:font-normal pb:text-gray-600">
                    Borderless until hover/focus
                  </div>
                </Table.RowHeader>
                <Table.Cell>
                  <TableCellField
                    cellVariant="ghost"
                    label="Ghost emotion select"
                    maxWidth="140px"
                  >
                    <Select
                      options={emotionOptions}
                      value={ghostVal}
                      onChange={(v) => v && setGhostVal(String(v))}
                    />
                  </TableCellField>
                </Table.Cell>
                <Table.Cell>
                  <TableCellField
                    cellVariant="ghost"
                    label="Ghost text input"
                    maxWidth="160px"
                  >
                    <Input defaultValue="Hover or click me" />
                  </TableCellField>
                </Table.Cell>
                <Table.Cell>
                  <TableCellField
                    cellVariant="ghost"
                    label="Ghost number input"
                    maxWidth="105px"
                  >
                    <NumberField defaultValue={1.0} step={0.1} showButtons />
                  </TableCellField>
                </Table.Cell>
                <Table.Cell
                  modified
                  cellAction={
                    <TableCopyToColumnButton
                      onClick={() =>
                        setAppliedBanner("Copied cell value to column!")
                      }
                    />
                  }
                >
                  <TableCellField
                    cellVariant="ghost"
                    label="Ghost input with error"
                    error="Value out of range"
                    maxWidth="150px"
                  >
                    <Input defaultValue="Invalid value" />
                  </TableCellField>
                </Table.Cell>
              </Table.Row>

              <Table.Row>
                <Table.RowHeader>
                  <code>&quot;compact&quot;</code>
                  <div className="pb:text-[11px] pb:font-normal pb:text-gray-600">
                    28px height, subtle 1px border
                  </div>
                </Table.RowHeader>
                <Table.Cell>
                  <TableCellField
                    cellVariant="compact"
                    label="Compact emotion select"
                    maxWidth="140px"
                  >
                    <Select
                      options={emotionOptions}
                      value={compactVal}
                      onChange={(v) => v && setCompactVal(String(v))}
                    />
                  </TableCellField>
                </Table.Cell>
                <Table.Cell>
                  <TableCellField
                    cellVariant="compact"
                    label="Compact text input"
                    maxWidth="160px"
                  >
                    <Input defaultValue="Compact input" />
                  </TableCellField>
                </Table.Cell>
                <Table.Cell>
                  <TableCellField
                    cellVariant="compact"
                    label="Compact number input"
                    maxWidth="105px"
                  >
                    <NumberField defaultValue={1.5} step={0.1} showButtons />
                  </TableCellField>
                </Table.Cell>
                <Table.Cell
                  cellAction={
                    <TableCopyToColumnButton
                      onClick={() =>
                        setAppliedBanner("Copied compact value to column!")
                      }
                    />
                  }
                >
                  <TableCellField
                    cellVariant="compact"
                    label="Compact valid input"
                    maxWidth="150px"
                  >
                    <Input defaultValue="Ready" />
                  </TableCellField>
                </Table.Cell>
              </Table.Row>

              <Table.Row>
                <Table.RowHeader>
                  <code>&quot;default&quot;</code>
                  <div className="pb:text-[11px] pb:font-normal pb:text-gray-600">
                    Standard 36px form field
                  </div>
                </Table.RowHeader>
                <Table.Cell>
                  <TableCellField
                    cellVariant="default"
                    label="Default emotion select"
                    maxWidth="140px"
                  >
                    <Select
                      options={emotionOptions}
                      value={defaultVal}
                      onChange={(v) => v && setDefaultVal(String(v))}
                    />
                  </TableCellField>
                </Table.Cell>
                <Table.Cell>
                  <TableCellField
                    cellVariant="default"
                    label="Default text input"
                    maxWidth="160px"
                  >
                    <Input defaultValue="Standard input" />
                  </TableCellField>
                </Table.Cell>
                <Table.Cell>
                  <TableCellField
                    cellVariant="default"
                    label="Default number input"
                    maxWidth="115px"
                  >
                    <NumberField defaultValue={2.0} step={0.1} showButtons />
                  </TableCellField>
                </Table.Cell>
                <Table.Cell>
                  <TableCellField
                    cellVariant="default"
                    label="Default valid input"
                    maxWidth="150px"
                  >
                    <Input defaultValue="Standard" />
                  </TableCellField>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>

        {/* Section 5: Row Status Highlights & Pagination */}
        <div className="pb:space-y-3">
          <Heading
            level={4}
            className="pb:text-xs pb:font-bold pb:text-gray-700 pb:uppercase pb:tracking-wider"
          >
            4. Semantic Row States (<code>Table.Row</code>) &{" "}
            <code>Table.Pagination</code>
          </Heading>
          <Text size="xs" color="muted">
            <code>Table.Row</code> supports <code>selected</code> and semantic{" "}
            <code>status</code> tints (
            <code>&quot;default&quot; | &quot;modified&quot; | &quot;error&quot; | &quot;warning&quot; | &quot;success&quot;</code>
            ) to visually surface unsaved changes or validation issues.
          </Text>

          <Table.Container ariaLabel="Row statuses and pagination demo">
            <Table.Root responsiveMode="scroll">
              <Table.Header>
                <Table.Row>
                  <Table.Head>Row State</Table.Head>
                  <Table.Head>Prop Configuration</Table.Head>
                  <Table.Head>Typical Use Case</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row status="default">
                  <Table.RowHeader>Default</Table.RowHeader>
                  <Table.Cell>
                    <code>status=&quot;default&quot;</code>
                  </Table.Cell>
                  <Table.Cell>Clean, unmodified record</Table.Cell>
                </Table.Row>
                <Table.Row selected>
                  <Table.RowHeader>Selected</Table.RowHeader>
                  <Table.Cell>
                    <code>selected=&#123;true&#125;</code>
                  </Table.Cell>
                  <Table.Cell>Included in active batch selection</Table.Cell>
                </Table.Row>
                <Table.Row status="modified">
                  <Table.RowHeader modified>Modified (Dirty)</Table.RowHeader>
                  <Table.Cell modified>
                    <code>status=&quot;modified&quot;</code> +{" "}
                    <code>modified=&#123;true&#125;</code>
                  </Table.Cell>
                  <Table.Cell>Row has unsaved field edits</Table.Cell>
                </Table.Row>
                <Table.Row status="error">
                  <Table.RowHeader>Validation Error</Table.RowHeader>
                  <Table.Cell>
                    <code>status=&quot;error&quot;</code>
                  </Table.Cell>
                  <Table.Cell>One or more fields failed validation</Table.Cell>
                </Table.Row>
                <Table.Row status="success">
                  <Table.RowHeader>Success / Synced</Table.RowHeader>
                  <Table.Cell>
                    <code>status=&quot;success&quot;</code>
                  </Table.Cell>
                  <Table.Cell>Newly added or verified row</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Root>
            <TablePagination
              page={demoPage}
              pageSize={demoPageSize}
              totalItems={42}
              onPageChange={setDemoPage}
              onPageSizeChange={setDemoPageSize}
            />
          </Table.Container>
        </div>
      </div>
    );
  },
};
