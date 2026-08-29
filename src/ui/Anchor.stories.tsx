import type { Meta, StoryObj } from "@storybook/react";
import { Anchor } from "./Anchor";

const meta = {
  title: "Foundations/Anchor",
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
    variant: "default",
  },
};

export const Variants: Story = {
  render: () => (
    <div className="pb:flex pb:flex-col pb:gap-4 pb:p-6">
      <Anchor href="#" variant="default">Default Link</Anchor>
      <Anchor href="#" variant="teal">Teal Brand Link</Anchor>
      <Anchor href="#" variant="pink">Pink Brand Link</Anchor>
      <Anchor href="#" variant="underline">Underline Teal Link</Anchor>
      <Anchor href="#" variant="underline-pink">Underline Pink Link</Anchor>
      <Anchor href="#" variant="muted">Muted Link</Anchor>
    </div>
  ),
};
