import React from "react";
import type {
  PeerbotsEmotion,
  RobotControlButton,
} from "../../templates/types";
import { PeerbotsEmotionIcon } from "../forms/EmotionSelector";
import {
  PEERBOTS_COLOR_MAP,
  PEERBOTS_FONT_COLOR_MAP,
} from "../forms/PeerbotsColorSelector";
import { cn } from "../utils";

export interface PeerbotsButtonProps {
  /** Controlled button model */
  button?: RobotControlButton;
  /** Alias for `button` (backward-compatible with `app.peerbots.org`) */
  buttonInfo?: RobotControlButton;
  /** Whether the button is currently selected */
  selected?: boolean;
  /** Whether interaction is disabled */
  disabled?: boolean;
  /** Click callback invoked when the button is activated */
  onClick?: () => void;
  /** Optional custom emotion icon overrides (image URL or React node) */
  emotionIcons?: Partial<Record<PeerbotsEmotion, string | React.ReactNode>>;
  /** Optional localized emotion names */
  emotionLabels?: Partial<Record<PeerbotsEmotion, string>>;
  className?: string;
}

/**
 * Controlled Peerbots controller button displaying the button's label color, title,
 * and (for `"Message"` buttons) a decorative corner badge showing the robot face color + emotion.
 *
 * Note: The emotion icon inside `<button>` is marked `decorative={true}` (`alt=""` and `aria-hidden="true"`)
 * so the button's accessible name equals its visible `title` text (satisfying WCAG 2.5.3 `label-content-name-mismatch`).
 */
export function PeerbotsButton({
  button,
  buttonInfo,
  selected = false,
  disabled = false,
  onClick,
  emotionIcons,
  className,
}: PeerbotsButtonProps) {
  const resolved = button ?? buttonInfo;
  if (!resolved) {
    return null;
  }

  const labelBg =
    PEERBOTS_COLOR_MAP[resolved.labelColor] ?? resolved.labelColor;
  const labelFg = PEERBOTS_FONT_COLOR_MAP[resolved.labelColor] ?? "#020307";

  return (
    <div className={cn("pb:mx-2", className)}>
      <button
        type="button"
        disabled={disabled}
        aria-pressed={selected}
        onClick={() => {
          if (!disabled) {
            onClick?.();
          }
        }}
        className={cn(
          "pb:p-4 pb:my-2 pb:border-2 pb:rounded-md pb:shadow-sm pb:text-center pb:text-sm pb:font-bold pb:cursor-pointer pb:z-0 pb:relative pb:hover:border-solid pb:hover:opacity-85 pb:transition-opacity pb:w-full pb:focus-visible:outline-2 pb:focus-visible:outline-offset-2 pb:focus-visible:outline-peerbots-darkteal pb:disabled:opacity-50 pb:disabled:cursor-not-allowed",
          selected ? "pb:border-gray-950" : "pb:border-gray-200",
        )}
        style={{
          color: labelFg,
          background: labelBg,
          boxShadow: "0.5px 0.5px 4px 1px rgba(0, 0, 0, 0.20)",
        }}
      >
        <div className="pb:truncate">{resolved.details.title}</div>
        {resolved.type === "Message" && (
          <span
            aria-hidden="true"
            className="pb:rounded-full pb:h-8 pb:w-8 pb:p-1 pb:flex pb:items-center pb:justify-center pb:absolute pb:-top-3.5 pb:-end-3.5 pb:z-10 pb:border-solid pb:border-gray-950 pb:border-2"
            style={{
              background:
                PEERBOTS_COLOR_MAP[resolved.details.color] ??
                resolved.details.color,
            }}
          >
            <PeerbotsEmotionIcon
              emotion={resolved.details.emotion}
              customIcon={emotionIcons?.[resolved.details.emotion]}
              decorative={true}
            />
          </span>
        )}
      </button>
    </div>
  );
}
