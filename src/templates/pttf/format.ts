import type {
  LoggedEvent,
  Message,
  MetaData,
  PeerbotsColor,
  RobotControlButton,
  Template,
  TemplateHierarchy,
} from "../types";
import { DEFAULT_COLOR, DEFAULT_EMOTION, EMOTION_TO_PREFIX } from "./constants";
import type {
  FormatTemplateCodeOptions,
  FormattedCodeLine,
  FormattedCodeToken,
  FormattedTemplateCode,
} from "./types";

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
