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
    <div className="space-y-2">
      <div className="max-w-[200px]">
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
    <div className="flex flex-col gap-12 p-4">
      <div className="space-y-4">
        <Heading level={4} className="text-sm font-medium text-black uppercase">
          Configuration
        </Heading>
        <div className="grid gap-8">
          <div className="space-y-2">
            <Text variant="small" className="font-bold">
              With Buttons & Large Step
            </Text>
            <NumberField showButtons defaultValue={50} step={10} />
          </div>
          <div className="space-y-2">
            <Text variant="small" className="font-bold">
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
          <div className="space-y-2">
            <Text variant="small" className="font-bold">
              Disabled
            </Text>
            <NumberField disabled defaultValue={123} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Heading level={4} className="text-sm font-medium text-black uppercase">
          Interactive State
        </Heading>
        <InteractiveExample showButtons={true} />
      </div>
    </div>
  ),
};
