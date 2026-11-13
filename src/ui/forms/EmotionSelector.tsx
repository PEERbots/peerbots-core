import React from "react";
import { PEERBOTS_EMOTIONS, type PeerbotsEmotion } from "../../templates/types";
import { Tooltip } from "../feedback/Tooltip";
import { cn } from "../utils";
import { PEERBOTS_EMOTION_IMAGES } from "./emotionMapper";

/**
 * Props for {@link PeerbotsEmotionIcon}, which renders the canonical Peerbots
 * robot face PNG artwork (or a consumer-supplied override) for a `PeerbotsEmotion`.
 */
export interface PeerbotsEmotionIconProps {
  /** Target Peerbots emotion expression to display. */
  emotion: PeerbotsEmotion;
  /** Optional custom image URL or React node overriding the default PNG asset. */
  customIcon?: string | React.ReactNode;
  /**
   * Whether the icon is purely decorative (`alt=""` and `aria-hidden="true"`).
   * Keep `true` when rendered inside a button that already has an `aria-label`.
   * @default true
   */
  decorative?: boolean;
  /** Accessible label used when `decorative` is `false` (defaults to `emotion`). */
  label?: string;
  /** Optional additional CSS classes applied to the `<img>` or wrapper `<span>`. */
  className?: string;
}

/**
 * Renders the canonical Peerbots robot face PNG icon for any `PeerbotsEmotion`
 * (or a consumer-supplied custom image URL / React node override).
 */
export function PeerbotsEmotionIcon({
  emotion,
  customIcon,
  decorative = true,
  label,
  className,
}: PeerbotsEmotionIconProps) {
  if (
    customIcon !== undefined &&
    customIcon !== null &&
    typeof customIcon !== "string"
  ) {
    return (
      <span
        role={decorative ? undefined : "img"}
        aria-label={decorative ? undefined : (label ?? emotion)}
        aria-hidden={decorative ? "true" : undefined}
        className={cn(
          "pb:inline-flex pb:items-center pb:justify-center pb:w-full pb:h-full",
          className,
        )}
      >
        {customIcon}
      </span>
    );
  }

  const resolvedSrc =
    typeof customIcon === "string"
      ? customIcon
      : PEERBOTS_EMOTION_IMAGES[emotion];

  return (
    <img
      src={resolvedSrc}
      alt={decorative ? "" : (label ?? emotion)}
      aria-hidden={decorative ? "true" : undefined}
      className={cn("pb:w-full pb:h-full pb:object-contain", className)}
    />
  );
}

/**
 * Props for {@link EmotionSelector}, a compact icon-only radio group for choosing a
 * Peerbots robot facial expression (`Neutral`, `Surprised`, `Happy`, `Sad`, `Concerned`, `Sleepy`).
 */
export interface EmotionSelectorProps {
  /** Currently selected emotion (controlled). */
  selectedEmotion?: PeerbotsEmotion | "";
  /** Alias for `selectedEmotion` for standard form control ergonomics. */
  value?: PeerbotsEmotion | "";
  /** Callback fired when an emotion button is selected. */
  onEmotionSelect?: (emotion: PeerbotsEmotion) => void;
  /** Alias for `onEmotionSelect`. */
  onChange?: (emotion: PeerbotsEmotion) => void;
  /** Available emotions to display (defaults to all 6 `PEERBOTS_EMOTIONS`). */
  emotions?: readonly PeerbotsEmotion[];
  /** Optional custom icon map (image URL or React node per emotion). */
  emotionIcons?: Partial<Record<PeerbotsEmotion, string | React.ReactNode>>;
  /** Optional localized display names per emotion (used for `aria-label` and tooltips). */
  emotionLabels?: Partial<Record<PeerbotsEmotion, string>>;
  /**
   * Square icon-button size preset (`sm` = 28px, `md` = 32px, `lg` = 40px).
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  /**
   * Whether to wrap each compact icon button in a hover/focus tooltip showing the emotion name.
   * @default true
   */
  showTooltips?: boolean;
  /**
   * Accessible label for the `radiogroup` container.
   * @default "Emotion selector"
   */
  ariaLabel?: string;
  /**
   * Prefix prepended to individual radio button `aria-label`s.
   * @default "Select emotion"
   */
  ariaLabelPrefix?: string;
  /** Disables all emotion radio buttons when `true`. */
  disabled?: boolean;
  /** Optional additional CSS classes applied to the `radiogroup` container. */
  className?: string;
}

/**
 * Compact icon-only Peerbots robot expression picker rendering each emotion's dark
 * line-art face PNG on the high-contrast Peerbots primary teal (`#46d9d9`) tile with
 * hover/focus tooltips.
 */
export function EmotionSelector({
  selectedEmotion,
  value,
  onEmotionSelect,
  onChange,
  emotions = PEERBOTS_EMOTIONS,
  emotionIcons,
  emotionLabels,
  size = "md",
  showTooltips = true,
  ariaLabel = "Emotion selector",
  ariaLabelPrefix = "Select emotion",
  disabled = false,
  className,
}: EmotionSelectorProps) {
  const activeEmotion = selectedEmotion ?? value ?? "";
  const handleSelect = (emotion: PeerbotsEmotion) => {
    if (disabled) return;
    onEmotionSelect?.(emotion);
    onChange?.(emotion);
  };

  const buttonSizeClasses: Record<"sm" | "md" | "lg", string> = {
    sm: "pb:min-h-7 pb:min-w-7 pb:h-7 pb:w-7 pb:p-0.5",
    md: "pb:min-h-8 pb:min-w-8 pb:h-8 pb:w-8 pb:p-1",
    lg: "pb:min-h-10 pb:min-w-10 pb:h-10 pb:w-10 pb:p-1.5",
  };

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        "pb:inline-flex pb:flex-wrap pb:gap-1 pb:items-center",
        className,
      )}
    >
      {emotions.map((emotion) => {
        const isSelected = activeEmotion === emotion;
        const displayLabel = emotionLabels?.[emotion] ?? emotion;

        const buttonNode = (
          <button
            key={emotion}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={
              ariaLabelPrefix
                ? `${ariaLabelPrefix} ${displayLabel}`
                : displayLabel
            }
            disabled={disabled}
            onClick={() => handleSelect(emotion)}
            className={cn(
              "pb:inline-flex pb:items-center pb:justify-center pb:shrink-0 pb:rounded-lg pb:bg-primary hover:pb:bg-peerbots-teal pb:text-gray-950 pb:cursor-pointer pb:transition-all pb:duration-150 pb:focus-visible:outline-2 pb:focus-visible:outline-offset-2 pb:focus-visible:outline-peerbots-darkteal pb:disabled:opacity-50 pb:disabled:cursor-not-allowed",
              buttonSizeClasses[size],
              isSelected
                ? "pb:border-2 pb:border-gray-950 pb:ring-2 pb:ring-gray-950/20 pb:shadow-sm"
                : "pb:border pb:border-teal-800/25 hover:pb:border-gray-900/50",
            )}
          >
            <PeerbotsEmotionIcon
              emotion={emotion}
              customIcon={emotionIcons?.[emotion]}
              decorative
              className={cn(
                "pb:transition-opacity",
                isSelected
                  ? "pb:opacity-100"
                  : "pb:opacity-85 hover:pb:opacity-100",
              )}
            />
          </button>
        );

        if (!showTooltips) {
          return buttonNode;
        }

        return (
          <Tooltip key={emotion} content={displayLabel} className="pb:text-xs">
            {buttonNode}
          </Tooltip>
        );
      })}
    </div>
  );
}
