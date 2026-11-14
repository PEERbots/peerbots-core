import type { Emotion, RobotControlButton, TemplateDetails } from "./types";

/**
 * Emoticon prefixes recognized at the start of bulk-authored lines or speech segments
 * when {@link ParseItemOptions.detectEmotionAtStart} is enabled.
 */
export const EMOTION_PREFIXES: {
  /** Leading ASCII emoticon token (e.g., `":)"`, `":("`). */
  prefix: string;
  /** Mapped Peerbots facial expression applied to the generated button. */
  emotion: Emotion;
}[] = [
  { prefix: ":)", emotion: "Happy" },
  { prefix: ":(", emotion: "Sad" },
  { prefix: ":/", emotion: "Surprised" },
  { prefix: ":o", emotion: "Surprised" },
  { prefix: ":z", emotion: "Sleepy" },
];

/**
 * Options controlling how a single raw text segment is parsed into a button's
 * `title`, `speech`, and `emotion` by {@link parseItem}.
 */
export interface ParseItemOptions {
  /**
   * When `true`, splits `"Title: Speech"` on the first colon (`:`), using the left side
   * as the button `title` and the right side as the spoken `speech`.
   */
  parseTitlesAndSpeech?: boolean;
  /**
   * When `true`, checks for a leading emoticon from {@link EMOTION_PREFIXES} (either at the
   * start of the line or immediately after `"Title:"`) to set `emotion` and strip the prefix.
   */
  detectEmotionAtStart?: boolean;
  /**
   * When `true`, truncates the button `title` to at most 20 characters while keeping full `speech`.
   */
  trimTitle?: boolean;
}

/**
 * Delimiter mode used by {@link processBulkAuthorContent} to segment pasted script text into buttons:
 * - `"New Lines"`: Creates one button per non-empty line (`\n` / `\r\n`).
 * - `"Sentences"`: Splits after sentence-ending punctuation (`.`, `?`, `!`).
 */
export type ButtonFormationOptions = "New Lines" | "Sentences";

/**
 * Full configuration for {@link processBulkAuthorContent} when converting pasted scripts
 * into Peerbots template buttons.
 */
export interface BulkAuthorOptions extends ParseItemOptions {
  /** How raw script content is segmented into individual buttons (`"New Lines"` vs `"Sentences"`). */
  formButtonsOn: ButtonFormationOptions;
  /** When `true`, splits utterances longer than 60 characters into smaller speech chunks via {@link breakUpSpeechIntoChunks}. */
  breakUpLongSentences: boolean;
  /**
   * When `true`, automatically appends one positive (`Green`) and one constructive (`Yellow`)
   * feedback button after any generated button whose `speech` ends with `"?"`.
   */
  addFeedbackAfterQuestions: boolean;
  /** When `true`, truncates generated button titles to 20 characters. */
  trimTitle: boolean;
  /** When `true`, splits `"Title: Speech"` segments on the first colon. */
  parseTitlesAndSpeech: boolean;
  /** When `true`, extracts leading emoticon prefixes (`:)`, `:(`, `:/`, `:o`, `:z`) into `emotion`. */
  detectEmotionAtStart: boolean;
}

/**
 * Default {@link BulkAuthorOptions} (splits on `"New Lines"` with optional transformations disabled).
 */
export const DEFAULT_BULK_AUTHOR_OPTIONS: BulkAuthorOptions = {
  formButtonsOn: "New Lines",
  breakUpLongSentences: false,
  addFeedbackAfterQuestions: false,
  trimTitle: false,
  parseTitlesAndSpeech: false,
  detectEmotionAtStart: false,
};

/**
 * Preset encouraging `"Message"` buttons (`labelColor: "Green"`, `emotion: "Happy"`, face `color: "Light Blue"`)
 * sampled when {@link BulkAuthorOptions.addFeedbackAfterQuestions} is enabled.
 */
export const POSITIVE_FEEDBACK_BUTTONS: RobotControlButton[] = [
  {
    type: "Message",
    labelColor: "Green",
    details: {
      title: "Good work",
      speech: "Good work",
      emotion: "Happy",
      color: "Light Blue",
    },
  },
  {
    type: "Message",
    labelColor: "Green",
    details: {
      title: "Nice!",
      speech: "Nice!",
      emotion: "Happy",
      color: "Light Blue",
    },
  },
  {
    type: "Message",
    labelColor: "Green",
    details: {
      title: "Amazing!",
      speech: "Amazing!",
      emotion: "Happy",
      color: "Light Blue",
    },
  },
];

/**
 * Preset gentle retry `"Message"` buttons (`labelColor: "Yellow"`, `emotion: "Neutral"`, face `color: "Light Blue"`)
 * sampled when {@link BulkAuthorOptions.addFeedbackAfterQuestions} is enabled.
 */
export const CONSTRUCTIVE_FEEDBACK_BUTTONS: RobotControlButton[] = [
  {
    type: "Message",
    labelColor: "Yellow",
    details: {
      title: "Not quite, try again!",
      speech: "Not quite, try again!",
      emotion: "Neutral",
      color: "Light Blue",
    },
  },
  {
    type: "Message",
    labelColor: "Yellow",
    details: {
      title: "I'm not sure about that!",
      speech: "I'm not sure about that!",
      emotion: "Neutral",
      color: "Light Blue",
    },
  },
  {
    type: "Message",
    labelColor: "Yellow",
    details: {
      title: "Nice try, let's think about it some more!",
      speech: "Nice try, let's think about it some more!",
      emotion: "Neutral",
      color: "Light Blue",
    },
  },
];

let fallbackCounter = 0;

function generateButtonId(): string {
  if (
    typeof globalThis.crypto !== "undefined" &&
    typeof globalThis.crypto.randomUUID === "function"
  ) {
    return globalThis.crypto.randomUUID();
  }
  fallbackCounter += 1;
  return `${Math.random().toString(16).slice(2)}-${fallbackCounter.toString(16)}`;
}

function cloneControlButton(button: RobotControlButton): RobotControlButton {
  if (button.type === "Message") {
    return {
      type: "Message",
      labelColor: button.labelColor,
      details: {
        ...button.details,
        ...(button.details.metadata
          ? { metadata: { ...button.details.metadata } }
          : {}),
        ...(button.details.keywords
          ? { keywords: [...button.details.keywords] }
          : {}),
      },
    };
  }
  return {
    type: "Log",
    labelColor: button.labelColor,
    details: {
      ...button.details,
      ...(button.details.metadata
        ? { metadata: { ...button.details.metadata } }
        : {}),
    },
  };
}

/**
 * Checks whether `text` starts with a recognized emoticon in {@link EMOTION_PREFIXES}.
 * Returns the matched {@link Emotion} and prefix-stripped `cleanedText`, or `null` if no prefix matches.
 */
export function extractEmotion(
  text: string,
): { emotion: Emotion; cleanedText: string } | null {
  for (const { prefix, emotion } of EMOTION_PREFIXES) {
    if (text.startsWith(prefix)) {
      let cleaned = text.slice(prefix.length);
      if (cleaned.startsWith(" ")) {
        cleaned = cleaned.slice(1);
      }
      return { emotion, cleanedText: cleaned };
    }
  }
  return null;
}

/**
 * Parses a single raw bulk-authoring text item into `{ title, speech, emotion }`
 * according to the provided {@link ParseItemOptions}.
 */
export function parseItem(
  rawItem: string,
  options: ParseItemOptions = {},
): { title: string; speech: string; emotion: Emotion } {
  let item = rawItem.trim();
  let emotion: Emotion = "Neutral";

  if (options.detectEmotionAtStart) {
    const extracted = extractEmotion(item);
    if (extracted) {
      emotion = extracted.emotion;
      item = extracted.cleanedText.trim();
    }
  }

  let title = item;
  let speech = item;

  if (options.parseTitlesAndSpeech) {
    const colonIndex = item.indexOf(":");
    if (colonIndex > 0) {
      const parsedTitle = item.slice(0, colonIndex).trim();
      let parsedSpeech = item.slice(colonIndex + 1).trim();

      if (options.detectEmotionAtStart && emotion === "Neutral") {
        const speechExtracted = extractEmotion(parsedSpeech);
        if (speechExtracted) {
          emotion = speechExtracted.emotion;
          parsedSpeech = speechExtracted.cleanedText.trim();
        }
      }

      title = parsedTitle;
      speech = parsedSpeech.length > 0 ? parsedSpeech : parsedTitle;
    }
  }

  if (options.trimTitle) {
    title = title.substring(0, 20);
  }

  return { title, speech, emotion };
}

/**
 * Alias for {@link parseItem} exported for readability in external bulk-authoring consumers.
 */
export const parseBulkAuthorItem = parseItem;

/**
 * Breaks utterances longer than 60 characters into shorter ~5-word chunks
 * (or 60-character slices for single unbroken tokens) so robot TTS pacing stays natural.
 */
export function breakUpSpeechIntoChunks(lines: readonly string[]): string[] {
  return lines.flatMap((line) => {
    const trimmed = line.trim();
    if (trimmed.length <= 60) {
      return line;
    }

    const words = trimmed.split(/\s+/);
    const chunkSize = 5;
    const chunkCount = Math.floor(words.length / chunkSize);

    if (chunkCount >= 2) {
      const chunks: string[] = [];
      for (let i = 0; i < chunkCount; i++) {
        if (i === chunkCount - 1) {
          chunks.push(words.slice(i * chunkSize).join(" "));
        } else {
          chunks.push(
            words.slice(i * chunkSize, i * chunkSize + chunkSize).join(" "),
          );
        }
      }
      return chunks;
    }

    if (words.length >= 2) {
      const midpoint = Math.ceil(words.length / 2);
      return [
        words.slice(0, midpoint).join(" "),
        words.slice(midpoint).join(" "),
      ];
    }

    // Single unbroken long token (>60 chars): slice cleanly into 60-character chunks
    const charChunks: string[] = [];
    for (let idx = 0; idx < trimmed.length; idx += 60) {
      charChunks.push(trimmed.slice(idx, idx + 60));
    }
    return charChunks;
  });
}

/**
 * Converts free-form script text into {@link TemplateDetails} (`buttons` dictionary and flat `root` hierarchy)
 * using the specified {@link BulkAuthorOptions}.
 */
export function processBulkAuthorContent(
  content: string,
  options: Partial<BulkAuthorOptions> = DEFAULT_BULK_AUTHOR_OPTIONS,
): TemplateDetails {
  const resolvedOptions: BulkAuthorOptions = {
    ...DEFAULT_BULK_AUTHOR_OPTIONS,
    ...options,
  };

  const rawLines =
    resolvedOptions.formButtonsOn === "Sentences"
      ? content.split(/(?<=[?!.])/g)
      : content.split(/\r?\n/);

  const lines = resolvedOptions.breakUpLongSentences
    ? breakUpSpeechIntoChunks(rawLines)
    : rawLines;

  const details: TemplateDetails = {
    buttons: {},
    hierarchy: { root: [] },
  };

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed) continue;

    const { title, speech, emotion } = parseItem(trimmed, resolvedOptions);
    const buttonId = generateButtonId();

    const button: RobotControlButton = {
      type: "Message",
      labelColor: "Light Blue",
      details: {
        title,
        speech,
        emotion,
        color: "Light Blue",
      },
    };

    details.buttons[buttonId] = button;
    details.hierarchy.root.push(buttonId);

    if (resolvedOptions.addFeedbackAfterQuestions && speech.endsWith("?")) {
      const posId = generateButtonId();
      const posButton =
        POSITIVE_FEEDBACK_BUTTONS[
          Math.floor(Math.random() * POSITIVE_FEEDBACK_BUTTONS.length)
        ];
      details.buttons[posId] = cloneControlButton(posButton);
      details.hierarchy.root.push(posId);

      const constrId = generateButtonId();
      const constrButton =
        CONSTRUCTIVE_FEEDBACK_BUTTONS[
          Math.floor(Math.random() * CONSTRUCTIVE_FEEDBACK_BUTTONS.length)
        ];
      details.buttons[constrId] = cloneControlButton(constrButton);
      details.hierarchy.root.push(constrId);
    }
  }

  return details;
}
