import type { Meta, StoryObj } from "@storybook/react";
import { Anchor } from "./Anchor";

const meta = {
  title: "UI/Anchor",
  component: Anchor,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    href: { control: "text" },
    children: { control: "text" },
  },
} satisfies Meta<typeof Anchor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    href: "https://peerbots.org",
    children: "Visit Peerbots",
  },
};
