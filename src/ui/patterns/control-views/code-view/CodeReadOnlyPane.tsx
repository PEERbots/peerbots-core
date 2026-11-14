import { cn } from "../../../utils";
import type { PeerbotsButtonActionHandler } from "../types";
import { CodeStatusBar } from "./CodeStatusBar";
import type { NormalizedLineView } from "./constants";

export interface CodeReadOnlyPaneProps {
  lines: NormalizedLineView[];
  selectedButtonId: string | null;
  disabled: boolean;
  showExplainer: boolean;
  hoveredLineNumber: number | null;
  hoveredTokenIdx: number | null;
  activeLine: NormalizedLineView | undefined;
  activeToken?: NormalizedLineView["tokens"][number];
  onHoverLine: (lineNumber: number | null) => void;
  onHoverToken: (tokenIdx: number | null) => void;
  onButtonAction?: PeerbotsButtonActionHandler;
  className?: string;
}

/**
 * Interactive read-only syntax-highlighted code pane with line/token hover
 * inspection and keyboard selection.
 */
export function CodeReadOnlyPane({
  lines,
  selectedButtonId,
  disabled,
  showExplainer,
  hoveredLineNumber,
  hoveredTokenIdx,
  activeLine,
  activeToken,
  onHoverLine,
  onHoverToken,
  onButtonAction,
  className,
}: CodeReadOnlyPaneProps) {
  return (
    <div
      className={cn(
        "pb:bg-[#1e222b] pb:text-gray-100 pb:font-mono pb:text-xs sm:pb:text-sm pb:overflow-x-auto pb:p-3 pb:max-h-[32rem] pb:overflow-y-auto",
        className,
      )}
    >
      {lines.length === 0 ? (
        <div className="pb:text-gray-400 pb:py-6 pb:text-center pb:font-sans">
          No lines to display.
        </div>
      ) : (
        <div role="list" aria-label="Formatted template code lines">
          {lines.map((line) => {
            const isHovered = hoveredLineNumber === line.lineNumber;
            const isSelected =
              Boolean(selectedButtonId) && line.buttonId === selectedButtonId;

            return (
              <div
                key={line.lineNumber}
                role="listitem"
                tabIndex={0}
                aria-label={`Line ${line.lineNumber}: ${line.summary}`}
                onMouseEnter={() => {
                  onHoverLine(line.lineNumber);
                  onHoverToken(null);
                }}
                onFocus={() => {
                  onHoverLine(line.lineNumber);
                  onHoverToken(null);
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
                          onHoverLine(line.lineNumber);
                          onHoverToken(tokIdx);
                        }}
                        onMouseLeave={() => {
                          onHoverToken(null);
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

      {showExplainer && (
        <CodeStatusBar
          activeLine={activeLine}
          activeToken={activeToken}
          className="pb:mt-3 pb:pt-2.5 pb:border-t pb:border-gray-700/80"
        />
      )}
    </div>
  );
}
