/**
 * Structural voice descriptor compatible with browser `SpeechSynthesisVoice`,
 * cloud TTS voices (e.g. Polly), and mock test voice objects.
 */
export interface VoiceDescriptor {
  name: string;
  voiceURI: string;
  lang: string;
  localService?: boolean;
  default?: boolean;
}

/**
 * Formats technical or platform-specific voice identifiers into clean, human-readable display names.
 * Examples:
 * - `"com.apple.speech.synthesis.voice.Alex"` -> `"Alex"`
 * - `"com.apple.voice.compact.en-US.Samantha"` -> `"Samantha"`
 * - `"com.apple.voice.enhanced.en-US.Samantha"` -> `"Samantha (Enhanced)"`
 * - `"com.apple.ttsbundle.siri_female_en-US_compact"` -> `"Siri Female"`
 * - `"com.apple.eloquence.en-US.Flo"` -> `"Flo"`
 * - `"AWS - Joanna"` -> `"Joanna"`
 */
export function formatVoiceDisplayName(rawName: string): string {
  if (!rawName) return "";

  let name = rawName.replace(/^AWS - /, "").trim();

  if (name.startsWith("aws:")) {
    name = name.slice(4);
  }

  if (!name.includes("com.apple.") && !name.includes("com.google.")) {
    return name;
  }

  if (name.includes("com.google.")) {
    const afterColon = name.split(":").pop() || name;
    return afterColon.replace(/[-_]/g, " ").trim();
  }

  const siriMatch = name.match(
    /siri_([a-zA-Z]+)_[a-zA-Z0-9-_]+?(?:_(compact|premium|enhanced))?$/i,
  );
  if (siriMatch) {
    const gender =
      siriMatch[1].charAt(0).toUpperCase() +
      siriMatch[1].slice(1).toLowerCase();
    const quality =
      siriMatch[2] && siriMatch[2].toLowerCase() !== "compact"
        ? ` (${siriMatch[2].charAt(0).toUpperCase() + siriMatch[2].slice(1).toLowerCase()})`
        : "";
    return `Siri ${gender}${quality}`;
  }

  const ttsMatch = name.match(
    /com\.apple\.ttsbundle\.([a-zA-Z0-9]+)(?:-(compact|premium|enhanced))?/i,
  );
  if (ttsMatch) {
    const base = ttsMatch[1].replace(/([a-z])([A-Z])/g, "$1 $2");
    const quality =
      ttsMatch[2] && ttsMatch[2].toLowerCase() !== "compact"
        ? ` (${ttsMatch[2].charAt(0).toUpperCase() + ttsMatch[2].slice(1).toLowerCase()})`
        : "";
    return `${base}${quality}`;
  }

  const speechMatch = name.match(
    /com\.apple\.speech\.synthesis\.voice\.([a-zA-Z0-9_-]+)/i,
  );
  if (speechMatch) {
    return speechMatch[1].replace(/([a-z])([A-Z])/g, "$1 $2");
  }

  const tierMatch = name.match(
    /com\.apple\.voice\.(compact|enhanced|premium)\.[^.]+\.([a-zA-Z0-9_-]+)/i,
  );
  if (tierMatch) {
    const base = tierMatch[2].replace(/([a-z])([A-Z])/g, "$1 $2");
    const quality =
      tierMatch[1].toLowerCase() !== "compact"
        ? ` (${tierMatch[1].charAt(0).toUpperCase() + tierMatch[1].slice(1).toLowerCase()})`
        : "";
    return `${base}${quality}`;
  }

  const eloquenceMatch = name.match(
    /com\.apple\.eloquence\.[^.]+\.([a-zA-Z0-9_-]+)/i,
  );
  if (eloquenceMatch) {
    return eloquenceMatch[1].replace(/([a-z])([A-Z])/g, "$1 $2");
  }

  const segments = name.split(".");
  let last = segments[segments.length - 1];
  last = last.replace(/[-_](compact|premium|enhanced)$/i, "");
  last = last.replace(/([a-z])([A-Z])/g, "$1 $2");
  last = last.replace(/[-_]/g, " ").trim();
  return last || name;
}

/**
 * Finds a matching voice in a list by checking `voiceURI`, `name`, cleaned display name,
 * and case-insensitive variations.
 */
export function findMatchingVoice<
  T extends { name: string; voiceURI: string; lang?: string },
>(voices: readonly T[], target: string | null | undefined): T | undefined {
  if (!target) return undefined;

  const directUri = voices.find((v) => v.voiceURI === target);
  if (directUri) return directUri;

  const directName = voices.find((v) => v.name === target);
  if (directName) return directName;

  const targetClean = formatVoiceDisplayName(target).toLowerCase();

  const cleanMatch = voices.find(
    (v) =>
      formatVoiceDisplayName(v.name).toLowerCase() === targetClean ||
      formatVoiceDisplayName(v.voiceURI).toLowerCase() === targetClean,
  );
  if (cleanMatch) return cleanMatch;

  return voices.find(
    (v) =>
      v.voiceURI.toLowerCase() === target.toLowerCase() ||
      v.name.toLowerCase() === target.toLowerCase(),
  );
}
