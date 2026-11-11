import React from "react";
import { PEERBOTS_EMOTIONS, type PeerbotsEmotion } from "../../templates/types";
import { Tooltip } from "../feedback/Tooltip";
import { cn } from "../utils";

export interface PeerbotsEmotionIconProps {
  emotion: PeerbotsEmotion;
  customIcon?: string | React.ReactNode;
  decorative?: boolean;
  label?: string;
  className?: string;
}

/**
 * Renders a crisp vector Peerbots face icon for any canonical `PeerbotsEmotion`,
 * or a consumer-supplied custom image URL / React node override.
 */
export function PeerbotsEmotionIcon({
  emotion,
  customIcon,
  decorative = true,
  label,
  className,
}: PeerbotsEmotionIconProps) {
  if (typeof customIcon === "string") {
    return (
      <img
        src={customIcon}
        alt={decorative ? "" : (label ?? emotion)}
        aria-hidden={decorative ? "true" : undefined}
        className={cn("pb:w-full pb:h-full pb:object-contain", className)}
      />
    );
  }

  if (customIcon !== undefined && customIcon !== null) {
    return (
      <span
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

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : (label ?? emotion)}
      aria-hidden={decorative ? "true" : undefined}
      className={cn("pb:w-full pb:h-full pb:text-gray-900", className)}
    >
      {/* Eyes & Eyebrows per PeerbotsEmotion */}
      {emotion === "Sleepy" ? (
        <>
          <path
            d="M6.5 13.5Q9.5 16 12.5 13.5"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M19.5 13.5Q22.5 16 25.5 13.5"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </>
      ) : emotion === "Happy" ? (
        <>
          <path
            d="M6.5 14Q9.5 9.5 12.5 14"
            stroke="currentColor"
            strokeWidth="2.3"
            strokeLinecap="round"
          />
          <path
            d="M19.5 14Q22.5 9.5 25.5 14"
            stroke="currentColor"
            strokeWidth="2.3"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          {emotion === "Concerned" && (
            <>
              <path
                d="M6.5 9.5L12.5 7.8"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M19.5 7.8L25.5 9.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </>
          )}
          {emotion === "Sad" && (
            <>
              <path
                d="M6.5 10.2Q9.5 8.5 12.5 8.2"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M19.5 8.2Q22.5 8.5 25.5 10.2"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </>
          )}
          {emotion === "Surprised" && (
            <>
              <path
                d="M6.5 8.2Q9.5 6.2 12.5 8.2"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M19.5 8.2Q22.5 6.2 25.5 8.2"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </>
          )}
          <circle
            cx="9.5"
            cy="13"
            r={emotion === "Surprised" ? "2.8" : "2.3"}
            fill="currentColor"
          />
          <circle
            cx="22.5"
            cy="13"
            r={emotion === "Surprised" ? "2.8" : "2.3"}
            fill="currentColor"
          />
        </>
      )}

      {/* Mouth per PeerbotsEmotion */}
      {emotion === "Happy" && (
        <path
          d="M10 20.5Q16 26.5 22 20.5"
          stroke="currentColor"
          strokeWidth="2.3"
          strokeLinecap="round"
        />
      )}
      {emotion === "Neutral" && (
        <path
          d="M11 21.5Q16 23.5 21 21.5"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      )}
      {emotion === "Sad" && (
        <path
          d="M10.5 23.5Q16 18.8 21.5 23.5"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      )}
      {emotion === "Surprised" && (
        <ellipse
          cx="16"
          cy="22"
          rx="3"
          ry="3.6"
          stroke="currentColor"
          strokeWidth="2.2"
        />
      )}
      {emotion === "Concerned" && (
        <path
          d="M10.5 22.5Q13.5 20.2 16 22T21.5 21.5"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
        />
      )}
      {emotion === "Sleepy" && (
        <ellipse
          cx="16"
          cy="22.5"
          rx="2.3"
          ry="1.6"
          stroke="currentColor"
          strokeWidth="2"
        />
      )}
    </svg>
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
  /** Size preset matching `PeerbotsColorSelector` */
  size?: "sm" | "md" | "lg";
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

  const sizeClasses: Record<"sm" | "md" | "lg", string> = {
    sm: "pb:min-h-6 pb:min-w-6 pb:h-7 pb:w-7 pb:p-0.5",
    md: "pb:min-h-8 pb:min-w-8 pb:h-8 pb:w-8 pb:p-1",
    lg: "pb:min-h-10 pb:min-w-10 pb:h-10 pb:w-10 pb:p-1.5",
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
            aria-label={`${ariaLabelPrefix} ${displayLabel}`}
            disabled={disabled}
            onClick={() => handleSelect(emotion)}
            className={cn(
              "pb:inline-flex pb:items-center pb:justify-center pb:rounded-lg pb:cursor-pointer pb:transition-all pb:duration-150 pb:bg-primary/20 pb:hover:bg-primary/35 pb:focus-visible:outline-2 pb:focus-visible:outline-offset-2 pb:focus-visible:outline-peerbots-darkteal pb:disabled:opacity-50 pb:disabled:cursor-not-allowed",
              sizeClasses[size],
              isSelected
                ? "pb:border-2 pb:border-gray-900 pb:bg-primary/45 pb:scale-105 pb:shadow-xs"
                : "pb:border pb:border-gray-300 pb:hover:border-gray-500",
            )}
          >
            <PeerbotsEmotionIcon
              emotion={emotion}
              customIcon={emotionIcons?.[emotion]}
              decorative
              className={cn(
                "pb:transition-opacity",
                isSelected ? "pb:opacity-100" : "pb:opacity-80 pb:hover:opacity-100",
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
