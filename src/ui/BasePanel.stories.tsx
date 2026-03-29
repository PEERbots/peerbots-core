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
      <div className="w-[450px] border border-gray-200 rounded-lg shadow-sm bg-white overflow-hidden p-4">
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
        className="p-4 bg-gray-50 rounded-md border border-gray-100 text-black text-center"
      >
        Panel content goes here.
      </UIText>
    ),
  },
};
