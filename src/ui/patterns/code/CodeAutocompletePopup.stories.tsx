import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { CodeAutocompletePopup } from "./CodeAutocompletePopup";
import type { CodeAutocompleteState } from "./types";

const meta: Meta<typeof CodeAutocompletePopup> = {
  title: "Code/CodeAutocompletePopup",
  component: CodeAutocompletePopup,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Domain-neutral inline floating autocomplete listbox positioned near the editor caret.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CodeAutocompletePopup>;

const COLOR_CONTEXT: CodeAutocompleteState = {
  heading: "Button Color",
  replaceStart: 0,
  replaceEnd: 0,
  suggestions: [
    {
      label: "Green",
      insertText: "Green",
      description: "Peerbots Green",
      swatchColor: "#22c55e",
    },
    {
      label: "Blue",
      insertText: "Blue",
      description: "Peerbots Blue",
      swatchColor: "#3b82f6",
    },
    {
      label: "Purple",
      insertText: "Purple",
      description: "Peerbots Purple",
      swatchColor: "#a855f7",
    },
  ],
};

const EMOTION_CONTEXT: CodeAutocompleteState = {
  heading: "Emotion",
  replaceStart: 0,
  replaceEnd: 0,
  suggestions: [
    { label: ":)", insertText: ":)", description: "Happy" },
    { label: ":(", insertText: ":(", description: "Sad" },
    { label: ":O", insertText: ":O", description: "Surprised" },
  ],
};

const ANCHOR_CONTEXT: CodeAutocompleteState = {
  heading: "Jump to #anchor",
  replaceStart: 0,
  replaceEnd: 0,
  suggestions: [
    { label: "#checkin", insertText: "#checkin", description: "Check In" },
    { label: "#calm", insertText: "#calm", description: "Calm Breaths" },
  ],
};

export const Default: Story = {
  render: () => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    return (
      <div className="pb:relative pb:h-52 pb:w-80 pb:bg-[#1e222b] pb:rounded-xl pb:p-3">
        <CodeAutocompletePopup
          context={COLOR_CONTEXT}
          selectedIndex={selectedIndex}
          position={{ top: 16, left: "16px" }}
          onHoverIndex={setSelectedIndex}
          onSelect={() => {}}
        />
      </div>
    );
  },
};

export const Variations: Story = {
  render: () => (
    <div className="pb:grid pb:grid-cols-1 md:pb:grid-cols-2 pb:gap-4">
      <div className="pb:relative pb:h-52 pb:bg-[#1e222b] pb:rounded-xl pb:p-3">
        <CodeAutocompletePopup
          context={EMOTION_CONTEXT}
          selectedIndex={1}
          position={{ top: 16, left: "16px" }}
          onHoverIndex={() => {}}
          onSelect={() => {}}
        />
      </div>
      <div className="pb:relative pb:h-52 pb:bg-[#1e222b] pb:rounded-xl pb:p-3">
        <CodeAutocompletePopup
          context={ANCHOR_CONTEXT}
          selectedIndex={0}
          position={{ top: 16, left: "16px" }}
          onHoverIndex={() => {}}
          onSelect={() => {}}
        />
      </div>
    </div>
  ),
};
