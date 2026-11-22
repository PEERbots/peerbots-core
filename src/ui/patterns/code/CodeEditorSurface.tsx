import React, { useRef } from "react";
import { Icon } from "../../foundations/Icon";
import { cn } from "../../utils";
import { CodeAutocompletePopup } from "./CodeAutocompletePopup";
import { CodeStatusBar } from "./CodeStatusBar";
import type {
  CodeAutocompleteOption,
  CodeAutocompleteState,
  CodeDiagnosticItem,
  CodeLineActionItem,
  ExplainedCodeLine,
  ExplainedCodeToken,
} from "./types";

export interface CodeEditorSurfaceProps {
  draftCode: string;
  highlightedDraftLines: React.ReactNode;
  diagnostics: CodeDiagnosticItem[];
  diagnosticsByLine: Map<number, CodeDiagnosticItem[]>;
  editorCursorLine: number;
  showStatusBar?: boolean;
  activeLine: ExplainedCodeLine | undefined;
  activeToken?: ExplainedCodeToken;
  autocompleteContext: CodeAutocompleteState | null;
  autocompleteIndex: number;
  autocompletePosition: {
    top?: number;
    bottom?: string;
    left: string;
  };
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
  textareaAriaLabel?: string;
  /** Optional map of lineNumber -> playable button metadata for rendering left-gutter Play buttons. */
  lineActions?: Map<number, CodeLineActionItem>;
  /** Invoked when a line's gutter Play button is clicked. */
  onLineAction?: (lineNumber: number) => void;
  onDraftChange: (nextValue: string, el: HTMLTextAreaElement) => void;
  onCursorUpdate: (el: HTMLTextAreaElement) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onScrollSync: (scroll: { top: number; left: number }) => void;
  onJumpToLine: (lineNumber: number, offset: number) => void;
  onAutocompleteHover: (idx: number) => void;
  onAutocompleteSelect: (suggestion: CodeAutocompleteOption) => void;
  className?: string;
}

/**
 * Domain-neutral layered monospace code editor surface with clickable
 * line-number gutter, optional per-line Play/error triggers, syntax-highlighted
 * `<pre>` overlay, inline floating autocomplete, live status bar, and
 * line-by-line diagnostics.
 */
export function CodeEditorSurface({
  draftCode,
  highlightedDraftLines,
  diagnostics,
  diagnosticsByLine,
  editorCursorLine,
  showStatusBar = true,
  activeLine,
  activeToken,
  autocompleteContext,
  autocompleteIndex,
  autocompletePosition,
  textareaRef,
  headerLeft,
  headerRight,
  textareaAriaLabel = "Template code editor",
  lineActions,
  onLineAction,
  onDraftChange,
  onCursorUpdate,
  onKeyDown,
  onScrollSync,
  onJumpToLine,
  onAutocompleteHover,
  onAutocompleteSelect,
  className,
}: CodeEditorSurfaceProps) {
  const highlightPreRef = useRef<HTMLPreElement | null>(null);
  const lineGutterRef = useRef<HTMLDivElement | null>(null);
  const hasActionSlot = Boolean(onLineAction);

  return (
    <div className={cn("pb:p-4 pb:flex pb:flex-col pb:gap-3", className)}>
      {(headerLeft || headerRight) && (
        <div className="pb:flex pb:flex-wrap pb:items-center pb:justify-between pb:gap-2 pb:text-xs pb:text-gray-600">
          {headerLeft}
          {headerRight}
        </div>
      )}

      <div className="pb:relative pb:flex pb:rounded-lg pb:border pb:border-gray-300 pb:bg-[#1e222b] pb:max-h-[32rem]">
        {/* Line Numbers & Play/Error Gutter */}
        <div
          ref={lineGutterRef}
          aria-hidden={hasActionSlot ? undefined : true}
          className={cn(
            "pb:shrink-0 pb:rounded-l-lg pb:py-3 pb:pr-2 pb:pl-1.5 pb:font-mono pb:text-xs pb:sm:text-sm pb:leading-6 pb:text-right pb:text-gray-500 pb:select-none pb:overflow-hidden pb:max-h-[32rem] pb:border-r pb:border-gray-800",
            hasActionSlot ? "pb:w-14" : "pb:w-9 pb:pl-2",
          )}
        >
          {draftCode.split(/\r?\n/).map((_, idx) => {
            const lineNum = idx + 1;
            const isActive = lineNum === editorCursorLine;
            const lineDiags = diagnosticsByLine.get(lineNum) ?? [];
            const hasError = lineDiags.some((d) => d.severity === "error");
            const hasWarning = lineDiags.some((d) => d.severity === "warning");
            const action = lineActions?.get(lineNum);
            const diagTooltip =
              lineDiags.length > 0
                ? lineDiags.map((d) => d.message).join("\n")
                : undefined;

            return (
              <div
                key={lineNum}
                title={diagTooltip}
                className="pb:h-6 pb:flex pb:items-center pb:justify-end pb:gap-1"
              >
                {hasActionSlot && (
                  <span className="pb:w-4 pb:shrink-0 pb:flex pb:items-center pb:justify-center">
                    {hasError ? (
                      <Icon
                        name="xCircle"
                        aria-hidden="true"
                        className="pb:w-3.5 pb:h-3.5 pb:text-red-400"
                      />
                    ) : action && onLineAction ? (
                      <button
                        type="button"
                        tabIndex={-1}
                        aria-label={`Play button: ${action.label}`}
                        title={`Play button: ${action.label} (Ctrl/Cmd+Enter)`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onLineAction(lineNum);
                        }}
                        className={cn(
                          "pb:inline-flex pb:items-center pb:justify-center pb:w-4 pb:h-4 pb:rounded pb:transition-colors pb:cursor-pointer",
                          action.isSelected
                            ? "pb:text-peerbots-teal pb:bg-peerbots-teal/20"
                            : "pb:text-gray-400 pb:hover:text-peerbots-teal pb:hover:bg-white/10",
                        )}
                      >
                        <Icon name="play" className="pb:w-3 pb:h-3" />
                      </button>
                    ) : null}
                  </span>
                )}
                <span
                  aria-hidden="true"
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
                    onJumpToLine(lineNum, offset);
                  }}
                  className={cn(
                    "pb:min-w-[1.5rem] pb:text-right pb:cursor-pointer pb:transition-colors",
                    hasError
                      ? "pb:text-red-400 pb:font-bold"
                      : hasWarning
                        ? "pb:text-amber-400 pb:font-semibold"
                        : isActive
                          ? "pb:text-peerbots-teal pb:font-semibold"
                          : "pb:hover:text-gray-300",
                  )}
                >
                  {lineNum}
                </span>
              </div>
            );
          })}
        </div>

        <div className="pb:relative pb:flex-1 pb:min-w-0">
          <pre
            ref={highlightPreRef}
            aria-hidden="true"
            className="pb:pointer-events-none pb:m-0 pb:py-3 pb:px-3 pb:font-mono pb:text-xs pb:sm:text-sm pb:leading-6 pb:whitespace-pre pb:overflow-hidden pb:min-h-[21rem] pb:max-h-[32rem]"
          >
            {highlightedDraftLines}
          </pre>
          <textarea
            ref={textareaRef}
            aria-label={textareaAriaLabel}
            aria-expanded={Boolean(autocompleteContext)}
            aria-autocomplete="list"
            value={draftCode}
            wrap="off"
            onChange={(e) => onDraftChange(e.target.value, e.currentTarget)}
            onClick={(e) => onCursorUpdate(e.currentTarget)}
            onKeyUp={(e) => onCursorUpdate(e.currentTarget)}
            onSelect={(e) => onCursorUpdate(e.currentTarget)}
            onFocus={(e) => onCursorUpdate(e.currentTarget)}
            onKeyDown={onKeyDown}
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
              onScrollSync({ top, left });
            }}
            rows={14}
            spellCheck={false}
            className="pb:absolute pb:inset-0 pb:w-full pb:h-full pb:resize-none pb:rounded-r-lg pb:bg-transparent pb:text-transparent pb:caret-white pb:font-mono pb:text-xs pb:sm:text-sm pb:leading-6 pb:py-3 pb:px-4 pb:whitespace-pre pb:overflow-auto pb:focus:outline-none pb:focus:ring-2 pb:focus:ring-peerbots-teal"
          />

          {autocompleteContext && (
            <CodeAutocompletePopup
              context={autocompleteContext}
              selectedIndex={autocompleteIndex}
              position={autocompletePosition}
              onHoverIndex={onAutocompleteHover}
              onSelect={onAutocompleteSelect}
            />
          )}
        </div>
      </div>

      {showStatusBar && (
        <CodeStatusBar
          activeLine={activeLine}
          activeToken={activeToken}
          className="pb:px-3 pb:py-2 pb:rounded-lg pb:bg-[#1e222b]"
        />
      )}

      {diagnostics.length > 0 && (
        <div
          role="status"
          aria-label="Code diagnostics"
          className="pb:flex pb:flex-col pb:gap-1.5"
        >
          {diagnostics.map((diag, idx) => (
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
                  diag.severity === "error" ? "xCircle" : "exclamationTriangle"
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
  );
}
