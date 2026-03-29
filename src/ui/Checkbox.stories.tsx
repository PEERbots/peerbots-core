import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./Checkbox";
import { Heading } from "./Typography";
import React from "react";

const meta: Meta<typeof Checkbox> = {
  title: "UI/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

const StatefulCheckbox = (
  props: React.ComponentProps<typeof Checkbox> & { label?: string },
) => {
  const [checked, setChecked] = React.useState(props.checked || false);
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        {...props}
        id="terms"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
      <label
        htmlFor="terms"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {props.label || "Accept terms and conditions"}
      </label>
    </div>
  );
};

export const Default: Story = {
  render: () => <StatefulCheckbox />,
};

export const Variations: Story = {
  render: () => (
    <div className="flex flex-col gap-8 p-4">
      <div className="space-y-4">
        <Heading level={4} className="text-sm font-medium text-black uppercase">
          States
        </Heading>
        <div className="flex flex-col gap-4">
          <StatefulCheckbox label="Default Unchecked" />
          <StatefulCheckbox label="Default Checked" checked={true} />
          <StatefulCheckbox label="Disabled Unchecked" disabled={true} />
          <StatefulCheckbox
            label="Disabled Checked"
            disabled={true}
            checked={true}
          />
        </div>
      </div>
    </div>
  ),
};
