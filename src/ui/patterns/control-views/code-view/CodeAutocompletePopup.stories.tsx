import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { getCodeAutocompleteContext } from "../../../../templates/codeFormat";
import { CodeAutocompletePopup } from "./CodeAutocompletePopup";

const meta: Meta<typeof CodeAutocompletePopup> = {
  title: "Code/CodeAutocompletePopup",
  component: CodeAutocompletePopup,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Inline floating context-aware autocomplete listbox for PTTF syntax: button colors, robot face colors (`->`), emotions (`:`), and `#anchor` jump targets.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CodeAutocompletePopup>;

const COLOR_CONTEXT = getCodeAutocompleteContext("- [", 3, [])!;
const ROBOT_COLOR_CONTEXT = getCodeAutocompleteContext(
  "- [Green -> ",
  12,
  [],
)!;
const EMOTION_CONTEXT = getCodeAutocompleteContext("- [Green] :", 11, [])!;
const ANCHOR_CONTEXT = getCodeAutocompleteContext("  -> #", 6, [
  { anchor: "checkin", title: "Check In" },
  { anchor: "calm", title: "Calm Breaths" },
])!;

export const Default: Story = {
  render: () => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    return (
      <div className="pb:relative pb:h-56 pb:w-80 pb:bg-[#1e222b] pb:rounded-xl pb:p-3">
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
    <div className="pb:grid pb:grid-cols-1 md:pb:grid-cols-3 pb:gap-4">
      <div className="pb:relative pb:h-56 pb:bg-[#1e222b] pb:rounded-xl pb:p-3">
        <CodeAutocompletePopup
          context={ROBOT_COLOR_CONTEXT}
          selectedIndex={0}
          position={{ top: 16, left: "16px" }}
          onHoverIndex={() => {}}
          onSelect={() => {}}
        />
      </div>
      <div className="pb:relative pb:h-56 pb:bg-[#1e222b] pb:rounded-xl pb:p-3">
        <CodeAutocompletePopup
          context={EMOTION_CONTEXT}
          selectedIndex={1}
          position={{ top: 16, left: "16px" }}
          onHoverIndex={() => {}}
          onSelect={() => {}}
        />
      </div>
      <div className="pb:relative pb:h-56 pb:bg-[#1e222b] pb:rounded-xl pb:p-3">
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
