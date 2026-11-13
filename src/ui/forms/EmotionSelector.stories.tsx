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
          "Accessible `radiogroup` emotion picker for choosing a Peerbots robot facial expression (`Neutral`, `Surprised`, `Happy`, `Sad`, `Concerned`, `Sleepy`). Each radio tile uses the Peerbots primary teal fill (`#46d9d9` / `pb:bg-primary`) paired with `#020307` (`pb:text-gray-950`) text and black line-art `RobotFaceIcons/*.png`, delivering >12:1 WCAG AAA contrast in both compact icon-only mode (`showLabels={false}`, matching `app.peerbots.org`) and labeled mode (`showLabels={true}`).",
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

export const CompactIconOnly: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Compact icon-only mode (`showLabels={false}`, `showTooltips={true}`) matching the `app.peerbots.org` controller bar.",
      },
    },
  },
  render: () => <InteractiveEmotionSelector showLabels={false} showTooltips />,
};

export const Variations: Story = {
  render: () => (
    <div className="pb:flex pb:flex-col pb:gap-6 pb:p-4">
      <div>
        <span className="pb:text-xs pb:font-bold pb:text-gray-700 pb:block pb:mb-2">
          Compact Icon-Only Mode (`showLabels={false}`, Tooltips Enabled — `app.peerbots.org` Default)
        </span>
        <InteractiveEmotionSelector showLabels={false} showTooltips />
      </div>
      <div>
        <span className="pb:text-xs pb:font-bold pb:text-gray-700 pb:block pb:mb-2">
          Small Labeled Size (`size=&quot;sm&quot;`)
        </span>
        <InteractiveEmotionSelector size="sm" />
      </div>
      <div>
        <span className="pb:text-xs pb:font-bold pb:text-gray-700 pb:block pb:mb-2">
          Medium Labeled Size (`size=&quot;md&quot;`)
        </span>
        <InteractiveEmotionSelector size="md" />
      </div>
      <div>
        <span className="pb:text-xs pb:font-bold pb:text-gray-700 pb:block pb:mb-2">
          Large Labeled Size (`size=&quot;lg&quot;`)
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
