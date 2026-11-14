import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { analyzeTemplateCode } from "../../../../templates/codeFormat";
import { CodeExplainerAside } from "./CodeExplainerAside";
import { normalizePttfLines } from "./constants";

const SAMPLE_ANALYSIS = analyzeTemplateCode(
  [
    "// Social Check-In",
    "- [Green -> Light Blue] :) Check In | How are you feeling? #checkin",
    "  ! [Purple -> Red] :) Bad Log | Should warn on robot color and emotion",
    "  -> #checkin",
  ].join("\n"),
);

const SAMPLE_LINES = normalizePttfLines(SAMPLE_ANALYSIS.lines);

const meta: Meta<typeof CodeExplainerAside> = {
  title: "Code/CodeExplainerAside",
  component: CodeExplainerAside,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Live right-hand explainer panel for CodeView showing the rendered `<PeerbotsButton>`, line diagnostics, and interactive token-by-token syntax breakdown.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CodeExplainerAside>;

export const Default: Story = {
  render: () => {
    const [hoveredTokenIdx, setHoveredTokenIdx] = useState<number | null>(null);
    return (
      <div className="pb:max-w-md pb:border pb:border-gray-200 pb:rounded-xl pb:overflow-hidden">
        <CodeExplainerAside
          activeLine={SAMPLE_LINES[1]}
          format="shorthand"
          disabled={false}
          logIcon="zap"
          hoveredTokenIdx={hoveredTokenIdx}
          onHoverToken={setHoveredTokenIdx}
          emptyHint="Select a line to inspect."
        />
      </div>
    );
  },
};

export const Variations: Story = {
  render: () => {
    const [hoveredTokenIdx, setHoveredTokenIdx] = useState<number | null>(null);
    const logLine = SAMPLE_LINES[2];
    const logDiags = SAMPLE_ANALYSIS.diagnostics.filter(
      (d) => d.lineNumber === logLine.lineNumber,
    );

    return (
      <div className="pb:grid pb:grid-cols-1 md:pb:grid-cols-3 pb:gap-4">
        <div className="pb:border pb:border-gray-200 pb:rounded-xl pb:overflow-hidden">
          <CodeExplainerAside
            activeLine={logLine}
            lineDiagnostics={logDiags}
            format="shorthand"
            disabled={false}
            logIcon="zap"
            hoveredTokenIdx={hoveredTokenIdx}
            onHoverToken={setHoveredTokenIdx}
            emptyHint="Select a line to inspect."
          />
        </div>
        <div className="pb:border pb:border-gray-200 pb:rounded-xl pb:overflow-hidden">
          <CodeExplainerAside
            activeLine={SAMPLE_LINES[3]}
            format="shorthand"
            disabled={false}
            logIcon="zap"
            hoveredTokenIdx={null}
            onHoverToken={() => {}}
            emptyHint="Select a line to inspect."
          />
        </div>
        <div className="pb:border pb:border-gray-200 pb:rounded-xl pb:overflow-hidden">
          <CodeExplainerAside
            activeLine={undefined}
            format="json"
            disabled={false}
            logIcon="zap"
            hoveredTokenIdx={null}
            onHoverToken={() => {}}
            emptyHint="Fix the JSON syntax error to restore the live button preview and breakdown."
          />
        </div>
      </div>
    );
  },
};
