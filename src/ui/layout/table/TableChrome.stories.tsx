import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../../forms/Button";
import type { TableDensity } from "../useTableState";
import {
  TableBulkActionBar,
  TablePagination,
  TableToolbar,
} from "./TableChrome";

const meta: Meta<typeof TableToolbar> = {
  title: "Layout/Table/TableChrome",
  component: TableToolbar,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Table chrome subcomponents (`TableToolbar`, `TableBulkActionBar`, and `TablePagination`) for search, density switching, bulk actions, and paging.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TableToolbar>;

export const Default: Story = {
  render: () => {
    const [search, setSearch] = useState("");
    const [density, setDensity] = useState<TableDensity>("comfortable");
    const [selectedCount, setSelectedCount] = useState(2);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    return (
      <div className="pb:rounded-xl pb:border pb:border-gray-200 pb:bg-white pb:overflow-hidden">
        <TableToolbar
          searchValue={search}
          onSearchChange={setSearch}
          density={density}
          onDensityChange={setDensity}
          modifiedCount={1}
          onResetModified={() => {}}
          actionsSlot={
            <Button size="sm" color="teal">
              Add Row
            </Button>
          }
        />
        <TableBulkActionBar
          selectedCount={selectedCount}
          totalCount={24}
          onSelectAllRows={() => setSelectedCount(24)}
          onClearSelection={() => setSelectedCount(0)}
        >
          <Button size="xs" variant="outline" color="danger">
            Delete Selected
          </Button>
        </TableBulkActionBar>
        <div className="pb:p-4 pb:text-xs pb:text-gray-600">
          Density: <strong>{density}</strong> • Search:{" "}
          <strong>{search || "(empty)"}</strong>
        </div>
        <TablePagination
          page={page}
          pageSize={pageSize}
          totalItems={24}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </div>
    );
  },
};
