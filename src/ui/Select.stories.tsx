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
    <div className="pb:flex pb:flex-col pb:gap-8 pb:p-4 pb:max-w-sm">
      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase">
          Option Types
        </Heading>
        <div className="pb:space-y-4">
          <div className="pb:space-y-1">
            <Text variant="small" className="pb:font-bold">
              String Options
            </Text>
            <Select options={simpleOptions} />
          </div>
          <div className="pb:space-y-1">
            <Text variant="small" className="pb:font-bold">
              Object Options (Label/Value)
            </Text>
            <Select options={objectOptions} defaultValue="apple" />
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
