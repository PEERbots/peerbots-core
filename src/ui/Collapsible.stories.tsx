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
      <div className="pb:p-4 pb:bg-gray-50 pb:rounded-md">
        This is the collapsible content. It can contain any elements.
      </div>
    ),
  },
};

export const Variations: Story = {
  render: () => (
    <div className="pb:flex pb:flex-col pb:gap-8 pb:p-4">
      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase">
          States & Styling
        </Heading>
        <div className="pb:space-y-4">
          <Collapsible title="Initially Open" defaultOpen={true}>
            <div className="pb:p-4 pb:bg-gray-50 pb:rounded-md">
              This content is visible by default.
            </div>
          </Collapsible>
          <Collapsible
            title={<span className="pb:font-bold pb:text-primary">Styled Title</span>}
            className="pb:border pb:border-gray-200 pb:rounded-lg pb:overflow-hidden"
          >
            <div className="pb:p-4">Custom styled wrapper and title.</div>
          </Collapsible>
        </div>
      </div>

      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase">
          Variants
        </Heading>
        <div className="pb:space-y-4">
          <Collapsible title="Secondary (Default)" variant="secondary">
            <div className="pb:p-4 pb:bg-gray-50 pb:rounded-md">
              Secondary variant content.
            </div>
          </Collapsible>
          <Collapsible title="Ghost" variant="ghost">
            <div className="pb:p-4 pb:bg-gray-50 pb:rounded-md">
              Ghost variant content.
            </div>
          </Collapsible>
          <Collapsible title="Primary" variant="primary">
            <div className="pb:p-4 pb:bg-gray-50 pb:rounded-md">
              Primary variant content.
            </div>
          </Collapsible>
        </div>
      </div>

      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase">
          Sizes
        </Heading>
        <div className="pb:space-y-4">
          <Collapsible title="Small" size="sm">
            <div className="pb:p-4 pb:bg-gray-50 pb:rounded-md">Small size content.</div>
          </Collapsible>
          <Collapsible title="Medium (Default)" size="md">
            <div className="pb:p-4 pb:bg-gray-50 pb:rounded-md">
              Medium size content.
            </div>
          </Collapsible>
          <Collapsible title="Large" size="lg">
            <div className="pb:p-4 pb:bg-gray-50 pb:rounded-md">Large size content.</div>
          </Collapsible>
        </div>
      </div>
    </div>
  ),
};
