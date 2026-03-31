import type { Meta, StoryObj } from "@storybook/react";
import { Alert } from "./Alert";
import React from "react";

const meta: Meta<typeof Alert> = {
  title: "UI/Alert",
  component: Alert,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  args: {
    level: "Info",
    message: "This is a simple informational alert.",
  },
};

export const Variations: Story = {
  render: () => (
    <div className="pb:flex pb:flex-col pb:gap-4 pb:w-[600px] pb:bg-gray-100 pb:p-8">
      <Alert
        level="Error"
        message="Critical connection failure!"
        action={{ name: "Retry", callback: () => alert("Retrying...") }}
      />
      <Alert level="Warning" message="Your session is about to expire." />
      <Alert level="Success" message="Settings saved successfully." />
      <Alert
        level="Info"
        message="New firmware update available."
        action={{ name: "View", callback: () => alert("Viewing update...") }}
      />
    </div>
  ),
};
