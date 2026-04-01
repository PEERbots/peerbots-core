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
    <div className="pb:flex pb:flex-col pb:gap-8 pb:p-4 pb:max-w-sm">
      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase">
          Input Styles
        </Heading>
        <div className="pb:space-y-4">
          <div className="pb:space-y-1">
            <Text variant="small" className="pb:font-bold">
              With Placeholder
            </Text>
            <Input placeholder="Type here..." />
          </div>
          <div className="pb:space-y-1">
            <Text variant="small" className="pb:font-bold">
              With Value
            </Text>
            <Input defaultValue="Initial value" />
          </div>
          <div className="pb:space-y-1">
            <Text variant="small" className="pb:font-bold">
              Password Type
            </Text>
            <Input type="password" placeholder="Password..." />
          </div>
        </div>
      </div>

      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase">
          States
        </Heading>
        <div className="pb:space-y-4">
          <div className="pb:space-y-1">
            <Text variant="small" className="pb:font-bold">
              Disabled
            </Text>
            <Input disabled defaultValue="Can't edit me" />
          </div>
        </div>
      </div>
    </div>
  ),
};
