import type { Meta, StoryObj } from "@storybook/react";
import { CopyButton } from "./CopyButton";
import { Heading } from "../foundations/Typography";

const meta: Meta<typeof CopyButton> = {
  title: "Patterns/CopyButton",
  component: CopyButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "danger", "ghost", "ghostly-danger"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    value: { control: "text" },
    label: { control: "text" },
    successLabel: { control: "text" },
    timeout: { control: "number" },
  },
};

export default meta;
type Story = StoryObj<typeof CopyButton>;

export const Default: Story = {
  args: {
    value: "https://peerbots.org/session/12345",
    label: "Copy Link",
    successLabel: "Link Copied!",
    variant: "secondary",
  },
};

export const Variations: Story = {
  render: () => (
    <div className="pb:flex pb:flex-col pb:gap-6 pb:p-4">
      <div className="pb:space-y-3">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black">
          Variants
        </Heading>
        <div className="pb:flex pb:flex-wrap pb:gap-3 pb:items-center">
          <CopyButton value="Code Snippet" variant="primary" label="Copy Primary" />
          <CopyButton value="Code Snippet" variant="secondary" label="Copy Secondary" />
          <CopyButton value="Code Snippet" variant="ghost" label="Copy Ghost" />
        </div>
      </div>

      <div className="pb:space-y-3">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black">
          Sizes
        </Heading>
        <div className="pb:flex pb:flex-wrap pb:gap-3 pb:items-center">
          <CopyButton value="Short Link" size="sm" label="Small" />
          <CopyButton value="Short Link" size="md" label="Medium" />
          <CopyButton value="Short Link" size="lg" label="Large" />
        </div>
      </div>

      <div className="pb:space-y-3">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black">
          Icon Only
        </Heading>
        <div className="pb:flex pb:flex-wrap pb:gap-3 pb:items-center">
          <CopyButton value="Secret Token" isIconOnly size="sm" />
          <CopyButton value="Secret Token" isIconOnly size="md" />
          <CopyButton value="Secret Token" isIconOnly size="lg" />
        </div>
      </div>
    </div>
  ),
};
