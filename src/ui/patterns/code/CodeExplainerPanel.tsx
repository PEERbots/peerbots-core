import React from "react";
import { Icon } from "../../foundations/Icon";
import { cn } from "../../utils";
import type {
  CodeDiagnosticItem,
  ExplainedCodeLine,
  ExplainedCodeSwatch,
} from "./types";

export interface CodeExplainerPanelProps<
  TLine extends ExplainedCodeLine = ExplainedCodeLine,
> {
  activeLine: TLine | undefined;
  lineDiagnostics?: CodeDiagnosticItem[];
  hoveredTokenIdx: number | null;
  onHoverToken: (idx: number | null) => void;
  /** Optional domain-specific preview rendered above the token breakdown */
  renderPreview?: (line: TLine) => React.ReactNode;
  heading?: string;
  emptyHint: string;
  className?: string;
}

/**
 * Domain-neutral code explainer aside showing line diagnostics, an optional
 * domain preview slot, and an interactive token-by-token syntax breakdown.
 */
export function CodeExplainerPanel<
  TLine extends ExplainedCodeLine = ExplainedCodeLine,
>({
  activeLine,
  lineDiagnostics = [],
  hoveredTokenIdx,
  onHoverToken,
  renderPreview,
  heading = "What This Produces",
  emptyHint,
  className,
}: CodeExplainerPanelProps<TLine>) {
  return (
    <aside
      aria-label="Interactive code explainer"
      className={cn(
        "lg:pb:col-span-5 pb:bg-gray-50 pb:border-t lg:pb:border-t-0 lg:pb:border-l pb:border-gray-200 pb:p-4 pb:flex pb:flex-col pb:gap-4",
        className,
      )}
    >
      <div className="pb:flex pb:items-center pb:justify-between">
        <h3 className="pb:text-xs pb:font-bold pb:uppercase pb:tracking-wider pb:text-gray-500">
          {heading}
        </h3>
        {activeLine && (
          <span className="pb:text-xs pb:text-gray-500">
            Line {activeLine.lineNumber}
            {activeLine.metaLabel ? ` • ${activeLine.metaLabel}` : ""}
          </span>
        )}
      </div>

      {lineDiagnostics.length > 0 && (
        <div className="pb:flex pb:flex-col pb:gap-1.5">
          {lineDiagnostics.map((diag, idx) => (
            <div
              key={idx}
              className={cn(
                "pb:flex pb:items-start pb:gap-2 pb:px-2.5 pb:py-2 pb:rounded-lg pb:text-xs pb:border",
                diag.severity === "error"
                  ? "pb:bg-red-50 pb:border-red-200 pb:text-red-800"
                  : "pb:bg-amber-50 pb:border-amber-200 pb:text-amber-900",
              )}
            >
              <Icon
                name={
                  diag.severity === "error" ? "xCircle" : "exclamationTriangle"
                }
                className="pb:w-4 pb:h-4 pb:shrink-0 pb:mt-0.5"
              />
              <span>{diag.message}</span>
            </div>
          ))}
        </div>
      )}

      {activeLine ? (
        <>
          {renderPreview?.(activeLine)}

          <div className="pb:flex pb:flex-col pb:gap-1.5">
            <div className="pb:text-xs pb:font-semibold pb:text-gray-700">
              Syntax Breakdown
            </div>
            <ul className="pb:flex pb:flex-col pb:gap-1.5">
              {activeLine.tokens
                .filter((t) => !t.isStructural)
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
                      <TokenSwatches swatches={tok.swatches} />
                      <div className="pb:min-w-0 pb:flex-1">
                        <div className="pb:flex pb:items-center pb:gap-1.5">
                          <span className="pb:font-semibold pb:text-gray-900">
                            {tok.badgeLabel}
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

function TokenSwatches({ swatches }: { swatches?: ExplainedCodeSwatch[] }) {
  if (!swatches || swatches.length === 0) return null;
  return (
    <div className="pb:flex pb:items-center pb:gap-1 pb:mt-0.5 pb:shrink-0">
      {swatches.map((swatch, idx) => (
        <span
          key={idx}
          title={swatch.title}
          className={cn(
            "pb:w-3 pb:h-3 pb:border pb:border-gray-300",
            swatch.shape === "circle" ? "pb:rounded-full" : "pb:rounded-sm",
          )}
          style={{ backgroundColor: swatch.color }}
        />
      ))}
    </div>
  );
}
