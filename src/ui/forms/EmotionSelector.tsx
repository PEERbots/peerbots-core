import React from "react";
import { PEERBOTS_EMOTIONS, type PeerbotsEmotion } from "../../templates/types";
import { Tooltip } from "../feedback/Tooltip";
import { cn } from "../utils";
import { PEERBOTS_EMOTION_IMAGES } from "./emotionMapper";

export interface PeerbotsEmotionIconProps {
  emotion: PeerbotsEmotion;
  customIcon?: string | React.ReactNode;
  decorative?: boolean;
  label?: string;
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

export interface EmotionSelectorProps {
  /** Currently selected emotion (controlled) */
  selectedEmotion?: PeerbotsEmotion | "";
  /** Alias for `selectedEmotion` */
  value?: PeerbotsEmotion | "";
  /** Callback fired when an emotion is selected */
  onEmotionSelect?: (emotion: PeerbotsEmotion) => void;
  /** Alias for `onEmotionSelect` */
  onChange?: (emotion: PeerbotsEmotion) => void;
  /** Available emotions to display (defaults to all 6 `PEERBOTS_EMOTIONS`) */
  emotions?: readonly PeerbotsEmotion[];
  /** Optional custom icon map (image URL or React node per emotion) */
  emotionIcons?: Partial<Record<PeerbotsEmotion, string | React.ReactNode>>;
  /** Optional localized display names per emotion */
  emotionLabels?: Partial<Record<PeerbotsEmotion, string>>;
  /** Size preset */
  size?: "sm" | "md" | "lg";
  /** Whether to stack the emotion name below each icon (@default true) */
  showLabels?: boolean;
  /** Whether to wrap each option in a tooltip showing the emotion name */
  showTooltips?: boolean;
  /** Accessible label for the radiogroup */
  ariaLabel?: string;
  /** Prefix for individual radio button accessible names */
  ariaLabelPrefix?: string;
  disabled?: boolean;
  className?: string;
}

export function EmotionSelector({
  selectedEmotion,
  value,
  onEmotionSelect,
  onChange,
  emotions = PEERBOTS_EMOTIONS,
  emotionIcons,
  emotionLabels,
  size = "md",
  showLabels = true,
  showTooltips = false,
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

  const iconSizeClasses: Record<"sm" | "md" | "lg", string> = {
    sm: "pb:h-6 pb:w-6",
    md: "pb:h-7 pb:w-7",
    lg: "pb:h-9 pb:w-9",
  };

  const buttonPaddingClasses: Record<"sm" | "md" | "lg", string> = showLabels
    ? {
        sm: "pb:px-1.5 pb:py-1 pb:min-w-[52px]",
        md: "pb:px-2 pb:py-1.5 pb:min-w-[60px]",
        lg: "pb:px-2.5 pb:py-2 pb:min-w-[72px]",
      }
    : {
        sm: "pb:h-7 pb:w-7 pb:p-0.5",
        md: "pb:h-8 pb:w-8 pb:p-1",
        lg: "pb:h-10 pb:w-10 pb:p-1.5",
      };

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        "pb:inline-flex pb:flex-wrap pb:gap-1.5 pb:items-center",
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
              "pb:inline-flex pb:flex-col pb:items-center pb:justify-center pb:gap-1 pb:rounded-lg pb:bg-transparent hover:pb:bg-gray-200 dark:hover:pb:bg-zinc-800 pb:cursor-pointer pb:transition-all pb:duration-150 pb:focus-visible:outline-2 pb:focus-visible:outline-offset-2 pb:focus-visible:outline-peerbots-darkteal pb:disabled:opacity-50 pb:disabled:cursor-not-allowed",
              buttonPaddingClasses[size],
              isSelected
                ? "pb:border-2 pb:border-black dark:pb:border-white"
                : "pb:border pb:border-transparent hover:pb:border-gray-400 dark:hover:pb:border-zinc-600",
            )}
          >
            <span className={cn("pb:block pb:shrink-0", iconSizeClasses[size])}>
              <PeerbotsEmotionIcon
                emotion={emotion}
                customIcon={emotionIcons?.[emotion]}
                decorative
                className={cn(
                  "pb:transition-opacity",
                  isSelected
                    ? "pb:opacity-100"
                    : "pb:opacity-75 hover:pb:opacity-100",
                )}
              />
            </span>
            {showLabels && (
              <span
                className={cn(
                  "pb:text-[11px] pb:leading-tight pb:text-gray-800 dark:pb:text-gray-100",
                  isSelected ? "pb:font-bold" : "pb:font-medium",
                )}
              >
                {displayLabel}
              </span>
            )}
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
