import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { PeerbotsColorSelector, PeerbotsColor } from "./PeerbotsColorSelector";

const meta: Meta<typeof PeerbotsColorSelector> = {
  title: "Components/PeerbotsColorSelector",
  component: PeerbotsColorSelector,
};

export default meta;
type Story = StoryObj<typeof PeerbotsColorSelector>;

function InteractiveSelector(props: Partial<React.ComponentProps<typeof PeerbotsColorSelector>>) {
  const [selected, setSelected] = useState<PeerbotsColor>("Light Blue");
  return (
    <PeerbotsColorSelector
      selectedColor={selected}
      onColorSelect={setSelected}
      {...props}
    />
  );
}

export const Default: Story = {
  render: () => <InteractiveSelector />,
};

export const Variations: Story = {
  render: () => (
    <div className="pb:flex pb:flex-col pb:gap-6 pb:p-4">
      <div>
        <span className="pb:text-xs pb:font-bold pb:text-gray-500 pb:block pb:mb-2">Small Size</span>
        <InteractiveSelector size="sm" />
      </div>
      <div>
        <span className="pb:text-xs pb:font-bold pb:text-gray-500 pb:block pb:mb-2">Medium Size (Default)</span>
        <InteractiveSelector size="md" />
      </div>
      <div>
        <span className="pb:text-xs pb:font-bold pb:text-gray-500 pb:block pb:mb-2">Large Size</span>
        <InteractiveSelector size="lg" />
      </div>
      <div>
        <span className="pb:text-xs pb:font-bold pb:text-gray-500 pb:block pb:mb-2">Subset of Colors</span>
        <InteractiveSelector colors={["Light Blue", "Blue", "Green", "Red", "Purple"]} />
      </div>
    </div>
  ),
};
