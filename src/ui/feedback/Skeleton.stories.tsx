import { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "./Skeleton";

const meta: Meta<typeof Skeleton> = {
  title: "Feedback/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  render: () => (
    <div className="pb:flex pb:items-center pb:gap-4 pb:p-6 pb:bg-white pb:rounded-2xl pb:border pb:border-gray-200 pb:shadow-xs pb:w-[380px]">
      <Skeleton className="pb:h-12 pb:w-12 pb:rounded-full pb:shrink-0" />
      <div className="pb:space-y-2 pb:flex-1">
        <Skeleton className="pb:h-4 pb:w-3/4 pb:rounded-md" />
        <Skeleton className="pb:h-3 pb:w-1/2 pb:rounded-md" />
      </div>
    </div>
  ),
};

export const CardPlaceholder: Story = {
  render: () => (
    <div className="pb:p-6 pb:bg-white pb:rounded-2xl pb:border pb:border-gray-200 pb:shadow-sm pb:w-[320px] pb:space-y-4">
      {/* Media thumbnail */}
      <Skeleton className="pb:h-36 pb:w-full pb:rounded-xl" />
      {/* Content lines */}
      <div className="pb:space-y-2">
        <Skeleton className="pb:h-4 pb:w-4/5 pb:rounded-md" />
        <Skeleton className="pb:h-3 pb:w-full pb:rounded-md" />
        <Skeleton className="pb:h-3 pb:w-2/3 pb:rounded-md" />
      </div>
      {/* Footer action button */}
      <div className="pb:pt-2 pb:flex pb:justify-between pb:items-center">
        <Skeleton className="pb:h-8 pb:w-24 pb:rounded-lg" />
        <Skeleton className="pb:h-8 pb:w-8 pb:rounded-full" />
      </div>
    </div>
  ),
};

export const Variations: Story = {
  render: () => (
    <div className="pb:flex pb:flex-col pb:gap-8 pb:max-w-md">
      <div>
        <span className="pb:text-xs pb:font-bold pb:text-gray-700 pb:uppercase pb:tracking-wider pb:block pb:mb-3">
          Avatar & Profile Header
        </span>
        <div className="pb:flex pb:items-center pb:gap-4">
          <Skeleton className="pb:h-14 pb:w-14 pb:rounded-full" />
          <div className="pb:space-y-2 pb:flex-1">
            <Skeleton className="pb:h-4 pb:w-48 pb:rounded-md" />
            <Skeleton className="pb:h-3 pb:w-32 pb:rounded-md" />
          </div>
        </div>
      </div>

      <div>
        <span className="pb:text-xs pb:font-bold pb:text-gray-700 pb:uppercase pb:tracking-wider pb:block pb:mb-3">
          Paragraph Text Lines
        </span>
        <div className="pb:space-y-2.5">
          <Skeleton className="pb:h-3.5 pb:w-full pb:rounded-md" />
          <Skeleton className="pb:h-3.5 pb:w-11/12 pb:rounded-md" />
          <Skeleton className="pb:h-3.5 pb:w-4/5 pb:rounded-md" />
          <Skeleton className="pb:h-3.5 pb:w-3/5 pb:rounded-md" />
        </div>
      </div>

      <div>
        <span className="pb:text-xs pb:font-bold pb:text-gray-700 pb:uppercase pb:tracking-wider pb:block pb:mb-3">
          Interactive Controls & Buttons
        </span>
        <div className="pb:flex pb:gap-3">
          <Skeleton className="pb:h-10 pb:w-28 pb:rounded-xl" />
          <Skeleton className="pb:h-10 pb:w-28 pb:rounded-xl" />
          <Skeleton className="pb:h-10 pb:w-10 pb:rounded-xl" />
        </div>
      </div>
    </div>
  ),
};
