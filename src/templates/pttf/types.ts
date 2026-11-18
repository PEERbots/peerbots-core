import type {
  Emotion,
  PeerbotsColor,
  RobotControlButton,
  Template,
} from "../types";

/**
 * Semantic token category used by {@link CodeView} for syntax highlighting
 * and token-level hover explanations.
 */
export type CodeTokenKind =
  | "indent"
  | "bullet"
  | "anchor"
  | "jump"
  | "type"
  | "colors"
  | "emotion"
  | "title"
  | "separator"
  | "speech"
  | "metadata"
  | "section"
  | "comment";

/**
 * A single syntax token within a {@link FormattedCodeLine}, carrying its raw text
 * and a human-readable explanation of what it produces.
 */
export interface FormattedCodeToken {
  kind: CodeTokenKind;
  text: string;
  explanation: string;
  /** Optional label color when `kind === "colors"` or `kind === "type"`. */
  labelColor?: PeerbotsColor;
  /** Optional robot face color when `kind === "colors"`. */
  robotColor?: PeerbotsColor;
  /** Optional emotion when `kind === "emotion"`. */
  emotion?: Emotion;
}

/**
 * Structured representation of a single line in formatted Peerbots Template Text Format (PTTF).
 */
export interface FormattedCodeLine {
  /** 1-based line number. */
  lineNumber: number;
  /** Exact text content of the line (including leading indentation). */
  raw: string;
  /** Semantic role of the line. */
  kind: "comment" | "section" | "button" | "jump";
  /** Zero-based hierarchy depth (`0` for root). */
  depth: number;
  /** Button ID in `Template.buttons` (defined on this line, or targeted by a `jump` line). */
  buttonId?: string;
  /** Resolved button payload (for `"button"` and `"jump"` lines). */
  button?: RobotControlButton;
  /** Title of the parent button when `depth > 0`. */
  parentTitle?: string;
  /** Anchor tag (e.g. `"#check-in"`) if this line defines or jumps to an anchor. */
  anchor?: string;
  /** `true` when a `"jump"` line points to an ancestor (forming a cycle/loop). */
  isCycle?: boolean;
  /** Tokenized breakdown of the line for syntax highlighting and hover explainers. */
  tokens: FormattedCodeToken[];
  /** Plain-English summary of what this line produces in the template. */
  summary: string;
}

/**
 * Options for {@link formatTemplateToCode}.
 */
export interface FormatTemplateCodeOptions {
  /** Number of spaces per indentation level (@default 2). */
  indentSize?: number;
  /** Emit `#anchor` tags on every button rather than only jump targets (@default false). */
  alwaysEmitAnchors?: boolean;
  /** Include a leading `// Template Title` comment header (@default true when `template.title` is non-empty). */
  includeHeaderComment?: boolean;
}

/**
 * Result returned by {@link formatTemplateToCode}.
 */
export interface FormattedTemplateCode {
  /** Complete formatted PTTF text. */
  code: string;
  /** Line-by-line structured tokens and explanations. */
  lines: FormattedCodeLine[];
}

/**
 * Diagnostic warning or error emitted by {@link parseCodeToTemplate}.
 */
export interface CodeDiagnostic {
  /** 1-based line number where the issue occurred. */
  lineNumber: number;
  /** Diagnostic severity. */
  severity: "warning" | "error";
  /** Human-readable explanation of the issue. */
  message: string;
}

/**
 * Options for {@link parseCodeToTemplate}.
 */
export interface ParseTemplateCodeOptions {
  /** Fallback template title when no `// Title` header comment is present. */
  title?: string;
  /** Optional template ID to preserve on the parsed `Template`. */
  id?: string;
  /** Optional template description to preserve on the parsed `Template`. */
  description?: string;
  /** Default color for omitted `labelColor` / `details.color` (@default `"Light Blue"`). */
  defaultColor?: PeerbotsColor;
}

/**
 * Result returned by {@link parseCodeToTemplate}.
 */
export interface ParsedTemplateCodeResult {
  /** Reconstructed `Template` with `buttons` and `hierarchy`. */
  template: Template;
  /** Non-fatal warnings or errors encountered while parsing. */
  diagnostics: CodeDiagnostic[];
}

/**
 * Result returned by {@link analyzeTemplateCode}, including line-by-line
 * syntax tokens and live button previews aligned 1:1 with the input text.
 */
export interface AnalyzedTemplateCodeResult extends ParsedTemplateCodeResult {
  /** Line-by-line structured tokens and explanations matching the raw input lines 1:1. */
  lines: FormattedCodeLine[];
}

/**
 * Semantic token category for JSON syntax highlighting and hover explanations.
 */
export type JsonTokenKind =
  | "indent"
  | "key"
  | "string"
  | "number"
  | "boolean"
  | "punctuation";

/**
 * A single token within a {@link FormattedJsonLine}.
 */
export interface FormattedJsonToken {
  kind: JsonTokenKind;
  text: string;
  explanation: string;
}

/**
 * Structured representation of a single line of pretty-printed Template JSON.
 */
export interface FormattedJsonLine {
  lineNumber: number;
  raw: string;
  buttonId?: string;
  button?: RobotControlButton;
  tokens: FormattedJsonToken[];
  summary: string;
}

/**
 * A single context-aware autocomplete suggestion for PTTF editing.
 */
export interface CodeAutocompleteSuggestion {
  /** Display label shown in the autocomplete menu. */
  label: string;
  /** Exact text inserted when accepted. */
  insertText: string;
  /** Plain-English description of what this token does. */
  description: string;
  /** Optional color swatch to render beside the suggestion. */
  colorSwatch?: PeerbotsColor;
}

/**
 * Active autocomplete context derived from the caret position in PTTF text.
 */
export interface CodeAutocompleteContext {
  /** Which PTTF syntax section the caret is currently inside. */
  kind: "labelColor" | "robotColor" | "anchor" | "emotion";
  /** Human-readable section header for the autocomplete popup. */
  heading: string;
  /** Character index in the full text where replacement begins. */
  replaceStart: number;
  /** Character index in the full text where replacement ends. */
  replaceEnd: number;
  /** Ordered list of matching suggestions. */
  suggestions: CodeAutocompleteSuggestion[];
}
