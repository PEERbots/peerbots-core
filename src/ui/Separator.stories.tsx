import type { Meta, StoryObj } from "@storybook/react";
import { Separator } from "./Separator";
import { Heading, Text } from "./Typography";

const meta: Meta<typeof Separator> = {
  title: "UI/Separator",
  component: Separator,
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "radio",
      options: ["horizontal", "vertical"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const Default: Story = {
  args: {
    orientation: "horizontal",
  },
  render: (args) => (
    <div className="pb:w-64">
      <Text>Above the separator</Text>
      <Separator {...args} className="pb:my-4" />
      <Text>Below the separator</Text>
    </div>
  ),
};

export const Variations: Story = {
  render: () => (
    <div className="pb:flex pb:flex-col pb:gap-12 pb:p-4">
      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase">
          Horizontal (Default)
        </Heading>
        <div className="pb:w-64">
          <Text variant="small">Item A</Text>
          <Separator className="pb:my-2" />
          <Text variant="small">Item B</Text>
        </div>
      </div>

      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase">
          Vertical
        </Heading>
        <div className="pb:flex pb:h-8 pb:items-center pb:gap-4 pb:text-sm">
          <Text variant="small">Option 1</Text>
          <Separator orientation="vertical" />
          <Text variant="small">Option 2</Text>
          <Separator orientation="vertical" />
          <Text variant="small">Option 3</Text>
        </div>
      </div>
    </div>
  ),
};
