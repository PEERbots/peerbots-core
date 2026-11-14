import React, { useRef } from "react";
import { Icon } from "../../foundations/Icon";
import { cn } from "../../utils";
import { CodeAutocompletePopup } from "./CodeAutocompletePopup";
import { CodeStatusBar } from "./CodeStatusBar";
import type {
  CodeAutocompleteOption,
  CodeAutocompleteState,
  CodeDiagnosticItem,
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
 * line-number gutter, syntax-highlighted `<pre>` overlay, inline floating
 * autocomplete, live status bar, and line-by-line diagnostics.
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

  return (
    <div className={cn("pb:p-4 pb:flex pb:flex-col pb:gap-3", className)}>
      {(headerLeft || headerRight) && (
        <div className="pb:flex pb:flex-wrap pb:items-center pb:justify-between pb:gap-2 pb:text-xs pb:text-gray-600">
          {headerLeft}
          {headerRight}
        </div>
      )}

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
            const hasWarning = lineDiags.some((d) => d.severity === "warning");
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
                  onJumpToLine(lineNum, offset);
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
            className="pb:absolute pb:inset-0 pb:w-full pb:h-full pb:resize-none pb:rounded-r-lg pb:bg-transparent pb:text-transparent pb:caret-white pb:font-mono pb:text-xs sm:pb:text-sm pb:leading-6 pb:py-3 pb:px-4 pb:whitespace-pre pb:overflow-auto focus:pb:outline-none focus:pb:ring-2 focus:pb:ring-peerbots-teal"
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
