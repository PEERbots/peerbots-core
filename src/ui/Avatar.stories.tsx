import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "./Avatar";
import { Heading } from "./Typography";

const meta: Meta<typeof Avatar> = {
  title: "UI/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    shape: {
      control: "select",
      options: ["circle", "rounded"],
    },
    name: { control: "text" },
    src: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: {
    name: "Ada Lovelace",
    size: "md",
    shape: "circle",
  },
};

export const Variations: Story = {
  render: () => (
    <div className="pb:flex pb:flex-col pb:gap-6 pb:p-4">
      <div className="pb:space-y-3">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black">
          Sizes with Image
        </Heading>
        <div className="pb:flex pb:flex-wrap pb:gap-3 pb:items-end">
          <Avatar size="xs" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" />
          <Avatar size="sm" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" />
          <Avatar size="md" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" />
          <Avatar size="lg" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" />
          <Avatar size="xl" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" />
        </div>
      </div>

      <div className="pb:space-y-3">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black">
          Initials Fallback (Dynamic Colors)
        </Heading>
        <div className="pb:flex pb:flex-wrap pb:gap-3 pb:items-center">
          <Avatar name="Ada Lovelace" size="md" />
          <Avatar name="BMO Bot" size="md" />
          <Avatar name="Coraline Maker" size="md" />
          <Avatar name="David Porfirio" size="md" />
          <Avatar name="Frankenstein Robot" size="md" />
          <Avatar name="Jacob Roberts" size="md" />
        </div>
      </div>

      <div className="pb:space-y-3">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black">
          Shapes
        </Heading>
        <div className="pb:flex pb:flex-wrap pb:gap-3 pb:items-center">
          <Avatar name="Circle Shape" shape="circle" size="lg" />
          <Avatar name="Rounded Shape" shape="rounded" size="lg" />
        </div>
      </div>

      <div className="pb:space-y-3">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black">
          Generic Icon Fallback
        </Heading>
        <div className="pb:flex pb:flex-wrap pb:gap-3 pb:items-center">
          <Avatar size="sm" />
          <Avatar size="md" />
          <Avatar size="lg" />
        </div>
      </div>
    </div>
  ),
};
