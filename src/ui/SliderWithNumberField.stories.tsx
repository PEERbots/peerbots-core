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
    <div className="pb:w-80 pb:p-4">
      <InteractiveSliderWithNumberField
        {...(args as React.ComponentProps<typeof SliderWithNumberField>)}
      />
    </div>
  ),
};

export const Variations: Story = {
  render: () => (
    <div className="pb:flex pb:flex-col pb:gap-12 pb:p-4">
      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase">
          Responsive Layouts
        </Heading>
        <div className="pb:space-y-8 pb:max-w-lg">
          <div className="pb:space-y-2">
            <Text variant="small" className="pb:font-bold pb:underline">
              Flexible (Full width of container)
            </Text>
            <InteractiveSliderWithNumberField defaultValue={50} />
          </div>

          <div className="pb:space-y-2 pb:w-64 pb:border-l pb:border-r pb:border-dotted pb:px-2 pb:bg-gray-50 pb:py-4">
            <Text variant="small" className="pb:font-bold pb:underline">
              Narrow Container (w-64)
            </Text>
            <InteractiveSliderWithNumberField defaultValue={50} />
          </div>

          <div className="pb:space-y-2 pb:w-48 pb:border-l pb:border-r pb:border-dotted pb:px-2 pb:bg-gray-50 pb:py-4">
            <Text variant="small" className="pb:font-bold pb:underline">
              Very Narrow (w-48) - Wraps
            </Text>
            <InteractiveSliderWithNumberField defaultValue={50} />
          </div>
        </div>
      </div>

      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase">
          Configuration
        </Heading>
        <div className="pb:space-y-4 pb:max-w-sm">
          <div className="pb:space-y-1">
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
