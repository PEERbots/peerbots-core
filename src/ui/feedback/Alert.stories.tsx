import type { Meta, StoryObj } from "@storybook/react";
import { Alert } from "./Alert";
import React from "react";

const meta: Meta<typeof Alert> = {
  title: "Feedback/Alert",
  component: Alert,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["info", "success", "warning", "danger", "neutral"],
    },
    variant: {
      control: "select",
      options: ["soft", "outline", "solid"],
    },
    title: { control: "text" },
    message: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  args: {
    color: "info",
    variant: "outline",
    title: "System Update",
    message: "A new robot face configuration has been synchronized to your controller.",
    className: "pb:w-[480px]",
  },
};

export const ColorsAndVariants: Story = {
  render: () => (
    <div className="pb:flex pb:flex-col pb:gap-4 pb:w-[520px]">
      <Alert color="info" variant="outline" title="Info Banner (Outline)" message="New feature release available." />
      <Alert color="success" variant="soft" title="Session Connected" message="Controller paired with robot face." />
      <Alert color="warning" variant="soft" title="Battery Low" message="Robot head battery is below 15%." />
      <Alert
        color="danger"
        variant="soft"
        title="Connection Failed"
        message="Unable to reach the WebSocket server."
        action={{ name: "Retry", callback: () => console.log("Retrying...") }}
      />
      <Alert color="danger" variant="outline" title="Outline Danger" message="Action cannot be undone." />
      <Alert color="success" variant="solid" title="Solid Success" message="Changes published successfully." />
    </div>
  ),
};
