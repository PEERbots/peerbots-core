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

  tokens.push({
    kind: "bullet",
    text: "- ",
    explanation:
      depth === 0
        ? "Top-level (root) button."
        : `Child button under "${parentTitle ?? "parent"}".`,
  });

  if (anchor) {
    tokens.push({
      kind: "anchor",
      text: `${anchor} `,
      explanation: `Anchor "${anchor}": other lines can jump here using "-> ${anchor}".`,
    });
  }

  const isLog = button.type === "Log";
  if (isLog) {
    tokens.push({
      kind: "type",
      text: "[Log] ",
      labelColor: button.labelColor,
      explanation:
        'Log button: records a user/session event (dashed style with zap icon) without robot speech.',
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
 * Parses Peerbots Template Text Format (PTTF) back into a {@link Template}
 * with `buttons`, `hierarchy` (including cycles/shared targets), and diagnostics.
 */
export function parseCodeToTemplate(
  code: string,
  options: ParseTemplateCodeOptions = {},
): ParsedTemplateCodeResult {
  const defaultColor = options.defaultColor ?? DEFAULT_COLOR;
  const diagnostics: CodeDiagnostic[] = [];
  const buttons: Record<string, RobotControlButton> = {};
  const hierarchy: TemplateHierarchy = { root: [] };

  let parsedTitle = options.title ?? "Untitled Template";
  let sawHeaderTitle = false;
  let inUnlinkedSection = false;
  let idCounter = 1;

  const anchorToId = new Map<string, string>();
  const pendingJumps: {
    parentId: string | "root";
    anchor: string;
    lineNumber: number;
  }[] = [];

  // Stack of active ancestor button IDs by depth: stack[depth] = buttonId
  const depthStack: string[] = [];

  const rawLines = code.split(/\r?\n/);

  for (let idx = 0; idx < rawLines.length; idx += 1) {
    const lineNumber = idx + 1;
    const rawLine = rawLines[idx];
    const trimmed = rawLine.trim();

    if (!trimmed) continue;

    // Comment lines
    if (trimmed.startsWith("//")) {
      const commentBody = trimmed.slice(2).trim();
      if (!sawHeaderTitle && commentBody) {
        parsedTitle = commentBody;
        sawHeaderTitle = true;
      }
      continue;
    }

    // Section headers
    if (trimmed.startsWith("##")) {
      const sectionName = trimmed.slice(2).trim().toLowerCase();
      inUnlinkedSection = sectionName === "unlinked";
      depthStack.length = 0;
      continue;
    }

    // Measure indentation (2 spaces or 1 tab = 1 depth level)
    const leadingMatch = rawLine.match(/^([ \t]*)/);
    const leadingRaw = leadingMatch ? leadingMatch[1].replace(/\t/g, "  ") : "";
    let depth = Math.floor(leadingRaw.length / 2);

    // Strip optional bullet prefix `- ` or `* `
    let content = trimmed;
    if (content.startsWith("- ") || content.startsWith("* ")) {
      content = content.slice(2).trim();
    } else if (content === "-" || content === "*") {
      continue;
    }

    if (!content) continue;

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

    // Check for jump line: `-> #anchor`
    if (content.startsWith("->")) {
      const targetRef = content.slice(2).trim();
      const anchorKey = targetRef.startsWith("#")
        ? targetRef.toLowerCase()
        : `#${targetRef.toLowerCase()}`;
      pendingJumps.push({ parentId, anchor: anchorKey, lineNumber });
      continue;
    }

    // Optional leading `#anchor`
    let anchor: string | undefined;
    const anchorMatch = content.match(/^(#[a-zA-Z0-9_-]+)\s+(.*)$/);
    if (anchorMatch) {
      anchor = anchorMatch[1].toLowerCase();
      content = anchorMatch[2].trim();
    }

    let isLog = false;
    let labelColor: PeerbotsColor = defaultColor;
    let robotColor: PeerbotsColor = defaultColor;
    let emotion: Emotion = DEFAULT_EMOTION;

    // Parse leading bracket tokens `[...]` in any order
    while (content.startsWith("[")) {
      const closeIdx = content.indexOf("]");
      if (closeIdx <= 0) break;
      const inner = content.slice(1, closeIdx).trim();
      const lower = inner.toLowerCase();

      if (lower === "log") {
        isLog = true;
      } else if (EMOTION_LOOKUP.has(lower)) {
        emotion = EMOTION_LOOKUP.get(lower)!;
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
        } else {
          diagnostics.push({
            lineNumber,
            severity: "warning",
            message: `Unrecognized bracket token "[${inner}]" ignored.`,
          });
        }
      }

      content = content.slice(closeIdx + 1).trim();
    }

    // Parse optional leading ASCII emoticon (`:)`, `:(`, etc.)
    for (const { prefix, emotion: mappedEmotion } of EXTRA_EMOTION_PREFIXES) {
      if (content.startsWith(prefix)) {
        emotion = mappedEmotion;
        content = content.slice(prefix.length).trim();
        break;
      }
    }

    // Parse optional trailing `{ ... }` metadata
    let metadata: MetaData | undefined;
    if (content.endsWith("}")) {
      const openBrace = content.lastIndexOf("{");
      if (openBrace > 0) {
        const candidate = content.slice(openBrace);
        const parsedMeta = parseMetadataBlock(candidate);
        if (parsedMeta) {
          metadata = parsedMeta;
          content = content.slice(0, openBrace).trim();
        }
      }
    }

    // Parse Title | Speech (or fallback Title: Speech)
    let title = content;
    let speech = content;
    const pipeIdx = content.indexOf("|");
    if (pipeIdx > 0) {
      title = content.slice(0, pipeIdx).trim();
      const rhs = content.slice(pipeIdx + 1).trim();
      speech = rhs.length > 0 ? rhs : title;
    } else {
      const colonIdx = content.indexOf(":");
      if (colonIdx > 0) {
        const lhs = content.slice(0, colonIdx).trim();
        const rhs = content.slice(colonIdx + 1).trim();
        if (lhs.length > 0 && rhs.length > 0) {
          title = lhs;
          speech = rhs;
        }
      }
    }

    const buttonId = String(idCounter);
    idCounter += 1;

    if (isLog) {
      const logDetails: LoggedEvent = {
        title,
        ...(speech !== title ? { details: speech } : {}),
        ...(metadata ? { metadata } : {}),
      };
      buttons[buttonId] = {
        type: "Log",
        labelColor,
        details: logDetails,
      };
    } else {
      const msgDetails: Message = {
        title,
        speech,
        color: robotColor,
        emotion,
        ...(metadata ? { metadata } : {}),
      };
      buttons[buttonId] = {
        type: "Message",
        labelColor,
        details: msgDetails,
      };
    }

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
  }

  const template: Template = {
    ...(options.id ? { id: options.id } : {}),
    title: parsedTitle,
    ...(options.description ? { description: options.description } : {}),
    buttons,
    hierarchy,
  };

  return { template, diagnostics };
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

