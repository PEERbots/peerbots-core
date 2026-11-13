import React from "react";
import { cn } from "../utils";

/**
 * Canonical named color palette used across Peerbots controller buttons and robot face screens.
 */
export type PeerbotsColor =
  | "Light Blue"
  | "Blue"
  | "Green"
  | "Red"
  | "Purple"
  | "Pink"
  | "Yellow"
  | "Orange"
  | "Grey"
  | "Black"
  | "White";

/**
 * Hex background fills corresponding to each `PeerbotsColor`.
 */
export const PEERBOTS_COLOR_MAP: Record<PeerbotsColor, string> = {
  "Light Blue": "#ABE3FA",
  Blue: "#5F94D6",
  Green: "#65C77D",
  Red: "#E6817E",
  Purple: "#9B86F3",
  Pink: "#EBA4E4",
  Yellow: "#F8EDB1",
  Orange: "#E6A575",
  Grey: "#CECECE",
  Black: "#4D4D4D",
  White: "#FDFEFE",
};

/**
 * Accessible WCAG 2.1 AA foreground text colors paired with each `PeerbotsColor` fill.
 */
export const PEERBOTS_FONT_COLOR_MAP: Record<PeerbotsColor, string> = {
  "Light Blue": "#020307",
  Blue: "#020307",
  Green: "#020307",
  Red: "#020307",
  Purple: "#020307",
  Pink: "#020307",
  Yellow: "#020307",
  Orange: "#020307",
  Grey: "#020307",
  Black: "#FDFEFE",
  White: "#020307",
};

/**
 * Props for `<PeerbotsColorSelector>` — circular swatch radio group for choosing a `PeerbotsColor`.
 */
export interface PeerbotsColorSelectorProps {
  /** Currently active `PeerbotsColor` name. */
  selectedColor?: PeerbotsColor | string;
  /** Callback fired when a color swatch is clicked. */
  onColorSelect: (color: PeerbotsColor) => void;
  /** Optional subset of colors to display (defaults to all 11 `PEERBOTS_COLOR_MAP` keys). */
  colors?: PeerbotsColor[];
  /** Swatch diameter scale (@default "md"). */
  size?: "sm" | "md" | "lg";
  /** Additional classes applied to the `radiogroup` container. */
  className?: string;
  /** Prefix prepended to each swatch's `aria-label` (@default "Select color"). */
  ariaLabelPrefix?: string;
}

export function PeerbotsColorSelector({
  selectedColor,
  onColorSelect,
  colors = Object.keys(PEERBOTS_COLOR_MAP) as PeerbotsColor[],
  size = "md",
  className,
  ariaLabelPrefix = "Select color",
}: PeerbotsColorSelectorProps) {
  const sizeClasses = {
    sm: "pb:h-6 pb:w-6",
    md: "pb:h-8 pb:w-8",
    lg: "pb:h-10 pb:w-10",
  };

  return (
    <div
      role="radiogroup"
      aria-label="Color selector"
      className={cn(
        "pb:inline-flex pb:flex-wrap pb:gap-1 pb:items-center",
        className,
      )}
    >
      {colors.map((colorName) => {
        const isSelected = selectedColor === colorName;
        return (
          <button
            key={colorName}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={`${ariaLabelPrefix} ${colorName}`}
            className={cn(
              "pb:rounded-full pb:cursor-pointer pb:border pb:transition-all pb:duration-150 pb:focus-visible:ring-2 pb:focus-visible:ring-gray-400 pb:focus-visible:outline-none",
              sizeClasses[size],
              isSelected
                ? "pb:border-2 pb:border-black pb:scale-110 pb:shadow-sm"
                : "pb:border-gray-300 pb:hover:border-gray-500 pb:hover:scale-105",
            )}
            style={{ background: PEERBOTS_COLOR_MAP[colorName] || colorName }}
            onClick={() => onColorSelect(colorName)}
          />
        );
      })}
    </div>
  );
}
