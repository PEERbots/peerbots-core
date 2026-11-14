import { EMOTION_PREFIXES } from "../bulkAuthor";
import {
  PEERBOTS_COLORS,
  PEERBOTS_EMOTIONS,
  type Emotion,
  type PeerbotsColor,
} from "../types";

export const DEFAULT_COLOR: PeerbotsColor = "Light Blue";
export const DEFAULT_EMOTION: Emotion = "Neutral";

export const EMOTION_TO_PREFIX: Partial<Record<Emotion, string>> = {
  Happy: ":)",
  Sad: ":(",
  Surprised: ":o",
  Sleepy: ":z",
};

export const EXTRA_EMOTION_PREFIXES: { prefix: string; emotion: Emotion }[] = [
  ...EMOTION_PREFIXES,
  { prefix: ":\\", emotion: "Concerned" },
];

export const COLOR_LOOKUP = new Map<string, PeerbotsColor>(
  PEERBOTS_COLORS.map((c) => [c.toLowerCase(), c]),
);

export const EMOTION_LOOKUP = new Map<string, Emotion>(
  PEERBOTS_EMOTIONS.map((e) => [e.toLowerCase(), e]),
);
