import type {
  CodeTokenKind,
  FormattedCodeLine,
  FormattedJsonLine,
  JsonTokenKind,
} from "../../../../templates/codeFormat";
import type { PeerbotsColor, RobotControlButton } from "../../../../templates/types";

export const PTTF_TOKEN_CLASSES: Record<CodeTokenKind, string> = {
  indent: "pb:text-gray-600 pb:select-none",
  bullet: "pb:text-gray-500 pb:font-bold",
  anchor: "pb:text-amber-300 pb:font-semibold",
  jump: "pb:text-cyan-300 pb:font-semibold",
  type: "pb:text-fuchsia-300 pb:font-semibold",
  colors: "pb:text-emerald-300 pb:font-medium",
  emotion: "pb:text-yellow-300 pb:font-semibold",
  title: "pb:text-gray-100 pb:font-medium",
  separator: "pb:text-gray-500",
  speech: "pb:text-sky-200 pb:italic",
  metadata: "pb:text-purple-300",
  section: "pb:text-amber-400 pb:font-bold",
  comment: "pb:text-gray-400 pb:italic",
};

export const JSON_TOKEN_CLASSES: Record<JsonTokenKind, string> = {
  indent: "pb:text-gray-600 pb:select-none",
  key: "pb:text-sky-300 pb:font-medium",
  string: "pb:text-emerald-300",
  number: "pb:text-amber-300",
  boolean: "pb:text-fuchsia-300 pb:font-semibold",
  punctuation: "pb:text-gray-400",
};

export const TOKEN_BADGE_LABELS: Record<CodeTokenKind | JsonTokenKind, string> = {
  indent: "Hierarchy",
  bullet: "Item",
  anchor: "Anchor",
  jump: "Jump / Loop",
  type: "Button Type",
  colors: "Colors",
  emotion: "Emotion",
  title: "Button Title",
  separator: "Separator",
  speech: "Robot Speech",
  metadata: "Metadata",
  section: "Section",
  comment: "Comment",
  key: "JSON Key",
  string: "String",
  number: "Number",
  boolean: "Literal",
  punctuation: "Syntax",
};

export interface NormalizedLineView {
  lineNumber: number;
  depth: number;
  kind: "comment" | "section" | "button" | "jump" | "json";
  buttonId?: string;
  button?: RobotControlButton;
  anchor?: string;
  isCycle?: boolean;
  summary: string;
  tokens: Array<{
    kind: CodeTokenKind | JsonTokenKind;
    text: string;
    explanation: string;
    className: string;
    labelColor?: PeerbotsColor;
    robotColor?: PeerbotsColor;
  }>;
}

export function normalizePttfLines(lines: FormattedCodeLine[]): NormalizedLineView[] {
  return lines.map((l) => ({
    lineNumber: l.lineNumber,
    depth: l.depth,
    kind: l.kind,
    buttonId: l.buttonId,
    button: l.button,
    anchor: l.anchor,
    isCycle: l.isCycle,
    summary: l.summary,
    tokens: l.tokens.map((t) => ({
      kind: t.kind,
      text: t.text,
      explanation: t.explanation,
      className: PTTF_TOKEN_CLASSES[t.kind],
      labelColor: t.labelColor,
      robotColor: t.robotColor,
    })),
  }));
}

export function normalizeJsonLines(lines: FormattedJsonLine[]): NormalizedLineView[] {
  return lines.map((l) => ({
    lineNumber: l.lineNumber,
    depth: 0,
    kind: "json",
    buttonId: l.buttonId,
    button: l.button,
    summary: l.summary,
    tokens: l.tokens.map((t) => ({
      kind: t.kind,
      text: t.text,
      explanation: t.explanation,
      className: JSON_TOKEN_CLASSES[t.kind],
    })),
  }));
}

export function highlightJsonRaw(raw: string): Array<{ text: string; className: string }> {
  const parts: Array<{ text: string; className: string }> = [];
  const regex =
    /("(?:\\.|[^"\\])*")(\s*:)?|(-?\d+(?:\.\d+)?)|(\btrue\b|\bfalse\b|\bnull\b)|([{}[\],:])/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(raw)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        text: raw.slice(lastIndex, match.index),
        className: "pb:text-gray-300",
      });
    }
    if (match[1]) {
      parts.push({
        text: match[1],
        className: match[2] ? JSON_TOKEN_CLASSES.key : JSON_TOKEN_CLASSES.string,
      });
      if (match[2]) {
        parts.push({ text: match[2], className: JSON_TOKEN_CLASSES.punctuation });
      }
    } else if (match[3]) {
      parts.push({ text: match[3], className: JSON_TOKEN_CLASSES.number });
    } else if (match[4]) {
      parts.push({ text: match[4], className: JSON_TOKEN_CLASSES.boolean });
    } else if (match[5]) {
      parts.push({ text: match[5], className: JSON_TOKEN_CLASSES.punctuation });
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < raw.length) {
    parts.push({ text: raw.slice(lastIndex), className: "pb:text-gray-300" });
  }
  return parts;
}
