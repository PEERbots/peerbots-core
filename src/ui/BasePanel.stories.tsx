import type { Meta, StoryObj } from "@storybook/react";
import { BasePanel } from "./BasePanel";
import { Text as UIText } from "./Typography";

const meta = {
  title: "UI/BasePanel",
  component: BasePanel,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="pb:w-[450px] pb:rounded-lg pb:shadow-sm pb:bg-white pb:overflow-hidden pb:p-4">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof BasePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Example Panel",
    children: (
      <UIText
        variant="small"
        className="pb:p-4 pb:bg-gray-50 pb:rounded-md pb:border pb:border-gray-100 pb:text-black pb:text-center"
      >
        Panel content goes here.
      </UIText>
    ),
  },
};
