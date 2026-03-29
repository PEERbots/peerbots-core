import type { Meta, StoryObj } from "@storybook/react";
import SliderWithNumberField from "./SliderWithNumberField";
import React, { useState } from "react";
import { Heading, Text } from "./Typography";

const meta: Meta<typeof SliderWithNumberField> = {
  title: "UI/SliderWithNumberField",
  component: SliderWithNumberField,
  argTypes: {
    onChange: { action: "changed" },
    min: { control: { type: "number" } },
    max: { control: { type: "number" } },
    step: { control: { type: "number" } },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof SliderWithNumberField>;

const InteractiveSliderWithNumberField = (
  props: React.ComponentProps<typeof SliderWithNumberField>,
) => {
  const [value, setValue] = useState(props.value || props.defaultValue || 0);
  return (
    <SliderWithNumberField
      {...props}
      value={value}
      onChange={(v) => {
        setValue(v);
        props.onChange?.(v as number, new Event("change")); // Match signature
      }}
    />
  );
};

export const Default: Story = {
  args: {
    min: 0,
    max: 100,
    defaultValue: 50,
  },
  render: (args) => (
    <div className="w-80 p-4">
      <InteractiveSliderWithNumberField
        {...(args as React.ComponentProps<typeof SliderWithNumberField>)}
      />
    </div>
  ),
};

export const Variations: Story = {
  render: () => (
    <div className="flex flex-col gap-12 p-4">
      <div className="space-y-4">
        <Heading level={4} className="text-sm font-medium text-black uppercase">
          Responsive Layouts
        </Heading>
        <div className="space-y-8 max-w-lg">
          <div className="space-y-2">
            <Text variant="small" className="font-bold underline">
              Flexible (Full width of container)
            </Text>
            <InteractiveSliderWithNumberField defaultValue={50} />
          </div>

          <div className="space-y-2 w-64 border-l border-r border-dotted px-2 bg-gray-50 py-4">
            <Text variant="small" className="font-bold underline">
              Narrow Container (w-64)
            </Text>
            <InteractiveSliderWithNumberField defaultValue={50} />
          </div>

          <div className="space-y-2 w-48 border-l border-r border-dotted px-2 bg-gray-50 py-4">
            <Text variant="small" className="font-bold underline">
              Very Narrow (w-48) - Wraps
            </Text>
            <InteractiveSliderWithNumberField defaultValue={50} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Heading level={4} className="text-sm font-medium text-black uppercase">
          Configuration
        </Heading>
        <div className="space-y-4 max-w-sm">
          <div className="space-y-1">
            <Text variant="small">Custom Step (0.5)</Text>
            <InteractiveSliderWithNumberField
              step={0.5}
              defaultValue={2.5}
              min={0}
              max={10}
            />
          </div>
        </div>
      </div>
    </div>
  ),
};
