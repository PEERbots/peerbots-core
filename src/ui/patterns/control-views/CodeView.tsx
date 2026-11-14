import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  analyzeTemplateCode,
  formatTemplateToCode,
  formatTemplateToJsonCode,
  getCodeAutocompleteContext,
  type CodeAutocompleteContext,
  type CodeAutocompleteSuggestion,
  type CodeDiagnostic,
  type CodeTokenKind,
  type FormattedCodeLine,
  type FormattedJsonLine,
  type JsonTokenKind,
} from "../../../templates/codeFormat";
import type {
  PeerbotsColor,
  PeerbotsEmotion,
  RobotControlButton,
  Template,
} from "../../../templates/types";
import { EmptyState } from "../../feedback/EmptyState";
import { PEERBOTS_COLOR_MAP } from "../../forms/PeerbotsColorSelector";
import { Icon, type IconName } from "../../foundations/Icon";
import { cn } from "../../utils";
import { PeerbotsButton } from "../PeerbotsButton";
import type { PeerbotsButtonActionHandler } from "./types";

export interface CodeViewProps {
  /** Canonical Peerbots template containing `buttons` and `hierarchy` */
  template: Template;
  /** Optional action callback invoked when a code line's button is selected or activated */
  onButtonAction?: PeerbotsButtonActionHandler;
  /** Optional template update callback used when editing and applying code or JSON */
  onTemplateChange?: (nextTemplate: Template) => void;
  /** Primary active/selected button ID */
  selectedButtonId?: string | null;
  /** Disables editing and interactive selection when true */
  disabled?: boolean;
  /** Optional icon name for `"Log"` buttons (@default "zap") */
  logIcon?: IconName;
  /** Optional custom emotion icon overrides */
  emotionIcons?: Partial<Record<PeerbotsEmotion, string | React.ReactNode>>;
  /** Optional localized emotion names */
  emotionLabels?: Partial<Record<PeerbotsEmotion, string>>;
  /** Initial syntax format: `"shorthand"` (PTTF) or `"json"` (@default "shorthand") */
  defaultFormat?: "shorthand" | "json";
  /** Initial view mode (@default "inspect") */
  defaultMode?: "inspect" | "edit";
  /** Whether hover/focus explainers are enabled (@default true) */
  defaultShowExplainer?: boolean;
  /** Additional container classes */
  className?: string;
}

const PTTF_TOKEN_CLASSES: Record<CodeTokenKind, string> = {
  indent: "pb:text-gray-600 pb:select-none",
  bullet: "pb:text-gray-500 pb:font-bold",
  anchor: "pb:text-amber-300 pb:font-semibold",
  jump: "pb:text-cyan-300 pb:font-semibold",
  type: "pb:text-fuchsia-300 pb:font-semibold",
  colors: "pb:text-emerald-300 pb:font-medium",
  emotion: "pb:text-yellow-300 pb:font-semibold",
  title: "pb:text-gray-100 pb:font-medium",
  separator: "pb:text-gray-500",
  speech: "pb:text-sky-200 pb:italic",
  metadata: "pb:text-purple-300",
  section: "pb:text-amber-400 pb:font-bold",
  comment: "pb:text-gray-400 pb:italic",
};

const JSON_TOKEN_CLASSES: Record<JsonTokenKind, string> = {
  indent: "pb:text-gray-600 pb:select-none",
  key: "pb:text-sky-300 pb:font-medium",
  string: "pb:text-emerald-300",
  number: "pb:text-amber-300",
  boolean: "pb:text-fuchsia-300 pb:font-semibold",
  punctuation: "pb:text-gray-400",
};

const TOKEN_BADGE_LABELS: Record<CodeTokenKind | JsonTokenKind, string> = {
  indent: "Hierarchy",
  bullet: "Item",
  anchor: "Anchor",
  jump: "Jump / Loop",
  type: "Button Type",
  colors: "Colors",
  emotion: "Emotion",
  title: "Button Title",
  separator: "Separator",
  speech: "Robot Speech",
  metadata: "Metadata",
  section: "Section",
  comment: "Comment",
  key: "JSON Key",
  string: "String",
  number: "Number",
  boolean: "Literal",
  punctuation: "Syntax",
};

interface NormalizedLineView {
  lineNumber: number;
  depth: number;
  kind: "comment" | "section" | "button" | "jump" | "json";
  buttonId?: string;
  button?: RobotControlButton;
  anchor?: string;
  isCycle?: boolean;
  summary: string;
  tokens: Array<{
    kind: CodeTokenKind | JsonTokenKind;
    text: string;
    explanation: string;
    className: string;
    labelColor?: PeerbotsColor;
    robotColor?: PeerbotsColor;
  }>;
}

function normalizePttfLines(lines: FormattedCodeLine[]): NormalizedLineView[] {
  return lines.map((l) => ({
    lineNumber: l.lineNumber,
    depth: l.depth,
    kind: l.kind,
    buttonId: l.buttonId,
    button: l.button,
    anchor: l.anchor,
    isCycle: l.isCycle,
    summary: l.summary,
    tokens: l.tokens.map((t) => ({
      kind: t.kind,
      text: t.text,
      explanation: t.explanation,
      className: PTTF_TOKEN_CLASSES[t.kind],
      labelColor: t.labelColor,
      robotColor: t.robotColor,
    })),
  }));
}

function normalizeJsonLines(lines: FormattedJsonLine[]): NormalizedLineView[] {
  return lines.map((l) => ({
    lineNumber: l.lineNumber,
    depth: 0,
    kind: "json",
    buttonId: l.buttonId,
    button: l.button,
    summary: l.summary,
    tokens: l.tokens.map((t) => ({
      kind: t.kind,
      text: t.text,
      explanation: t.explanation,
      className: JSON_TOKEN_CLASSES[t.kind],
    })),
  }));
}

function highlightJsonRaw(raw: string): Array<{ text: string; className: string }> {
  const parts: Array<{ text: string; className: string }> = [];
  const regex =
    /("(?:\\.|[^"\\])*")(\s*:)?|(-?\d+(?:\.\d+)?)|(\btrue\b|\bfalse\b|\bnull\b)|([{}[\],:])/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(raw)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        text: raw.slice(lastIndex, match.index),
        className: "pb:text-gray-300",
      });
    }
    if (match[1]) {
      parts.push({
        text: match[1],
        className: match[2] ? JSON_TOKEN_CLASSES.key : JSON_TOKEN_CLASSES.string,
      });
      if (match[2]) {
        parts.push({ text: match[2], className: JSON_TOKEN_CLASSES.punctuation });
      }
    } else if (match[3]) {
      parts.push({ text: match[3], className: JSON_TOKEN_CLASSES.number });
    } else if (match[4]) {
      parts.push({ text: match[4], className: JSON_TOKEN_CLASSES.boolean });
    } else if (match[5]) {
      parts.push({ text: match[5], className: JSON_TOKEN_CLASSES.punctuation });
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < raw.length) {
    parts.push({ text: raw.slice(lastIndex), className: "pb:text-gray-300" });
  }
  return parts;
}

/**
 * Interactive Code & Shorthand View for Peerbots `Template` objects.
 *
 * Supports switching between **Shorthand (PTTF)** and **JSON** with syntax highlighting,
 * interactive hover/focus explainers (previewing the live `<PeerbotsButton>` produced by each line),
 * and an **Edit & Format** mode for round-trip authoring.
 */
export function CodeView({
  template,
  onButtonAction,
  onTemplateChange,
  selectedButtonId = null,
  disabled = false,
  logIcon = "zap",
  emotionIcons,
  emotionLabels,
  defaultFormat = "shorthand",
  defaultMode = "inspect",
  defaultShowExplainer = true,
  className,
}: CodeViewProps) {
  const [format, setFormat] = useState<"shorthand" | "json">(defaultFormat);
  const [mode, setMode] = useState<"inspect" | "edit">(defaultMode);
  const [showExplainer, setShowExplainer] = useState<boolean>(
    defaultShowExplainer,
  );
  const [showAllAnchors, setShowAllAnchors] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const [hoveredLineNumber, setHoveredLineNumber] = useState<number | null>(
    null,
  );
  const [hoveredTokenIdx, setHoveredTokenIdx] = useState<number | null>(null);
  const [editorCursorLine, setEditorCursorLine] = useState<number>(1);
  const [editorSelectionStart, setEditorSelectionStart] = useState<number>(0);
  const [autocompleteIndex, setAutocompleteIndex] = useState<number>(0);
  const [autocompleteDismissedAt, setAutocompleteDismissedAt] = useState<
    number | null
  >(null);
  const highlightPreRef = useRef<HTMLPreElement | null>(null);
  const lineGutterRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const formattedPttf = useMemo(
    () =>
      formatTemplateToCode(template, {
        alwaysEmitAnchors: showAllAnchors,
      }),
    [template, showAllAnchors],
  );

  const formattedJson = useMemo(
    () => formatTemplateToJsonCode(template),
    [template],
  );

  const activeCode =
    format === "shorthand" ? formattedPttf.code : formattedJson.code;

  const normalizedLines = useMemo(
    () =>
      format === "shorthand"
        ? normalizePttfLines(formattedPttf.lines)
        : normalizeJsonLines(formattedJson.lines),
    [format, formattedPttf.lines, formattedJson.lines],
  );

  const [draftCode, setDraftCode] = useState<string>(activeCode);

  useEffect(() => {
    if (mode === "inspect") {
      setDraftCode(activeCode);
    }
  }, [activeCode, mode]);

  const parsedDraft = useMemo((): {
    template: Template | null;
    diagnostics: CodeDiagnostic[];
    buttonCount: number;
    rootCount: number;
    draftLines: NormalizedLineView[];
  } => {
    if (format === "shorthand") {
      const res = analyzeTemplateCode(draftCode, {
        id: template.id,
        title: template.title,
        description: template.description,
      });
      return {
        template: res.template,
        diagnostics: res.diagnostics,
        buttonCount: Object.keys(res.template.buttons).length,
        rootCount: res.template.hierarchy.root.length,
        draftLines: normalizePttfLines(res.lines),
      };
    }

    try {
      const obj = JSON.parse(draftCode) as Partial<Template>;
      if (!obj || typeof obj !== "object" || !obj.buttons || !obj.hierarchy) {
        return {
          template: null,
          diagnostics: [
            {
              lineNumber: 1,
              severity: "error",
              message: 'JSON must include "buttons" and "hierarchy" objects.',
            },
          ],
          buttonCount: 0,
          rootCount: 0,
          draftLines: [],
        };
      }
      const nextTemplate: Template = {
        ...template,
        ...obj,
        title: typeof obj.title === "string" ? obj.title : template.title,
        buttons: obj.buttons,
        hierarchy: {
          ...obj.hierarchy,
          root: Array.isArray(obj.hierarchy.root) ? obj.hierarchy.root : [],
        },
      };
      const jsonFormatted = formatTemplateToJsonCode(nextTemplate);
      return {
        template: nextTemplate,
        diagnostics: [],
        buttonCount: Object.keys(nextTemplate.buttons).length,
        rootCount: nextTemplate.hierarchy.root.length,
        draftLines: normalizeJsonLines(jsonFormatted.lines),
      };
    } catch (err) {
      return {
        template: null,
        diagnostics: [
          {
            lineNumber: 1,
            severity: "error",
            message:
              err instanceof Error ? `Invalid JSON: ${err.message}` : "Invalid JSON.",
          },
        ],
        buttonCount: 0,
        rootCount: 0,
        draftLines: [],
      };
    }
  }, [draftCode, format, template]);

  const highlightedDraftLines = useMemo(() => {
    if (format === "json") {
      return draftCode.split(/\r?\n/).map((line, i) => {
        const lineNum = i + 1;
        const isCursorLine = lineNum === editorCursorLine;
        const matchedLine = parsedDraft.draftLines[i];
        const canUseStructuredTokens =
          matchedLine &&
          matchedLine.tokens.map((t) => t.text).join("") === line;
        const isSelected =
          Boolean(selectedButtonId) &&
          matchedLine?.buttonId === selectedButtonId;

        return (
          <div
            key={i}
            className={cn(
              "pb:rounded pb:px-1",
              isCursorLine
                ? "pb:bg-white/10 pb:ring-1 pb:ring-peerbots-teal/60"
                : isSelected
                  ? "pb:bg-peerbots-teal/15"
                  : "",
            )}
          >
            {line.length === 0
              ? " "
              : canUseStructuredTokens
                ? matchedLine.tokens.map((tok, j) => {
                    const isTokenHovered =
                      isCursorLine && hoveredTokenIdx === j;
                    return (
                      <span
                        key={j}
                        className={cn(
                          tok.className,
                          "pb:rounded-xs pb:transition-colors",
                          isTokenHovered &&
                            "pb:bg-white/20 pb:underline pb:decoration-peerbots-teal pb:underline-offset-4",
                        )}
                      >
                        {tok.text}
                      </span>
                    );
                  })
                : highlightJsonRaw(line).map((seg, j) => (
                    <span key={j} className={seg.className}>
                      {seg.text}
                    </span>
                  ))}
          </div>
        );
      });
    }

    return parsedDraft.draftLines.map((line, i) => {
      const isCursorLine = line.lineNumber === editorCursorLine;
      const isSelected =
        Boolean(selectedButtonId) && line.buttonId === selectedButtonId;
      const isEmpty =
        line.tokens.length === 0 ||
        line.tokens.every((t) => t.text.length === 0);
      return (
        <div
          key={i}
          className={cn(
            "pb:rounded pb:px-1",
            isCursorLine
              ? "pb:bg-white/10 pb:ring-1 pb:ring-peerbots-teal/60"
              : isSelected
                ? "pb:bg-peerbots-teal/15"
                : "",
          )}
        >
          {isEmpty
            ? " "
            : line.tokens.map((tok, j) => {
                const isTokenHovered = isCursorLine && hoveredTokenIdx === j;
                return (
                  <span
                    key={j}
                    className={cn(
                      tok.className,
                      "pb:rounded-xs pb:transition-colors",
                      isTokenHovered &&
                        "pb:bg-white/20 pb:underline pb:decoration-peerbots-teal pb:underline-offset-4",
                    )}
                  >
                    {tok.text}
                  </span>
                );
              })}
        </div>
      );
    });
  }, [
    draftCode,
    format,
    parsedDraft.draftLines,
    editorCursorLine,
    hoveredTokenIdx,
    selectedButtonId,
  ]);

  const activeLine: NormalizedLineView | undefined = useMemo(() => {
    if (mode === "edit") {
      return (
        parsedDraft.draftLines.find((l) => l.lineNumber === editorCursorLine) ??
        parsedDraft.draftLines.find((l) => Boolean(l.button)) ??
        parsedDraft.draftLines[0]
      );
    }
    if (hoveredLineNumber !== null) {
      return normalizedLines.find((l) => l.lineNumber === hoveredLineNumber);
    }
    if (selectedButtonId) {
      return normalizedLines.find((l) => l.buttonId === selectedButtonId);
    }
    return normalizedLines.find((l) => Boolean(l.button)) ?? normalizedLines[0];
  }, [
    mode,
    parsedDraft.draftLines,
    editorCursorLine,
    normalizedLines,
    hoveredLineNumber,
    selectedButtonId,
  ]);

  const activeToken = useMemo(() => {
    if (!activeLine || hoveredTokenIdx === null) return undefined;
    return activeLine.tokens[hoveredTokenIdx];
  }, [activeLine, hoveredTokenIdx]);

  const availableAnchors = useMemo(() => {
    const seen = new Set<string>();
    const list: Array<{ anchor: string; title: string }> = [];
    for (const line of parsedDraft.draftLines) {
      if (line.kind === "button" && line.anchor && !seen.has(line.anchor)) {
        seen.add(line.anchor);
        list.push({
          anchor: line.anchor,
          title: line.button?.details.title ?? line.anchor,
        });
      }
    }
    return list;
  }, [parsedDraft.draftLines]);

  const autocompleteContext: CodeAutocompleteContext | null = useMemo(() => {
    if (
      mode !== "edit" ||
      format !== "shorthand" ||
      autocompleteDismissedAt === editorSelectionStart
    ) {
      return null;
    }
    return getCodeAutocompleteContext(
      draftCode,
      editorSelectionStart,
      availableAnchors,
    );
  }, [
    mode,
    format,
    autocompleteDismissedAt,
    editorSelectionStart,
    draftCode,
    availableAnchors,
  ]);

  const clampedAutocompleteIndex = autocompleteContext
    ? Math.min(autocompleteIndex, autocompleteContext.suggestions.length - 1)
    : 0;

  const updateCursorLine = (el: HTMLTextAreaElement) => {
    const pos = el.selectionStart ?? 0;
    const line = el.value.slice(0, pos).split(/\r?\n/).length;
    setEditorCursorLine(line);
    setEditorSelectionStart((prev) => {
      if (prev !== pos) {
        setAutocompleteDismissedAt(null);
        setAutocompleteIndex(0);
      }
      return pos;
    });
    setHoveredTokenIdx(null);
  };

  const applyAutocompleteSuggestion = (
    suggestion: CodeAutocompleteSuggestion,
  ) => {
    if (!autocompleteContext) return;
    const { replaceStart, replaceEnd } = autocompleteContext;
    const nextCode =
      draftCode.slice(0, replaceStart) +
      suggestion.insertText +
      draftCode.slice(replaceEnd);
    const nextCaret = replaceStart + suggestion.insertText.length;
    const nextLine = nextCode.slice(0, nextCaret).split(/\r?\n/).length;

    setDraftCode(nextCode);
    setEditorSelectionStart(nextCaret);
    setEditorCursorLine(nextLine);
    setAutocompleteDismissedAt(null);
    setAutocompleteIndex(0);

    requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (el) {
        el.focus();
        el.setSelectionRange(nextCaret, nextCaret);
      }
    });
  };

  const handleCopy = async () => {
    const textToCopy = mode === "edit" ? draftCode : activeCode;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard may be unavailable in non-secure test environments
    }
  };

  const handleFormatDraft = () => {
    if (!parsedDraft.template) return;
    if (format === "shorthand") {
      const reformatted = formatTemplateToCode(parsedDraft.template, {
        alwaysEmitAnchors: showAllAnchors,
      });
      setDraftCode(reformatted.code);
    } else {
      setDraftCode(JSON.stringify(parsedDraft.template, null, 2));
    }
  };

  const handleApplyDraft = () => {
    if (!onTemplateChange || disabled || !parsedDraft.template) return;
    onTemplateChange(parsedDraft.template);
    setMode("inspect");
  };

  const handleSwitchFormat = (nextFormat: "shorthand" | "json") => {
    setFormat(nextFormat);
    setHoveredLineNumber(null);
    setHoveredTokenIdx(null);
    setEditorCursorLine(1);
    setDraftCode(
      nextFormat === "shorthand" ? formattedPttf.code : formattedJson.code,
    );
  };

  const hasButtons = Object.keys(template.buttons ?? {}).length > 0;
  const canEdit = Boolean(onTemplateChange) && !disabled;

  if (!hasButtons && mode === "inspect" && !canEdit) {
    return (
      <EmptyState
        title="No buttons in template"
        description="Add buttons or switch to Edit mode to write Peerbots Template Text."
        className={className}
      />
    );
  }

  return (
    <div
      className={cn(
        "pb:rounded-xl pb:border pb:border-gray-200 pb:bg-white pb:shadow-sm pb:overflow-hidden",
        className,
      )}
    >
      {/* Toolbar */}
      <div className="pb:flex pb:flex-wrap pb:items-center pb:justify-between pb:gap-2 pb:px-4 pb:py-2.5 pb:bg-gray-50 pb:border-b pb:border-gray-200">
        <div className="pb:flex pb:items-center pb:gap-2">
          <Icon name="code" className="pb:w-4 pb:h-4 pb:text-peerbots-teal" />
          <span className="pb:text-sm pb:font-semibold pb:text-gray-900">
            Code View
          </span>

          {/* Shorthand vs JSON Switcher */}
          <div
            role="group"
            aria-label="Code syntax format"
            className="pb:inline-flex pb:rounded-lg pb:bg-gray-200/70 pb:p-0.5 pb:ms-1"
          >
            <button
              type="button"
              onClick={() => handleSwitchFormat("shorthand")}
              aria-pressed={format === "shorthand"}
              className={cn(
                "pb:px-2 pb:py-0.5 pb:text-[11px] pb:font-semibold pb:rounded-md pb:transition-colors pb:cursor-pointer",
                format === "shorthand"
                  ? "pb:bg-white pb:text-gray-900 pb:shadow-xs"
                  : "pb:text-gray-600 pb:hover:text-gray-900",
              )}
            >
              Shorthand
            </button>
            <button
              type="button"
              onClick={() => handleSwitchFormat("json")}
              aria-pressed={format === "json"}
              className={cn(
                "pb:px-2 pb:py-0.5 pb:text-[11px] pb:font-semibold pb:rounded-md pb:transition-colors pb:cursor-pointer",
                format === "json"
                  ? "pb:bg-white pb:text-gray-900 pb:shadow-xs"
                  : "pb:text-gray-600 pb:hover:text-gray-900",
              )}
            >
              JSON
            </button>
          </div>
        </div>

        <div className="pb:flex pb:flex-wrap pb:items-center pb:gap-2">
          {canEdit && (
            <div
              role="group"
              aria-label="Code view mode"
              className="pb:inline-flex pb:rounded-lg pb:bg-gray-200/70 pb:p-0.5"
            >
              <button
                type="button"
                onClick={() => setMode("inspect")}
                aria-pressed={mode === "inspect"}
                className={cn(
                  "pb:px-2.5 pb:py-1 pb:text-xs pb:font-medium pb:rounded-md pb:transition-colors pb:cursor-pointer",
                  mode === "inspect"
                    ? "pb:bg-white pb:text-gray-900 pb:shadow-xs"
                    : "pb:text-gray-600 pb:hover:text-gray-900",
                )}
              >
                Inspect
              </button>
              <button
                type="button"
                onClick={() => {
                  setDraftCode(activeCode);
                  setMode("edit");
                }}
                aria-pressed={mode === "edit"}
                className={cn(
                  "pb:px-2.5 pb:py-1 pb:text-xs pb:font-medium pb:rounded-md pb:transition-colors pb:cursor-pointer",
                  mode === "edit"
                    ? "pb:bg-white pb:text-gray-900 pb:shadow-xs"
                    : "pb:text-gray-600 pb:hover:text-gray-900",
                )}
              >
                Edit
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowExplainer((prev) => !prev)}
            aria-pressed={showExplainer}
            className={cn(
              "pb:px-2.5 pb:py-1 pb:text-xs pb:font-medium pb:rounded-lg pb:border pb:transition-colors pb:cursor-pointer",
              showExplainer
                ? "pb:border-peerbots-teal pb:bg-peerbots-teal/10 pb:text-teal-800"
                : "pb:border-gray-300 pb:bg-white pb:text-gray-700 pb:hover:bg-gray-100",
            )}
          >
            Explainer {showExplainer ? "On" : "Off"}
          </button>

          {mode === "inspect" && format === "shorthand" && (
            <button
              type="button"
              onClick={() => setShowAllAnchors((prev) => !prev)}
              aria-pressed={showAllAnchors}
              className={cn(
                "pb:px-2.5 pb:py-1 pb:text-xs pb:font-medium pb:rounded-lg pb:border pb:transition-colors pb:cursor-pointer",
                showAllAnchors
                  ? "pb:border-amber-400 pb:bg-amber-50 pb:text-amber-900"
                  : "pb:border-gray-300 pb:bg-white pb:text-gray-700 pb:hover:bg-gray-100",
              )}
            >
              {showAllAnchors ? "Hide #anchors" : "Show #anchors"}
            </button>
          )}

          {mode === "edit" && (
            <>
              <button
                type="button"
                onClick={handleFormatDraft}
                disabled={!parsedDraft.template}
                className="pb:px-2.5 pb:py-1 pb:text-xs pb:font-medium pb:rounded-lg pb:border pb:border-gray-300 pb:bg-white pb:text-gray-700 pb:hover:bg-gray-100 disabled:pb:opacity-50 pb:cursor-pointer"
              >
                Format
              </button>
              <button
                type="button"
                onClick={handleApplyDraft}
                disabled={
                  !parsedDraft.template ||
                  parsedDraft.diagnostics.some((d) => d.severity === "error")
                }
                className="pb:px-3 pb:py-1 pb:text-xs pb:font-semibold pb:rounded-lg pb:bg-peerbots-teal pb:text-gray-900 pb:hover:opacity-90 disabled:pb:opacity-50 pb:cursor-pointer"
              >
                Apply Changes
              </button>
            </>
          )}

          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy template code"
            className="pb:inline-flex pb:items-center pb:gap-1 pb:px-2.5 pb:py-1 pb:text-xs pb:font-medium pb:rounded-lg pb:border pb:border-gray-300 pb:bg-white pb:text-gray-700 pb:hover:bg-gray-100 pb:cursor-pointer"
          >
            <Icon
              name={copied ? "check" : "clipboard"}
              className="pb:w-3.5 pb:h-3.5"
            />
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      {mode === "inspect" ? (
        <div
          className={cn(
            "pb:grid pb:grid-cols-1",
            showExplainer && "lg:pb:grid-cols-12",
          )}
        >
          {/* Syntax-Highlighted Interactive Code Pane */}
          <div
            className={cn(
              "pb:bg-[#1e222b] pb:text-gray-100 pb:font-mono pb:text-xs sm:pb:text-sm pb:overflow-x-auto pb:p-3 pb:max-h-[32rem] pb:overflow-y-auto",
              showExplainer ? "lg:pb:col-span-7" : "pb:col-span-1",
            )}
          >
            {normalizedLines.length === 0 ? (
              <div className="pb:text-gray-400 pb:py-6 pb:text-center pb:font-sans">
                No lines to display.
              </div>
            ) : (
              <div role="list" aria-label="Formatted template code lines">
                {normalizedLines.map((line) => {
                  const isHovered = hoveredLineNumber === line.lineNumber;
                  const isSelected =
                    Boolean(selectedButtonId) &&
                    line.buttonId === selectedButtonId;

                  return (
                    <div
                      key={line.lineNumber}
                      role="listitem"
                      tabIndex={0}
                      aria-label={`Line ${line.lineNumber}: ${line.summary}`}
                      onMouseEnter={() => {
                        setHoveredLineNumber(line.lineNumber);
                        setHoveredTokenIdx(null);
                      }}
                      onFocus={() => {
                        setHoveredLineNumber(line.lineNumber);
                        setHoveredTokenIdx(null);
                      }}
                      onClick={() => {
                        if (
                          !disabled &&
                          onButtonAction &&
                          line.buttonId &&
                          line.button
                        ) {
                          onButtonAction(line.button, line.buttonId, {
                            type: "SELECT",
                          });
                        }
                      }}
                      onKeyDown={(e) => {
                        if (
                          (e.key === "Enter" || e.key === " ") &&
                          !disabled &&
                          onButtonAction &&
                          line.buttonId &&
                          line.button
                        ) {
                          e.preventDefault();
                          onButtonAction(line.button, line.buttonId, {
                            type: "SELECT",
                          });
                        }
                      }}
                      className={cn(
                        "pb:flex pb:items-baseline pb:gap-3 pb:px-2 pb:py-0.5 pb:rounded pb:transition-colors pb:outline-none",
                        line.buttonId && !disabled && "pb:cursor-pointer",
                        isHovered
                          ? "pb:bg-white/10 pb:ring-1 pb:ring-peerbots-teal/60"
                          : isSelected
                            ? "pb:bg-peerbots-teal/15"
                            : "hover:pb:bg-white/5",
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className="pb:w-6 pb:shrink-0 pb:text-right pb:text-gray-500 pb:select-none pb:text-xs"
                      >
                        {line.lineNumber}
                      </span>
                      <span className="pb:whitespace-pre">
                        {line.tokens.map((tok, tokIdx) => {
                          const isTokenHovered =
                            isHovered && hoveredTokenIdx === tokIdx;
                          return (
                            <span
                              key={tokIdx}
                              onMouseEnter={(e) => {
                                e.stopPropagation();
                                setHoveredLineNumber(line.lineNumber);
                                setHoveredTokenIdx(tokIdx);
                              }}
                              onMouseLeave={() => {
                                setHoveredTokenIdx(null);
                              }}
                              className={cn(
                                tok.className,
                                "pb:rounded-xs pb:transition-colors",
                                isTokenHovered &&
                                  "pb:bg-white/20 pb:underline pb:decoration-peerbots-teal pb:underline-offset-4",
                              )}
                            >
                              {tok.text}
                            </span>
                          );
                        })}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quick Hover Status Bar at bottom of code pane */}
            {showExplainer && activeLine && (
              <div
                aria-live="polite"
                className="pb:mt-3 pb:pt-2.5 pb:border-t pb:border-gray-700/80 pb:font-sans pb:text-xs pb:text-gray-300 pb:flex pb:items-center pb:gap-2"
              >
                <span className="pb:px-1.5 pb:py-0.5 pb:rounded pb:bg-peerbots-teal/20 pb:text-peerbots-teal pb:font-semibold pb:shrink-0">
                  {activeToken
                    ? TOKEN_BADGE_LABELS[activeToken.kind]
                    : `Line ${activeLine.lineNumber}`}
                </span>
                <span className="pb:truncate">
                  {activeToken ? activeToken.explanation : activeLine.summary}
                </span>
              </div>
            )}
          </div>

          {/* Interactive Hover Explainer & Live Button Preview */}
          {showExplainer && (
            <CodeExplainerAside
              activeLine={activeLine}
              format={format}
              disabled={disabled}
              logIcon={logIcon}
              emotionIcons={emotionIcons}
              emotionLabels={emotionLabels}
              hoveredTokenIdx={hoveredTokenIdx}
              onHoverToken={setHoveredTokenIdx}
              onButtonAction={onButtonAction}
              emptyHint="Hover or focus any line on the left to preview its button and see what each symbol means."
            />
          )}
        </div>
      ) : (
        /* Edit & Format Mode with Layered Syntax Highlighting + Live Explainer */
        <div
          className={cn(
            "pb:grid pb:grid-cols-1",
            showExplainer && "lg:pb:grid-cols-12",
          )}
        >
          <div
            className={cn(
              "pb:p-4 pb:flex pb:flex-col pb:gap-3",
              showExplainer ? "lg:pb:col-span-7" : "pb:col-span-1",
            )}
          >
            <div className="pb:flex pb:flex-wrap pb:items-center pb:justify-between pb:gap-2 pb:text-xs pb:text-gray-600">
              {format === "shorthand" ? (
                <span>
                  Start a line with{" "}
                  <code className="pb:px-1 pb:bg-gray-100 pb:rounded">!</code> for a Log
                  button, indent 2 spaces for children, use{" "}
                  <code className="pb:px-1 pb:bg-gray-100 pb:rounded">[Label -&gt; Robot]</code>{" "}
                  for colors,{" "}
                  <code className="pb:px-1 pb:bg-gray-100 pb:rounded">:)</code> for
                  emotion, and{" "}
                  <code className="pb:px-1 pb:bg-gray-100 pb:rounded">#tag</code> /{" "}
                  <code className="pb:px-1 pb:bg-gray-100 pb:rounded">-&gt; #tag</code>{" "}
                  for loops.
                </span>
              ) : (
                <span>
                  Edit raw <code className="pb:px-1 pb:bg-gray-100 pb:rounded">Template</code> JSON
                  (<code className="pb:px-1 pb:bg-gray-100 pb:rounded">buttons</code> &amp;{" "}
                  <code className="pb:px-1 pb:bg-gray-100 pb:rounded">hierarchy</code>). Click{" "}
                  <strong>Format</strong> to pretty-print.
                </span>
              )}
              <span className="pb:font-medium pb:text-gray-700">
                {parsedDraft.buttonCount} buttons • {parsedDraft.rootCount} root
              </span>
            </div>

            <div className="pb:flex pb:rounded-lg pb:border pb:border-gray-300 pb:bg-[#1e222b] pb:overflow-hidden">
              {/* Line Numbers Gutter */}
              <div
                ref={lineGutterRef}
                aria-hidden="true"
                className="pb:w-9 pb:shrink-0 pb:py-3 pb:pr-2 pb:pl-2 pb:font-mono pb:text-xs sm:pb:text-sm pb:leading-6 pb:text-right pb:text-gray-500 pb:select-none pb:overflow-hidden pb:border-r pb:border-gray-800"
              >
                {draftCode.split(/\r?\n/).map((_, idx) => {
                  const lineNum = idx + 1;
                  const isActive = lineNum === editorCursorLine;
                  return (
                    <div
                      key={lineNum}
                      onClick={() => {
                        const el = textareaRef.current;
                        if (!el) return;
                        const lines = el.value.split(/\r?\n/);
                        let offset = 0;
                        for (let k = 0; k < idx; k += 1) {
                          offset += lines[k].length + 1;
                        }
                        el.focus();
                        el.setSelectionRange(offset, offset);
                        setEditorCursorLine(lineNum);
                        setHoveredTokenIdx(null);
                      }}
                      className={cn(
                        "pb:cursor-pointer pb:transition-colors",
                        isActive ? "pb:text-peerbots-teal pb:font-semibold" : "hover:pb:text-gray-300",
                      )}
                    >
                      {lineNum}
                    </div>
                  );
                })}
              </div>

              <div className="pb:relative pb:flex-1 pb:min-w-0">
                <pre
                  ref={highlightPreRef}
                  aria-hidden="true"
                  className="pb:pointer-events-none pb:m-0 pb:py-3 pb:px-3 pb:font-mono pb:text-xs sm:pb:text-sm pb:leading-6 pb:whitespace-pre pb:overflow-hidden pb:min-h-[21rem]"
                >
                  {highlightedDraftLines}
                </pre>
                <textarea
                  ref={textareaRef}
                  aria-label="Template code editor"
                  aria-expanded={Boolean(autocompleteContext)}
                  aria-autocomplete="list"
                  value={draftCode}
                  wrap="off"
                  onChange={(e) => {
                    setDraftCode(e.target.value);
                    updateCursorLine(e.currentTarget);
                  }}
                  onClick={(e) => updateCursorLine(e.currentTarget)}
                  onKeyUp={(e) => updateCursorLine(e.currentTarget)}
                  onSelect={(e) => updateCursorLine(e.currentTarget)}
                  onFocus={(e) => updateCursorLine(e.currentTarget)}
                  onKeyDown={(e) => {
                    if (!autocompleteContext) return;
                    const { suggestions } = autocompleteContext;
                    if (suggestions.length === 0) return;

                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setAutocompleteIndex((prev) => (prev + 1) % suggestions.length);
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setAutocompleteIndex(
                        (prev) => (prev - 1 + suggestions.length) % suggestions.length,
                      );
                    } else if (e.key === "Enter" || e.key === "Tab") {
                      e.preventDefault();
                      applyAutocompleteSuggestion(
                        suggestions[clampedAutocompleteIndex],
                      );
                    } else if (e.key === "Escape") {
                      e.preventDefault();
                      setAutocompleteDismissedAt(editorSelectionStart);
                    }
                  }}
                  onScroll={(e) => {
                    if (highlightPreRef.current) {
                      highlightPreRef.current.scrollTop = e.currentTarget.scrollTop;
                      highlightPreRef.current.scrollLeft = e.currentTarget.scrollLeft;
                    }
                    if (lineGutterRef.current) {
                      lineGutterRef.current.scrollTop = e.currentTarget.scrollTop;
                    }
                  }}
                  rows={14}
                  spellCheck={false}
                  className="pb:absolute pb:inset-0 pb:w-full pb:h-full pb:resize-none pb:bg-transparent pb:text-transparent pb:caret-white pb:font-mono pb:text-xs sm:pb:text-sm pb:leading-6 pb:py-3 pb:px-4 pb:whitespace-pre pb:overflow-auto focus:pb:outline-none focus:pb:ring-2 focus:pb:ring-peerbots-teal"
                />
              </div>
            </div>

            {/* Context-Aware Autocomplete Suggestions */}
            {autocompleteContext && (
              <div className="pb:rounded-lg pb:border pb:border-peerbots-teal/50 pb:bg-white pb:shadow-md pb:overflow-hidden">
                <div className="pb:flex pb:items-center pb:justify-between pb:px-3 pb:py-1.5 pb:bg-gray-50 pb:border-b pb:border-gray-200 pb:text-[11px]">
                  <span className="pb:font-semibold pb:text-gray-700">
                    {autocompleteContext.heading}
                  </span>
                  <span className="pb:text-gray-500">
                    ↑↓ navigate • Enter/Tab insert • Esc close
                  </span>
                </div>
                <div
                  role="listbox"
                  aria-label={autocompleteContext.heading}
                  className="pb:max-h-44 pb:overflow-y-auto pb:divide-y pb:divide-gray-100"
                >
                  {autocompleteContext.suggestions.map((sug, idx) => {
                    const isSelected = idx === clampedAutocompleteIndex;
                    return (
                      <button
                        key={`${sug.label}-${idx}`}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onMouseDown={(e) => e.preventDefault()}
                        onMouseEnter={() => setAutocompleteIndex(idx)}
                        onClick={() => applyAutocompleteSuggestion(sug)}
                        className={cn(
                          "pb:w-full pb:flex pb:items-center pb:justify-between pb:gap-3 pb:px-3 pb:py-1.5 pb:text-left pb:text-xs pb:transition-colors pb:cursor-pointer",
                          isSelected
                            ? "pb:bg-peerbots-teal/15 pb:text-gray-900"
                            : "pb:bg-white pb:text-gray-700 hover:pb:bg-gray-50",
                        )}
                      >
                        <span className="pb:flex pb:items-center pb:gap-2 pb:min-w-0">
                          {sug.colorSwatch && (
                            <span
                              aria-hidden="true"
                              className="pb:w-3.5 pb:h-3.5 pb:rounded-sm pb:border pb:border-gray-300 pb:shrink-0"
                              style={{
                                backgroundColor:
                                  PEERBOTS_COLOR_MAP[sug.colorSwatch] ??
                                  sug.colorSwatch,
                              }}
                            />
                          )}
                          <code className="pb:font-mono pb:font-semibold pb:text-gray-900">
                            {sug.label}
                          </code>
                        </span>
                        <span className="pb:text-[11px] pb:text-gray-500 pb:truncate">
                          {sug.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Live Cursor Status Bar */}
            {showExplainer && activeLine && (
              <div
                aria-live="polite"
                className="pb:px-3 pb:py-2 pb:rounded-lg pb:bg-[#1e222b] pb:font-sans pb:text-xs pb:text-gray-300 pb:flex pb:items-center pb:gap-2"
              >
                <span className="pb:px-1.5 pb:py-0.5 pb:rounded pb:bg-peerbots-teal/20 pb:text-peerbots-teal pb:font-semibold pb:shrink-0">
                  {activeToken
                    ? TOKEN_BADGE_LABELS[activeToken.kind]
                    : `Line ${activeLine.lineNumber}`}
                </span>
                <span className="pb:truncate">
                  {activeToken ? activeToken.explanation : activeLine.summary}
                </span>
              </div>
            )}

            {parsedDraft.diagnostics.length > 0 && (
              <div
                role="status"
                aria-label="Code diagnostics"
                className="pb:flex pb:flex-col pb:gap-1.5"
              >
                {parsedDraft.diagnostics.map((diag, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "pb:flex pb:items-center pb:gap-2 pb:px-3 pb:py-1.5 pb:rounded-lg pb:text-xs pb:border",
                      diag.severity === "error"
                        ? "pb:bg-red-50 pb:border-red-200 pb:text-red-800"
                        : "pb:bg-amber-50 pb:border-amber-200 pb:text-amber-900",
                    )}
                  >
                    <Icon
                      name={
                        diag.severity === "error"
                          ? "xCircle"
                          : "exclamationTriangle"
                      }
                      className="pb:w-4 pb:h-4 pb:shrink-0"
                    />
                    <span>
                      <strong>Line {diag.lineNumber}:</strong> {diag.message}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {showExplainer && (
            <CodeExplainerAside
              activeLine={activeLine}
              format={format}
              disabled={disabled}
              logIcon={logIcon}
              emotionIcons={emotionIcons}
              emotionLabels={emotionLabels}
              hoveredTokenIdx={hoveredTokenIdx}
              onHoverToken={setHoveredTokenIdx}
              onButtonAction={onButtonAction}
              emptyHint={
                format === "json" && !parsedDraft.template
                  ? "Fix the JSON syntax error to restore the live button preview and breakdown."
                  : "Place your cursor on any line to preview its button and see what each symbol means."
              }
            />
          )}
        </div>
      )}
    </div>
  );
}

function CodeExplainerAside({
  activeLine,
  format,
  disabled,
  logIcon,
  emotionIcons,
  emotionLabels,
  hoveredTokenIdx,
  onHoverToken,
  onButtonAction,
  emptyHint,
}: {
  activeLine: NormalizedLineView | undefined;
  format: "shorthand" | "json";
  disabled: boolean;
  logIcon: IconName;
  emotionIcons?: Partial<Record<PeerbotsEmotion, string | React.ReactNode>>;
  emotionLabels?: Partial<Record<PeerbotsEmotion, string>>;
  hoveredTokenIdx: number | null;
  onHoverToken: (idx: number | null) => void;
  onButtonAction?: PeerbotsButtonActionHandler;
  emptyHint: string;
}) {
  return (
    <aside
      aria-label="Interactive code explainer"
      className="lg:pb:col-span-5 pb:bg-gray-50 pb:border-t lg:pb:border-t-0 lg:pb:border-l pb:border-gray-200 pb:p-4 pb:flex pb:flex-col pb:gap-4"
    >
      <div className="pb:flex pb:items-center pb:justify-between">
        <h3 className="pb:text-xs pb:font-bold pb:uppercase pb:tracking-wider pb:text-gray-500">
          What This Produces
        </h3>
        {activeLine && (
          <span className="pb:text-xs pb:text-gray-500">
            Line {activeLine.lineNumber}
            {format === "shorthand" ? ` • Depth ${activeLine.depth}` : ""}
          </span>
        )}
      </div>

      {activeLine ? (
        <>
          {activeLine.button && (
            <div className="pb:rounded-xl pb:bg-white pb:border pb:border-gray-200 pb:p-3 pb:flex pb:flex-col pb:items-center pb:gap-2">
              {activeLine.kind === "jump" && (
                <div className="pb:inline-flex pb:items-center pb:gap-1.5 pb:text-xs pb:font-medium pb:px-2.5 pb:py-0.5 pb:rounded-full pb:bg-cyan-50 pb:text-cyan-800 pb:border pb:border-cyan-200">
                  <Icon name="arrowPath" className="pb:w-3.5 pb:h-3.5" />
                  <span>
                    {activeLine.isCycle
                      ? `Loops back to ${activeLine.anchor}`
                      : `Jumps to ${activeLine.anchor}`}
                  </span>
                </div>
              )}

              <PeerbotsButton
                button={activeLine.button}
                logIcon={logIcon}
                emotionIcons={emotionIcons}
                emotionLabels={emotionLabels}
                onClick={() => {
                  if (
                    !disabled &&
                    onButtonAction &&
                    activeLine.buttonId &&
                    activeLine.button
                  ) {
                    onButtonAction(activeLine.button, activeLine.buttonId, {
                      type: "CLICK",
                    });
                  }
                }}
              />

              {activeLine.button.type === "Message" ? (
                <p className="pb:text-xs pb:text-gray-600 pb:text-center">
                  Robot speaks:{" "}
                  <span className="pb:font-medium pb:text-gray-900">
                    &ldquo;{activeLine.button.details.speech}&rdquo;
                  </span>
                </p>
              ) : (
                <p className="pb:text-xs pb:text-gray-600 pb:text-center">
                  Logs event
                  {activeLine.button.details.details
                    ? `: "${activeLine.button.details.details}"`
                    : " (no robot speech)"}
                </p>
              )}
            </div>
          )}

          <div className="pb:flex pb:flex-col pb:gap-1.5">
            <div className="pb:text-xs pb:font-semibold pb:text-gray-700">
              Syntax Breakdown
            </div>
            <ul className="pb:flex pb:flex-col pb:gap-1.5">
              {activeLine.tokens
                .filter(
                  (t) =>
                    t.kind !== "bullet" &&
                    t.kind !== "separator" &&
                    t.kind !== "punctuation" &&
                    t.kind !== "indent",
                )
                .map((tok, idx) => {
                  const originalIdx = activeLine.tokens.indexOf(tok);
                  const isHighlighted = hoveredTokenIdx === originalIdx;
                  return (
                    <li
                      key={idx}
                      onMouseEnter={() => onHoverToken(originalIdx)}
                      onMouseLeave={() => onHoverToken(null)}
                      className={cn(
                        "pb:flex pb:items-start pb:gap-2 pb:p-2 pb:rounded-lg pb:border pb:text-xs pb:transition-colors",
                        isHighlighted
                          ? "pb:bg-peerbots-teal/10 pb:border-peerbots-teal"
                          : "pb:bg-white pb:border-gray-200",
                      )}
                    >
                      <TokenColorSwatches
                        labelColor={tok.labelColor}
                        robotColor={tok.robotColor}
                      />
                      <div className="pb:min-w-0 pb:flex-1">
                        <div className="pb:flex pb:items-center pb:gap-1.5">
                          <span className="pb:font-semibold pb:text-gray-900">
                            {TOKEN_BADGE_LABELS[tok.kind]}
                          </span>
                          <code className="pb:px-1 pb:py-0.5 pb:rounded pb:bg-gray-100 pb:text-gray-800 pb:font-mono pb:text-[11px] pb:truncate">
                            {tok.text.trim() || `${tok.text.length} spaces`}
                          </code>
                        </div>
                        <p className="pb:text-gray-600 pb:mt-0.5">
                          {tok.explanation}
                        </p>
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>
        </>
      ) : (
        <p className="pb:text-xs pb:text-gray-500">{emptyHint}</p>
      )}
    </aside>
  );
}

function TokenColorSwatches({
  labelColor,
  robotColor,
}: {
  labelColor?: PeerbotsColor;
  robotColor?: PeerbotsColor;
}) {
  if (!labelColor && !robotColor) return null;
  return (
    <div className="pb:flex pb:items-center pb:gap-1 pb:mt-0.5 pb:shrink-0">
      {labelColor && (
        <span
          title={`Button color: ${labelColor}`}
          className="pb:w-3 pb:h-3 pb:rounded-sm pb:border pb:border-gray-300"
          style={{
            backgroundColor: PEERBOTS_COLOR_MAP[labelColor] ?? labelColor,
          }}
        />
      )}
      {robotColor && (
        <span
          title={`Robot face color: ${robotColor}`}
          className="pb:w-3 pb:h-3 pb:rounded-full pb:border pb:border-gray-300"
          style={{
            backgroundColor: PEERBOTS_COLOR_MAP[robotColor] ?? robotColor,
          }}
        />
      )}
    </div>
  );
}
