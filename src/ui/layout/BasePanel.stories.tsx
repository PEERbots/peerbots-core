import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../forms/Button";
import { Text } from "../foundations/Typography";
import { BasePanel } from "./BasePanel";

const meta: Meta<typeof BasePanel> = {
  title: "Layout/BasePanel",
  component: BasePanel,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Shared docked side-panel shell used by `PeerbotsButtonEditor` and `TemplateAnalysisPanel`, providing a consistent header, heading level, and optional close button.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof BasePanel>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    if (!open) {
      return (
        <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
          Reopen Panel
        </Button>
      );
    }
    return (
      <div className="pb:w-80 pb:rounded-xl pb:border pb:border-gray-200 pb:bg-white pb:p-4 pb:shadow-sm">
        <BasePanel title="Inspector Panel" onClose={() => setOpen(false)}>
          <Text size="sm" color="muted">
            Shared panel chrome used by both the Edit Button panel and the
            Template Analysis panel.
          </Text>
        </BasePanel>
      </div>
    );
  },
};

export const Variations: Story = {
  render: () => (
    <div className="pb:flex pb:flex-wrap pb:gap-6">
      <div className="pb:w-72 pb:rounded-xl pb:border pb:border-gray-200 pb:bg-white pb:p-4 pb:shadow-sm">
        <BasePanel title="Without Close Button" headingLevel={4}>
          <Text size="sm" color="muted">
            Omit <code>onClose</code> when the panel is permanently docked.
          </Text>
        </BasePanel>
      </div>
      <div className="pb:w-72 pb:rounded-xl pb:border pb:border-peerbots-teal/40 pb:bg-teal-50/40 pb:p-4 pb:shadow-sm">
        <BasePanel
          title="Custom Header & Close"
          onClose={() => {}}
          headerClassName="pb:border-b pb:border-peerbots-teal/20 pb:pb-2"
        >
          <Text size="sm" color="muted">
            Supports custom <code>headerClassName</code> and{" "}
            <code>headingLevel</code>.
          </Text>
        </BasePanel>
      </div>
    </div>
  ),
};
