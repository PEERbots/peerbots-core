import type { Meta, StoryObj } from "@storybook/react";
import SliderWithNumberField from "./SliderWithNumberField";
import React, { useState } from "react";
import { Heading, Text } from "../foundations/Typography";

const meta: Meta<typeof SliderWithNumberField> = {
  title: "Forms/SliderWithNumberField",
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
    <div className="pb:p-6 pb:bg-white pb:rounded-2xl pb:border pb:border-gray-200 pb:shadow-xs pb:w-[420px] pb:space-y-2">
      <div className="pb:flex pb:justify-between pb:items-center pb:mb-1">
        <Text size="sm" weight="bold">Output Volume</Text>
        <Text size="xs" color="muted">0 – 100%</Text>
      </div>
      <InteractiveSliderWithNumberField
        aria-label="Output volume"
        {...(args as React.ComponentProps<typeof SliderWithNumberField>)}
      />
    </div>
  ),
};

export const WithStepperButtons: Story = {
  render: () => (
    <div className="pb:p-6 pb:bg-white pb:rounded-2xl pb:border pb:border-gray-200 pb:shadow-xs pb:w-[460px] pb:space-y-2">
      <div className="pb:flex pb:justify-between pb:items-center pb:mb-1">
        <Text size="sm" weight="bold">Head Tilt Angle</Text>
        <Text size="xs" color="muted">-45° to +45°</Text>
      </div>
      <InteractiveSliderWithNumberField
        aria-label="Head tilt angle"
        min={-45}
        max={45}
        defaultValue={0}
        step={1}
        showButtons={true}
      />
    </div>
  ),
};

export const DecimalPrecision: Story = {
  render: () => (
    <div className="pb:p-6 pb:bg-white pb:rounded-2xl pb:border pb:border-gray-200 pb:shadow-xs pb:w-[420px] pb:space-y-2">
      <div className="pb:flex pb:justify-between pb:items-center pb:mb-1">
        <Text size="sm" weight="bold">Speaking Pitch Multiplier</Text>
        <Text size="xs" color="muted">0.5x – 2.0x (step 0.05)</Text>
      </div>
      <InteractiveSliderWithNumberField
        aria-label="Speaking pitch multiplier"
        min={0.5}
        max={2.0}
        step={0.05}
        defaultValue={1.0}
      />
    </div>
  ),
};

export const Variations: Story = {
  render: () => (
    <div className="pb:flex pb:flex-col pb:gap-8 pb:p-4 pb:max-w-lg">
      <div className="pb:space-y-4">
        <span className="pb:text-xs pb:font-bold pb:text-gray-700 pb:uppercase pb:tracking-wider pb:block">
          Robot Motor & Audio Settings
        </span>
        <div className="pb:space-y-6 pb:p-6 pb:bg-gray-50 pb:rounded-2xl pb:border pb:border-gray-200">
          <div className="pb:space-y-1.5">
            <Text size="xs" weight="bold">Motor Sensitivity</Text>
            <InteractiveSliderWithNumberField
              aria-label="Motor sensitivity"
              min={1}
              max={10}
              defaultValue={7}
            />
          </div>

          <div className="pb:space-y-1.5">
            <Text size="xs" weight="bold">Eye Blink Frequency (Hz)</Text>
            <InteractiveSliderWithNumberField
              aria-label="Eye blink frequency"
              min={0.1}
              max={5.0}
              step={0.1}
              defaultValue={1.2}
              showButtons={true}
            />
          </div>

          <div className="pb:space-y-1.5">
            <Text size="xs" weight="bold" color="muted">Disabled Axis (Locked)</Text>
            <InteractiveSliderWithNumberField
              aria-label="Locked axis"
              disabled
              defaultValue={0}
            />
          </div>
        </div>
      </div>
    </div>
  ),
};
