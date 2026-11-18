import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { CodeInteractiveLines } from "./CodeInteractiveLines";
import type { ExplainedCodeLine } from "./types";

const SAMPLE_LINES: ExplainedCodeLine[] = [
  {
    lineNumber: 1,
    metaLabel: "Depth 0",
    summary: "Template title comment",
    tokens: [
      {
        kind: "comment",
        badgeLabel: "Comment",
        text: "// Morning Check-In",
        explanation: "Sets the template title.",
        className: "pb:text-gray-400 pb:italic",
        isStructural: true,
      },
    ],
  },
  {
    lineNumber: 2,
    metaLabel: "Depth 0",
    summary: 'Message button "Check In"',
    isInteractive: true,
    tokens: [
      {
        kind: "bullet",
        badgeLabel: "Item",
        text: "- ",
        explanation: "Message button",
        className: "pb:text-gray-500 pb:font-bold",
        isStructural: true,
      },
      {
        kind: "colors",
        badgeLabel: "Colors",
        text: "[Green -> Light Blue] ",
        explanation: "Button is Green and robot face glows Light Blue.",
        className: "pb:text-emerald-300 pb:font-medium",
      },
      {
        kind: "emotion",
        badgeLabel: "Emotion",
        text: ":) ",
        explanation: "Sets the robot facial expression to Happy.",
        className: "pb:text-yellow-300 pb:font-semibold",
      },
      {
        kind: "title",
        badgeLabel: "Button Title",
        text: "Check In",
        explanation: "Label displayed on the button.",
        className: "pb:text-gray-100 pb:font-medium",
      },
      {
        kind: "separator",
        badgeLabel: "Separator",
        text: " | ",
        explanation: "Separates button title from robot speech.",
        className: "pb:text-gray-500",
        isStructural: true,
      },
      {
        kind: "speech",
        badgeLabel: "Robot Speech",
        text: "How are you feeling?",
        explanation: "Spoken aloud by the robot when tapped.",
        className: "pb:text-sky-200 pb:italic",
      },
    ],
  },
  {
    lineNumber: 3,
    metaLabel: "Depth 1",
    summary: 'Log button "Break Marker"',
    isInteractive: true,
    isSelected: true,
    tokens: [
      {
        kind: "indent",
        badgeLabel: "Hierarchy",
        text: "  ",
        explanation: "Child of the previous line.",
        className: "pb:text-gray-600 pb:select-none",
        isStructural: true,
      },
      {
        kind: "bullet",
        badgeLabel: "Item",
        text: "! ",
        explanation: "Log button",
        className: "pb:text-gray-500 pb:font-bold",
        isStructural: true,
      },
      {
        kind: "title",
        badgeLabel: "Button Title",
        text: "Break Marker",
        explanation: "Label displayed on the log button.",
        className: "pb:text-gray-100 pb:font-medium",
      },
    ],
  },
];

const meta: Meta<typeof CodeInteractiveLines> = {
  title: "Code/CodeInteractiveLines",
  component: CodeInteractiveLines,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Domain-neutral interactive read-only code pane with line/token hover highlighting, keyboard selection, and live status bar.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CodeInteractiveLines>;

export const Default: Story = {
  render: () => {
    const [hoveredLine, setHoveredLine] = useState<number | null>(2);
    const [hoveredToken, setHoveredToken] = useState<number | null>(null);
    const activeLine =
      SAMPLE_LINES.find((l) => l.lineNumber === hoveredLine) ?? SAMPLE_LINES[1];
    const activeToken =
      hoveredToken !== null ? activeLine.tokens[hoveredToken] : undefined;

    return (
      <div className="pb:max-w-2xl pb:rounded-xl pb:overflow-hidden pb:border pb:border-gray-200">
        <CodeInteractiveLines
          lines={SAMPLE_LINES}
          hoveredLineNumber={hoveredLine}
          hoveredTokenIdx={hoveredToken}
          activeLine={activeLine}
          activeToken={activeToken}
          onHoverLine={setHoveredLine}
          onHoverToken={setHoveredToken}
          onSelectLine={() => {}}
        />
      </div>
    );
  },
};

export const Variations: Story = {
  render: () => (
    <div className="pb:grid pb:grid-cols-1 md:pb:grid-cols-2 pb:gap-4">
      <div className="pb:rounded-xl pb:overflow-hidden pb:border pb:border-gray-200">
        <CodeInteractiveLines
          lines={SAMPLE_LINES}
          disabled
          showStatusBar={false}
          hoveredLineNumber={null}
          hoveredTokenIdx={null}
          activeLine={undefined}
          onHoverLine={() => {}}
          onHoverToken={() => {}}
        />
      </div>
      <div className="pb:rounded-xl pb:overflow-hidden pb:border pb:border-gray-200">
        <CodeInteractiveLines
          lines={[]}
          showStatusBar={false}
          hoveredLineNumber={null}
          hoveredTokenIdx={null}
          activeLine={undefined}
          onHoverLine={() => {}}
          onHoverToken={() => {}}
        />
      </div>
    </div>
  ),
};
