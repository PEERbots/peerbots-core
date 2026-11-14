import React from "react";
import type { CodeDiagnostic } from "../../../../templates/codeFormat";
import type { PeerbotsColor, PeerbotsEmotion } from "../../../../templates/types";
import { PEERBOTS_COLOR_MAP } from "../../../forms/PeerbotsColorSelector";
import { Icon, type IconName } from "../../../foundations/Icon";
import { cn } from "../../../utils";
import { PeerbotsButton } from "../../PeerbotsButton";
import type { PeerbotsButtonActionHandler } from "../types";
import { TOKEN_BADGE_LABELS, type NormalizedLineView } from "./constants";

export interface CodeExplainerAsideProps {
  activeLine: NormalizedLineView | undefined;
  lineDiagnostics?: CodeDiagnostic[];
  format: "shorthand" | "json";
  disabled: boolean;
  logIcon: IconName;
  emotionIcons?: Partial<Record<PeerbotsEmotion, string | React.ReactNode>>;
  emotionLabels?: Partial<Record<PeerbotsEmotion, string>>;
  hoveredTokenIdx: number | null;
  onHoverToken: (idx: number | null) => void;
  onButtonAction?: PeerbotsButtonActionHandler;
  emptyHint: string;
}

export function CodeExplainerAside({
  activeLine,
  lineDiagnostics = [],
  format,
  disabled,
  logIcon,
  emotionIcons,
  emotionLabels,
  hoveredTokenIdx,
  onHoverToken,
  onButtonAction,
  emptyHint,
}: CodeExplainerAsideProps) {
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
