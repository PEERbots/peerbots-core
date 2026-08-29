import type { Meta, StoryObj } from "@storybook/react";
import { Stepper } from "./Stepper";
import { Button } from "./Button";
import { Heading, Text } from "./Typography";
import React, { useState } from "react";

const meta: Meta<typeof Stepper> = {
  title: "Patterns/Stepper",
  component: Stepper,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical", "chips"],
    },
    color: {
      control: "select",
      options: ["teal", "pink", "primary", "neutral"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Stepper>;

const sampleSteps = [
  { id: "account", title: "Account", description: "Enter profile & email" },
  { id: "robot", title: "Select Bot", description: "Choose CAD model" },
  { id: "config", title: "Configure", description: "Set face parameters" },
  { id: "review", title: "Review", description: "Confirm and deploy" },
];

export const Default: Story = {
  args: {
    steps: sampleSteps,
    activeStepId: "config",
    orientation: "horizontal",
    color: "teal",
    className: "pb:w-[600px]",
  },
};

export const InteractiveWizard: Story = {
  render: () => {
    const [currentStepId, setCurrentStepId] = useState("robot");
    const stepIdx = sampleSteps.findIndex((s) => s.id === currentStepId);

    return (
      <div className="pb:flex pb:flex-col pb:gap-6 pb:p-6 pb:bg-white pb:rounded-2xl pb:border pb:border-gray-100 pb:shadow-md pb:w-[560px]">
        <Stepper
          steps={sampleSteps}
          activeStepId={currentStepId}
          onStepClick={setCurrentStepId}
          color="teal"
        />

        <div className="pb:p-6 pb:bg-gray-50 pb:rounded-xl pb:text-center pb:space-y-2">
          <Heading level={3} color="darkblue">
            Step {stepIdx + 1}: {sampleSteps[stepIdx].title}
          </Heading>
          <Text size="sm" color="muted">
            {sampleSteps[stepIdx].description}
          </Text>
        </div>

        <div className="pb:flex pb:items-center pb:justify-between">
          <Button
            color="neutral"
            disabled={stepIdx === 0}
            onClick={() => setCurrentStepId(sampleSteps[stepIdx - 1].id)}
          >
            Previous
          </Button>
          <Button
            color="teal"
            disabled={stepIdx === sampleSteps.length - 1}
            onClick={() => setCurrentStepId(sampleSteps[stepIdx + 1].id)}
          >
            Next Step
          </Button>
        </div>
      </div>
    );
  },
};

export const BuildChipsGuide: Story = {
  render: () => {
    const [focused, setFocused] = useState("face");
    const buildSteps = [
      { id: "base", title: "1. Neck Base" },
      { id: "servos", title: "2. Pan/Tilt Servos" },
      { id: "face", title: "3. Face Plate" },
      { id: "eyes", title: "4. OLED Displays" },
      { id: "cover", title: "5. Outer Shell" },
    ];

    return (
      <div className="pb:p-6 pb:bg-gray-50 pb:rounded-2xl pb:max-w-xl pb:space-y-4">
        <Text size="xs" weight="bold" color="muted" className="pb:uppercase">
          Assembly Steps — Click to Jump
        </Text>
        <Stepper
          orientation="chips"
          steps={buildSteps}
          activeStepId={focused}
          onStepClick={setFocused}
          color="teal"
        />
      </div>
    );
  },
};

export const VerticalOrientation: Story = {
  render: () => (
    <div className="pb:p-6 pb:bg-white pb:rounded-2xl pb:border pb:border-gray-100 pb:w-[380px]">
      <Stepper
        orientation="vertical"
        steps={sampleSteps}
        activeStepId="robot"
        color="pink"
      />
    </div>
  ),
};
