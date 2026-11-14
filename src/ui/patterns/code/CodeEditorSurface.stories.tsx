import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo, useRef, useState } from "react";
import { cn } from "../../utils";
import { CodeEditorSurface } from "./CodeEditorSurface";
import type { CodeDiagnosticItem, ExplainedCodeLine } from "./types";

const meta: Meta<typeof CodeEditorSurface> = {
  title: "Code/CodeEditorSurface",
  component: CodeEditorSurface,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Domain-neutral layered monospace code editor surface with clickable line-number gutter, syntax-highlighted overlay, live status bar, and line-by-line diagnostics.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CodeEditorSurface>;

function StandaloneSurfaceDemo({
  initialCode,
  diagnostics = [],
}: {
  initialCode: string;
  diagnostics?: CodeDiagnosticItem[];
}) {
  const [draftCode, setDraftCode] = useState(initialCode);
  const [cursorLine, setCursorLine] = useState(1);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const rawLines = useMemo(() => draftCode.split(/\r?\n/), [draftCode]);
  const explainedLines: ExplainedCodeLine[] = useMemo(
    () =>
      rawLines.map((text, idx) => ({
        lineNumber: idx + 1,
        summary: text.trim() || "Empty line",
        tokens: [
          {
            kind: "text",
            badgeLabel: `Line ${idx + 1}`,
            text,
            explanation: text.trim() || "Blank line",
            className: text.trim().startsWith("//")
              ? "pb:text-gray-400 pb:italic"
              : "pb:text-gray-100",
          },
        ],
      })),
    [rawLines],
  );

  const diagnosticsByLine = useMemo(() => {
    const map = new Map<number, CodeDiagnosticItem[]>();
    for (const d of diagnostics) {
      const list = map.get(d.lineNumber) ?? [];
      list.push(d);
      map.set(d.lineNumber, list);
    }
    return map;
  }, [diagnostics]);

  const highlighted = useMemo(
    () =>
      explainedLines.map((line, i) => {
        const isCursor = line.lineNumber === cursorLine;
        const lineDiags = diagnosticsByLine.get(line.lineNumber) ?? [];
        const hasError = lineDiags.some((d) => d.severity === "error");
        const hasWarning = lineDiags.some((d) => d.severity === "warning");
        const text = line.tokens[0]?.text ?? "";
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
            {text.length === 0 ? (
              " "
            ) : (
              <span className={line.tokens[0]?.className}>{text}</span>
            )}
          </div>
        );
      }),
    [explainedLines, cursorLine, diagnosticsByLine],
  );

  return (
    <div className="pb:max-w-2xl pb:border pb:border-gray-200 pb:rounded-xl pb:bg-white">
      <CodeEditorSurface
        draftCode={draftCode}
        highlightedDraftLines={highlighted}
        diagnostics={diagnostics}
        diagnosticsByLine={diagnosticsByLine}
        editorCursorLine={cursorLine}
        activeLine={explainedLines[cursorLine - 1]}
        autocompleteContext={null}
        autocompleteIndex={0}
        autocompletePosition={{ top: 16, left: "16px" }}
        textareaRef={textareaRef}
        headerLeft={<span>Domain-neutral monospace editor surface</span>}
        headerRight={
          <span className="pb:font-medium pb:text-gray-700">
            {rawLines.length} lines
          </span>
        }
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
    <StandaloneSurfaceDemo
      initialCode={[
        "// Example snippet",
        'const greeting = "Hello Peerbots!";',
        "console.log(greeting);",
      ].join("\n")}
    />
  ),
};

export const Variations: Story = {
  render: () => (
    <StandaloneSurfaceDemo
      initialCode={[
        "// With diagnostics",
        "const value = 42;",
        "unknownCall();",
      ].join("\n")}
      diagnostics={[
        {
          lineNumber: 2,
          severity: "warning",
          message: "Unused variable 'value'.",
        },
        {
          lineNumber: 3,
          severity: "error",
          message: "Identifier 'unknownCall' is not defined.",
        },
      ]}
    />
  ),
};
