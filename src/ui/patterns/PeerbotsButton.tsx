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
import { Icon, type IconName } from "../foundations/Icon";
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
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Double-click callback (e.g. opening inline edit in FlowView) */
  onDoubleClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Right-click context menu handler (e.g. opening the edit popover in ButtonView) */
  onContextMenu?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Optional ref forwarded to the underlying `<button>` element */
  buttonRef?: React.Ref<HTMLButtonElement>;
  /** Optional icon name rendered in the top-left badge of `"Log"` buttons (@default "zap") */
  logIcon?: IconName;
  /** Optional custom emotion icon overrides (image URL or React node) */
  emotionIcons?: Partial<Record<PeerbotsEmotion, string | React.ReactNode>>;
  /** Optional localized emotion names */
  emotionLabels?: Partial<Record<PeerbotsEmotion, string>>;
  className?: string;
}

/**
 * Controlled Peerbots controller button displaying:
 * - **`"Message"` (Robot Action)**: Solid `labelColor` fill, centered title, and a top-end circular
 *   corner badge showing the robot face color + emotion.
 * - **`"Log"` (User Intent / Event)**: Soft `labelColor`-tinted surface, `2px dashed` border,
 *   leading `labelColor` accent stripe, and a top-start rounded-square event badge (`zap` by default).
 *
 * Note: Decorative corner badges use `aria-hidden="true"` so the button's accessible name equals
 * its visible `title` text (satisfying WCAG 2.5.3 `label-content-name-mismatch`).
 */
export function PeerbotsButton({
  button,
  buttonInfo,
  selected = false,
  disabled = false,
  onClick,
  onDoubleClick,
  onContextMenu,
  buttonRef,
  logIcon = "zap",
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
  const isLog = resolved.type === "Log";

  return (
    <div className={cn("pb:mx-2", className)}>
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        aria-pressed={selected}
        onClick={(e) => {
          if (!disabled) {
            onClick?.(e);
          }
        }}
        onDoubleClick={(e) => {
          if (!disabled) {
            onDoubleClick?.(e);
          }
        }}
        onContextMenu={(e) => {
          if (!disabled) {
            onContextMenu?.(e);
          }
        }}
        className={cn(
          "pb:py-3.5 pb:px-4 pb:my-2 pb:border-2 pb:rounded-md pb:text-center pb:text-sm pb:font-bold pb:cursor-pointer pb:z-0 pb:relative pb:hover:opacity-90 pb:transition-all pb:w-full pb:focus-visible:outline-2 pb:focus-visible:outline-offset-2 pb:focus-visible:outline-peerbots-darkteal pb:disabled:opacity-50 pb:disabled:cursor-not-allowed",
          isLog ? "pb:ps-5 pb:border-dashed" : "pb:border-solid",
          selected
            ? "pb:border-gray-950 pb:ring-2 pb:ring-primary/50"
            : isLog
              ? "pb:border-slate-700"
              : "pb:border-gray-200",
        )}
        style={
          isLog
            ? {
                color: "#0F172A",
                background: `color-mix(in srgb, ${labelBg} 16%, #FFFFFF)`,
                boxShadow: "0 1px 3px rgba(15, 23, 42, 0.12)",
              }
            : {
                color: labelFg,
                background: labelBg,
                boxShadow: "0.5px 0.5px 4px 1px rgba(0, 0, 0, 0.20)",
              }
        }
      >
        {isLog && (
          <span
            aria-hidden="true"
            className="pb:absolute pb:inset-y-0 pb:start-0 pb:w-1.5 pb:rounded-s-[4px]"
            style={{ backgroundColor: labelBg }}
          />
        )}
        <div className="pb:truncate">{resolved.details.title}</div>
        {resolved.type === "Message" ? (
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
        ) : (
          <span
            aria-hidden="true"
            className="pb:rounded-md pb:h-7 pb:w-7 pb:flex pb:items-center pb:justify-center pb:absolute pb:-top-3 pb:-start-3 pb:z-10 pb:border-solid pb:border-gray-950 pb:border-2 pb:shadow-xs"
            style={{
              background: labelBg,
              color: labelFg,
            }}
          >
            <Icon name={logIcon} className="pb:w-4 pb:h-4" />
          </span>
        )}
      </button>
    </div>
  );
}
