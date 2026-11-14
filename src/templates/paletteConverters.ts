import {
  LEGACY_PALETTE_CSV_HEADERS,
  MODERN_PALETTE_CSV_HEADERS,
  serializeCsvRows,
} from "./csv";
import { flattenHierarchy } from "./hierarchy";
import {
  colorToLegacyIndex,
  emotionToLegacyIndex,
  normalizeEmotion,
  normalizePeerbotsColor,
} from "./normalization";
import type {
  Palette,
  PaletteButton,
  RobotControlButton,
  Template,
} from "./types";

/**
 * Options controlling CSV schema formatting in {@link convertPaletteToCSV}.
 */
export interface SerializePaletteCsvOptions {
  /**
   * Target CSV dialect:
   * - `"modern"` (default): Human-readable color/emotion names with {@link MODERN_PALETTE_CSV_HEADERS}.
   * - `"legacy"`: Numeric `0-7` color/emotion codes with {@link LEGACY_PALETTE_CSV_HEADERS}.
   */
  format?: "modern" | "legacy";
}

/**
 * Serializes a {@link Palette} into an RFC-4180 CSV string using either modern named columns
 * (default) or legacy `0-7` indexed columns (`options.format === "legacy"`).
 */
export function convertPaletteToCSV(
  palette: Palette,
  options?: SerializePaletteCsvOptions,
): string {
  const isLegacy = options?.format === "legacy";
  const headers = isLegacy
    ? LEGACY_PALETTE_CSV_HEADERS
    : MODERN_PALETTE_CSV_HEADERS;

  const dataRows = palette.buttons.map((row) => [
    row.title,
    isLegacy ? String(colorToLegacyIndex(row.color)) : row.color,
    isLegacy ? String(emotionToLegacyIndex(row.emotion)) : row.emotion,
    row.speech,
    row.goal,
    row.subgoal,
    row.proficiency,
  ]);

  return serializeCsvRows(headers, dataRows);
}

/**
 * Alias for {@link convertPaletteToCSV}.
 */
export const serializePaletteCsv = convertPaletteToCSV;

/**
 * Converts a flat {@link PaletteButton} row into a canonical `"Message"` {@link RobotControlButton},
 * using the normalized `color` for both `labelColor` (controller button) and `details.color` (robot face)
 * and storing `goal`, `subgoal`, and `proficiency` in `details.metadata`.
 */
export function convertPaletteButtonToRobotControlButton(
  paletteButton: PaletteButton,
): RobotControlButton {
  const color = normalizePeerbotsColor(paletteButton.color);
  const emotion = normalizeEmotion(paletteButton.emotion);
  return {
    type: "Message",
    labelColor: color,
    details: {
      title: paletteButton.title,
      color,
      speech: paletteButton.speech,
      emotion,
      metadata: {
        goal: paletteButton.goal || "None",
        subgoal: paletteButton.subgoal || "None",
        proficiency: paletteButton.proficiency || "None",
      },
    },
  };
}

/**
 * Converts a {@link RobotControlButton} into a flat {@link PaletteButton} row for CSV export.
 * `"Message"` buttons retain speech, face color, emotion, and curriculum metadata;
 * `"Log"` buttons export `details.title`, `details.details` as `speech`, `"Light Blue"`, and `"Neutral"`.
 */
export function convertRobotControlButtonToPaletteButton(
  robotControlButton: RobotControlButton,
): PaletteButton {
  switch (robotControlButton.type) {
    case "Message":
      return {
        title: robotControlButton.details.title,
        speech: robotControlButton.details.speech,
        color: normalizePeerbotsColor(robotControlButton.details.color),
        emotion: normalizeEmotion(robotControlButton.details.emotion),
        goal: robotControlButton.details.metadata?.goal
          ? String(robotControlButton.details.metadata.goal)
          : "None",
        subgoal: robotControlButton.details.metadata?.subgoal
          ? String(robotControlButton.details.metadata.subgoal)
          : "None",
        proficiency: robotControlButton.details.metadata?.proficiency
          ? String(robotControlButton.details.metadata.proficiency)
          : "None",
      };
    case "Log":
      return {
        title: robotControlButton.details.title,
        speech: robotControlButton.details.details ?? "",
        color: "Light Blue",
        emotion: "Neutral",
        goal: "None",
        subgoal: "None",
        proficiency: "None",
      };
  }
}

/**
 * Converts a flat {@link Palette} into a canonical {@link Template} with sequential string keys
 * (`"0"`, `"1"`, ...) in `buttons` and `hierarchy.root`.
 */
export function convertPaletteToTemplate(palette: Palette): Template {
  return {
    title: palette.title,
    buttons: Object.fromEntries(
      palette.buttons.map((button, index) => [
        index.toString(),
        convertPaletteButtonToRobotControlButton(button),
      ]),
    ),
    hierarchy: {
      root: Array.from({ length: palette.buttons.length }, (_, i) =>
        i.toString(),
      ),
    },
  };
}

/**
 * Converts a canonical {@link Template} into a flat {@link Palette}, traversing the entire
 * hierarchy via {@link flattenHierarchy} (cycle-safe and duplicate-safe across nested children).
 */
export function convertTemplateToPalette<TRef>(
  template: Template<TRef>,
): Palette {
  const flattened = flattenHierarchy(template.hierarchy);
  const buttons: PaletteButton[] = [];

  for (const { buttonId } of flattened) {
    const button = template.buttons[buttonId];
    if (!button) continue;
    buttons.push(convertRobotControlButtonToPaletteButton(button));
  }

  return {
    title: template.title,
    buttons,
  };
}
