import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner } from "./Spinner";

const meta: Meta<typeof Spinner> = {
  title: "Feedback/Spinner",
  component: Spinner,
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
    color: {
      control: "select",
      options: ["primary", "teal", "pink", "neutral", "white"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  args: {
    size: "md",
    color: "teal",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="pb:flex pb:items-center pb:gap-6">
      <div className="pb:flex pb:flex-col pb:items-center pb:gap-2">
        <Spinner size="xs" color="teal" />
        <span className="pb:text-xs pb:text-gray-500">xs</span>
      </div>
      <div className="pb:flex pb:flex-col pb:items-center pb:gap-2">
        <Spinner size="sm" color="teal" />
        <span className="pb:text-xs pb:text-gray-500">sm</span>
      </div>
      <div className="pb:flex pb:flex-col pb:items-center pb:gap-2">
        <Spinner size="md" color="teal" />
        <span className="pb:text-xs pb:text-gray-500">md</span>
      </div>
      <div className="pb:flex pb:flex-col pb:items-center pb:gap-2">
        <Spinner size="lg" color="teal" />
        <span className="pb:text-xs pb:text-gray-500">lg</span>
      </div>
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="pb:flex pb:items-center pb:gap-6 pb:p-4 pb:bg-gray-50 pb:rounded-xl">
      <div className="pb:flex pb:flex-col pb:items-center pb:gap-2">
        <Spinner size="md" color="primary" />
        <span className="pb:text-xs pb:text-gray-500">primary</span>
      </div>
      <div className="pb:flex pb:flex-col pb:items-center pb:gap-2">
        <Spinner size="md" color="teal" />
        <span className="pb:text-xs pb:text-gray-500">teal</span>
      </div>
      <div className="pb:flex pb:flex-col pb:items-center pb:gap-2">
        <Spinner size="md" color="pink" />
        <span className="pb:text-xs pb:text-gray-500">pink</span>
      </div>
      <div className="pb:flex pb:flex-col pb:items-center pb:gap-2">
        <Spinner size="md" color="neutral" />
        <span className="pb:text-xs pb:text-gray-500">neutral</span>
      </div>
      <div className="pb:flex pb:flex-col pb:items-center pb:gap-2 pb:bg-gray-800 pb:p-2 pb:rounded-lg">
        <Spinner size="md" color="white" />
        <span className="pb:text-xs pb:text-white">white</span>
      </div>
    </div>
  ),
};
