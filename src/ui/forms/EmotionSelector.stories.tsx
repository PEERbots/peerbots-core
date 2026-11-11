import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";
import type { PeerbotsEmotion } from "../../templates/types";
import { EmotionSelector } from "./EmotionSelector";

const meta: Meta<typeof EmotionSelector> = {
  title: "Forms/EmotionSelector",
  component: EmotionSelector,
};

export default meta;
type Story = StoryObj<typeof EmotionSelector>;

function InteractiveEmotionSelector(
  props: Partial<React.ComponentProps<typeof EmotionSelector>>,
) {
  const [selected, setSelected] = useState<PeerbotsEmotion>("Happy");
  return (
    <EmotionSelector
      selectedEmotion={selected}
      onEmotionSelect={setSelected}
      {...props}
    />
  );
}

export const Default: Story = {
  render: () => <InteractiveEmotionSelector />,
};

export const Variations: Story = {
  render: () => (
    <div className="pb:flex pb:flex-col pb:gap-6 pb:p-4">
      <div>
        <span className="pb:text-xs pb:font-bold pb:text-gray-700 pb:block pb:mb-2">
          Small Size
        </span>
        <InteractiveEmotionSelector size="sm" />
      </div>
      <div>
        <span className="pb:text-xs pb:font-bold pb:text-gray-700 pb:block pb:mb-2">
          Medium Size (Default)
        </span>
        <InteractiveEmotionSelector size="md" />
      </div>
      <div>
        <span className="pb:text-xs pb:font-bold pb:text-gray-700 pb:block pb:mb-2">
          Large Size
        </span>
        <InteractiveEmotionSelector size="lg" />
      </div>
      <div>
        <span className="pb:text-xs pb:font-bold pb:text-gray-700 pb:block pb:mb-2">
          Subset of Emotions (Without Tooltips)
        </span>
        <InteractiveEmotionSelector
          emotions={["Neutral", "Happy", "Concerned"]}
          showTooltips={false}
        />
      </div>
      <div>
        <span className="pb:text-xs pb:font-bold pb:text-gray-700 pb:block pb:mb-2">
          Disabled State
        </span>
        <InteractiveEmotionSelector disabled />
      </div>
    </div>
  ),
};
