import { EMOTION_PREFIXES } from "./bulkAuthor";
import {
  PEERBOTS_COLORS,
  PEERBOTS_EMOTIONS,
  type Emotion,
  type LoggedEvent,
  type Message,
  type MetaData,
  type PeerbotsColor,
  type RobotControlButton,
  type Template,
  type TemplateHierarchy,
} from "./types";

const DEFAULT_COLOR: PeerbotsColor = "Light Blue";
const DEFAULT_EMOTION: Emotion = "Neutral";

const EMOTION_TO_PREFIX: Partial<Record<Emotion, string>> = {
  Happy: ":)",
  Sad: ":(",
  Surprised: ":o",
  Sleepy: ":z",
};

const EXTRA_EMOTION_PREFIXES: { prefix: string; emotion: Emotion }[] = [
  ...EMOTION_PREFIXES,
  { prefix: ":\\", emotion: "Concerned" },
];

const COLOR_LOOKUP = new Map<string, PeerbotsColor>(
  PEERBOTS_COLORS.map((c) => [c.toLowerCase(), c]),
);

const EMOTION_LOOKUP = new Map<string, Emotion>(
  PEERBOTS_EMOTIONS.map((e) => [e.toLowerCase(), e]),
);

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

function slugifyAnchor(value: string, fallback: string): string {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 28)
    .replace(/-+$/g, "");
  return slug || fallback;
}

function buildAnchorMap(
  template: Template,
  neededIds: Set<string>,
): Map<string, string> {
  const anchors = new Map<string, string>();
  const used = new Set<string>();

  for (const id of neededIds) {
    const btn = template.buttons[id];
    const base = slugifyAnchor(btn?.details?.title ?? id, `btn-${id}`);
    let candidate = base;
    let counter = 2;
    while (used.has(candidate)) {
      candidate = `${base}-${counter}`;
      counter += 1;
    }
    used.add(candidate);
    anchors.set(id, `#${candidate}`);
  }

  return anchors;
}

function formatMetadata(metadata?: MetaData): string | null {
  if (!metadata) return null;
  const entries = Object.entries(metadata);
  if (entries.length === 0) return null;

  const parts = entries.map(([key, val]) => {
    const safeKey = /^[a-zA-Z_][a-zA-Z0-9_-]*$/.test(key)
      ? key
      : JSON.stringify(key);
    const safeVal = typeof val === "number" ? String(val) : JSON.stringify(val);
    return `${safeKey}: ${safeVal}`;
  });
  return `{ ${parts.join(", ")} }`;
}

function formatButtonTokens(
  buttonId: string,
  button: RobotControlButton,
  depth: number,
  indentSize: number,
  anchor: string | undefined,
  parentTitle: string | undefined,
  defaultColor: PeerbotsColor,
): { tokens: FormattedCodeToken[]; raw: string; summary: string } {
  const tokens: FormattedCodeToken[] = [];
  const indentText = " ".repeat(depth * indentSize);

  if (indentText.length > 0) {
    tokens.push({
      kind: "indent",
      text: indentText,
      explanation: parentTitle
        ? `Indented ${depth * indentSize} spaces: nested inside "${parentTitle}".`
        : `Indented ${depth * indentSize} spaces (depth ${depth}).`,
    });
  }

  const isLog = button.type === "Log";
  if (isLog) {
    tokens.push({
      kind: "type",
      text: "! ",
      labelColor: button.labelColor,
      explanation:
        depth === 0
          ? "Log button (!): top-level event marker (dashed style with zap icon) without robot speech."
          : `Log button (!): child event marker under "${parentTitle ?? "parent"}" (dashed style with zap icon) without robot speech.`,
    });
  } else {
    tokens.push({
      kind: "bullet",
      text: "- ",
      explanation:
        depth === 0
          ? "Top-level (root) button."
          : `Child button under "${parentTitle ?? "parent"}".`,
    });
  }

  if (anchor) {
    tokens.push({
      kind: "anchor",
      text: `${anchor} `,
      explanation: `Anchor "${anchor}": other lines can jump here using "-> ${anchor}".`,
    });
  }

  const labelColor = button.labelColor ?? defaultColor;
  const robotColor = !isLog ? (button.details.color ?? defaultColor) : defaultColor;

  const hasCustomLabel = labelColor !== defaultColor;
  const hasCustomRobot = !isLog && robotColor !== defaultColor;

  if (hasCustomLabel || hasCustomRobot) {
    let colorText: string;
    let colorExplanation: string;
    if (hasCustomLabel && hasCustomRobot) {
      colorText = `[${labelColor} -> ${robotColor}] `;
      colorExplanation = `Button color: ${labelColor} • Robot face color: ${robotColor}.`;
    } else if (hasCustomLabel) {
      colorText = `[${labelColor}] `;
      colorExplanation = isLog
        ? `Log button accent color: ${labelColor}.`
        : `Button color: ${labelColor} • Robot face color: ${defaultColor} (default).`;
    } else {
      colorText = `[-> ${robotColor}] `;
      colorExplanation = `Button color: ${defaultColor} (default) • Robot face color: ${robotColor}.`;
    }
    tokens.push({
      kind: "colors",
      text: colorText,
      labelColor,
      robotColor: isLog ? undefined : robotColor,
      explanation: colorExplanation,
    });
  }

  if (!isLog && button.details.emotion && button.details.emotion !== DEFAULT_EMOTION) {
    const emotion = button.details.emotion;
    const prefix = EMOTION_TO_PREFIX[emotion];
    const emotionText = prefix ? `${prefix} ` : `[${emotion}] `;
    tokens.push({
      kind: "emotion",
      text: emotionText,
      emotion,
      explanation: `Robot facial expression: ${emotion}.`,
    });
  }

  const title = button.details.title || buttonId;
  const secondaryText = isLog
    ? (button.details as LoggedEvent).details
    : (button.details as Message).speech;

  tokens.push({
    kind: "title",
    text: title,
    explanation: `Button label shown on screen: "${title}".`,
  });

  const hasDistinctSecondary =
    typeof secondaryText === "string" &&
    secondaryText.length > 0 &&
    secondaryText !== title;

  if (hasDistinctSecondary) {
    tokens.push({
      kind: "separator",
      text: " | ",
      explanation: isLog
        ? "Separates the button title from the logged event notes."
        : "Separates the button label from what the robot actually speaks.",
    });
    tokens.push({
      kind: "speech",
      text: secondaryText,
      explanation: isLog
        ? `Event notes recorded when clicked: "${secondaryText}".`
        : `Robot speaks aloud: "${secondaryText}".`,
    });
  }

  const metaString = formatMetadata(button.details.metadata);
  if (metaString) {
    tokens.push({
      kind: "metadata",
      text: ` ${metaString}`,
      explanation: `Custom metadata attached to this button: ${metaString}.`,
    });
  }

  const raw = tokens.map((t) => t.text).join("");
  const summaryParts: string[] = [
    isLog ? `Log button "${title}"` : `Message button "${title}"`,
  ];
  if (parentTitle) summaryParts.push(`under "${parentTitle}"`);
  if (!isLog) {
    summaryParts.push(`face: ${robotColor} / ${button.details.emotion}`);
  }
  summaryParts.push(`label: ${labelColor}`);
  if (hasDistinctSecondary && !isLog) {
    summaryParts.push(`speaks "${secondaryText}"`);
  }

  return {
    tokens,
    raw,
    summary: summaryParts.join(" • "),
  };
}

/**
 * Formats a {@link Template} into human-readable Peerbots Template Text Format (PTTF)
 * with line-by-line syntax tokens and hover explanations.
 */
export function formatTemplateToCode(
  template: Template,
  options: FormatTemplateCodeOptions = {},
): FormattedTemplateCode {
  const indentSize = options.indentSize ?? 2;
  const alwaysEmitAnchors = options.alwaysEmitAnchors ?? false;
  const includeHeaderComment =
    options.includeHeaderComment ?? Boolean(template.title?.trim());

  const hierarchy: TemplateHierarchy = template.hierarchy ?? { root: [] };
  const rootIds = Array.isArray(hierarchy.root) ? hierarchy.root : [];

  // Count how many times each reachable buttonId is referenced so we know which nodes need #anchors.
  const refCounts = new Map<string, number>();
  const visitedForCount = new Set<string>();

  function countRefs(ids: string[]) {
    for (const id of ids) {
      if (!template.buttons[id]) continue;
      refCounts.set(id, (refCounts.get(id) ?? 0) + 1);
      if (visitedForCount.has(id)) continue;
      visitedForCount.add(id);
      const children = hierarchy[id];
      if (Array.isArray(children) && children.length > 0) {
        countRefs(children);
      }
    }
  }
  countRefs(rootIds);

  const neededAnchors = new Set<string>();
  for (const [id, count] of refCounts.entries()) {
    if (alwaysEmitAnchors || count > 1) {
      neededAnchors.add(id);
    }
  }
  // Also emit anchors on all buttons if requested, including unlinked ones.
  if (alwaysEmitAnchors) {
    for (const id of Object.keys(template.buttons)) {
      neededAnchors.add(id);
    }
  }

  const anchorMap = buildAnchorMap(template, neededAnchors);
  const lines: FormattedCodeLine[] = [];

  if (includeHeaderComment && template.title?.trim()) {
    const commentText = `// ${template.title.trim()}`;
    lines.push({
      lineNumber: lines.length + 1,
      raw: commentText,
      kind: "comment",
      depth: 0,
      tokens: [
        {
          kind: "comment",
          text: commentText,
          explanation: `Template title comment: "${template.title.trim()}".`,
        },
      ],
      summary: `Template header: "${template.title.trim()}"`,
    });
  }

  const emitted = new Set<string>();

  function walk(
    ids: string[],
    depth: number,
    ancestors: Set<string>,
    parentTitle?: string,
  ) {
    for (const id of ids) {
      const button = template.buttons[id];
      if (!button) continue;

      if (emitted.has(id)) {
        const anchor = anchorMap.get(id) ?? `#${slugifyAnchor(id, id)}`;
        const isCycle = ancestors.has(id);
        const indentText = " ".repeat(depth * indentSize);
        const tokens: FormattedCodeToken[] = [];
        if (indentText.length > 0) {
          tokens.push({
            kind: "indent",
            text: indentText,
            explanation: parentTitle
              ? `Indented ${depth * indentSize} spaces: triggered from "${parentTitle}".`
              : `Indented ${depth * indentSize} spaces.`,
          });
        }
        tokens.push({
          kind: "bullet",
          text: "- ",
          explanation: "Jump reference line.",
        });
        tokens.push({
          kind: "jump",
          text: `-> ${anchor}`,
          explanation: isCycle
            ? `Creates a loop back to "${button.details.title}" (${anchor}).`
            : `Links to shared button "${button.details.title}" (${anchor}) without duplicating it.`,
        });
        const raw = tokens.map((t) => t.text).join("");
        lines.push({
          lineNumber: lines.length + 1,
          raw,
          kind: "jump",
          depth,
          buttonId: id,
          button,
          parentTitle,
          anchor,
          isCycle,
          tokens,
          summary: isCycle
            ? `Loop back to "${button.details.title}" (${anchor})`
            : `Jump to shared "${button.details.title}" (${anchor})`,
        });
        continue;
      }

      emitted.add(id);
      const anchor = anchorMap.get(id);
      const formatted = formatButtonTokens(
        id,
        button,
        depth,
        indentSize,
        anchor,
        parentTitle,
        DEFAULT_COLOR,
      );

      lines.push({
        lineNumber: lines.length + 1,
        raw: formatted.raw,
        kind: "button",
        depth,
        buttonId: id,
        button,
        parentTitle,
        anchor,
        tokens: formatted.tokens,
        summary: formatted.summary,
      });

      const children = hierarchy[id];
      if (Array.isArray(children) && children.length > 0) {
        const nextAncestors = new Set(ancestors);
        nextAncestors.add(id);
        walk(children, depth + 1, nextAncestors, button.details.title || id);
      }
    }
  }

  walk(rootIds, 0, new Set());

  // Preserve any buttons in template.buttons that are unreachable from root.
  const unlinkedIds = Object.keys(template.buttons).filter(
    (id) => !emitted.has(id),
  );
  if (unlinkedIds.length > 0) {
    lines.push({
      lineNumber: lines.length + 1,
      raw: "## Unlinked",
      kind: "section",
      depth: 0,
      tokens: [
        {
          kind: "section",
          text: "## Unlinked",
          explanation:
            "Buttons in this section exist in the template but are not connected to the root menu.",
        },
      ],
      summary: "Unlinked buttons section (not shown in root menu)",
    });

    for (const id of unlinkedIds) {
      if (emitted.has(id)) continue;
      walk([id], 0, new Set());
    }
  }

  return {
    code: lines.map((l) => l.raw).join("\n"),
    lines,
  };
}

/**
 * Convenience helper returning just the formatted PTTF string for a {@link Template}.
 */
export function serializeTemplateToCode(
  template: Template,
  options?: FormatTemplateCodeOptions,
): string {
  return formatTemplateToCode(template, options).code;
}

function parseMetadataBlock(raw: string): MetaData | undefined {
  const trimmed = raw.trim();
  if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) return undefined;
  const inner = trimmed.slice(1, -1).trim();
  if (!inner) return undefined;

  const result: MetaData = {};
  // Split on commas not inside quotes
  const pairs: string[] = [];
  let current = "";
  let inQuote: string | null = null;
  for (let i = 0; i < inner.length; i += 1) {
    const ch = inner[i];
    if (inQuote) {
      current += ch;
      if (ch === inQuote && inner[i - 1] !== "\\") {
        inQuote = null;
      }
    } else if (ch === '"' || ch === "'") {
      inQuote = ch;
      current += ch;
    } else if (ch === ",") {
      pairs.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  if (current.trim()) pairs.push(current.trim());

  for (const pair of pairs) {
    const colonIdx = pair.indexOf(":");
    if (colonIdx <= 0) continue;
    let key = pair.slice(0, colonIdx).trim();
    let valStr = pair.slice(colonIdx + 1).trim();

    if (
      (key.startsWith('"') && key.endsWith('"')) ||
      (key.startsWith("'") && key.endsWith("'"))
    ) {
      key = key.slice(1, -1);
    }

    if (
      (valStr.startsWith('"') && valStr.endsWith('"')) ||
      (valStr.startsWith("'") && valStr.endsWith("'"))
    ) {
      try {
        result[key] = JSON.parse(
          valStr.startsWith("'")
            ? `"${valStr.slice(1, -1).replace(/"/g, '\\"')}"`
            : valStr,
        );
      } catch {
        result[key] = valStr.slice(1, -1);
      }
    } else if (/^-?\d+(\.\d+)?$/.test(valStr)) {
      result[key] = Number(valStr);
    } else {
      result[key] = valStr;
    }
  }

  return Object.keys(result).length > 0 ? result : undefined;
}

function parseColorToken(
  tokenInner: string,
  defaultColor: PeerbotsColor,
  lineNumber: number,
  diagnostics: CodeDiagnostic[],
): { labelColor?: PeerbotsColor; robotColor?: PeerbotsColor; matched: boolean } {
  if (tokenInner.includes("->")) {
    const [leftRaw, rightRaw] = tokenInner.split("->").map((s) => s.trim());
    let labelColor: PeerbotsColor | undefined;
    let robotColor: PeerbotsColor | undefined;

    if (leftRaw) {
      const found = COLOR_LOOKUP.get(leftRaw.toLowerCase());
      if (found) labelColor = found;
      else {
        diagnostics.push({
          lineNumber,
          severity: "warning",
          message: `Unknown label color "${leftRaw}"; using "${defaultColor}".`,
        });
      }
    }
    if (rightRaw) {
      const found = COLOR_LOOKUP.get(rightRaw.toLowerCase());
      if (found) robotColor = found;
      else {
        diagnostics.push({
          lineNumber,
          severity: "warning",
          message: `Unknown robot color "${rightRaw}"; using "${defaultColor}".`,
        });
      }
    }
    return { labelColor, robotColor, matched: true };
  }

  const single = COLOR_LOOKUP.get(tokenInner.trim().toLowerCase());
  if (single) {
    return { labelColor: single, matched: true };
  }

  return { matched: false };
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
 * Parses Peerbots Template Text Format (PTTF) into a {@link Template} while
 * preserving exact 1:1 line tokens, button previews, and explanations for every
 * input line (used by {@link CodeView} in both Edit and Inspect modes).
 */
export function analyzeTemplateCode(
  code: string,
  options: ParseTemplateCodeOptions = {},
): AnalyzedTemplateCodeResult {
  const defaultColor = options.defaultColor ?? DEFAULT_COLOR;
  const diagnostics: CodeDiagnostic[] = [];
  const buttons: Record<string, RobotControlButton> = {};
  const hierarchy: TemplateHierarchy = { root: [] };
  const lines: FormattedCodeLine[] = [];

  let parsedTitle = options.title ?? "Untitled Template";
  let sawHeaderTitle = false;
  let inUnlinkedSection = false;
  let idCounter = 1;

  const anchorToId = new Map<string, string>();
  const pendingJumps: {
    parentId: string | "root";
    anchor: string;
    lineNumber: number;
    lineIdx: number;
  }[] = [];

  // Stack of active ancestor button IDs by depth: stack[depth] = buttonId
  const depthStack: string[] = [];

  const rawLines = code.split(/\r?\n/);

  for (let idx = 0; idx < rawLines.length; idx += 1) {
    const lineNumber = idx + 1;
    const rawLine = rawLines[idx];
    const trimmed = rawLine.trim();
    const tokens: FormattedCodeToken[] = [];

    const leadingMatch = rawLine.match(/^([ \t]*)/);
    const exactIndent = leadingMatch ? leadingMatch[1] : "";
    const leadingNormalized = exactIndent.replace(/\t/g, "  ");
    let depth = Math.floor(leadingNormalized.length / 2);

    if (!trimmed) {
      if (rawLine.length > 0) {
        tokens.push({
          kind: "indent",
          text: rawLine,
          explanation: "Blank line.",
        });
      }
      lines.push({
        lineNumber,
        raw: rawLine,
        kind: "comment",
        depth: 0,
        tokens,
        summary: "Blank line",
      });
      continue;
    }

    // Comment lines
    if (trimmed.startsWith("//")) {
      if (exactIndent.length > 0) {
        tokens.push({
          kind: "indent",
          text: exactIndent,
          explanation: "Leading indentation.",
        });
      }
      const commentBody = trimmed.slice(2).trim();
      if (!sawHeaderTitle && commentBody) {
        parsedTitle = commentBody;
        sawHeaderTitle = true;
      }
      tokens.push({
        kind: "comment",
        text: rawLine.slice(exactIndent.length),
        explanation: commentBody
          ? `Comment: "${commentBody}".`
          : "Comment line.",
      });
      lines.push({
        lineNumber,
        raw: rawLine,
        kind: "comment",
        depth: 0,
        tokens,
        summary: commentBody ? `Comment: "${commentBody}"` : "Comment line",
      });
      continue;
    }

    // Section headers
    if (trimmed.startsWith("##")) {
      if (exactIndent.length > 0) {
        tokens.push({
          kind: "indent",
          text: exactIndent,
          explanation: "Leading indentation.",
        });
      }
      const sectionName = trimmed.slice(2).trim().toLowerCase();
      inUnlinkedSection = sectionName === "unlinked";
      depthStack.length = 0;
      tokens.push({
        kind: "section",
        text: rawLine.slice(exactIndent.length),
        explanation: inUnlinkedSection
          ? "Buttons in this section exist in the template but are not connected to the root menu."
          : `Section header: "${trimmed.slice(2).trim()}".`,
      });
      lines.push({
        lineNumber,
        raw: rawLine,
        kind: "section",
        depth: 0,
        tokens,
        summary: inUnlinkedSection
          ? "Unlinked buttons section (not shown in root menu)"
          : `Section "${trimmed.slice(2).trim()}"`,
      });
      continue;
    }

    if (!inUnlinkedSection && depth > depthStack.length) {
      diagnostics.push({
        lineNumber,
        severity: "warning",
        message: `Indentation jumped by more than one level; attaching to nearest parent.`,
      });
      depth = depthStack.length;
    }

    const parentId: string | "root" = inUnlinkedSection
      ? "root"
      : depth === 0
        ? "root"
        : depthStack[depth - 1];
    const parentTitle =
      parentId !== "root" ? buttons[parentId]?.details.title : undefined;

    if (exactIndent.length > 0) {
      tokens.push({
        kind: "indent",
        text: exactIndent,
        explanation: parentTitle
          ? `Indented ${leadingNormalized.length} spaces: nested inside "${parentTitle}".`
          : `Indented ${leadingNormalized.length} spaces (depth ${depth}).`,
      });
    }

    let pos = exactIndent.length;
    let isLog = false;

    // Strip optional bullet prefix `- `, `* `, or `!` (Log)
    const afterIndent = rawLine.slice(pos);
    const bulletMatch = afterIndent.match(/^([-*][ \t]+)/);
    const emptyBulletMatch = afterIndent.match(/^([-*])$/);
    const logBulletMatch = afterIndent.match(/^(!+[ \t]*)/);

    if (bulletMatch) {
      tokens.push({
        kind: "bullet",
        text: bulletMatch[1],
        explanation:
          depth === 0
            ? "Top-level (root) button."
            : `Child button under "${parentTitle ?? "parent"}".`,
      });
      pos += bulletMatch[1].length;
    } else if (emptyBulletMatch) {
      tokens.push({
        kind: "bullet",
        text: emptyBulletMatch[1],
        explanation: "Empty bullet item.",
      });
      lines.push({
        lineNumber,
        raw: rawLine,
        kind: "comment",
        depth,
        tokens,
        summary: "Empty bullet item (type a button title)",
      });
      continue;
    } else if (logBulletMatch && afterIndent.startsWith("!")) {
      isLog = true;
      tokens.push({
        kind: "type",
        text: logBulletMatch[1],
        explanation:
          depth === 0
            ? "Log button (!): top-level event marker (dashed style with zap icon) without robot speech."
            : `Log button (!): child event marker under "${parentTitle ?? "parent"}" (dashed style with zap icon) without robot speech.`,
      });
      pos += logBulletMatch[1].length;
      if (rawLine.slice(pos).trim().length === 0) {
        if (pos < rawLine.length) {
          tokens.push({
            kind: "indent",
            text: rawLine.slice(pos),
            explanation: "Trailing whitespace.",
          });
        }
        lines.push({
          lineNumber,
          raw: rawLine,
          kind: "comment",
          depth,
          tokens,
          summary: "Log button (!) — type an event title",
        });
        continue;
      }
    }

    // Check for jump line: `-> #anchor`
    const restAfterBullet = rawLine.slice(pos);
    if (restAfterBullet.trimStart().startsWith("->")) {
      const targetRef = restAfterBullet.trim().slice(2).trim();
      const anchorKey = targetRef.startsWith("#")
        ? targetRef.toLowerCase()
        : `#${targetRef.toLowerCase()}`;
      tokens.push({
        kind: "jump",
        text: restAfterBullet,
        explanation: `Jump reference to "${anchorKey}".`,
      });
      const lineIdx = lines.length;
      lines.push({
        lineNumber,
        raw: rawLine,
        kind: "jump",
        depth,
        parentTitle,
        anchor: anchorKey,
        tokens,
        summary: `Jump to ${anchorKey}`,
      });
      pendingJumps.push({ parentId, anchor: anchorKey, lineNumber, lineIdx });
      continue;
    }

    // Optional leading `#anchor`
    let anchor: string | undefined;
    const anchorMatch = rawLine.slice(pos).match(/^(#[a-zA-Z0-9_-]+)([ \t]+)(.*)$/);
    if (anchorMatch) {
      anchor = anchorMatch[1].toLowerCase();
      tokens.push({
        kind: "anchor",
        text: anchorMatch[1] + anchorMatch[2],
        explanation: `Anchor "${anchor}": other lines can jump here using "-> ${anchor}".`,
      });
      pos += anchorMatch[1].length + anchorMatch[2].length;
    }

    let labelColor: PeerbotsColor = defaultColor;
    let robotColor: PeerbotsColor = defaultColor;
    let emotion: Emotion = DEFAULT_EMOTION;

    // Parse leading bracket tokens `[...]` in any order
    while (rawLine.slice(pos).startsWith("[")) {
      const slice = rawLine.slice(pos);
      const closeIdx = slice.indexOf("]");
      if (closeIdx <= 0) break;
      const inner = slice.slice(1, closeIdx).trim();
      const lower = inner.toLowerCase();
      const trailingSpaceMatch = slice.slice(closeIdx + 1).match(/^([ \t]*)/);
      const trailingSpace = trailingSpaceMatch ? trailingSpaceMatch[1] : "";
      const tokenText = slice.slice(0, closeIdx + 1) + trailingSpace;

      if (lower === "log") {
        isLog = true;
        tokens.push({
          kind: "type",
          text: tokenText,
          explanation:
            'Log button ([Log] alias): records a user/session event (dashed style with zap icon) without robot speech. Prefer starting the line with "!".',
        });
      } else if (EMOTION_LOOKUP.has(lower)) {
        emotion = EMOTION_LOOKUP.get(lower)!;
        tokens.push({
          kind: "emotion",
          text: tokenText,
          emotion,
          explanation: `Robot facial expression: ${emotion}.`,
        });
      } else {
        const colorRes = parseColorToken(
          inner,
          defaultColor,
          lineNumber,
          diagnostics,
        );
        if (colorRes.matched) {
          if (colorRes.labelColor) labelColor = colorRes.labelColor;
          if (colorRes.robotColor) robotColor = colorRes.robotColor;
          tokens.push({
            kind: "colors",
            text: tokenText,
            labelColor: colorRes.labelColor ?? labelColor,
            robotColor: colorRes.robotColor,
            explanation: `Colors: button ${colorRes.labelColor ?? labelColor}${colorRes.robotColor ? ` • robot face ${colorRes.robotColor}` : ""}.`,
          });
        } else {
          diagnostics.push({
            lineNumber,
            severity: "warning",
            message: `Unrecognized bracket token "[${inner}]" ignored.`,
          });
          tokens.push({
            kind: "title",
            text: tokenText,
            explanation: `Unrecognized bracket token "[${inner}]" (ignored).`,
          });
        }
      }

      pos += tokenText.length;
    }

    // Parse optional leading ASCII emoticon (`:)`, `:(`, etc.)
    const afterBrackets = rawLine.slice(pos);
    for (const { prefix, emotion: mappedEmotion } of EXTRA_EMOTION_PREFIXES) {
      if (afterBrackets.startsWith(prefix)) {
        emotion = mappedEmotion;
        const spaceMatch = afterBrackets.slice(prefix.length).match(/^([ \t]*)/);
        const spaceAfter = spaceMatch ? spaceMatch[1] : "";
        const tokenText = prefix + spaceAfter;
        tokens.push({
          kind: "emotion",
          text: tokenText,
          emotion,
          explanation: `Robot facial expression: ${emotion}.`,
        });
        pos += tokenText.length;
        break;
      }
    }

    // Parse optional trailing `{ ... }` metadata
    let metadata: MetaData | undefined;
    let bodyEnd = rawLine.length;
    const trimmedRight = rawLine.slice(pos).replace(/[ \t]+$/, "");
    if (trimmedRight.endsWith("}")) {
      const openBraceInTrimmed = trimmedRight.lastIndexOf("{");
      if (openBraceInTrimmed > 0) {
        const candidate = trimmedRight.slice(openBraceInTrimmed);
        const parsedMeta = parseMetadataBlock(candidate);
        if (parsedMeta) {
          metadata = parsedMeta;
          // Include preceding spaces before `{` in the metadata token
          const beforeBrace = trimmedRight.slice(0, openBraceInTrimmed);
          const trimmedBeforeBrace = beforeBrace.replace(/[ \t]+$/, "");
          bodyEnd = pos + trimmedBeforeBrace.length;
        }
      }
    }

    // Parse Title | Speech (or fallback Title: Speech)
    const body = rawLine.slice(pos, bodyEnd);
    let title = body.trim();
    let speech = title;

    const pipeMatch = body.match(/^(.*?)([ \t]*\|[ \t]*)(.*)$/);
    if (pipeMatch && pipeMatch[1].trim().length > 0) {
      title = pipeMatch[1].trim();
      const rhs = pipeMatch[3].trim();
      speech = rhs.length > 0 ? rhs : title;
      tokens.push({
        kind: "title",
        text: pipeMatch[1],
        explanation: `Button label shown on screen: "${title}".`,
      });
      tokens.push({
        kind: "separator",
        text: pipeMatch[2],
        explanation: isLog
          ? "Separates the button title from the logged event notes."
          : "Separates the button label from what the robot actually speaks.",
      });
      if (pipeMatch[3].length > 0) {
        tokens.push({
          kind: "speech",
          text: pipeMatch[3],
          explanation: isLog
            ? `Event notes recorded when clicked: "${speech}".`
            : `Robot speaks aloud: "${speech}".`,
        });
      }
    } else {
      const colonMatch = body.match(/^([^:]+?)([ \t]*:[ \t]*)(.+)$/);
      if (
        colonMatch &&
        colonMatch[1].trim().length > 0 &&
        colonMatch[3].trim().length > 0
      ) {
        title = colonMatch[1].trim();
        speech = colonMatch[3].trim();
        tokens.push({
          kind: "title",
          text: colonMatch[1],
          explanation: `Button label shown on screen: "${title}".`,
        });
        tokens.push({
          kind: "separator",
          text: colonMatch[2],
          explanation: isLog
            ? "Separates the button title from the logged event notes."
            : "Separates the button label from what the robot actually speaks.",
        });
        tokens.push({
          kind: "speech",
          text: colonMatch[3],
          explanation: isLog
            ? `Event notes recorded when clicked: "${speech}".`
            : `Robot speaks aloud: "${speech}".`,
        });
      } else if (body.length > 0) {
        tokens.push({
          kind: "title",
          text: body,
          explanation: `Button label shown on screen: "${title}".`,
        });
      }
    }

    if (bodyEnd < rawLine.length) {
      const metaText = rawLine.slice(bodyEnd);
      tokens.push({
        kind: "metadata",
        text: metaText,
        explanation: `Custom metadata attached to this button: ${metaText.trim()}.`,
      });
    }

    const buttonId = String(idCounter);
    idCounter += 1;

    let createdButton: RobotControlButton;
    if (isLog) {
      const logDetails: LoggedEvent = {
        title,
        ...(speech !== title ? { details: speech } : {}),
        ...(metadata ? { metadata } : {}),
      };
      createdButton = {
        type: "Log",
        labelColor,
        details: logDetails,
      };
      // Propagate labelColor onto the `! ` type token if present
      const typeTok = tokens.find((t) => t.kind === "type");
      if (typeTok) typeTok.labelColor = labelColor;
    } else {
      const msgDetails: Message = {
        title,
        speech,
        color: robotColor,
        emotion,
        ...(metadata ? { metadata } : {}),
      };
      createdButton = {
        type: "Message",
        labelColor,
        details: msgDetails,
      };
    }
    buttons[buttonId] = createdButton;

    if (anchor) {
      if (anchorToId.has(anchor)) {
        diagnostics.push({
          lineNumber,
          severity: "warning",
          message: `Duplicate anchor "${anchor}"; later jumps will point to the latest definition.`,
        });
      }
      anchorToId.set(anchor, buttonId);
    }

    if (!inUnlinkedSection) {
      if (parentId === "root") {
        hierarchy.root.push(buttonId);
      } else {
        if (!hierarchy[parentId]) hierarchy[parentId] = [];
        hierarchy[parentId].push(buttonId);
      }
      depthStack.length = depth + 1;
      depthStack[depth] = buttonId;
    }

    const summaryParts: string[] = [
      isLog ? `Log button "${title}"` : `Message button "${title}"`,
    ];
    if (parentTitle) summaryParts.push(`under "${parentTitle}"`);
    if (!isLog) {
      summaryParts.push(`face: ${robotColor} / ${emotion}`);
    }
    summaryParts.push(`label: ${labelColor}`);
    if (speech !== title && !isLog) {
      summaryParts.push(`speaks "${speech}"`);
    }

    lines.push({
      lineNumber,
      raw: rawLine,
      kind: "button",
      depth,
      buttonId,
      button: createdButton,
      parentTitle,
      anchor,
      tokens,
      summary: summaryParts.join(" • "),
    });
  }

  // Resolve `-> #anchor` jumps (supporting both back-edges and forward-references)
  for (const jump of pendingJumps) {
    const targetId = anchorToId.get(jump.anchor);
    if (!targetId) {
      diagnostics.push({
        lineNumber: jump.lineNumber,
        severity: "error",
        message: `Jump target "${jump.anchor}" does not match any #anchor in this template.`,
      });
      continue;
    }
    if (jump.parentId === "root") {
      hierarchy.root.push(targetId);
    } else {
      if (!hierarchy[jump.parentId]) hierarchy[jump.parentId] = [];
      hierarchy[jump.parentId].push(targetId);
    }
    const targetBtn = buttons[targetId];
    const lineEntry = lines[jump.lineIdx];
    if (lineEntry && targetBtn) {
      lineEntry.buttonId = targetId;
      lineEntry.button = targetBtn;
      lineEntry.summary = `Jump to "${targetBtn.details.title}" (${jump.anchor})`;
      const jumpTok = lineEntry.tokens.find((t) => t.kind === "jump");
      if (jumpTok) {
        jumpTok.explanation = `Links to "${targetBtn.details.title}" (${jump.anchor}).`;
      }
    }
  }

  const template: Template = {
    ...(options.id ? { id: options.id } : {}),
    title: parsedTitle,
    ...(options.description ? { description: options.description } : {}),
    buttons,
    hierarchy,
  };

  return { template, diagnostics, lines };
}

/**
 * Parses Peerbots Template Text Format (PTTF) back into a {@link Template}
 * with `buttons`, `hierarchy` (including cycles/shared targets), and diagnostics.
 */
export function parseCodeToTemplate(
  code: string,
  options: ParseTemplateCodeOptions = {},
): ParsedTemplateCodeResult {
  const { template, diagnostics } = analyzeTemplateCode(code, options);
  return { template, diagnostics };
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

  // 1. Inside `[...]` brackets -> colors (label or robot) and emotions
  const lastOpen = lineBeforeCaret.lastIndexOf("[");
  const lastClose = lineBeforeCaret.lastIndexOf("]");
  if (lastOpen > lastClose) {
    const inside = lineBeforeCaret.slice(lastOpen + 1);
    const alreadyHasClosing = lineAfterCaret.trimStart().startsWith("]");
    const suffix = alreadyHasClosing ? "" : "] ";

    if (inside.includes("->")) {
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
    const matchingEmotions = PEERBOTS_EMOTIONS.filter(
      (e) => e !== "Neutral" && e.toLowerCase().includes(query),
    );

    const suggestions: CodeAutocompleteSuggestion[] = [
      ...matchingColors.map((color) => ({
        label: color,
        insertText: `${color}${suffix}`,
        description: `Button color (${color})`,
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
      heading: "Button Color or Emotion (type -> for Robot Color)",
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

  // 3. Emoticon prefix (`:` after bullet/indent/brackets)
  const colonMatch = lineBeforeCaret.match(
    /^([ \t]*(?:[-*!][ \t]+)?(?:#[a-zA-Z0-9_-]+[ \t]+)?(?:\[[^\]]+\][ \t]*)*)(:[a-zA-Z()\\]?)$/,
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

    // Tokenize remainder of line
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
      // Split strings, numbers, booleans, punctuation
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

