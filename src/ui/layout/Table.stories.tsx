import type { Meta, StoryObj } from "@storybook/react";
import React, { useReducer, useState } from "react";
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

interface ExpressionCueRow {
  id: string;
  cueName: string;
  phrase: string;
  emotion: string;
  ledColor: string;
  speed: number;
  autoPlay: boolean;
}

const emotionOptions = [
  { label: "Happy", value: "happy" },
  { label: "Calm", value: "calm" },
  { label: "Curious", value: "curious" },
  { label: "Surprised", value: "surprised" },
  { label: "Empathetic", value: "empathetic" },
];

const colorOptions = [
  { label: "Peerbots Teal", value: "teal" },
  { label: "Peerbots Pink", value: "pink" },
  { label: "Electric Cyan", value: "cyan" },
  { label: "Warm Amber", value: "amber" },
  { label: "Deep Navy", value: "darkblue" },
];

const initialCueRows: ExpressionCueRow[] = [
  {
    id: "cue-1",
    cueName: "Greeting Wave",
    phrase: "Hello friend! Ready to learn together?",
    emotion: "happy",
    ledColor: "teal",
    speed: 1.0,
    autoPlay: true,
  },
  {
    id: "cue-2",
    cueName: "Active Listening",
    phrase: "I'm listening, tell me more about that.",
    emotion: "empathetic",
    ledColor: "cyan",
    speed: 0.9,
    autoPlay: true,
  },
  {
    id: "cue-3",
    cueName: "Celebration",
    phrase: "Awesome job solving that puzzle!",
    emotion: "surprised",
    ledColor: "pink",
    speed: 1.2,
    autoPlay: false,
  },
  {
    id: "cue-4",
    cueName: "Deep Breath Prompt",
    phrase: "Let's take a slow, calm breath together.",
    emotion: "calm",
    ledColor: "teal",
    speed: 0.8,
    autoPlay: true,
  },
  {
    id: "cue-5",
    cueName: "Question Prompt",
    phrase: "What do you think happens next?",
    emotion: "curious",
    ledColor: "amber",
    speed: 1.0,
    autoPlay: false,
  },
];

export const TableWithFieldComponents: Story = {
  render: () => {
    const [fieldVariant, setFieldVariant] =
      useState<TableFieldVariant>("ghost");

    const table = useTableState<ExpressionCueRow>({
      initialData: initialCueRows,
      initialDensity: "compact",
      validateRow: (row) => ({
        phrase:
          row.phrase.trim().length === 0
            ? "Spoken phrase is required"
            : row.phrase.length > 80
              ? "Keep phrase under 80 chars"
              : undefined,
        speed:
          row.speed < 0.5 || row.speed > 2.0
            ? "Speed must be 0.5x – 2.0x"
            : undefined,
      }),
    });

    const columns: TableColumn<ExpressionCueRow>[] = [
      {
        id: "cueName",
        header: "Cue",
        isRowHeader: true,
        sortable: true,
        width: "150px",
        cell: ({ row, rowId, isModified }) => (
          <div className="pb:leading-tight">
            <div className="pb:font-bold pb:text-gray-900 pb:text-xs sm:pb:text-sm">
              {row.cueName}
            </div>
            <div className="pb:text-[10px] pb:font-mono pb:text-gray-600">
              #{rowId} {isModified ? "• edited" : ""}
            </div>
          </div>
        ),
      },
      {
        id: "phrase",
        header: "Spoken Phrase",
        tooltip: "Text spoken via robot TTS engine. Cannot be empty.",
        minWidth: "220px",
        cell: ({ row, rowId, error }) => (
          <TableCellField
            label={`Spoken phrase for ${row.cueName}`}
            error={error}
          >
            <Input
              value={row.phrase}
              onChange={(e) =>
                table.updateCell(rowId, "phrase", e.target.value)
              }
              placeholder="Enter spoken phrase..."
            />
          </TableCellField>
        ),
      },
      {
        id: "emotion",
        header: "Emotion",
        tooltip: "Use 'Apply all' in the header or click the arrow icon on any cell to batch-apply.",
        sortable: true,
        width: "165px",
        showCellCopyAction: true,
        applyAll: {
          options: emotionOptions,
          defaultValue: "happy",
          label: "Set emotion for target rows",
          onApply: (value, target) => {
            table.applyToColumn("emotion", String(value), {
              rowIds: target.rowIds,
            });
          },
        },
        cell: ({ row, rowId }) => (
          <TableCellField
            label={`Emotion for ${row.cueName}`}
            maxWidth="135px"
          >
            <Select
              options={emotionOptions}
              value={row.emotion}
              onChange={(val) => {
                if (val != null) {
                  table.updateCell(rowId, "emotion", String(val));
                }
              }}
            />
          </TableCellField>
        ),
      },
      {
        id: "ledColor",
        header: "LED Ring",
        sortable: true,
        width: "175px",
        showCellCopyAction: true,
        applyAll: {
          options: colorOptions,
          defaultValue: "teal",
          label: "Set LED color for target rows",
          onApply: (value, target) => {
            table.applyToColumn("ledColor", String(value), {
              rowIds: target.rowIds,
            });
          },
        },
        cell: ({ row, rowId }) => (
          <TableCellField
            label={`LED Color for ${row.cueName}`}
            maxWidth="145px"
          >
            <Select
              options={colorOptions}
              value={row.ledColor}
              onChange={(val) => {
                if (val != null) {
                  table.updateCell(rowId, "ledColor", String(val));
                }
              }}
            />
          </TableCellField>
        ),
      },
      {
        id: "speed",
        header: "Speed",
        tooltip: "Valid range: 0.5x to 2.0x. Try setting > 2.0 to see Field error state.",
        sortable: true,
        width: "140px",
        showCellCopyAction: true,
        applyAll: {
          controlType: "number",
          defaultValue: 1.0,
          label: "Voice Speed (0.5x – 2.0x)",
          renderControl: ({ value, onChange }) => (
            <Field
              label="Batch Voice Speed"
              description="Recommended between 0.5x and 2.0x"
            >
              <NumberField
                value={Number(value)}
                min={0.5}
                max={2.0}
                step={0.1}
                showButtons
                onChange={(val) => onChange(val ?? 1.0)}
              />
            </Field>
          ),
          onApply: (value, target) => {
            table.applyToColumn("speed", Number(value), {
              rowIds: target.rowIds,
            });
          },
        },
        cell: ({ row, rowId, error }) => (
          <TableCellField
            label={`Voice speed for ${row.cueName}`}
            error={error}
            maxWidth="105px"
          >
            <NumberField
              value={row.speed}
              min={0.2}
              max={3.0}
              step={0.1}
              showButtons
              onChange={(val) => {
                if (val != null) {
                  table.updateCell(rowId, "speed", val);
                }
              }}
            />
          </TableCellField>
        ),
      },
      {
        id: "autoPlay",
        header: "Auto-Play",
        align: "center",
        width: "125px",
        applyAll: {
          controlType: "boolean",
          defaultValue: true,
          label: "Enable Auto-Play",
          onApply: (value, target) => {
            table.applyToColumn("autoPlay", Boolean(value), {
              rowIds: target.rowIds,
            });
          },
        },
        cell: ({ row, rowId }) => (
          <div className="pb:inline-flex pb:justify-center">
            <Field
              label={row.autoPlay ? "On" : "Off"}
              labelPlacement="end"
              labelWeight="normal"
              inline
            >
              <Switch
                checked={row.autoPlay}
                onChange={(checked) =>
                  table.updateCell(rowId, "autoPlay", checked)
                }
              />
            </Field>
          </div>
        ),
      },
    ];

    const handleAddCue = () => {
      const nextNum = table.data.length + 1;
      table.addRow({
        id: `cue-${nextNum}`,
        cueName: `Custom Cue ${nextNum}`,
        phrase: "New robot expression line",
        emotion: "happy",
        ledColor: "teal",
        speed: 1.0,
        autoPlay: false,
      });
    };

    return (
      <div className="pb:space-y-4">
        <div className="pb:flex pb:flex-col sm:pb:flex-row sm:pb:items-center sm:pb:justify-between pb:gap-3">
          <div>
            <Heading level={4} color="darkblue">
              Robot Expression & Cue Matrix
            </Heading>
            <Text size="xs" color="muted">
              Switch between <strong>Ghost</strong> (borderless until hover/focus)
              and <strong>Compact</strong> (28px bordered) field styles to keep
              table cells sleek and scannable.
            </Text>
          </div>

          <div className="pb:flex pb:items-center pb:gap-2">
            <span className="pb:text-xs pb:font-bold pb:text-gray-600">
              Field Style:
            </span>
            <div
              role="group"
              aria-label="Field style variant"
              className="pb:inline-flex pb:items-center pb:rounded-lg pb:bg-gray-100 pb:p-0.5 pb:text-xs"
            >
              {(["ghost", "compact", "default"] as TableFieldVariant[]).map(
                (v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setFieldVariant(v)}
                    className={`pb:px-2.5 pb:py-1 pb:rounded-md pb:capitalize pb:transition-all pb:cursor-pointer ${
                      fieldVariant === v
                        ? "pb:bg-white pb:text-gray-900 pb:shadow-xs pb:font-bold"
                        : "pb:text-gray-600 pb:hover:text-gray-900 pb:font-medium"
                    }`}
                  >
                    {v}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>

        <Table
          caption="Robot Expression and Cue Configuration Table"
          hideCaption
          columns={columns}
          data={table.visibleData}
          selectable
          selectedRowIds={table.selectedRowIds}
          onSelectionChange={table.onSelectionChange}
          sortColumn={table.sortColumn}
          sortDirection={table.sortDirection}
          onSortChange={table.onSortChange}
          dirtyRowIds={table.dirtyRowIds}
          errorRowIds={table.errorRowIds}
          isCellModified={table.isCellModified}
          getCellError={table.getCellError}
          density={table.density}
          fieldVariant={fieldVariant}
          toolbar={
            <TableToolbar
              searchValue={table.searchQuery}
              onSearchChange={table.setSearchQuery}
              searchPlaceholder="Filter cues or phrases..."
              density={table.density}
              onDensityChange={table.setDensity}
              modifiedCount={table.dirtyRowIds.size}
              onResetModified={() => table.resetRows()}
              actionsSlot={
                <Button
                  size="xs"
                  color="primary"
                  leftIcon={<Icon name="plus" size="sm" className="pb:w-3.5 pb:h-3.5" />}
                  onClick={handleAddCue}
                >
                  Add Cue
                </Button>
              }
            />
          }
          bulkActions={
            <>
              <Button
                size="xs"
                color="neutral"
                onClick={() => table.resetRows(table.selectedRowIds)}
              >
                Reset Selected ({table.selectedRowIds.length})
              </Button>
              <Button
                size="xs"
                color="danger"
                variant="soft"
                onClick={() => table.deleteRows(table.selectedRowIds)}
              >
                Delete Selected
              </Button>
            </>
          }
        />
      </div>
    );
  },
};

/* ============================================================================
 * 3. Separated UI & External Tool State Management (Reducer / Store Pattern)
 * ========================================================================== */

interface ServoCalibrationRow {
  id: string;
  joint: string;
  minAngle: number;
  maxAngle: number;
  torqueLimit: string;
  locked: boolean;
}

interface ExternalToolState {
  servos: ServoCalibrationRow[];
  selectedIds: string[];
  sortBy: string | null;
  sortDir: TableSortDirection;
  lastActionLog: string;
}

type ExternalToolAction =
  | {
      type: "SET_SELECTION";
      selectedIds: string[];
      reason: string;
    }
  | {
      type: "SET_SORT";
      columnId: string;
      direction: TableSortDirection;
    }
  | {
      type: "UPDATE_SERVO_FIELD";
      id: string;
      field: keyof ServoCalibrationRow;
      value: any;
    }
  | {
      type: "BATCH_APPLY_COLUMN";
      field: keyof ServoCalibrationRow;
      value: any;
      targetIds: string[];
      scope: "all" | "selected";
    }
  | {
      type: "APPLY_PRESET";
      preset: "safe-classroom" | "full-range";
    };

const initialExternalState: ExternalToolState = {
  servos: [
    {
      id: "srv-pan",
      joint: "Neck Pan (Yaw)",
      minAngle: -60,
      maxAngle: 60,
      torqueLimit: "medium",
      locked: false,
    },
    {
      id: "srv-tilt",
      joint: "Neck Tilt (Pitch)",
      minAngle: -25,
      maxAngle: 35,
      torqueLimit: "low",
      locked: false,
    },
    {
      id: "srv-roll",
      joint: "Head Roll",
      minAngle: -15,
      maxAngle: 15,
      torqueLimit: "low",
      locked: false,
    },
    {
      id: "srv-arm-l",
      joint: "Left Shoulder",
      minAngle: 0,
      maxAngle: 120,
      torqueLimit: "high",
      locked: true,
    },
  ],
  selectedIds: ["srv-pan", "srv-tilt"],
  sortBy: null,
  sortDir: null,
  lastActionLog: "Initialized external calibration store",
};

function calibrationReducer(
  state: ExternalToolState,
  action: ExternalToolAction,
): ExternalToolState {
  switch (action.type) {
    case "SET_SELECTION":
      return {
        ...state,
        selectedIds: action.selectedIds,
        lastActionLog: `Selection updated (${action.selectedIds.length} rows via ${action.reason})`,
      };
    case "SET_SORT":
      return {
        ...state,
        sortBy: action.direction ? action.columnId : null,
        sortDir: action.direction,
        lastActionLog: `Sorted by ${action.columnId} (${action.direction ?? "none"})`,
      };
    case "UPDATE_SERVO_FIELD":
      return {
        ...state,
        servos: state.servos.map((s) =>
          s.id === action.id ? { ...s, [action.field]: action.value } : s,
        ),
        lastActionLog: `Updated ${action.id}.${action.field} = ${String(action.value)}`,
      };
    case "BATCH_APPLY_COLUMN": {
      const idSet = new Set(action.targetIds);
      return {
        ...state,
        servos: state.servos.map((s) =>
          idSet.has(s.id) && !s.locked
            ? { ...s, [action.field]: action.value }
            : s,
        ),
        lastActionLog: `Batch applied ${action.field} = "${String(action.value)}" to ${action.scope} (${action.targetIds.length} rows)`,
      };
    }
    case "APPLY_PRESET": {
      const isSafe = action.preset === "safe-classroom";
      return {
        ...state,
        servos: state.servos.map((s) =>
          s.locked
            ? s
            : {
                ...s,
                torqueLimit: isSafe ? "low" : "high",
                maxAngle: isSafe ? Math.min(s.maxAngle, 30) : 90,
              },
        ),
        lastActionLog: `External tool preset applied: ${action.preset}`,
      };
    }
    default:
      return state;
  }
}

export const SeparatedStateManagement: Story = {
  render: () => {
    const [state, dispatch] = useReducer(
      calibrationReducer,
      initialExternalState,
    );

    const torqueOptions = [
      { label: "Low (Safe)", value: "low" },
      { label: "Medium", value: "medium" },
      { label: "High (Performance)", value: "high" },
    ];

    const columns: TableColumn<ServoCalibrationRow>[] = [
      {
        id: "joint",
        header: "Servo Joint",
        isRowHeader: true,
        cell: ({ row }) => (
          <div className="pb:flex pb:items-center pb:gap-2">
            <span>{row.joint}</span>
            {row.locked && (
              <span className="pb:inline-flex pb:items-center pb:gap-1 pb:px-2 pb:py-0.5 pb:rounded-full pb:bg-gray-200 pb:text-gray-800 pb:text-[10px] pb:font-bold pb:uppercase">
                <Icon name="lock" size="sm" className="pb:w-3 pb:h-3" /> Locked
              </span>
            )}
          </div>
        ),
      },
      {
        id: "minAngle",
        header: "Min Angle (°)",
        width: "135px",
        applyAll: {
          controlType: "number",
          defaultValue: -30,
          onApply: (value, target) =>
            dispatch({
              type: "BATCH_APPLY_COLUMN",
              field: "minAngle",
              value: Number(value),
              targetIds: target.rowIds,
              scope: target.scope,
            }),
        },
        cell: ({ row }) => (
          <TableCellField
            label={`Min angle for ${row.joint}`}
            maxWidth="100px"
          >
            <NumberField
              value={row.minAngle}
              min={-180}
              max={0}
              step={5}
              disabled={row.locked}
              showButtons
              onChange={(val) =>
                dispatch({
                  type: "UPDATE_SERVO_FIELD",
                  id: row.id,
                  field: "minAngle",
                  value: val ?? 0,
                })
              }
            />
          </TableCellField>
        ),
      },
      {
        id: "maxAngle",
        header: "Max Angle (°)",
        width: "135px",
        applyAll: {
          controlType: "number",
          defaultValue: 45,
          onApply: (value, target) =>
            dispatch({
              type: "BATCH_APPLY_COLUMN",
              field: "maxAngle",
              value: Number(value),
              targetIds: target.rowIds,
              scope: target.scope,
            }),
        },
        cell: ({ row }) => (
          <TableCellField
            label={`Max angle for ${row.joint}`}
            maxWidth="100px"
          >
            <NumberField
              value={row.maxAngle}
              min={0}
              max={180}
              step={5}
              disabled={row.locked}
              showButtons
              onChange={(val) =>
                dispatch({
                  type: "UPDATE_SERVO_FIELD",
                  id: row.id,
                  field: "maxAngle",
                  value: val ?? 0,
                })
              }
            />
          </TableCellField>
        ),
      },
      {
        id: "torqueLimit",
        header: "Torque Limit",
        width: "170px",
        showCellCopyAction: true,
        applyAll: {
          options: torqueOptions,
          defaultValue: "low",
          onApply: (value, target) =>
            dispatch({
              type: "BATCH_APPLY_COLUMN",
              field: "torqueLimit",
              value: String(value),
              targetIds: target.rowIds,
              scope: target.scope,
            }),
        },
        cell: ({ row }) => (
          <TableCellField
            label={`Torque limit for ${row.joint}`}
            maxWidth="140px"
          >
            <Select
              options={torqueOptions}
              value={row.torqueLimit}
              disabled={row.locked}
              onChange={(val) =>
                dispatch({
                  type: "UPDATE_SERVO_FIELD",
                  id: row.id,
                  field: "torqueLimit",
                  value: String(val),
                })
              }
            />
          </TableCellField>
        ),
      },
      {
        id: "locked",
        header: "Safety Lock",
        align: "center",
        cell: ({ row }) => (
          <div className="pb:inline-flex pb:justify-center">
            <Field
              label={row.locked ? "Locked" : "Unlocked"}
              labelPlacement="end"
              labelWeight="normal"
              inline
            >
              <Checkbox
                checked={row.locked}
                onCheckedChange={(checked) =>
                  dispatch({
                    type: "UPDATE_SERVO_FIELD",
                    id: row.id,
                    field: "locked",
                    value: checked,
                  })
                }
              />
            </Field>
          </div>
        ),
      },
    ];

    return (
      <div className="pb:grid pb:grid-cols-1 lg:pb:grid-cols-3 pb:gap-6">
        <div className="lg:pb:col-span-2 pb:space-y-4">
          <div className="pb:flex pb:flex-wrap pb:items-center pb:justify-between pb:gap-2">
            <div>
              <Heading level={4} color="darkblue">
                External Tool Reducer + Stateless Table UI
              </Heading>
              <Text size="xs" color="muted">
                The <code>&lt;Table&gt;</code> holds zero internal data state.
                Locked rows automatically disable selection via{" "}
                <code>isRowSelectable</code>.
              </Text>
            </div>
            <div className="pb:flex pb:gap-2">
              <Button
                size="xs"
                color="teal"
                variant="soft"
                onClick={() =>
                  dispatch({ type: "APPLY_PRESET", preset: "safe-classroom" })
                }
              >
                Preset: Classroom Safe
              </Button>
              <Button
                size="xs"
                color="neutral"
                onClick={() =>
                  dispatch({ type: "APPLY_PRESET", preset: "full-range" })
                }
              >
                Preset: Full Range
              </Button>
            </div>
          </div>

          <Table
            caption="Servo Motor Calibration Table"
            hideCaption
            columns={columns}
            data={state.servos}
            selectable
            isRowSelectable={(row) => !row.locked}
            selectedRowIds={state.selectedIds}
            onSelectionChange={(nextIds, details) =>
              dispatch({
                type: "SET_SELECTION",
                selectedIds: nextIds,
                reason: details.type,
              })
            }
            sortColumn={state.sortBy}
            sortDirection={state.sortDir}
            onSortChange={(columnId, direction) =>
              dispatch({ type: "SET_SORT", columnId, direction })
            }
          />
        </div>

        <div className="pb:p-4 pb:rounded-2xl pb:bg-gray-900 pb:text-gray-100 pb:font-mono pb:text-xs pb:space-y-3 pb:self-start">
          <div className="pb:flex pb:items-center pb:justify-between pb:border-b pb:border-gray-700 pb:pb-2">
            <span className="pb:text-peerbots-teal pb:font-bold pb:uppercase">
              External Tool Store State
            </span>
            <span className="pb:text-[10px] pb:px-2 pb:py-0.5 pb:rounded pb:bg-gray-800">
              useReducer
            </span>
          </div>
          <div className="pb:text-amber-300 pb:bg-gray-800/80 pb:p-2 pb:rounded-lg">
            Last Dispatch: {state.lastActionLog}
          </div>
          <div>
            <div className="pb:text-gray-400 pb:mb-1">selectedIds:</div>
            <pre className="pb:bg-gray-950 pb:p-2 pb:rounded">
              {JSON.stringify(state.selectedIds)}
            </pre>
          </div>
          <div>
            <div className="pb:text-gray-300 pb:mb-1">servos:</div>
            <pre
              role="region"
              tabIndex={0}
              aria-label="Servo store state JSON"
              className="pb:bg-gray-950 pb:p-2 pb:rounded pb:max-h-56 pb:overflow-auto pb:focus-visible:outline-2 pb:focus-visible:outline-peerbots-teal"
            >
              {JSON.stringify(state.servos, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  },
};

/* ============================================================================
 * 4. Responsive Container-Query Layout (Stacked Mobile Cards vs Desktop)
 * ========================================================================== */

export const ResponsiveStackedComparison: Story = {
  render: () => {
    const [containerWidth, setContainerWidth] = useState<string>("380px");
    const table = useTableState<ExpressionCueRow>({
      initialData: initialCueRows.slice(0, 3),
    });

    const columns: TableColumn<ExpressionCueRow>[] = [
      {
        id: "cueName",
        header: "Cue Name",
        isRowHeader: true,
      },
      {
        id: "emotion",
        header: "Emotion",
        applyAll: {
          options: emotionOptions,
          defaultValue: "happy",
          onApply: (val, target) =>
            table.applyToColumn("emotion", String(val), {
              rowIds: target.rowIds,
            }),
        },
        cell: ({ row, rowId }) => (
          <TableCellField label={`Emotion for ${row.cueName}`}>
            <Select
              options={emotionOptions}
              value={row.emotion}
              onChange={(val) =>
                val != null && table.updateCell(rowId, "emotion", String(val))
              }
            />
          </TableCellField>
        ),
      },
      {
        id: "speed",
        header: "Voice Speed",
        cell: ({ row, rowId }) => (
          <TableCellField label={`Speed for ${row.cueName}`}>
            <NumberField
              value={row.speed}
              min={0.5}
              max={2.0}
              step={0.1}
              showButtons
              onChange={(val) =>
                val != null && table.updateCell(rowId, "speed", val)
              }
            />
          </TableCellField>
        ),
      },
      {
        id: "autoPlay",
        header: "Auto-Play",
        cell: ({ row, rowId }) => (
          <Field
            label={row.autoPlay ? "Enabled" : "Disabled"}
            labelPlacement="end"
            labelWeight="normal"
            inline
          >
            <Switch
              checked={row.autoPlay}
              onChange={(checked) =>
                table.updateCell(rowId, "autoPlay", checked)
              }
            />
          </Field>
        ),
      },
    ];

    return (
      <div className="pb:space-y-4">
        <div className="pb:flex pb:flex-wrap pb:items-center pb:justify-between pb:gap-3 pb:p-4 pb:rounded-xl pb:bg-gray-50 pb:border pb:border-gray-200">
          <div>
            <Heading level={4} color="darkblue">
              Container Query Responsiveness (<code>@container (width &lt; 600px)</code>)
            </Heading>
            <Text size="xs" color="muted">
              Because responsiveness uses CSS <code>@container</code> queries on{" "}
              <code>.pb-table-wrapper</code>, the table adapts automatically
              whether on a mobile phone or inside a narrow tool sidebar!
            </Text>
          </div>
          <div className="pb:flex pb:items-center pb:gap-2">
            <Button
              size="xs"
              color={containerWidth === "380px" ? "primary" : "neutral"}
              onClick={() => setContainerWidth("380px")}
            >
              Mobile Sidebar (380px)
            </Button>
            <Button
              size="xs"
              color={containerWidth === "540px" ? "primary" : "neutral"}
              onClick={() => setContainerWidth("540px")}
            >
              Compact Panel (540px)
            </Button>
            <Button
              size="xs"
              color={containerWidth === "100%" ? "primary" : "neutral"}
              onClick={() => setContainerWidth("100%")}
            >
              Full Desktop (100%)
            </Button>
          </div>
        </div>

        <div
          style={{ width: containerWidth, maxWidth: "100%" }}
          className="pb:transition-all pb:duration-300 pb:border-2 pb:border-dashed pb:border-peerbots-teal/50 pb:p-2 pb:rounded-2xl"
        >
          <Table
            caption="Responsive Container Table Preview"
            hideCaption
            columns={columns}
            data={table.visibleData}
            selectable
            selectedRowIds={table.selectedRowIds}
            onSelectionChange={table.onSelectionChange}
            responsiveMode="stack"
          />
        </div>
      </div>
    );
  },
};

/* ============================================================================
 * 5. Composable Semantic Primitives (`Table.Root`, `Table.RowHeader`, `Field`)
 * ========================================================================== */

export const ComposablePrimitives: Story = {
  render: () => {
    const [volume, setVolume] = useState(80);
    const [pitch, setPitch] = useState(1.0);

    return (
      <div className="pb:max-w-3xl pb:space-y-3">
        <Heading level={4} color="darkblue">
          Composable Table Primitives
        </Heading>
        <Text size="xs" color="muted">
          Use <code>Table.Container</code>, <code>Table.Root</code>,{" "}
          <code>Table.Header</code>, <code>Table.Body</code>,{" "}
          <code>Table.RowHeader</code>, and <code>Table.Cell</code> when building
          custom table layouts with <code>&lt;Field&gt;</code> components.
        </Text>

        <Table
          ariaLabel="Audio Output Channel Settings"
          columnLabels={["Channel", "Gain / Parameter", "Status"]}
        >
          <Table.Header>
            <Table.Row>
              <Table.Head>Audio Channel</Table.Head>
              <Table.Head>Parameter Control</Table.Head>
              <Table.Head align="end">Current Readout</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.RowHeader>Master Speaker Gain</Table.RowHeader>
              <Table.Cell>
                <Field
                  label="Volume (%)"
                  labelPlacement="left"
                  labelWeight="normal"
                >
                  <NumberField
                    value={volume}
                    min={0}
                    max={100}
                    step={5}
                    showButtons
                    onChange={(v) => setVolume(v ?? 0)}
                  />
                </Field>
              </Table.Cell>
              <Table.Cell align="end" className="pb:font-mono pb:font-bold">
                {volume}%
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.RowHeader>Voice Pitch Shift</Table.RowHeader>
              <Table.Cell>
                <Field
                  label="Pitch Multiplier"
                  labelPlacement="left"
                  labelWeight="normal"
                >
                  <NumberField
                    value={pitch}
                    min={0.5}
                    max={2.0}
                    step={0.1}
                    showButtons
                    onChange={(v) => setPitch(v ?? 1.0)}
                  />
                </Field>
              </Table.Cell>
              <Table.Cell align="end" className="pb:font-mono pb:font-bold">
                {pitch.toFixed(1)}x
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    );
  },
};

/* ============================================================================
 * 6. Expandable Rows, Pagination, Loading & Empty States
 * ========================================================================== */

export const ExpandableRowsAndPagination: Story = {
  render: () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showEmpty, setShowEmpty] = useState(false);

    const table = useTableState<RobotFleetRow>({
      initialData: initialFleetData,
      paginate: true,
      initialPageSize: 3,
    });

    const columns: TableColumn<RobotFleetRow>[] = [
      { id: "name", header: "Robot Name", isRowHeader: true, sortable: true },
      { id: "model", header: "Model", sortable: true },
      { id: "location", header: "Assigned Room", sortable: true },
      {
        id: "battery",
        header: "Battery",
        align: "end",
        cell: ({ row }) => `${row.battery}%`,
      },
    ];

    return (
      <div className="pb:space-y-4">
        <div className="pb:flex pb:flex-wrap pb:items-center pb:gap-2">
          <Button
            size="xs"
            color={isLoading ? "primary" : "neutral"}
            onClick={() => setIsLoading((prev) => !prev)}
          >
            {isLoading ? "Stop Loading Skeleton" : "Simulate Loading State"}
          </Button>
          <Button
            size="xs"
            color={showEmpty ? "primary" : "neutral"}
            onClick={() => setShowEmpty((prev) => !prev)}
          >
            {showEmpty ? "Restore Data" : "Simulate Empty State"}
          </Button>
        </div>

        <Table
          caption="Expandable & Paginated Fleet Table"
          hideCaption
          columns={columns}
          data={showEmpty ? [] : table.visibleData}
          isLoading={isLoading}
          loadingRowCount={3}
          selectable
          selectedRowIds={table.selectedRowIds}
          onSelectionChange={table.onSelectionChange}
          expandedRowIds={table.expandedRowIds}
          onExpandChange={table.onExpandChange}
          renderExpandedRow={(row) => (
            <div className="pb:grid pb:grid-cols-1 sm:pb:grid-cols-2 pb:gap-4 pb:p-2">
              <Field
                label="Assigned Room Override"
                description="Changes take effect on next check-in"
              >
                <Input
                  value={row.location}
                  onChange={(e) =>
                    table.updateCell(row.id, "location", e.target.value)
                  }
                />
              </Field>
              <Field
                label="Operating Status"
                description="Set maintenance mode to pause classroom sessions"
              >
                <Select
                  options={["Online", "Charging", "Maintenance"]}
                  value={row.status}
                  onChange={(val) =>
                    val != null &&
                    table.updateCell(
                      row.id,
                      "status",
                      String(val) as RobotFleetRow["status"],
                    )
                  }
                />
              </Field>
            </div>
          )}
          pagination={
            <TablePagination
              page={table.page}
              pageSize={table.pageSize}
              totalItems={showEmpty ? 0 : table.processedData.length}
              onPageChange={table.setPage}
              onPageSizeChange={table.setPageSize}
              pageSizeOptions={[2, 3, 5]}
            />
          }
        />
      </div>
    );
  },
};
