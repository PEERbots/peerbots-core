import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  analyzeTemplateCode,
  formatTemplateToCode,
  formatTemplateToJsonCode,
  getCodeAutocompleteContext,
  type CodeAutocompleteContext,
  type CodeAutocompleteSuggestion,
  type CodeDiagnostic,
} from "../../../templates/codeFormat";
import type {
  PeerbotsEmotion,
  Template,
} from "../../../templates/types";
import { EmptyState } from "../../feedback/EmptyState";
import { Icon, type IconName } from "../../foundations/Icon";
import { cn } from "../../utils";
import { CodeAutocompletePopup } from "./code-view/CodeAutocompletePopup";
import { CodeExplainerAside } from "./code-view/CodeExplainerAside";
import {
  highlightJsonRaw,
  normalizeJsonLines,
  normalizePttfLines,
  TOKEN_BADGE_LABELS,
  type NormalizedLineView,
} from "./code-view/constants";
import type { PeerbotsButtonActionHandler } from "./types";

export interface CodeViewProps {
  /** Canonical Peerbots template containing `buttons` and `hierarchy` */
  template: Template;
  /** Optional action callback invoked when a code line's button is selected or activated */
  onButtonAction?: PeerbotsButtonActionHandler;
  /** Optional template update callback; when provided (and not disabled), renders the unified live editor */
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
  /**
   * @deprecated Inspect and Edit are now unified: providing `onTemplateChange` enables live editing directly.
   */
  defaultMode?: "inspect" | "edit";
  /** Whether hover/focus explainers are enabled (@default true) */
  defaultShowExplainer?: boolean;
  /** Additional container classes */
  className?: string;
}

interface UndoEntry {
  code: string;
  selectionStart: number;
}

/**
 * Interactive Code & Shorthand View for Peerbots `Template` objects.
 *
 * Supports switching between **Shorthand (PTTF)** and **JSON** with syntax highlighting,
 * interactive hover/focus explainers (previewing the live `<PeerbotsButton>` produced by each line),
 * inline context-aware autocomplete, line-by-line diagnostics, and round-trip editing when `onTemplateChange` is provided.
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
  defaultMode: _defaultMode,
  defaultShowExplainer = true,
  className,
}: CodeViewProps) {
  const isEditable = Boolean(onTemplateChange) && !disabled;

  const [format, setFormat] = useState<"shorthand" | "json">(defaultFormat);
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
  const [editorScroll, setEditorScroll] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });

  const highlightPreRef = useRef<HTMLPreElement | null>(null);
  const lineGutterRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const undoStackRef = useRef<UndoEntry[]>([]);

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
  const prevActiveCodeRef = useRef<string>(activeCode);

  useEffect(() => {
    if (prevActiveCodeRef.current !== activeCode) {
      prevActiveCodeRef.current = activeCode;
      setDraftCode(activeCode);
      undoStackRef.current = [];
    }
  }, [activeCode]);

  const hasUnsavedChanges = isEditable && draftCode !== activeCode;

  const pushUndo = (code: string, selectionStart: number) => {
    undoStackRef.current.push({ code, selectionStart });
    if (undoStackRef.current.length > 50) {
      undoStackRef.current.shift();
    }
  };

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

  const diagnosticsByLine = useMemo(() => {
    const map = new Map<number, CodeDiagnostic[]>();
    for (const diag of parsedDraft.diagnostics) {
      const existing = map.get(diag.lineNumber) ?? [];
      existing.push(diag);
      map.set(diag.lineNumber, existing);
    }
    return map;
  }, [parsedDraft.diagnostics]);

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
        const lineDiags = diagnosticsByLine.get(lineNum) ?? [];
        const hasError = lineDiags.some((d) => d.severity === "error");
        const hasWarning = lineDiags.some((d) => d.severity === "warning");

        return (
          <div
            key={i}
            className={cn(
              "pb:rounded pb:px-1",
              isCursorLine
                ? hasError
                  ? "pb:bg-red-500/15 pb:ring-1 pb:ring-red-400/70"
                  : hasWarning
                    ? "pb:bg-amber-500/15 pb:ring-1 pb:ring-amber-400/70"
                    : "pb:bg-white/10 pb:ring-1 pb:ring-peerbots-teal/60"
                : hasError
                  ? "pb:bg-red-500/10"
                  : hasWarning
                    ? "pb:bg-amber-500/10"
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
            isCursorLine
              ? hasError
                ? "pb:bg-red-500/15 pb:ring-1 pb:ring-red-400/70"
                : hasWarning
                  ? "pb:bg-amber-500/15 pb:ring-1 pb:ring-amber-400/70"
                  : "pb:bg-white/10 pb:ring-1 pb:ring-peerbots-teal/60"
              : hasError
                ? "pb:bg-red-500/10"
                : hasWarning
                  ? "pb:bg-amber-500/10"
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
    diagnosticsByLine,
    editorCursorLine,
    hoveredTokenIdx,
    selectedButtonId,
  ]);

  const activeLine: NormalizedLineView | undefined = useMemo(() => {
    if (isEditable) {
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
    isEditable,
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
      !isEditable ||
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
    isEditable,
    format,
    autocompleteDismissedAt,
    editorSelectionStart,
    draftCode,
    availableAnchors,
  ]);

  const clampedAutocompleteIndex = autocompleteContext
    ? Math.min(autocompleteIndex, autocompleteContext.suggestions.length - 1)
    : 0;

  const autocompletePosition = useMemo(() => {
    const lineStart =
      draftCode.lastIndexOf("\n", Math.max(0, editorSelectionStart - 1)) + 1;
    const cursorCol = Math.max(0, editorSelectionStart - lineStart);
    const cursorRow = Math.max(0, editorCursorLine - 1);
    const lineHeightPx = 24;
    const paddingTopPx = 12;
    const lineTop = paddingTopPx + cursorRow * lineHeightPx - editorScroll.top;
    const lineBottom = lineTop + lineHeightPx;
    const flipAbove = lineBottom > 190;

    return {
      top: flipAbove ? undefined : Math.max(4, lineBottom + 4),
      bottom: flipAbove
        ? `calc(100% - ${Math.max(4, lineTop)}px + 4px)`
        : undefined,
      left: `clamp(8px, calc(16px + ${cursorCol}ch - ${editorScroll.left}px), calc(100% - 18.5rem))`,
    };
  }, [draftCode, editorSelectionStart, editorCursorLine, editorScroll]);

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
    pushUndo(draftCode, editorSelectionStart);
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
    const textToCopy = isEditable ? draftCode : activeCode;
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
    pushUndo(draftCode, editorSelectionStart);
    if (format === "shorthand") {
      const reformatted = formatTemplateToCode(parsedDraft.template, {
        alwaysEmitAnchors: showAllAnchors,
      });
      setDraftCode(reformatted.code);
    } else {
      setDraftCode(JSON.stringify(parsedDraft.template, null, 2));
    }
  };

  const handleDiscardDraft = () => {
    setDraftCode(activeCode);
    undoStackRef.current = [];
    setAutocompleteDismissedAt(null);
    setAutocompleteIndex(0);
  };

  const handleApplyDraft = () => {
    if (!onTemplateChange || disabled || !parsedDraft.template) return;
    onTemplateChange(parsedDraft.template);
    undoStackRef.current = [];
  };

  const handleSwitchFormat = (nextFormat: "shorthand" | "json") => {
    setFormat(nextFormat);
    setHoveredLineNumber(null);
    setHoveredTokenIdx(null);
    setEditorCursorLine(1);
    undoStackRef.current = [];
    setDraftCode(
      nextFormat === "shorthand" ? formattedPttf.code : formattedJson.code,
    );
  };

  const hasButtons = Object.keys(template.buttons ?? {}).length > 0;

  if (!hasButtons && !isEditable) {
    return (
      <EmptyState
        title="No buttons in template"
        description="Add buttons to see Peerbots Template Text."
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

          {hasUnsavedChanges && (
            <span className="pb:px-2 pb:py-0.5 pb:text-[11px] pb:font-semibold pb:rounded-full pb:bg-amber-100 pb:text-amber-900 pb:border pb:border-amber-300">
              Unsaved
            </span>
          )}
        </div>

        <div className="pb:flex pb:flex-wrap pb:items-center pb:gap-2">
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

          {format === "shorthand" && (
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

          {isEditable && (
            <>
              <button
                type="button"
                onClick={handleFormatDraft}
                disabled={!parsedDraft.template}
                className="pb:px-2.5 pb:py-1 pb:text-xs pb:font-medium pb:rounded-lg pb:border pb:border-gray-300 pb:bg-white pb:text-gray-700 pb:hover:bg-gray-100 disabled:pb:opacity-50 pb:cursor-pointer"
              >
                Format
              </button>
              {hasUnsavedChanges && (
                <button
                  type="button"
                  onClick={handleDiscardDraft}
                  className="pb:px-2.5 pb:py-1 pb:text-xs pb:font-medium pb:rounded-lg pb:border pb:border-gray-300 pb:bg-white pb:text-gray-700 pb:hover:bg-gray-100 pb:cursor-pointer"
                >
                  Discard
                </button>
              )}
              <button
                type="button"
                onClick={handleApplyDraft}
                disabled={
                  !hasUnsavedChanges ||
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
      {!isEditable ? (
        <div
          className={cn(
            "pb:grid pb:grid-cols-1",
            showExplainer && "lg:pb:grid-cols-12",
          )}
        >
          {/* Read-Only Syntax-Highlighted Interactive Code Pane */}
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
        /* Unified Live Editor with Layered Syntax Highlighting, Inline Autocomplete & Explainer */
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
                  <code className="pb:px-1 pb:bg-gray-100 pb:rounded">!</code>{" "}
                  for a Log button, indent 2 spaces for children, use{" "}
                  <code className="pb:px-1 pb:bg-gray-100 pb:rounded">
                    [Label -&gt; Robot]
                  </code>{" "}
                  for colors,{" "}
                  <code className="pb:px-1 pb:bg-gray-100 pb:rounded">:)</code>{" "}
                  for emotion, and{" "}
                  <code className="pb:px-1 pb:bg-gray-100 pb:rounded">#tag</code>{" "}
                  /{" "}
                  <code className="pb:px-1 pb:bg-gray-100 pb:rounded">
                    -&gt; #tag
                  </code>{" "}
                  for loops.
                </span>
              ) : (
                <span>
                  Edit raw{" "}
                  <code className="pb:px-1 pb:bg-gray-100 pb:rounded">
                    Template
                  </code>{" "}
                  JSON (
                  <code className="pb:px-1 pb:bg-gray-100 pb:rounded">
                    buttons
                  </code>{" "}
                  &amp;{" "}
                  <code className="pb:px-1 pb:bg-gray-100 pb:rounded">
                    hierarchy
                  </code>
                  ). Click <strong>Format</strong> to pretty-print.
                </span>
              )}
              <span className="pb:font-medium pb:text-gray-700">
                {parsedDraft.buttonCount} buttons • {parsedDraft.rootCount} root
              </span>
            </div>

            <div className="pb:relative pb:flex pb:rounded-lg pb:border pb:border-gray-300 pb:bg-[#1e222b]">
              {/* Line Numbers Gutter */}
              <div
                ref={lineGutterRef}
                aria-hidden="true"
                className="pb:w-9 pb:shrink-0 pb:rounded-l-lg pb:py-3 pb:pr-2 pb:pl-2 pb:font-mono pb:text-xs sm:pb:text-sm pb:leading-6 pb:text-right pb:text-gray-500 pb:select-none pb:overflow-hidden pb:border-r pb:border-gray-800"
              >
                {draftCode.split(/\r?\n/).map((_, idx) => {
                  const lineNum = idx + 1;
                  const isActive = lineNum === editorCursorLine;
                  const lineDiags = diagnosticsByLine.get(lineNum) ?? [];
                  const hasError = lineDiags.some((d) => d.severity === "error");
                  const hasWarning = lineDiags.some(
                    (d) => d.severity === "warning",
                  );
                  return (
                    <div
                      key={lineNum}
                      title={
                        lineDiags.length > 0
                          ? lineDiags.map((d) => d.message).join("\n")
                          : undefined
                      }
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
                        setEditorSelectionStart(offset);
                        setHoveredTokenIdx(null);
                      }}
                      className={cn(
                        "pb:cursor-pointer pb:transition-colors",
                        hasError
                          ? "pb:text-red-400 pb:font-bold"
                          : hasWarning
                            ? "pb:text-amber-400 pb:font-semibold"
                            : isActive
                              ? "pb:text-peerbots-teal pb:font-semibold"
                              : "hover:pb:text-gray-300",
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
                    if (
                      (e.metaKey || e.ctrlKey) &&
                      !e.shiftKey &&
                      e.key.toLowerCase() === "z" &&
                      undoStackRef.current.length > 0
                    ) {
                      e.preventDefault();
                      const prev = undoStackRef.current.pop()!;
                      const prevLine = prev.code
                        .slice(0, prev.selectionStart)
                        .split(/\r?\n/).length;
                      setDraftCode(prev.code);
                      setEditorSelectionStart(prev.selectionStart);
                      setEditorCursorLine(prevLine);
                      setAutocompleteDismissedAt(null);
                      requestAnimationFrame(() => {
                        const el = textareaRef.current;
                        if (el) {
                          el.focus();
                          el.setSelectionRange(
                            prev.selectionStart,
                            prev.selectionStart,
                          );
                        }
                      });
                      return;
                    }

                    if (!autocompleteContext) return;
                    const { suggestions } = autocompleteContext;
                    if (suggestions.length === 0) return;

                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setAutocompleteIndex(
                        (prev) => (prev + 1) % suggestions.length,
                      );
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setAutocompleteIndex(
                        (prev) =>
                          (prev - 1 + suggestions.length) % suggestions.length,
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
                    const top = e.currentTarget.scrollTop;
                    const left = e.currentTarget.scrollLeft;
                    if (highlightPreRef.current) {
                      highlightPreRef.current.scrollTop = top;
                      highlightPreRef.current.scrollLeft = left;
                    }
                    if (lineGutterRef.current) {
                      lineGutterRef.current.scrollTop = top;
                    }
                    setEditorScroll({ top, left });
                  }}
                  rows={14}
                  spellCheck={false}
                  className="pb:absolute pb:inset-0 pb:w-full pb:h-full pb:resize-none pb:rounded-r-lg pb:bg-transparent pb:text-transparent pb:caret-white pb:font-mono pb:text-xs sm:pb:text-sm pb:leading-6 pb:py-3 pb:px-4 pb:whitespace-pre pb:overflow-auto focus:pb:outline-none focus:pb:ring-2 focus:pb:ring-peerbots-teal"
                />

                {/* Inline Floating Context-Aware Autocomplete */}
                {autocompleteContext && (
                  <CodeAutocompletePopup
                    context={autocompleteContext}
                    selectedIndex={clampedAutocompleteIndex}
                    position={autocompletePosition}
                    onHoverIndex={setAutocompleteIndex}
                    onSelect={applyAutocompleteSuggestion}
                  />
                )}
              </div>
            </div>

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
              lineDiagnostics={
                activeLine
                  ? (diagnosticsByLine.get(activeLine.lineNumber) ?? [])
                  : []
              }
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
