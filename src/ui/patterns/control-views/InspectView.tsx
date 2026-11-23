import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  formatTemplateToCode,
  formatTemplateToJsonCode,
  getCodeAutocompleteContext,
} from "../../../templates/codeFormat";
import type { PeerbotsEmotion, Template } from "../../../templates/types";
import { EmptyState } from "../../feedback/EmptyState";
import { Icon, type IconName } from "../../foundations/Icon";
import { cn } from "../../utils";
import {
  CodeEditorSurface,
  CodeExplainerPanel,
  CodeInteractiveLines,
  type CodeAutocompleteOption,
} from "../code";
import {
  adaptAutocompleteContext,
  adaptJsonLines,
  adaptPttfLines,
  type ExplainedPttfLine,
} from "./code-view/pttfAdapter";
import { buildPlayableButtonLineMap } from "./code-view/playableLines";
import { PttfButtonPreview } from "./code-view/PttfButtonPreview";
import { useCodeViewDraft } from "./code-view/useCodeViewDraft";
import type { PeerbotsButtonActionHandler } from "./types";

export interface InspectViewProps {
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
  /** Optional icon name for `"Log"` buttons (@default "pencilNote") */
  logIcon?: IconName;
  /** Optional custom emotion icon overrides */
  emotionIcons?: Partial<Record<PeerbotsEmotion, string | React.ReactNode>>;
  /** Optional localized emotion names */
  emotionLabels?: Partial<Record<PeerbotsEmotion, string>>;
  /** Initial syntax format: `"shorthand"` (PTTF) or `"json"` (@default "shorthand") */
  defaultFormat?: "shorthand" | "json";
  /** Whether the editor starts locked in read-only play mode (@default false when `onTemplateChange` is provided). */
  defaultLocked?: boolean;
  /**
   * @deprecated Inspect and Edit are now unified: providing `onTemplateChange` enables live editing directly.
   */
  defaultMode?: "inspect" | "edit";
  /** Whether hover/focus explainers are enabled (@default true) */
  defaultShowExplainer?: boolean;
  /** Visible heading label in the toolbar (@default "Inspect View") */
  title?: string;
  /** Additional container classes */
  className?: string;
}

interface UndoEntry {
  code: string;
  selectionStart: number;
}

/**
 * Interactive Inspect & Shorthand View for Peerbots `Template` objects.
 *
 * Composes domain-neutral {@link CodeInteractiveLines}, {@link CodeEditorSurface},
 * and {@link CodeExplainerPanel} with PTTF/JSON adapters and {@link PttfButtonPreview}.
 */
export function InspectView({
  template,
  onButtonAction,
  onTemplateChange,
  selectedButtonId = null,
  disabled = false,
  logIcon = "pencilNote",
  emotionIcons,
  emotionLabels,
  defaultFormat = "shorthand",
  defaultLocked = false,
  defaultMode: _defaultMode,
  defaultShowExplainer = true,
  title = "Inspect View",
  className,
}: InspectViewProps) {
  const canEdit = Boolean(onTemplateChange) && !disabled;
  const [isLocked, setIsLocked] = useState<boolean>(defaultLocked);
  const isEditable = canEdit && !isLocked;

  const [format, setFormat] = useState<"shorthand" | "json">(defaultFormat);
  const [showExplainer, setShowExplainer] = useState<boolean>(
    defaultShowExplainer,
  );
  const [explainerWidthPercent, setExplainerWidthPercent] =
    useState<number>(40);
  const [isResizingExplainer, setIsResizingExplainer] =
    useState<boolean>(false);
  const [showAllAnchors, setShowAllAnchors] = useState<boolean>(false);

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

  const splitContainerRef = useRef<HTMLDivElement | null>(null);
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
        ? adaptPttfLines(formattedPttf.lines, selectedButtonId)
        : adaptJsonLines(formattedJson.lines, selectedButtonId),
    [format, formattedPttf.lines, formattedJson.lines, selectedButtonId],
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

  const { parsedDraft, diagnosticsByLine, highlightedDraftLines } =
    useCodeViewDraft({
      draftCode,
      format,
      template,
      selectedButtonId,
      editorCursorLine,
      hoveredTokenIdx,
    });

  const playableLines = useMemo(
    () =>
      buildPlayableButtonLineMap({
        format,
        draftCode,
        isEditable,
        disabled,
        parsedTemplate: parsedDraft.template,
        diagnostics: parsedDraft.diagnostics,
        lines: isEditable ? parsedDraft.draftLines : normalizedLines,
        selectedButtonId,
      }),
    [
      format,
      draftCode,
      isEditable,
      disabled,
      parsedDraft.template,
      parsedDraft.diagnostics,
      parsedDraft.draftLines,
      normalizedLines,
      selectedButtonId,
    ],
  );

  const handlePlayLine = (lineNumber: number) => {
    if (disabled || !onButtonAction) return;
    const entry = playableLines.get(lineNumber);
    if (!entry) return;
    onButtonAction(entry.button, entry.buttonId, { type: "SELECT" });
  };

  const activeLine: ExplainedPttfLine | undefined = useMemo(() => {
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

  const autocompleteContext = useMemo(() => {
    if (
      !isEditable ||
      format !== "shorthand" ||
      autocompleteDismissedAt === editorSelectionStart
    ) {
      return null;
    }
    return adaptAutocompleteContext(
      getCodeAutocompleteContext(
        draftCode,
        editorSelectionStart,
        availableAnchors,
      ),
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

  const applyAutocompleteSuggestion = (suggestion: CodeAutocompleteOption) => {
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

  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      const entry = playableLines.get(editorCursorLine);
      if (entry && onButtonAction && !disabled) {
        e.preventDefault();
        onButtonAction(entry.button, entry.buttonId, { type: "SELECT" });
        return;
      }
    }

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
          el.setSelectionRange(prev.selectionStart, prev.selectionStart);
        }
      });
      return;
    }

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
      applyAutocompleteSuggestion(suggestions[clampedAutocompleteIndex]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setAutocompleteDismissedAt(editorSelectionStart);
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
      setDraftCode(formatTemplateToJsonCode(parsedDraft.template).code);
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
            {title}
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
          {canEdit && (
            <button
              type="button"
              onClick={() => setIsLocked((prev) => !prev)}
              aria-pressed={isLocked}
              aria-label={
                isLocked ? "Unlock code editor" : "Lock code editor"
              }
              title={
                isLocked
                  ? "Unlock to edit code"
                  : "Lock to read-only play mode"
              }
              className={cn(
                "pb:inline-flex pb:items-center pb:justify-center pb:p-1.5 pb:rounded-lg pb:border pb:transition-colors pb:cursor-pointer",
                isLocked
                  ? "pb:border-peerbots-teal pb:bg-peerbots-teal/10 pb:text-teal-800"
                  : "pb:border-gray-300 pb:bg-white pb:text-gray-700 pb:hover:bg-gray-100",
              )}
            >
              <Icon
                name={isLocked ? "lockClosed" : "lockOpen"}
                className="pb:w-4 pb:h-4"
              />
            </button>
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
                className="pb:px-2.5 pb:py-1 pb:text-xs pb:font-medium pb:rounded-lg pb:border pb:border-gray-300 pb:bg-white pb:text-gray-700 pb:hover:bg-gray-100 pb:disabled:opacity-50 pb:cursor-pointer"
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
                className="pb:px-3 pb:py-1 pb:text-xs pb:font-semibold pb:rounded-lg pb:bg-peerbots-teal pb:text-gray-900 pb:hover:opacity-90 pb:disabled:opacity-50 pb:cursor-pointer"
              >
                Apply Changes
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div
        ref={splitContainerRef}
        className={cn(
          "pb:flex pb:flex-col",
          showExplainer && "pb:lg:flex-row",
          isResizingExplainer && "pb:select-none",
        )}
      >
        {!isEditable ? (
          <CodeInteractiveLines
            lines={normalizedLines}
            disabled={disabled}
            showStatusBar={showExplainer}
            hoveredLineNumber={hoveredLineNumber}
            hoveredTokenIdx={hoveredTokenIdx}
            activeLine={activeLine}
            activeToken={activeToken}
            onHoverLine={setHoveredLineNumber}
            onHoverToken={setHoveredTokenIdx}
            onSelectLine={(line) => {
              if (onButtonAction && line.buttonId && line.button) {
                onButtonAction(line.button, line.buttonId, { type: "SELECT" });
              }
            }}
            lineActions={onButtonAction ? playableLines : undefined}
            onLineAction={onButtonAction ? handlePlayLine : undefined}
            className="pb:flex-1 pb:min-w-0"
          />
        ) : (
          <CodeEditorSurface
            draftCode={draftCode}
            highlightedDraftLines={highlightedDraftLines}
            diagnostics={parsedDraft.diagnostics}
            diagnosticsByLine={diagnosticsByLine}
            editorCursorLine={editorCursorLine}
            showStatusBar={showExplainer}
            activeLine={activeLine}
            activeToken={activeToken}
            autocompleteContext={autocompleteContext}
            autocompleteIndex={clampedAutocompleteIndex}
            autocompletePosition={autocompletePosition}
            textareaRef={textareaRef}
            lineActions={onButtonAction ? playableLines : undefined}
            onLineAction={onButtonAction ? handlePlayLine : undefined}
            headerLeft={
              format === "shorthand" ? (
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
              )
            }
            headerRight={
              <span className="pb:font-medium pb:text-gray-700">
                {parsedDraft.buttonCount} buttons • {parsedDraft.rootCount} root
              </span>
            }
            onDraftChange={(nextValue, el) => {
              setDraftCode(nextValue);
              updateCursorLine(el);
            }}
            onCursorUpdate={updateCursorLine}
            onKeyDown={handleEditorKeyDown}
            onScrollSync={setEditorScroll}
            onJumpToLine={(lineNum, offset) => {
              setEditorCursorLine(lineNum);
              setEditorSelectionStart(offset);
              setHoveredTokenIdx(null);
            }}
            onAutocompleteHover={setAutocompleteIndex}
            onAutocompleteSelect={applyAutocompleteSuggestion}
            className="pb:flex-1 pb:min-w-0"
          />
        )}

        {showExplainer && (
          <>
            <div
              role="separator"
              aria-orientation="vertical"
              aria-label="Resize code explainer panel"
              aria-valuemin={22}
              aria-valuemax={62}
              aria-valuenow={Math.round(explainerWidthPercent)}
              tabIndex={0}
              title="Drag to resize explainer (double-click to reset)"
              onDoubleClick={() => setExplainerWidthPercent(40)}
              onPointerDown={(e) => {
                if (e.button !== 0 && e.pointerType === "mouse") return;
                e.preventDefault();
                e.currentTarget.setPointerCapture?.(e.pointerId);
                setIsResizingExplainer(true);
              }}
              onPointerMove={(e) => {
                if (!isResizingExplainer) return;
                const container = splitContainerRef.current;
                if (!container) return;
                const rect = container.getBoundingClientRect();
                if (rect.width <= 0) return;
                const isRtl =
                  typeof window !== "undefined" &&
                  window.getComputedStyle(container).direction === "rtl";
                const rawPercent = isRtl
                  ? ((e.clientX - rect.left) / rect.width) * 100
                  : ((rect.right - e.clientX) / rect.width) * 100;
                const clamped = Math.min(62, Math.max(22, rawPercent));
                setExplainerWidthPercent(clamped);
              }}
              onPointerUp={(e) => {
                if (!isResizingExplainer) return;
                e.currentTarget.releasePointerCapture?.(e.pointerId);
                setIsResizingExplainer(false);
              }}
              onPointerCancel={() => setIsResizingExplainer(false)}
              onKeyDown={(e) => {
                const step = e.shiftKey ? 8 : 3;
                if (e.key === "ArrowLeft") {
                  e.preventDefault();
                  setExplainerWidthPercent((prev) =>
                    Math.min(62, prev + step),
                  );
                } else if (e.key === "ArrowRight") {
                  e.preventDefault();
                  setExplainerWidthPercent((prev) =>
                    Math.max(22, prev - step),
                  );
                } else if (e.key === "Home") {
                  e.preventDefault();
                  setExplainerWidthPercent(40);
                }
              }}
              className={cn(
                "pb:hidden pb:lg:flex pb:w-2 pb:shrink-0 pb:cursor-col-resize pb:items-center pb:justify-center pb:bg-gray-100 pb:border-s pb:border-gray-200 pb:transition-colors pb:hover:bg-peerbots-teal/30 pb:focus:outline-none pb:focus-visible:bg-peerbots-teal/40 pb:touch-none",
                isResizingExplainer && "pb:bg-peerbots-teal/40",
              )}
            >
              <span
                aria-hidden="true"
                className="pb:h-8 pb:w-0.5 pb:rounded-full pb:bg-gray-400"
              />
            </div>

            <CodeExplainerPanel
              activeLine={activeLine}
              lineDiagnostics={
                isEditable && activeLine
                  ? (diagnosticsByLine.get(activeLine.lineNumber) ?? [])
                  : []
              }
              hoveredTokenIdx={hoveredTokenIdx}
              onHoverToken={setHoveredTokenIdx}
              style={
                {
                  "--explainer-width": `${explainerWidthPercent}%`,
                } as React.CSSProperties
              }
              className="pb:lg:w-[var(--explainer-width)] pb:lg:shrink-0 pb:lg:border-l-0"
              renderPreview={(line) => (
                <PttfButtonPreview
                  line={line}
                  disabled={disabled}
                  logIcon={logIcon}
                  emotionIcons={emotionIcons}
                  emotionLabels={emotionLabels}
                  onButtonAction={onButtonAction}
                />
              )}
              emptyHint={
                isEditable
                  ? format === "json" && !parsedDraft.template
                    ? "Fix the JSON syntax error to restore the live button preview and breakdown."
                    : "Place your cursor on any line to preview its button and see what each symbol means."
                  : "Hover or focus any line on the left to preview its button and see what each symbol means."
              }
            />
          </>
        )}
      </div>
    </div>
  );
}

/**
 * @deprecated Renamed to {@link InspectViewProps}.
 * TODO(v2): Remove deprecated `CodeViewProps` alias in the next major release (v2.0.0).
 */
export type CodeViewProps = InspectViewProps;

/**
 * @deprecated Renamed to {@link InspectView}.
 * TODO(v2): Remove deprecated `CodeView` alias in the next major release (v2.0.0).
 */
export const CodeView = InspectView;

