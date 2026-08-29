import type { Meta, StoryObj } from "@storybook/react-vite";
import { Collapsible } from "./Collapsible";
import { Heading } from "../foundations/Typography";
import { Input } from "../forms/Input";
import { Button } from "../forms/Button";
import React from "react";

const meta: Meta<typeof Collapsible> = {
  title: "Layout/Collapsible",
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
    <div className="pb:flex pb:flex-col pb:gap-8 pb:p-4 pb:max-w-xl">
      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase">
          States & Styling
        </Heading>
        <div className="pb:space-y-4">
          <Collapsible title="Initially Open" defaultOpen={true}>
            <div className="pb:p-4 pb:bg-gray-50 pb:rounded-md pb:space-y-2">
              <p>This content is visible by default.</p>
              <Input placeholder="Settings value" />
            </div>
          </Collapsible>
          <Collapsible
            title={<span className="pb:font-bold pb:text-peerbots-darkteal">Styled Title Section</span>}
          >
            <div className="pb:p-4 pb:space-y-3">
              <p>Custom styled title disclosure.</p>
              <Button variant="primary" size="sm">Action</Button>
            </div>
          </Collapsible>
        </div>
      </div>
    </div>
  ),
};
