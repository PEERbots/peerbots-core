import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "./Select";
import { Heading, Text } from "./Typography";

const meta: Meta<typeof Select> = {
  title: "UI/Select",
  component: Select,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
    onChange: { action: "changed" },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

const simpleOptions = ["Option 1", "Option 2", "Option 3"];
const objectOptions = [
  { label: "Banana", value: "banana" },
  { label: "Apple", value: "apple" },
  { label: "Orange", value: "orange" },
];

export const Default: Story = {
  args: {
    options: simpleOptions,
    placeholder: "Select an option...",
  },
};

export const Variations: Story = {
  render: () => (
    <div className="flex flex-col gap-8 p-4 max-w-sm">
      <div className="space-y-4">
        <Heading level={4} className="text-sm font-medium text-black uppercase">
          Option Types
        </Heading>
        <div className="space-y-4">
          <div className="space-y-1">
            <Text variant="small" className="font-bold">
              String Options
            </Text>
            <Select options={simpleOptions} />
          </div>
          <div className="space-y-1">
            <Text variant="small" className="font-bold">
              Object Options (Label/Value)
            </Text>
            <Select options={objectOptions} defaultValue="apple" />
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
            <Select
              options={simpleOptions}
              disabled
              placeholder="Can't select"
            />
          </div>
        </div>
      </div>
    </div>
  ),
};
