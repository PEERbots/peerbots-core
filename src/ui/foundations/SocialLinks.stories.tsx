import type { Meta, StoryObj } from "@storybook/react";
import { SocialLinks, DEFAULT_PEERBOTS_SOCIAL_LINKS } from "./SocialLinks";
import React from "react";

const meta: Meta<typeof SocialLinks> = {
  title: "Foundations/SocialLinks",
  component: SocialLinks,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof SocialLinks>;

export const Default: Story = {
  args: {
    links: DEFAULT_PEERBOTS_SOCIAL_LINKS,
    size: "md",
    variant: "default",
  },
};

export const Variations: Story = {
  render: () => (
    <div className="pb:flex pb:flex-col pb:gap-6 pb:p-6 pb:bg-slate-900 pb:rounded-2xl">
      <div>
        <p className="pb:text-white/60 pb:text-xs pb:mb-2">White Variant (for dark headers/footers)</p>
        <SocialLinks variant="white" size="md" />
      </div>
      <div>
        <p className="pb:text-white/60 pb:text-xs pb:mb-2">Teal Variant</p>
        <SocialLinks variant="teal" size="md" />
      </div>
    </div>
  ),
};
