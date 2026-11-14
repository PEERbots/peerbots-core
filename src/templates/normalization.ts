import {
  PEERBOTS_COLORS,
  PEERBOTS_EMOTIONS,
  type PeerbotsColor,
  type PeerbotsEmotion,
} from "./types";

const LEGACY_COLOR_INDEX_MAP: Record<number, PeerbotsColor> = {
  0: "Light Blue",
  1: "Blue",
  2: "Green",
  3: "Red",
  4: "Purple",
  5: "Pink",
  6: "Yellow",
  7: "Orange",
  8: "Grey",
  9: "Black",
  10: "White",
};

const COLOR_TO_LEGACY_INDEX_MAP: Partial<Record<PeerbotsColor, number>> = {
  "Light Blue": 0,
  Blue: 1,
  Green: 2,
  Red: 3,
  Purple: 4,
  Pink: 5,
  Yellow: 6,
  Orange: 7,
};

const LEGACY_EMOTION_INDEX_MAP: Record<number, PeerbotsEmotion> = {
  0: "Neutral",
  1: "Surprised",
  2: "Happy",
  3: "Sad",
  4: "Concerned",
  5: "Sleepy",
  6: "Neutral",
  7: "Neutral",
};

const EMOTION_TO_LEGACY_INDEX_MAP: Record<PeerbotsEmotion, number> = {
  Neutral: 0,
  Surprised: 1,
  Happy: 2,
  Sad: 3,
  Concerned: 4,
  Sleepy: 5,
};

/**
 * Normalizes a color name, common spelling/separator alias (`"gray"`, `"lightblue"`, `"light-blue"`, `"light_blue"`),
 * or legacy numeric code (`0-10`, as an integer or digit string) into a canonical {@link PeerbotsColor}.
 * Defaults to `"Light Blue"` when omitted, empty, or unrecognized.
 */
export function normalizePeerbotsColor(
  input?: string | number | null,
): PeerbotsColor {
  if (input === undefined || input === null) {
    return "Light Blue";
  }
  if (typeof input === "number") {
    return Number.isInteger(input)
      ? (LEGACY_COLOR_INDEX_MAP[input] ?? "Light Blue")
      : "Light Blue";
  }
  const trimmed = input.trim();
  if (!trimmed) {
    return "Light Blue";
  }
  if (/^\d+$/.test(trimmed)) {
    const idx = Number.parseInt(trimmed, 10);
    return LEGACY_COLOR_INDEX_MAP[idx] ?? "Light Blue";
  }
  const lower = trimmed.toLowerCase();
  if (lower === "gray") {
    return "Grey";
  }
  if (
    lower === "lightblue" ||
    lower === "light-blue" ||
    lower === "light_blue"
  ) {
    return "Light Blue";
  }
  const matched = PEERBOTS_COLORS.find((c) => c.toLowerCase() === lower);
  return matched ?? "Light Blue";
}

/**
 * Alias for {@link normalizePeerbotsColor}.
 */
export const normalizeColorName = normalizePeerbotsColor;

/**
 * Normalizes an emotion name, common variant (`"sleep"`, `"sleeping"`), or legacy numeric code
 * (`0-7`, as an integer or digit string) into a canonical {@link PeerbotsEmotion}.
 * Defaults to `"Neutral"` when omitted, empty, or unrecognized.
 */
export function normalizeEmotion(
  input?: string | number | null,
): PeerbotsEmotion {
  if (input === undefined || input === null) {
    return "Neutral";
  }
  if (typeof input === "number") {
    return Number.isInteger(input)
      ? (LEGACY_EMOTION_INDEX_MAP[input] ?? "Neutral")
      : "Neutral";
  }
  const trimmed = input.trim();
  if (!trimmed) {
    return "Neutral";
  }
  if (/^\d+$/.test(trimmed)) {
    const idx = Number.parseInt(trimmed, 10);
    return LEGACY_EMOTION_INDEX_MAP[idx] ?? "Neutral";
  }
  const lower = trimmed.toLowerCase();
  if (lower === "sleep" || lower === "sleeping") {
    return "Sleepy";
  }
  const matched = PEERBOTS_EMOTIONS.find((e) => e.toLowerCase() === lower);
  return matched ?? "Neutral";
}

/**
 * Maps a Peerbots color name or numeric code to its legacy `0-7` CSV index.
 * Newer colors outside `0-7` (`"Grey"`, `"Black"`, `"White"`) and unknown values default to `0` (`"Light Blue"`).
 */
export function colorToLegacyIndex(
  color: string | number | null | undefined,
): number {
  const normalized = normalizePeerbotsColor(color);
  return COLOR_TO_LEGACY_INDEX_MAP[normalized] ?? 0;
}

/**
 * Maps a Peerbots emotion name or numeric code to its legacy `0-7` CSV index (`0-5`).
 * Unknown or out-of-range values default to `0` (`"Neutral"`).
 */
export function emotionToLegacyIndex(
  emotion: string | number | null | undefined,
): number {
  const normalized = normalizeEmotion(emotion);
  return EMOTION_TO_LEGACY_INDEX_MAP[normalized] ?? 0;
}
