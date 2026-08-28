import React from "react";
import { cn } from "./utils";

export type PeerbotsColor =
  | "Green"
  | "Light Blue"
  | "Blue"
  | "Purple"
  | "Orange"
  | "Yellow"
  | "Pink"
  | "Grey";

export const PEERBOTS_COLOR_MAP: Record<PeerbotsColor, string> = {
  Green: "#61d476",
  "Light Blue": "#aee7ff",
  Blue: "#6da4f7",
  Purple: "#bf94e4",
  Orange: "#ffb347",
  Yellow: "#fdfd96",
  Pink: "#ffb6c1",
  Grey: "#d3d3d3",
};

export const PEERBOTS_FONT_COLOR_MAP: Record<PeerbotsColor, string> = {
  Green: "#000000",
  "Light Blue": "#000000",
  Blue: "#000000",
  Purple: "#000000",
  Orange: "#000000",
  Yellow: "#000000",
  Pink: "#000000",
  Grey: "#000000",
};

export interface PeerbotsColorSelectorProps {
  selectedColor?: PeerbotsColor | string;
  onColorSelect: (color: PeerbotsColor) => void;
  colors?: PeerbotsColor[];
  size?: "sm" | "md" | "lg";
  className?: string;
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
