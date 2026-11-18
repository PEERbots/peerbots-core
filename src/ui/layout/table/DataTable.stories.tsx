import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { DataTable } from "./DataTable";
import type { TableColumn } from "./types";

interface DemoRow {
  id: string;
  title: string;
  emotion: string;
  durationSec: number;
}

const ROWS: DemoRow[] = [
  { id: "1", title: "Wave Hello", emotion: "Happy", durationSec: 2 },
  { id: "2", title: "Ask Name", emotion: "Neutral", durationSec: 3 },
  { id: "3", title: "Empathy Check", emotion: "Concerned", durationSec: 4 },
  { id: "4", title: "Celebrate", emotion: "Surprised", durationSec: 2 },
];

const COLUMNS: TableColumn<DemoRow>[] = [
  { id: "title", accessorKey: "title", header: "Button Title", sortable: true },
  { id: "emotion", accessorKey: "emotion", header: "Emotion", sortable: true },
  {
    id: "durationSec",
    accessorKey: "durationSec",
    header: "Duration (s)",
    align: "end",
    sortable: true,
  },
];

const meta: Meta<typeof DataTable> = {
  title: "Layout/Table/DataTable",
  component: DataTable,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Declarative data-driven `DataTable` with built-in selection, sorting, search, pagination, and responsive card/scroll modes.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DataTable>;

export const Default: Story = {
  render: () => {
    const [selectedIds, setSelectedIds] = useState<string[]>(["2"]);
    return (
      <DataTable
        caption="Sample Prompt Rows"
        columns={COLUMNS}
        data={ROWS}
        selectable
        selectedRowIds={selectedIds}
        onSelectionChange={(next) => setSelectedIds(next)}
      />
    );
  },
};

export const Variations: Story = {
  render: () => (
    <div className="pb:space-y-6">
      <DataTable
        caption="Loading Skeleton State"
        columns={COLUMNS}
        data={[]}
        isLoading
      />
      <DataTable
        caption="Empty State"
        columns={COLUMNS}
        data={[]}
        emptyTitle="No prompts yet"
        emptyDescription="Add a prompt button to populate this table."
      />
    </div>
  ),
};
