import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { CodeExplainerPanel } from "./CodeExplainerPanel";
import type { CodeDiagnosticItem, ExplainedCodeLine } from "./types";

const SAMPLE_LINES: ExplainedCodeLine[] = [
  {
    lineNumber: 2,
    metaLabel: "Depth 0",
    summary: 'Message button "Check In"',
    tokens: [
      {
        kind: "colors",
        badgeLabel: "Colors",
        text: "[Green -> Light Blue]",
        explanation: "Button is Green and robot face glows Light Blue.",
        className: "pb:text-emerald-300",
        swatches: [
          { color: "#22c55e", title: "Button color: Green", shape: "square" },
          {
            color: "#38bdf8",
            title: "Robot face color: Light Blue",
            shape: "circle",
          },
        ],
      },
      {
        kind: "emotion",
        badgeLabel: "Emotion",
        text: ":)",
        explanation: "Sets the robot facial expression to Happy.",
        className: "pb:text-yellow-300",
      },
      {
        kind: "title",
        badgeLabel: "Title",
        text: "Check In",
        explanation: "Label displayed on the button.",
        className: "pb:text-gray-100",
      },
      {
        kind: "speech",
        badgeLabel: "Speech",
        text: "How are you feeling?",
        explanation: "Spoken aloud by the robot when tapped.",
        className: "pb:text-sky-200",
      },
    ],
  },
  {
    lineNumber: 3,
    metaLabel: "Depth 1",
    summary: 'Log button "Bad Log"',
    tokens: [
      {
        kind: "type",
        badgeLabel: "Button Type",
        text: "!",
        explanation: "Marks this line as a silent Log button.",
        className: "pb:text-fuchsia-300",
      },
      {
        kind: "title",
        badgeLabel: "Title",
        text: "Bad Log",
        explanation: "Label displayed on the log button.",
        className: "pb:text-gray-100",
      },
    ],
  },
];

const SAMPLE_DIAGNOSTICS: CodeDiagnosticItem[] = [
  {
    lineNumber: 3,
    severity: "warning",
    message: "Log buttons (!) do not have a robot face color.",
  },
  {
    lineNumber: 3,
    severity: "error",
    message: "Unknown jump target #missing.",
  },
];

const meta: Meta<typeof CodeExplainerPanel> = {
  title: "Code/CodeExplainerPanel",
  component: CodeExplainerPanel,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Domain-neutral code explainer aside displaying line diagnostics, an optional `renderPreview` slot, and an interactive token-by-token syntax breakdown.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CodeExplainerPanel>;

export const Default: Story = {
  render: () => {
    const [hoveredTokenIdx, setHoveredTokenIdx] = useState<number | null>(null);
    return (
      <div className="pb:max-w-md pb:border pb:border-gray-200 pb:rounded-xl pb:overflow-hidden">
        <CodeExplainerPanel
          activeLine={SAMPLE_LINES[0]}
          hoveredTokenIdx={hoveredTokenIdx}
          onHoverToken={setHoveredTokenIdx}
          renderPreview={(line) => (
            <div className="pb:rounded-xl pb:bg-white pb:border pb:border-gray-200 pb:p-3 pb:text-xs pb:text-gray-700">
              Custom preview slot for <strong>Line {line.lineNumber}</strong>:{" "}
              {line.summary}
            </div>
          )}
          emptyHint="Select a line to inspect."
        />
      </div>
    );
  },
};

export const Variations: Story = {
  render: () => {
    const [hoveredTokenIdx, setHoveredTokenIdx] = useState<number | null>(null);
    return (
      <div className="pb:grid pb:grid-cols-1 md:pb:grid-cols-2 pb:gap-4">
        <div className="pb:border pb:border-gray-200 pb:rounded-xl pb:overflow-hidden">
          <CodeExplainerPanel
            activeLine={SAMPLE_LINES[1]}
            lineDiagnostics={SAMPLE_DIAGNOSTICS}
            hoveredTokenIdx={hoveredTokenIdx}
            onHoverToken={setHoveredTokenIdx}
            emptyHint="Select a line to inspect."
          />
        </div>
        <div className="pb:border pb:border-gray-200 pb:rounded-xl pb:overflow-hidden">
          <CodeExplainerPanel
            activeLine={undefined}
            hoveredTokenIdx={null}
            onHoverToken={() => {}}
            emptyHint="Place your cursor on any line to see its token breakdown."
          />
        </div>
      </div>
    );
  },
};
