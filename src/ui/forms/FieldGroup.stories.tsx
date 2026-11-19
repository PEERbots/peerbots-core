import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FieldGroup } from "./FieldGroup";
import { SliderWithNumberField } from "./SliderWithNumberField";

const meta: Meta<typeof FieldGroup> = {
  title: "Forms/FieldGroup",
  component: FieldGroup,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FieldGroup>;

export const Default: Story = {
  args: {
    label: "Speech Rate",
    description: "Adjust how quickly the robot speaks.",
    children: (
      <SliderWithNumberField
        value={1}
        min={0.5}
        max={2}
        step={0.1}
        onChange={() => undefined}
        aria-label="Speech Rate"
      />
    ),
  },
};

export const Variations: Story = {
  render: () => (
    <div className="pb:flex pb:flex-col pb:gap-6 pb:max-w-md">
      <FieldGroup
        label="Pitch"
        icon={<span aria-hidden="true">🎵</span>}
        description="Controls voice pitch modulation."
      >
        <SliderWithNumberField
          value={1.2}
          min={0.5}
          max={2}
          step={0.1}
          onChange={() => undefined}
          aria-label="Pitch"
        />
      </FieldGroup>
      <FieldGroup label="Without Description">
        <SliderWithNumberField
          value={50}
          min={0}
          max={100}
          step={5}
          onChange={() => undefined}
          aria-label="Volume"
        />
      </FieldGroup>
    </div>
  ),
};
