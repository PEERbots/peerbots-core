import type { Emotion, RobotControlButton, TemplateDetails } from "./types";

export const EMOTION_PREFIXES: { prefix: string; emotion: Emotion }[] = [
  { prefix: ":)", emotion: "Happy" },
  { prefix: ":(", emotion: "Sad" },
  { prefix: ":/", emotion: "Surprised" },
  { prefix: ":o", emotion: "Surprised" },
  { prefix: ":z", emotion: "Sleepy" },
];

export interface ParseItemOptions {
  parseTitlesAndSpeech?: boolean;
  detectEmotionAtStart?: boolean;
  trimTitle?: boolean;
}

export type ButtonFormationOptions = "New Lines" | "Sentences";

export interface BulkAuthorOptions extends ParseItemOptions {
  formButtonsOn: ButtonFormationOptions;
  breakUpLongSentences: boolean;
  addFeedbackAfterQuestions: boolean;
  trimTitle: boolean;
  parseTitlesAndSpeech: boolean;
  detectEmotionAtStart: boolean;
}

export const DEFAULT_BULK_AUTHOR_OPTIONS: BulkAuthorOptions = {
  formButtonsOn: "New Lines",
  breakUpLongSentences: false,
  addFeedbackAfterQuestions: false,
  trimTitle: false,
  parseTitlesAndSpeech: false,
  detectEmotionAtStart: false,
};

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

export const parseBulkAuthorItem = parseItem;

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
