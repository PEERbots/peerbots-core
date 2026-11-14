import { cn } from "../../../utils";
import { TOKEN_BADGE_LABELS, type NormalizedLineView } from "./constants";

export interface CodeStatusBarProps {
  activeLine: NormalizedLineView | undefined;
  activeToken?: NormalizedLineView["tokens"][number];
  className?: string;
}

/**
 * Compact live status bar displaying the active token or line summary.
 */
export function CodeStatusBar({
  activeLine,
  activeToken,
  className,
}: CodeStatusBarProps) {
  if (!activeLine) return null;

  return (
    <div
      aria-live="polite"
      className={cn(
        "pb:font-sans pb:text-xs pb:text-gray-300 pb:flex pb:items-center pb:gap-2",
        className,
      )}
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
  );
}
