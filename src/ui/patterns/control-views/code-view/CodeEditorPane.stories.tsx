import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo, useRef, useState } from "react";
import { analyzeTemplateCode } from "../../../../templates/codeFormat";
import { cn } from "../../../utils";
import { CodeEditorPane } from "./CodeEditorPane";
import { normalizePttfLines } from "./constants";

const meta: Meta<typeof CodeEditorPane> = {
  title: "Code/CodeEditorPane",
  component: CodeEditorPane,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Standalone layered monospace code editor pane with clickable line-number gutter, syntax-highlighted overlay, live status bar, and line-by-line diagnostics.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CodeEditorPane>;

function StandaloneEditorDemo({ initialCode }: { initialCode: string }) {
  const [draftCode, setDraftCode] = useState(initialCode);
  const [cursorLine, setCursorLine] = useState(1);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const analysis = useMemo(() => analyzeTemplateCode(draftCode), [draftCode]);
  const draftLines = useMemo(
    () => normalizePttfLines(analysis.lines),
    [analysis.lines],
  );
  const diagnosticsByLine = useMemo(() => {
    const map = new Map<number, typeof analysis.diagnostics>();
    for (const d of analysis.diagnostics) {
      const list = map.get(d.lineNumber) ?? [];
      list.push(d);
      map.set(d.lineNumber, list);
    }
    return map;
  }, [analysis.diagnostics]);

  const highlighted = useMemo(
    () =>
      draftLines.map((line, i) => {
        const isCursor = line.lineNumber === cursorLine;
        const lineDiags = diagnosticsByLine.get(line.lineNumber) ?? [];
        const hasError = lineDiags.some((d) => d.severity === "error");
        const hasWarning = lineDiags.some((d) => d.severity === "warning");
        const isEmpty =
          line.tokens.length === 0 ||
          line.tokens.every((t) => t.text.length === 0);
        return (
          <div
            key={i}
            className={cn(
              "pb:rounded pb:px-1",
              isCursor
                ? hasError
                  ? "pb:bg-red-500/15 pb:ring-1 pb:ring-red-400/70"
                  : hasWarning
                    ? "pb:bg-amber-500/15 pb:ring-1 pb:ring-amber-400/70"
                    : "pb:bg-white/10 pb:ring-1 pb:ring-peerbots-teal/60"
                : "",
            )}
          >
            {isEmpty
              ? " "
              : line.tokens.map((tok, j) => (
                  <span key={j} className={tok.className}>
                    {tok.text}
                  </span>
                ))}
          </div>
        );
      }),
    [draftLines, cursorLine, diagnosticsByLine],
  );

  const activeLine =
    draftLines.find((l) => l.lineNumber === cursorLine) ?? draftLines[0];

  return (
    <div className="pb:max-w-2xl pb:border pb:border-gray-200 pb:rounded-xl pb:bg-white">
      <CodeEditorPane
        format="shorthand"
        draftCode={draftCode}
        highlightedDraftLines={highlighted}
        diagnostics={analysis.diagnostics}
        diagnosticsByLine={diagnosticsByLine}
        buttonCount={Object.keys(analysis.template.buttons).length}
        rootCount={analysis.template.hierarchy.root.length}
        editorCursorLine={cursorLine}
        showExplainer
        activeLine={activeLine}
        autocompleteContext={null}
        autocompleteIndex={0}
        autocompletePosition={{ top: 16, left: "16px" }}
        textareaRef={textareaRef}
        onDraftChange={(next, el) => {
          setDraftCode(next);
          const pos = el.selectionStart ?? 0;
          setCursorLine(el.value.slice(0, pos).split(/\r?\n/).length);
        }}
        onCursorUpdate={(el) => {
          const pos = el.selectionStart ?? 0;
          setCursorLine(el.value.slice(0, pos).split(/\r?\n/).length);
        }}
        onKeyDown={() => {}}
        onScrollSync={() => {}}
        onJumpToLine={(lineNum) => setCursorLine(lineNum)}
        onAutocompleteHover={() => {}}
        onAutocompleteSelect={() => {}}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <StandaloneEditorDemo
      initialCode={[
        "// Morning Check-In",
        "- [Green -> Light Blue] :) Hello | Good morning! #start",
        "  - [Blue -> Yellow] :) Great | I feel great!",
        "  ! [Grey] Break | Child asked for a break",
        "  -> #start",
      ].join("\n")}
    />
  ),
};

export const Variations: Story = {
  render: () => (
    <StandaloneEditorDemo
      initialCode={[
        "// Diagnostics Example",
        "! [Grey -> Red] :) Invalid Log | Should warn on robot color & emotion",
        "  -> #missing-anchor",
      ].join("\n")}
    />
  ),
};
