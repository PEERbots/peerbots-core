import { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "./Skeleton";

const meta: Meta<typeof Skeleton> = {
  title: "UI/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  args: {
    className: "w-[250px] h-4",
  },
};

export const Variations: Story = {
  render: () => (
    <div className="pb:flex pb:flex-col pb:space-y-3">
      {/* Circle Skeleton */}
      <Skeleton className="pb:h-12 pb:w-12 pb:rounded-full" />

      {/* Rectangular Skeletons */}
      <div className="pb:space-y-2">
        <Skeleton className="pb:h-4 pb:w-[250px]" />
        <Skeleton className="pb:h-4 pb:w-[200px]" />
      </div>

      <div className="pb:flex pb:items-center pb:space-x-4 pb:mt-6">
        <Skeleton className="pb:h-12 pb:w-12 pb:rounded-full" />
        <div className="pb:space-y-2">
          <Skeleton className="pb:h-4 pb:w-[250px]" />
          <Skeleton className="pb:h-4 pb:w-[200px]" />
        </div>
      </div>
    </div>
  ),
};
