import type { Meta, StoryObj } from "@storybook/react";
import { NumberField } from "./NumberField";
import { useState } from "react";
import { Heading, Text } from "./Typography";

const meta: Meta<typeof NumberField> = {
  title: "UI/NumberField",
  component: NumberField,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
    showButtons: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof NumberField>;

export const Default: Story = {
  args: {
    placeholder: "Enter a number...",
    min: 0,
    max: 100,
  },
};

const InteractiveExample = (args: React.ComponentProps<typeof NumberField>) => {
  const [value, setValue] = useState<number | null>(args.defaultValue ?? 10);
  return (
    <div className="pb:space-y-2">
      <div className="pb:max-w-[200px]">
        <NumberField
          {...args}
          value={value}
          onChange={(val) => setValue(val)}
        />
      </div>
      <Text variant="small">Value: {value}</Text>
    </div>
  );
};

export const Variations: Story = {
  render: () => (
    <div className="pb:flex pb:flex-col pb:gap-12 pb:p-4">
      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase">
          Configuration
        </Heading>
        <div className="pb:grid pb:gap-8">
          <div className="pb:space-y-2">
            <Text variant="small" className="pb:font-bold">
              With Buttons & Large Step
            </Text>
            <NumberField showButtons defaultValue={50} step={10} />
          </div>
          <div className="pb:space-y-2">
            <Text variant="small" className="pb:font-bold">
              Small Step (0.1) & Limits (0-1)
            </Text>
            <NumberField
              showButtons
              defaultValue={0.5}
              step={0.1}
              min={0}
              max={1}
            />
          </div>
          <div className="pb:space-y-2">
            <Text variant="small" className="pb:font-bold">
              Disabled
            </Text>
            <NumberField disabled defaultValue={123} />
          </div>
        </div>
      </div>

      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase">
          Interactive State
        </Heading>
        <InteractiveExample showButtons={true} />
      </div>
    </div>
  ),
};
