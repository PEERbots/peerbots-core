import {
  PEERBOTS_COLORS,
  PEERBOTS_EMOTIONS,
  type Emotion,
} from "../types";
import type {
  CodeAutocompleteContext,
  CodeAutocompleteSuggestion,
} from "./types";

const EMOTION_AUTOCOMPLETE_ITEMS: Array<{
  prefix: string;
  emotion: Emotion;
}> = [
  { prefix: ":)", emotion: "Happy" },
  { prefix: ":(", emotion: "Sad" },
  { prefix: ":o", emotion: "Surprised" },
  { prefix: ":z", emotion: "Sleepy" },
  { prefix: ":\\", emotion: "Concerned" },
];

/**
 * Inspects the PTTF text around `selectionStart` and returns context-aware
 * autocomplete suggestions (colors inside `[...]`, `#anchors` after `->` or `#`,
 * or emoticons after `:`). Returns `null` when no autocomplete trigger is active.
 */
export function getCodeAutocompleteContext(
  code: string,
  selectionStart: number,
  availableAnchors: Array<{ anchor: string; title: string }> = [],
): CodeAutocompleteContext | null {
  const lineStart = code.lastIndexOf("\n", Math.max(0, selectionStart - 1)) + 1;
  const nextNewline = code.indexOf("\n", selectionStart);
  const lineEnd = nextNewline === -1 ? code.length : nextNewline;
  const lineBeforeCaret = code.slice(lineStart, selectionStart);
  const lineAfterCaret = code.slice(selectionStart, lineEnd);
  const trimmedBefore = lineBeforeCaret.trimStart();

  // Never trigger inside comments or section headers
  if (trimmedBefore.startsWith("//") || trimmedBefore.startsWith("##")) {
    return null;
  }

  const isLogLine = /^(?:!|[-*]?\s*\[log\])/i.test(trimmedBefore);

  // 1. Inside `[...]` brackets -> colors (label or robot) and emotions
  const lastOpen = lineBeforeCaret.lastIndexOf("[");
  const lastClose = lineBeforeCaret.lastIndexOf("]");
  if (lastOpen > lastClose) {
    const inside = lineBeforeCaret.slice(lastOpen + 1);
    const alreadyHasClosing = lineAfterCaret.trimStart().startsWith("]");
    const suffix = alreadyHasClosing ? "" : "] ";

    if (inside.includes("->")) {
      // Log buttons do not have a robot face color
      if (isLogLine) return null;

      const afterArrow = inside.split("->").pop() ?? "";
      const query = afterArrow.trimStart().toLowerCase();
      const replaceStart = selectionStart - afterArrow.trimStart().length;
      const matchingColors = PEERBOTS_COLORS.filter((c) =>
        c.toLowerCase().includes(query),
      ).sort((a, b) => {
        const aStarts = a.toLowerCase().startsWith(query) ? 0 : 1;
        const bStarts = b.toLowerCase().startsWith(query) ? 0 : 1;
        return aStarts - bStarts;
      });

      if (matchingColors.length === 0) return null;
      return {
        kind: "robotColor",
        heading: "Robot Face Color",
        replaceStart,
        replaceEnd: selectionStart,
        suggestions: matchingColors.map((color) => ({
          label: color,
          insertText: `${color}${suffix}`,
          description: `Set robot face color to ${color}`,
          colorSwatch: color,
        })),
      };
    }

    const query = inside.trimStart().toLowerCase();
    const replaceStart = selectionStart - inside.trimStart().length;
    const matchingColors = PEERBOTS_COLORS.filter((c) =>
      c.toLowerCase().includes(query),
    ).sort((a, b) => {
      const aStarts = a.toLowerCase().startsWith(query) ? 0 : 1;
      const bStarts = b.toLowerCase().startsWith(query) ? 0 : 1;
      return aStarts - bStarts;
    });
    const matchingEmotions = isLogLine
      ? []
      : PEERBOTS_EMOTIONS.filter(
          (e) => e !== "Neutral" && e.toLowerCase().includes(query),
        );

    const suggestions: CodeAutocompleteSuggestion[] = [
      ...matchingColors.map((color) => ({
        label: color,
        insertText: `${color}${suffix}`,
        description: isLogLine
          ? `Log button color (${color})`
          : `Button color (${color})`,
        colorSwatch: color,
      })),
      ...matchingEmotions.map((emotion) => ({
        label: emotion,
        insertText: `${emotion}${suffix}`,
        description: `Robot facial expression (${emotion})`,
      })),
    ];

    if (suggestions.length === 0) return null;
    return {
      kind: "labelColor",
      heading: isLogLine
        ? "Log Button Color"
        : "Button Color or Emotion (type -> for Robot Color)",
      replaceStart,
      replaceEnd: selectionStart,
      suggestions,
    };
  }

  // 2. Jump / Anchor reference (`-> #...`, `-> `, or `#...`)
  const anchorMatch = lineBeforeCaret.match(/(->[ \t]*#?|#)([a-zA-Z0-9_-]*)$/);
  if (anchorMatch && availableAnchors.length > 0) {
    const fullPrefix = anchorMatch[1];
    const query = anchorMatch[2].toLowerCase();
    const hasHash = fullPrefix.includes("#");
    const replaceStart = selectionStart - anchorMatch[2].length - (hasHash ? 1 : 0);

    const suggestions: CodeAutocompleteSuggestion[] = availableAnchors
      .filter((a) => a.anchor.toLowerCase().includes(query))
      .map((a) => ({
        label: a.anchor,
        insertText: a.anchor,
        description: `Jump to "${a.title}"`,
      }));

    if (suggestions.length === 0) return null;
    return {
      kind: "anchor",
      heading: "Jump to Anchor",
      replaceStart,
      replaceEnd: selectionStart,
      suggestions,
    };
  }

  // 3. Emoticon prefix (`:` after bullet/indent/brackets — only for Message buttons)
  if (isLogLine) {
    return null;
  }

  const colonMatch = lineBeforeCaret.match(
    /^([ \t]*(?:[-*][ \t]+)?(?:#[a-zA-Z0-9_-]+[ \t]+)?(?:\[[^\]]+\][ \t]*)*)(:[a-zA-Z()\\]?)$/,
  );
  if (colonMatch) {
    const typed = colonMatch[2].toLowerCase();
    const replaceStart = selectionStart - colonMatch[2].length;
    const suggestions = EMOTION_AUTOCOMPLETE_ITEMS.filter(
      (item) =>
        item.prefix.toLowerCase().startsWith(typed) ||
        item.emotion.toLowerCase().includes(typed.slice(1)),
    ).map((item) => ({
      label: item.prefix,
      insertText: `${item.prefix} `,
      description: `${item.emotion} expression`,
    }));

    if (suggestions.length === 0) return null;
    return {
      kind: "emotion",
      heading: "Robot Emotion",
      replaceStart,
      replaceEnd: selectionStart,
      suggestions,
    };
  }

  return null;
}
