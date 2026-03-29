import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";
import { Heading, Text } from "./Typography";

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
};

export const Variations: Story = {
  render: () => (
    <div className="flex flex-col gap-8 p-4 max-w-sm">
      <div className="space-y-4">
        <Heading level={4} className="text-sm font-medium text-black uppercase">
          Input Styles
        </Heading>
        <div className="space-y-4">
          <div className="space-y-1">
            <Text variant="small" className="font-bold">
              With Placeholder
            </Text>
            <Input placeholder="Type here..." />
          </div>
          <div className="space-y-1">
            <Text variant="small" className="font-bold">
              With Value
            </Text>
            <Input defaultValue="Initial value" />
          </div>
          <div className="space-y-1">
            <Text variant="small" className="font-bold">
              Password Type
            </Text>
            <Input type="password" placeholder="Password..." />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Heading level={4} className="text-sm font-medium text-black uppercase">
          States
        </Heading>
        <div className="space-y-4">
          <div className="space-y-1">
            <Text variant="small" className="font-bold">
              Disabled
            </Text>
            <Input disabled defaultValue="Can't edit me" />
          </div>
        </div>
      </div>
    </div>
  ),
};
