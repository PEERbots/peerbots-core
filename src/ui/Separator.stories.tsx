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
    <div className="w-64">
      <Text>Above the separator</Text>
      <Separator {...args} className="my-4" />
      <Text>Below the separator</Text>
    </div>
  ),
};

export const Variations: Story = {
  render: () => (
    <div className="flex flex-col gap-12 p-4">
      <div className="space-y-4">
        <Heading level={4} className="text-sm font-medium text-black uppercase">
          Horizontal (Default)
        </Heading>
        <div className="w-64">
          <Text variant="small">Item A</Text>
          <Separator className="my-2" />
          <Text variant="small">Item B</Text>
        </div>
      </div>

      <div className="space-y-4">
        <Heading level={4} className="text-sm font-medium text-black uppercase">
          Vertical
        </Heading>
        <div className="flex h-8 items-center gap-4 text-sm">
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
