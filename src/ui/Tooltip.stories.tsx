import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip, HelperTooltip } from "./Tooltip";
import { Button } from "./Button";
import { Heading } from "./Typography";

const meta: Meta<typeof Tooltip> = {
  title: "UI/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  argTypes: {
    content: { control: "text" },
    delay: { control: "radio", options: ["normal", "slow"] },
  },
  decorators: [
    (Story) => (
      <div className="pb:flex pb:h-32 pb:items-center pb:justify-center">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {
    content: "This is a tooltip",
    children: <span>Hover me</span>,
  },
};

export const Variations: Story = {
  decorators: [
    (Story) => (
      <div className="pb:p-12">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <div className="pb:flex pb:flex-col pb:gap-16">
      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase">
          Placements & Triggers
        </Heading>
        <div className="pb:flex pb:flex-wrap pb:gap-8 pb:items-center pb:justify-center">
          <Tooltip content="Tooltip on button">
            <Button>On Button</Button>
          </Tooltip>
          <Tooltip content="Simple span trigger">
            <span className="pb:cursor-help pb:underline pb:decoration-dotted">
              On Text
            </span>
          </Tooltip>
        </div>
      </div>

      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase">
          Configurations
        </Heading>
        <div className="pb:flex pb:flex-wrap pb:gap-8 pb:items-center pb:justify-center">
          <Tooltip content="I appear slowly" delay="slow">
            <Button variant="secondary">Slow Delay (1s)</Button>
          </Tooltip>
          <Tooltip content="This is a very long tooltip message that should wrap nicely within the tooltip bounds instead of overflowing outside the container.">
            <Button variant="ghost">Long Content wrapping</Button>
          </Tooltip>
        </div>
      </div>

      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase">
          Helper Tooltip
        </Heading>
        <div className="pb:flex pb:flex-wrap pb:gap-8 pb:items-center pb:justify-center">
          <HelperTooltip content="I'm a helper" />
          <HelperTooltip content="This is a much longer message that is trying to illustrate what happens when we have a long message for the helper tooltip." />
        </div>
      </div>
    </div>
  ),
};
