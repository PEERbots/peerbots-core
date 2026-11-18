import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { PasswordInput } from "./PasswordInput";

const meta: Meta<typeof PasswordInput> = {
  title: "Forms/PasswordInput",
  component: PasswordInput,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Single-field password input control built on `<Input>`, pairing an optional leading lock icon with an accessible show/hide visibility toggle (`eye` / `eyeSlash`).",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PasswordInput>;

function ControlledPasswordInput(
  props: React.ComponentProps<typeof PasswordInput>,
) {
  const [val, setVal] = useState(props.value ?? "super-secret-123");
  return (
    <div className="pb:max-w-xs">
      <PasswordInput
        {...props}
        value={val}
        onChange={(e) => setVal(e.target.value)}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <ControlledPasswordInput placeholder="Enter password..." />,
};

export const Variations: Story = {
  render: () => (
    <div className="pb:flex pb:flex-col pb:gap-6 pb:p-4 pb:max-w-xs">
      <ControlledPasswordInput placeholder="Hidden by default" />
      <ControlledPasswordInput
        defaultRevealed
        placeholder="Initially revealed"
      />
      <ControlledPasswordInput
        showLockIcon={false}
        placeholder="Without leading lock icon"
      />
      <ControlledPasswordInput disabled placeholder="Disabled password input" />
    </div>
  ),
};
