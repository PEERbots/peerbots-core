import { describe, expect, it, vi } from "vitest";
import {
  CONSTRUCTIVE_FEEDBACK_BUTTONS,
  DEFAULT_BULK_AUTHOR_OPTIONS,
  EMOTION_PREFIXES,
  POSITIVE_FEEDBACK_BUTTONS,
  breakUpSpeechIntoChunks,
  extractEmotion,
  parseBulkAuthorItem,
  parseItem,
  processBulkAuthorContent,
  type ParseItemOptions,
} from "../index";

describe("bulkAuthor — extractEmotion", () => {
  it("extracts Happy emotion from :) prefix", () => {
    const result = extractEmotion(":) Hello world");
    expect(result).toEqual({ emotion: "Happy", cleanedText: "Hello world" });
  });

  it("extracts Sad emotion from :( prefix", () => {
    const result = extractEmotion(":( I am sad");
    expect(result).toEqual({ emotion: "Sad", cleanedText: "I am sad" });
  });

  it("extracts Surprised emotion from :/ and :o prefixes", () => {
    expect(extractEmotion(":/ Oh really")).toEqual({
      emotion: "Surprised",
      cleanedText: "Oh really",
    });
    expect(extractEmotion(":o Wow")).toEqual({
      emotion: "Surprised",
      cleanedText: "Wow",
    });
  });

  it("extracts Sleepy emotion from :z prefix", () => {
    expect(extractEmotion(":z Good night")).toEqual({
      emotion: "Sleepy",
      cleanedText: "Good night",
    });
  });

  it("extracts emotion even when no space follows the prefix", () => {
    expect(extractEmotion(":)NoSpace")).toEqual({
      emotion: "Happy",
      cleanedText: "NoSpace",
    });
  });

  it("returns null when text does not start with an emotion prefix", () => {
    expect(extractEmotion("Hello :) world")).toBeNull();
    expect(extractEmotion("Normal text")).toBeNull();
    expect(extractEmotion("")).toBeNull();
  });
});

describe("bulkAuthor — parseItem & parseBulkAuthorItem", () => {
  const defaultOptions: ParseItemOptions = {
    parseTitlesAndSpeech: true,
    detectEmotionAtStart: false,
    trimTitle: false,
  };

  it("exposes parseBulkAuthorItem as an alias of parseItem and supports omitted options", () => {
    expect(parseBulkAuthorItem).toBe(parseItem);
    expect(parseBulkAuthorItem("  Simple line  ")).toEqual({
      title: "Simple line",
      speech: "Simple line",
      emotion: "Neutral",
    });
  });

  it("separates title and speech on colon", () => {
    const result = parseItem("Greeting: Hello world", defaultOptions);
    expect(result.title).toBe("Greeting");
    expect(result.speech).toBe("Hello world");
    expect(result.emotion).toBe("Neutral");
  });

  it("handles multiple colons by splitting only on the first colon", () => {
    const result = parseItem("Time: The time is 10:30 AM", defaultOptions);
    expect(result.title).toBe("Time");
    expect(result.speech).toBe("The time is 10:30 AM");
  });

  it("falls back to full text for both title and speech when no colon is present", () => {
    const result = parseItem("Just a plain sentence", defaultOptions);
    expect(result.title).toBe("Just a plain sentence");
    expect(result.speech).toBe("Just a plain sentence");
  });

  it("falls back to full text when colon is at index 0 (no title before colon)", () => {
    const result = parseItem(": Speech with leading colon", defaultOptions);
    expect(result.title).toBe(": Speech with leading colon");
    expect(result.speech).toBe(": Speech with leading colon");
  });

  it("falls back to title when speech is empty after colon", () => {
    const result = parseItem("Title only: ", defaultOptions);
    expect(result.title).toBe("Title only");
    expect(result.speech).toBe("Title only");
  });

  it("trims title to 20 characters when trimTitle is true", () => {
    const result = parseItem(
      "A very long title exceeding 20 characters: Short speech",
      { ...defaultOptions, trimTitle: true },
    );
    expect(result.title).toBe("A very long title ex");
    expect(result.title.length).toBe(20);
    expect(result.speech).toBe("Short speech");
  });

  it("does not split on colon when parseTitlesAndSpeech is false", () => {
    const result = parseItem("Greeting: Hello world", {
      ...defaultOptions,
      parseTitlesAndSpeech: false,
    });
    expect(result.title).toBe("Greeting: Hello world");
    expect(result.speech).toBe("Greeting: Hello world");
  });

  it("detects emotion at start of line when detectEmotionAtStart is true", () => {
    const result = parseItem(":) Greeting: Hello world", {
      ...defaultOptions,
      detectEmotionAtStart: true,
    });
    expect(result.emotion).toBe("Happy");
    expect(result.title).toBe("Greeting");
    expect(result.speech).toBe("Hello world");
  });

  it("detects emotion in speech part when detectEmotionAtStart is true", () => {
    const result = parseItem("Greeting: :) Hello world", {
      ...defaultOptions,
      detectEmotionAtStart: true,
    });
    expect(result.emotion).toBe("Happy");
    expect(result.title).toBe("Greeting");
    expect(result.speech).toBe("Hello world");
  });

  it("handles emotion with no colon when detectEmotionAtStart is true", () => {
    const result = parseItem(":( Sad speech without title", {
      ...defaultOptions,
      detectEmotionAtStart: true,
    });
    expect(result.emotion).toBe("Sad");
    expect(result.title).toBe("Sad speech without title");
    expect(result.speech).toBe("Sad speech without title");
  });
});

describe("bulkAuthor — processBulkAuthorContent & >200-char chunking", () => {
  it("exports DEFAULT_BULK_AUTHOR_OPTIONS and feedback button presets", () => {
    expect(DEFAULT_BULK_AUTHOR_OPTIONS.formButtonsOn).toBe("New Lines");
    expect(EMOTION_PREFIXES).toHaveLength(5);
    expect(POSITIVE_FEEDBACK_BUTTONS).toHaveLength(3);
    expect(CONSTRUCTIVE_FEEDBACK_BUTTONS).toHaveLength(3);
  });

  it("creates buttons for each line in 'New Lines' mode and skips blank lines", () => {
    const content = "Greeting: Hello!\r\n\r\nFarewell: Goodbye!\n   ";
    const details = processBulkAuthorContent(content, {
      ...DEFAULT_BULK_AUTHOR_OPTIONS,
      parseTitlesAndSpeech: true,
    });

    const buttonKeys = details.hierarchy.root;
    expect(buttonKeys).toHaveLength(2);
    const btn0 = details.buttons[buttonKeys[0]];
    const btn1 = details.buttons[buttonKeys[1]];
    expect(btn0.details.title).toBe("Greeting");
    if (btn0.type === "Message") {
      expect(btn0.details.speech).toBe("Hello!");
    }
    expect(btn1.details.title).toBe("Farewell");
    if (btn1.type === "Message") {
      expect(btn1.details.speech).toBe("Goodbye!");
    }
  });

  it("creates buttons for each sentence in 'Sentences' mode across '.', '!', and '?'", () => {
    const content =
      "Intro: Hello world. Exclaim: Awesome job! Ask: How are you?";
    const details = processBulkAuthorContent(content, {
      ...DEFAULT_BULK_AUTHOR_OPTIONS,
      formButtonsOn: "Sentences",
      parseTitlesAndSpeech: true,
    });

    const buttonKeys = details.hierarchy.root;
    expect(buttonKeys).toHaveLength(3);
    expect(details.buttons[buttonKeys[0]].details.title).toBe("Intro");
    expect(details.buttons[buttonKeys[1]].details.title).toBe("Exclaim");
    expect(details.buttons[buttonKeys[2]].details.title).toBe("Ask");
  });

  it("appends positive and constructive feedback buttons after '?' when addFeedbackAfterQuestions is true", () => {
    const content = "Quiz: Are you ready?\nStatement: Let us begin.";
    const details = processBulkAuthorContent(content, {
      ...DEFAULT_BULK_AUTHOR_OPTIONS,
      parseTitlesAndSpeech: true,
      addFeedbackAfterQuestions: true,
    });

    // 1 question + 2 feedback + 1 statement = 4 buttons
    expect(details.hierarchy.root).toHaveLength(4);
    const [, posKey, constrKey, stmtKey] = details.hierarchy.root;
    expect(details.buttons[posKey].labelColor).toBe("Green");
    expect(details.buttons[constrKey].labelColor).toBe("Yellow");
    expect(details.buttons[stmtKey].details.title).toBe("Statement");
  });

  it("chunks >200-char multi-word sentences and >200-char unbroken tokens without losing text", () => {
    const longProse = Array.from(
      { length: 40 },
      (_, idx) => `word${idx + 1}`,
    ).join(" ");
    expect(longProse.length).toBeGreaterThan(200);

    const details = processBulkAuthorContent(longProse, {
      ...DEFAULT_BULK_AUTHOR_OPTIONS,
      breakUpLongSentences: true,
    });
    expect(details.hierarchy.root.length).toBe(8); // 40 words / 5 words per chunk = 8 chunks

    // Unbroken >200-char token without spaces
    const unbroken = "A".repeat(210);
    const unbrokenChunks = breakUpSpeechIntoChunks([unbroken]);
    expect(unbrokenChunks).toHaveLength(4);
    expect(unbrokenChunks.join("")).toBe(unbroken);

    // 3 long words (>60 chars total, fewer than 5 words)
    const threeLongWords = `${"alpha".repeat(5)} ${"bravo".repeat(5)} ${"charlie".repeat(5)}`;
    const threeWordChunks = breakUpSpeechIntoChunks([threeLongWords]);
    expect(threeWordChunks).toHaveLength(2);
  });

  it("falls back cleanly when crypto.randomUUID is unavailable", () => {
    const originalCrypto = globalThis.crypto;
    vi.stubGlobal("crypto", undefined);
    try {
      const details = processBulkAuthorContent("Line A\nLine B");
      expect(details.hierarchy.root).toHaveLength(2);
      expect(details.hierarchy.root[0]).not.toBe(details.hierarchy.root[1]);
    } finally {
      vi.stubGlobal("crypto", originalCrypto);
    }
  });
});

describe("bulkAuthor — 50-iteration randomized invariant tests", () => {
  it("preserves title length <= 20 invariant across 50 random lines when trimTitle is true", () => {
    const words = [
      "Alpha",
      "Beta",
      "Gamma",
      "Delta",
      "Epsilon",
      "Zeta",
      "Eta",
      "Theta",
    ];
    for (let i = 0; i < 50; i++) {
      const titleWords = Array.from(
        { length: 1 + Math.floor(Math.random() * 6) },
        () => words[Math.floor(Math.random() * words.length)],
      ).join(" ");
      const speechWords = Array.from(
        { length: 1 + Math.floor(Math.random() * 6) },
        () => words[Math.floor(Math.random() * words.length)],
      ).join(" ");

      const line = `${titleWords}: ${speechWords}`;
      const result = parseItem(line, {
        parseTitlesAndSpeech: true,
        detectEmotionAtStart: false,
        trimTitle: true,
      });

      expect(result.title.length).toBeLessThanOrEqual(20);
      expect(result.speech).toBe(speechWords);
    }
  });

  it("preserves title === speech when parseTitlesAndSpeech is false", () => {
    const phrases = [
      "Greeting: Hello",
      "Just a test without colons",
      "Multiple: colons: in: text",
    ];
    for (const phrase of phrases) {
      const result = parseItem(phrase, {
        parseTitlesAndSpeech: false,
        detectEmotionAtStart: false,
        trimTitle: false,
      });
      expect(result.title).toBe(phrase);
      expect(result.speech).toBe(phrase);
    }
  });

  it("maintains structural hierarchy & unique ID invariants across 50 randomized multi-line scripts", () => {
    const prefixes = ["", ":) ", ":( ", ":/ ", ":o ", ":z "];
    const endings = [".", "!", "?"];

    for (let iter = 0; iter < 50; iter++) {
      const lineCount = 1 + (iter % 8);
      let questionCount = 0;
      const lines: string[] = [];

      for (let l = 0; l < lineCount; l++) {
        const prefix = prefixes[(iter + l) % prefixes.length];
        const ending = endings[(iter * 3 + l) % endings.length];
        if (ending === "?") questionCount++;
        lines.push(`${prefix}Prompt ${l + 1}: Sample utterance ${l + 1}${ending}`);
      }

      const details = processBulkAuthorContent(lines.join("\n"), {
        formButtonsOn: "New Lines",
        parseTitlesAndSpeech: true,
        detectEmotionAtStart: true,
        trimTitle: true,
        breakUpLongSentences: false,
        addFeedbackAfterQuestions: true,
      });

      const expectedTotal = lineCount + questionCount * 2;
      expect(details.hierarchy.root).toHaveLength(expectedTotal);
      expect(new Set(details.hierarchy.root).size).toBe(expectedTotal);
      for (const id of details.hierarchy.root) {
        expect(details.buttons[id]).toBeDefined();
      }
    }
  });
});
