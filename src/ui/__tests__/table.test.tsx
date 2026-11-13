import { afterEach, describe, it, expect, vi } from "vitest";
import React from "react";
import axe from "axe-core";
import { cleanup, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import {
  Table,
  TableColumn,
  TableCellField,
  TableToolbar,
  TablePagination,
} from "../layout/Table";
import { Input } from "../forms/Input";
import { Select } from "../forms/Select";
import { Checkbox } from "../forms/Checkbox";
import { PeerbotsI18nProvider } from "../../i18n";

interface TestRow {
  id: string;
  name: string;
  emotion: string;
  speed: number;
}

const sampleRows: TestRow[] = [
  { id: "r1", name: "Greeting", emotion: "happy", speed: 1.0 },
  { id: "r2", name: "Farewell", emotion: "calm", speed: 0.9 },
  { id: "r3", name: "Alert", emotion: "surprised", speed: 1.4 },
];

const sampleColumns: TableColumn<TestRow>[] = [
  {
    id: "name",
    header: "Cue Name",
    isRowHeader: true,
    sortable: true,
  },
  {
    id: "emotion",
    header: "Emotion",
    sortable: true,
    showCellCopyAction: true,
    applyAll: {
      options: [
        { label: "Happy", value: "happy" },
        { label: "Calm", value: "calm" },
      ],
      onApply: vi.fn(),
    },
    cell: ({ row, error }) => (
      <TableCellField label={`Emotion for ${row.name}`} error={error}>
        <Select
          options={[
            { label: "Happy", value: "happy" },
            { label: "Calm", value: "calm" },
            { label: "Surprised", value: "surprised" },
          ]}
          value={row.emotion}
        />
      </TableCellField>
    ),
  },
  {
    id: "speed",
    header: "Speed",
    cell: ({ row, error }) => (
      <TableCellField label={`Speed for ${row.name}`} error={error}>
        <Input type="number" defaultValue={row.speed} />
      </TableCellField>
    ),
  },
];

describe("Refined Table & Table with Field Components", () => {
  it("renders accessible scrollable region, sticky headers, row headers (<th scope='row'>), and CSS --label-N variables", () => {
    const html = renderToString(
      <Table
        caption="Cue Configuration Table"
        columns={sampleColumns}
        data={sampleRows}
      />,
    );

    expect(html).toContain('role="region"');
    expect(html).toContain('tabindex="0"');
    expect(html).toContain("pb-table-wrapper");
    expect(html).toContain("pb-table-responsive-stack");
    expect(html).toContain('scope="col"');
    expect(html).toContain('scope="row"');
    expect(html).toContain("--label-1:&quot;Cue Name&quot;");
    expect(html).toContain("--label-2:&quot;Emotion&quot;");
    expect(html).toContain("--label-3:&quot;Speed&quot;");
    expect(html).toContain('data-has-label="true"');
  });

  it("renders Field / TableCellField controls and field validation errors inside cells", () => {
    const html = renderToString(
      <Table
        columns={sampleColumns}
        data={sampleRows}
        getCellError={(row, colId) =>
          row.id === "r3" && colId === "speed"
            ? "Speed exceeds safe threshold"
            : undefined
        }
        isCellModified={(row, colId) =>
          row.id === "r1" && colId === "emotion"
        }
      />,
    );

    expect(html).toContain("Happy");
    expect(html).toContain("Calm");
    expect(html).toContain("Surprised");
    expect(html).toContain("Speed exceeds safe threshold");
    expect(html).toContain('aria-label="Modified"');
  });

  it("renders row selection checkboxes, indeterminate select-all state, and bulk action bar when controlled", () => {
    const htmlPartial = renderToString(
      <Table
        columns={sampleColumns}
        data={sampleRows}
        selectable
        selectedRowIds={["r1"]}
      />,
    );

    // Indeterminate state on select-all checkbox when 1 of 3 rows is selected
    expect(htmlPartial).toContain('aria-checked="mixed"');
    expect(htmlPartial).toContain("1 selected");
    expect(htmlPartial).toContain("Select all 3 rows");

    const htmlAll = renderToString(
      <Table
        columns={sampleColumns}
        data={sampleRows}
        selectable
        selectedRowIds={["r1", "r2", "r3"]}
      />,
    );
    expect(htmlAll).toContain("3 selected");
  });

  it("renders column header Apply All triggers, cell copy-to-column buttons, and mobile controls bar", () => {
    const html = renderToString(
      <Table
        columns={sampleColumns}
        data={sampleRows}
        selectable
      />,
    );

    expect(html).toContain("Apply all");
    expect(html).toContain("Apply this value to column");
    expect(html).toContain("pb-table-mobile-controls");
  });

  it("supports controlled sorting with aria-sort attributes", () => {
    const htmlAsc = renderToString(
      <Table
        columns={sampleColumns}
        data={sampleRows}
        sortColumn="name"
        sortDirection="asc"
      />,
    );
    expect(htmlAsc).toContain('aria-sort="ascending"');

    const htmlDesc = renderToString(
      <Table
        columns={sampleColumns}
        data={sampleRows}
        sortColumn="name"
        sortDirection="desc"
      />,
    );
    expect(htmlDesc).toContain('aria-sort="descending"');
  });

  it("renders EmptyState when data is empty and Skeleton rows when isLoading is true", () => {
    const emptyHtml = renderToString(
      <Table
        columns={sampleColumns}
        data={[]}
        emptyTitle="No cues configured"
      />,
    );
    expect(emptyHtml).toContain("No cues configured");

    const loadingHtml = renderToString(
      <Table
        columns={sampleColumns}
        data={[]}
        isLoading
        loadingRowCount={3}
      />,
    );
    expect(loadingHtml).toContain("pb:animate-pulse");
  });

  it("supports 3-tier i18n label resolution via PeerbotsI18nProvider and component props", () => {
    const html = renderToString(
      <PeerbotsI18nProvider
        dir="rtl"
        lang="ar"
        labels={{
          table: {
            applyAll: "تطبيق على الكل",
            selectedCount: "تم تحديد {count}",
          },
        }}
      >
        <Table
          columns={sampleColumns}
          data={sampleRows}
          selectable
          selectedRowIds={["r1", "r2"]}
        />
      </PeerbotsI18nProvider>,
    );

    expect(html).toContain("تطبيق على الكل");
    expect(html).toContain("تم تحديد 2");
  });

  it("supports composable semantic primitives (Table.Header, Table.Body, Table.RowHeader, Table.Cell) and Checkbox indeterminate prop", () => {
    const html = renderToString(
      <Table columnLabels={["Setting", "Control"]}>
        <Table.Header>
          <Table.Row>
            <Table.Head>Setting</Table.Head>
            <Table.Head>Control</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.RowHeader>Batch Toggle</Table.RowHeader>
            <Table.Cell>
              <Checkbox indeterminate aria-label="Mixed state checkbox" />
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );

    expect(html).toContain("Batch Toggle");
    expect(html).toContain('aria-checked="mixed"');
  });

  it("renders TableToolbar and TablePagination cleanly", () => {
    const html = renderToString(
      <div>
        <TableToolbar
          searchValue="Greeting"
          onSearchChange={() => {}}
          density="compact"
          onDensityChange={() => {}}
          modifiedCount={2}
          onResetModified={() => {}}
        />
        <TablePagination
          page={2}
          pageSize={5}
          totalItems={12}
          onPageChange={() => {}}
        />
      </div>,
    );

    expect(html).toContain("2 modified");
    expect(html).toContain("Showing 6–10 of 12");
    expect(html).toContain("Page 2 of 3");
  });

  afterEach(() => {
    cleanup();
  });

  it("renders ZERO visible <label> elements inside TableCellField when srOnlyLabel is true while injecting aria-label, and renders visible <label> when srOnlyLabel={false}", async () => {
    const { container } = render(
      <div>
        <Table caption="Cue Table" columns={sampleColumns} data={sampleRows} />
      </div>,
    );

    const tbody = container.querySelector("tbody")!;
    // Zero <label> elements inside tbody when srOnlyLabel defaults to true!
    expect(tbody.querySelectorAll("label")).toHaveLength(0);

    // Every input and select combobox inside tbody still has its descriptive aria-label
    expect(
      screen.getByRole("combobox", { name: "Emotion for Greeting" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("spinbutton", { name: "Speed for Greeting" }),
    ).toBeInTheDocument();

    const axeResults = await axe.run(container, {
      rules: { "color-contrast": { enabled: false } },
    });
    expect(axeResults.violations).toEqual([]);

    cleanup();
    const { container: visibleContainer } = render(
      <TableCellField label="Explicit Visible Label" srOnlyLabel={false}>
        <Input placeholder="Enter text" />
      </TableCellField>,
    );
    const visibleLabels = visibleContainer.querySelectorAll("label");
    expect(visibleLabels).toHaveLength(1);
    expect(visibleLabels[0]).toHaveTextContent("Explicit Visible Label");
  });

  it("forwards style and triggerClassName onto Select trigger with currentColor chevron inheritance", () => {
    const { container } = render(
      <Select
        aria-label="Colored Select"
        options={[
          { label: "Light Blue", value: "Light Blue" },
          { label: "Black", value: "Black" },
        ]}
        value="Black"
        style={{ backgroundColor: "#4D4D4D", color: "#FDFEFE" }}
        triggerClassName="pb:font-semibold"
      />,
    );

    const trigger = screen.getByRole("combobox", { name: "Colored Select" });
    expect(trigger).toHaveStyle({
      backgroundColor: "rgb(77, 77, 77)",
      color: "rgb(253, 254, 254)",
    });
    expect(trigger.className).toContain("pb:font-semibold");
    const iconWrapper = container.querySelector("[data-select-icon]")!;
    expect(iconWrapper.className).toContain("pb:text-current");
  });
});
