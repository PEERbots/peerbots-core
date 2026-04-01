import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "./Switch";
import { useState } from "react";
import { Heading, Text } from "./Typography";

const meta: Meta<typeof Switch> = {
  title: "UI/Switch",
  component: Switch,
  tags: ["autodocs"],
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    onChange: { action: "changed" },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {
    "aria-label": "Default switch",
  },
};

const InteractiveSwitch = () => {
  const [checked, setChecked] = useState(false);
  return (
    <div className="pb:flex pb:flex-col pb:gap-2">
      <Switch
        checked={checked}
        onChange={(val) => setChecked(val)}
        aria-label="Interactive switch"
      />
      <Text variant="small">
        The switch is currently {checked ? "on" : "off"}.
      </Text>
    </div>
  );
};

export const Variations: Story = {
  render: () => (
    <div className="pb:flex pb:flex-col pb:gap-12 pb:p-4">
      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase">
          States
        </Heading>
        <div className="pb:flex pb:flex-col pb:gap-4">
          <div className="pb:flex pb:items-center pb:gap-2">
            <Switch defaultChecked={false} aria-label="Unchecked switch" />
            <Text variant="small">Unchecked</Text>
          </div>
          <div className="pb:flex pb:items-center pb:gap-2">
            <Switch defaultChecked={true} aria-label="Checked switch" />
            <Text variant="small">Checked</Text>
          </div>
          <div className="pb:flex pb:items-center pb:gap-2">
            <Switch disabled aria-label="Disabled switch" />
            <Text variant="small">Disabled Unchecked</Text>
          </div>
          <div className="pb:flex pb:items-center pb:gap-2">
            <Switch
              disabled
              defaultChecked={true}
              aria-label="Disabled checked switch"
            />
            <Text variant="small">Disabled Checked</Text>
          </div>
        </div>
      </div>

      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase">
          Interactive
        </Heading>
        <InteractiveSwitch />
      </div>
    </div>
  ),
};
