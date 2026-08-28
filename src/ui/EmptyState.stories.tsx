import type { Meta, StoryObj } from "@storybook/react-vite";
import { EmptyState } from "./EmptyState";

const meta: Meta<typeof EmptyState> = {
  title: "Components/EmptyState",
  component: EmptyState,
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    title: "No Items Found",
    description: "You haven't created any items yet. Get started by creating your first item.",
    icon: "document",
    primaryAction: {
      label: "Create Item",
      icon: "plus",
      onClick: () => alert("Create clicked"),
    },
  },
};

export const Variations: Story = {
  render: () => (
    <div className="pb:flex pb:flex-col pb:gap-8 pb:p-4">
      <div>
        <span className="pb:text-xs pb:font-bold pb:text-gray-500 pb:block pb:mb-2">With Dual Actions</span>
        <EmptyState
          title="No Content Collections"
          description="You can create and save interactions or acquire content from the marketplace."
          icon="squares"
          primaryAction={{
            label: "Create Interactions",
            variant: "primary",
            icon: "plus",
            onClick: () => {},
          }}
          secondaryAction={{
            label: "Browse Marketplace",
            variant: "secondary",
            icon: "externalLink",
            onClick: () => {},
          }}
        />
      </div>
      <div>
        <span className="pb:text-xs pb:font-bold pb:text-gray-500 pb:block pb:mb-2">Simple Text Only (No Icon, No Actions)</span>
        <EmptyState
          title="Nothing to display"
          description="Your search did not match any templates."
        />
      </div>
    </div>
  ),
};
