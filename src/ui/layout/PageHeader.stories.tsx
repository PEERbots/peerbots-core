import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../forms/Button";
import { PageHeader } from "./PageHeader";

const meta: Meta<typeof PageHeader> = {
  title: "Layout/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {
  args: {
    title: "Template Controller",
    description: "Manage robot speech buttons and interaction flows.",
  },
};

export const Variations: Story = {
  render: () => (
    <div className="pb:flex pb:flex-col pb:gap-6">
      <PageHeader
        title="With Actions"
        description="Includes a right-aligned toolbar action button."
        actions={<Button size="sm">Export Template</Button>}
      />
      <PageHeader title="Title Only" />
    </div>
  ),
};
