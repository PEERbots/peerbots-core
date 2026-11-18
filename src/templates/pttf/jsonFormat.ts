import type { Template } from "../types";
import type { FormattedJsonLine, FormattedJsonToken } from "./types";

const JSON_KEY_EXPLANATIONS: Record<string, string> = {
  id: "Unique identifier for this template.",
  title: "Human-readable title (for the template or button).",
  description: "Optional description of what this template is used for.",
  buttons: "Dictionary mapping each buttonId to its Message or Log button definition.",
  hierarchy: "Directed graph defining button order: 'root' is top-level, other keys list child IDs.",
  root: "Ordered list of top-level button IDs shown first.",
  type: "Button kind: 'Message' (robot speaks/shows face) or 'Log' (records an event).",
  labelColor: "Background accent color of the controller UI button.",
  details: "Payload for this button (speech/color/emotion for Message, or notes for Log).",
  speech: "Exact words the robot speaks aloud when this button is pressed.",
  color: "Color shown on the robot's face/screen (independent of labelColor).",
  emotion: "Facial expression shown on the robot's face (Neutral, Happy, Sad, Surprised, Concerned, Sleepy).",
  metadata: "Custom key-value tags (e.g. goal, subgoal, score) attached to this button.",
};

/**
 * Formats a {@link Template} as pretty-printed JSON with token-level syntax highlighting
 * and plain-English hover explanations for each key and button.
 */
export function formatTemplateToJsonCode(template: Template): {
  code: string;
  lines: FormattedJsonLine[];
} {
  const code = JSON.stringify(template, null, 2);
  const rawLines = code.split("\n");
  const lines: FormattedJsonLine[] = [];

  let section: "top" | "buttons" | "hierarchy" | "other" = "top";
  let currentButtonId: string | undefined;

  for (let i = 0; i < rawLines.length; i += 1) {
    const raw = rawLines[i];
    const lineNumber = i + 1;
    const trimmed = raw.trim();
    const indentMatch = raw.match(/^(\s*)/);
    const indent = indentMatch ? indentMatch[1] : "";
    const indentLevel = Math.floor(indent.length / 2);

    if (indentLevel === 1) {
      if (trimmed.startsWith('"buttons"')) section = "buttons";
      else if (trimmed.startsWith('"hierarchy"')) section = "hierarchy";
      else section = "other";
      currentButtonId = undefined;
    } else if (indentLevel === 2 && (section === "buttons" || section === "hierarchy")) {
      const keyMatch = trimmed.match(/^"([^"]+)"\s*:/);
      if (keyMatch) {
        const keyName = keyMatch[1];
        currentButtonId = template.buttons[keyName] ? keyName : undefined;
      }
    } else if (indentLevel <= 1) {
      currentButtonId = undefined;
    }

    const tokens: FormattedJsonToken[] = [];
    if (indent) {
      tokens.push({
        kind: "indent",
        text: indent,
        explanation: `Indentation level ${indentLevel}.`,
      });
    }

    let rest = raw.slice(indent.length);
    const keyMatch = rest.match(/^"([^"]+)"(\s*:\s*)(.*)$/);
    let lineSummary = trimmed;

    if (keyMatch) {
      const keyName = keyMatch[1];
      const colonPart = keyMatch[2];
      const valPart = keyMatch[3];
      const keyExplanation =
        JSON_KEY_EXPLANATIONS[keyName] ??
        (section === "buttons" && template.buttons[keyName]
          ? `Button definition for ID "${keyName}" ("${template.buttons[keyName].details.title}").`
          : section === "hierarchy" && template.buttons[keyName]
            ? `Child buttons shown after "${template.buttons[keyName].details.title}" (${keyName}).`
            : `Property "${keyName}".`);

      tokens.push({
        kind: "key",
        text: `"${keyName}"`,
        explanation: keyExplanation,
      });
      tokens.push({
        kind: "punctuation",
        text: colonPart,
        explanation: "Key-value separator.",
      });
      lineSummary = keyExplanation;
      rest = valPart;
    }

    if (rest.length > 0) {
      const regex = /("(?:\\.|[^"\\])*")|(-?\d+(?:\.\d+)?)|(\btrue\b|\bfalse\b|\bnull\b)|([{}[\],]+)/g;
      let lastIndex = 0;
      let match: RegExpExecArray | null;
      while ((match = regex.exec(rest)) !== null) {
        if (match.index > lastIndex) {
          tokens.push({
            kind: "punctuation",
            text: rest.slice(lastIndex, match.index),
            explanation: "JSON syntax.",
          });
        }
        if (match[1]) {
          const strVal = match[1].slice(1, -1);
          const referencedBtn = template.buttons[strVal];
          tokens.push({
            kind: "string",
            text: match[1],
            explanation: referencedBtn
              ? `References button "${referencedBtn.details.title}" (ID: ${strVal}).`
              : `String value: "${strVal}".`,
          });
        } else if (match[2]) {
          tokens.push({
            kind: "number",
            text: match[2],
            explanation: `Numeric value: ${match[2]}.`,
          });
        } else if (match[3]) {
          tokens.push({
            kind: "boolean",
            text: match[3],
            explanation: `Literal value: ${match[3]}.`,
          });
        } else if (match[4]) {
          tokens.push({
            kind: "punctuation",
            text: match[4],
            explanation: "JSON structure delimiter.",
          });
        }
        lastIndex = regex.lastIndex;
      }
      if (lastIndex < rest.length) {
        tokens.push({
          kind: "punctuation",
          text: rest.slice(lastIndex),
          explanation: "JSON syntax.",
        });
      }
    }

    const button = currentButtonId ? template.buttons[currentButtonId] : undefined;
    lines.push({
      lineNumber,
      raw,
      buttonId: currentButtonId,
      button,
      tokens,
      summary: button
        ? `${button.type} button "${button.details.title}" — ${lineSummary}`
        : lineSummary,
    });
  }

  return { code, lines };
}
