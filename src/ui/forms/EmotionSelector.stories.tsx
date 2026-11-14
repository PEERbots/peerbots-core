import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";
import type { PeerbotsEmotion } from "../../templates/types";
import { EmotionSelector } from "./EmotionSelector";

const meta: Meta<typeof EmotionSelector> = {
  title: "Forms/EmotionSelector",
  component: EmotionSelector,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Compact icon-only `radiogroup` emotion picker for choosing a Peerbots robot facial expression (`Neutral`, `Surprised`, `Happy`, `Sad`, `Concerned`, `Sleepy`). Each square radio tile renders its black line-art `RobotFaceIcons/*.png` icon on the Peerbots primary teal fill (`#46d9d9` / `pb:bg-primary`, >12:1 contrast) with hover/focus tooltips enabled by default.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof EmotionSelector>;

function InteractiveEmotionSelector(
  props: Partial<React.ComponentProps<typeof EmotionSelector>>,
) {
  const [selected, setSelected] = useState<PeerbotsEmotion>("Happy");
  return (
    <div className="pb:space-y-2">
      <EmotionSelector
        selectedEmotion={selected}
        onEmotionSelect={setSelected}
        {...props}
      />
      <div className="pb:text-xs pb:text-gray-600">
        Selected emotion: <strong className="pb:text-gray-900">{selected}</strong>
      </div>
    </div>
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
          Small (`size=&quot;sm&quot;` — 28px)
        </span>
        <InteractiveEmotionSelector size="sm" />
      </div>
      <div>
        <span className="pb:text-xs pb:font-bold pb:text-gray-700 pb:block pb:mb-2">
          Medium (`size=&quot;md&quot;` — 32px Default)
        </span>
        <InteractiveEmotionSelector size="md" />
      </div>
      <div>
        <span className="pb:text-xs pb:font-bold pb:text-gray-700 pb:block pb:mb-2">
          Large (`size=&quot;lg&quot;` — 40px)
        </span>
        <InteractiveEmotionSelector size="lg" />
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
