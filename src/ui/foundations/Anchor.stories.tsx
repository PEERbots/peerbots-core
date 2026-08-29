import type { Meta, StoryObj } from "@storybook/react";
import { Anchor } from "./Anchor";
import React from "react";

const meta: Meta<typeof Anchor> = {
  title: "Foundations/Anchor",
  component: Anchor,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Anchor>;

export const Default: Story = {
  args: {
    children: "Learn more about Peerbots",
    href: "https://peerbots.org",
    target: "_blank",
    color: "teal",
    underline: "hover",
  },
};

export const Variations: Story = {
  render: () => (
    <div className="pb:flex pb:flex-col pb:gap-4 pb:p-6 pb:bg-white pb:max-w-md">
      <Anchor href="#" color="default">Default Link</Anchor>
      <Anchor href="#" color="teal">Teal Brand Link</Anchor>
      <Anchor href="#" color="pink">Pink Brand Link</Anchor>
      <Anchor href="#" color="muted">Muted Help Link</Anchor>
      <Anchor href="#" color="teal" underline="always">Always Underlined Link</Anchor>
      <Anchor href="#" color="default" variant="ghost">Ghost Interactive Link</Anchor>
    </div>
  ),
};
