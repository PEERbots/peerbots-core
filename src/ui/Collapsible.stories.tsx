import type { Meta, StoryObj } from "@storybook/react";
import { Collapsible } from "./Collapsible";
import { Heading } from "./Typography";
import React from "react";

const meta: Meta<typeof Collapsible> = {
  title: "UI/Collapsible",
  component: Collapsible,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Collapsible>;

export const Default: Story = {
  args: {
    title: "Click to expand",
    children: (
      <div className="p-4 bg-gray-50 rounded-md">
        This is the collapsible content. It can contain any elements.
      </div>
    ),
  },
};

export const Variations: Story = {
  render: () => (
    <div className="flex flex-col gap-8 p-4">
      <div className="space-y-4">
        <Heading level={4} className="text-sm font-medium text-black uppercase">
          States & Styling
        </Heading>
        <div className="space-y-4">
          <Collapsible title="Initially Open" defaultOpen={true}>
            <div className="p-4 bg-gray-50 rounded-md">
              This content is visible by default.
            </div>
          </Collapsible>
          <Collapsible
            title={<span className="font-bold text-primary">Styled Title</span>}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div className="p-4">Custom styled wrapper and title.</div>
          </Collapsible>
        </div>
      </div>

      <div className="space-y-4">
        <Heading level={4} className="text-sm font-medium text-black uppercase">
          Variants
        </Heading>
        <div className="space-y-4">
          <Collapsible title="Secondary (Default)" variant="secondary">
            <div className="p-4 bg-gray-50 rounded-md">
              Secondary variant content.
            </div>
          </Collapsible>
          <Collapsible title="Ghost" variant="ghost">
            <div className="p-4 bg-gray-50 rounded-md">
              Ghost variant content.
            </div>
          </Collapsible>
          <Collapsible title="Primary" variant="primary">
            <div className="p-4 bg-gray-50 rounded-md">
              Primary variant content.
            </div>
          </Collapsible>
        </div>
      </div>

      <div className="space-y-4">
        <Heading level={4} className="text-sm font-medium text-black uppercase">
          Sizes
        </Heading>
        <div className="space-y-4">
          <Collapsible title="Small" size="sm">
            <div className="p-4 bg-gray-50 rounded-md">Small size content.</div>
          </Collapsible>
          <Collapsible title="Medium (Default)" size="md">
            <div className="p-4 bg-gray-50 rounded-md">
              Medium size content.
            </div>
          </Collapsible>
          <Collapsible title="Large" size="lg">
            <div className="p-4 bg-gray-50 rounded-md">Large size content.</div>
          </Collapsible>
        </div>
      </div>
    </div>
  ),
};
