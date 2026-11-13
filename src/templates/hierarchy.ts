import type {
  Message,
  PeerbotsColor,
  Template,
  TemplateHierarchy,
} from "./types";

/**
 * Entry produced by {@link flattenHierarchy}, pairing a unique button key with its
 * zero-based nesting depth in the template tree (`0` for `"root"` buttons).
 */
export type FlattenedButton = {
  /** Key of the button in `Template.buttons`. */
  buttonId: string;
  /** Zero-based indentation level (`0` for root-level buttons, `1` for their children, etc.). */
  depth: number;
};

/**
 * Normalized `"Message"` button extracted from a {@link Template} in hierarchy-flattened
 * depth-first order for constrained dialogue matchers, button grids, and follow-up prediction.
 */
export interface ExtractedMessageButton {
  /** Key of this button within `Template.buttons` and `Template.hierarchy`. */
  buttonKey: string;
  /** Resolved identifier of the parent template (explicit `Template.id` or slugified title). */
  templateId: string;
  /** Human-readable title of the parent template. */
  templateTitle: string;
  /** Spoken message payload (`title`, `speech`, face `color`, `emotion`, `keywords`, etc.). */
  details: Message;
  /** Controller UI button accent color (distinct from `details.color` shown on the robot face). */
  labelColor: PeerbotsColor;
  /** Ordered keys of direct child buttons in `Template.hierarchy` that are also `"Message"` buttons. */
  childIds: string[];
  /** Resolved flag indicating whether this button acts as a low-confidence fallback response. */
  isFallback: boolean;
}

function slugifyTemplateTitle(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/\.(json|csv)$/i, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "template"
  );
}

/**
 * Flattens a {@link TemplateHierarchy} into a depth-first ordered list of button entries
 * with zero-based nesting depth. Guarantees:
 * - No duplicate button IDs in the output (first-seen wins)
 * - No infinite recursion even if the input contains cycles
 * - Direct children appear immediately after their parent at `depth + 1`
 */
export function flattenHierarchy(
  hierarchy: TemplateHierarchy,
): FlattenedButton[] {
  const result: FlattenedButton[] = [];
  const seen = new Set<string>();

  function walk(ids: string[], depth: number, ancestors: Set<string>) {
    for (const id of ids) {
      if (seen.has(id)) continue;
      if (ancestors.has(id)) continue;

      seen.add(id);
      result.push({ buttonId: id, depth });

      const children = hierarchy[id];
      if (children && children.length > 0) {
        const nextAncestors = new Set(ancestors);
        nextAncestors.add(id);
        walk(children, depth + 1, nextAncestors);
      }
    }
  }

  const rootIds = Array.isArray(hierarchy?.root) ? hierarchy.root : [];
  walk(rootIds, 0, new Set());
  return result;
}

/**
 * Returns the deduplicated list of root-level button IDs from `hierarchy.root` in display order.
 */
export function getRootButtonIds(hierarchy: TemplateHierarchy): string[] {
  if (!Array.isArray(hierarchy?.root)) {
    return [];
  }
  return Array.from(new Set(hierarchy.root));
}

/**
 * Returns the deduplicated list of direct child button IDs for a given `buttonId`
 * (excluding self-references and ignoring `"root"` as a parent button ID).
 */
export function getDirectChildIds(
  hierarchy: TemplateHierarchy,
  buttonId: string,
): string[] {
  if (!buttonId || buttonId === "root") {
    return [];
  }
  const children = hierarchy?.[buttonId];
  if (!Array.isArray(children) || children.length === 0) {
    return [];
  }
  const unique: string[] = [];
  const seen = new Set<string>();
  for (const childId of children) {
    if (childId === buttonId || seen.has(childId)) continue;
    seen.add(childId);
    unique.push(childId);
  }
  return unique;
}

/**
 * Builds a cycle-safe, first-seen-wins parent lookup dictionary mapping each
 * reachable `buttonId` in `hierarchy` to its parent `buttonId` (or `null` for root-level buttons).
 */
export function getParentMap(
  hierarchy: TemplateHierarchy,
): Record<string, string | null> {
  const parentMap: Record<string, string | null> = {};
  const seen = new Set<string>();

  function walk(
    ids: string[],
    parentId: string | null,
    ancestors: Set<string>,
  ) {
    for (const id of ids) {
      if (seen.has(id)) continue;
      if (ancestors.has(id)) continue;

      seen.add(id);
      parentMap[id] = parentId;

      const children = hierarchy[id];
      if (children && children.length > 0) {
        const nextAncestors = new Set(ancestors);
        nextAncestors.add(id);
        walk(children, id, nextAncestors);
      }
    }
  }

  const rootIds = Array.isArray(hierarchy?.root) ? hierarchy.root : [];
  walk(rootIds, null, new Set());
  return parentMap;
}

/**
 * Returns `true` if `buttonId` resolves as a root-level button in `hierarchy`
 * (`depth === 0` in {@link flattenHierarchy}), and `false` otherwise.
 */
export function isRootButton(
  hierarchy: TemplateHierarchy,
  buttonId: string,
): boolean {
  if (!buttonId || !Array.isArray(hierarchy?.root)) {
    return false;
  }
  return getParentMap(hierarchy)[buttonId] === null;
}

function resolveIsFallback(details: Message): boolean {
  if (details.isFallback === true) {
    return true;
  }
  const rawMetaFallback = details.metadata?.isFallback;
  if (rawMetaFallback === 1) {
    return true;
  }
  if (
    typeof rawMetaFallback === "string" &&
    rawMetaFallback.trim().toLowerCase() === "true"
  ) {
    return true;
  }
  return false;
}

/**
 * Extracts all reachable `"Message"` buttons from a {@link Template} in hierarchy-flattened
 * depth-first order (skipping silent `"Log"` buttons), preserving direct `"Message"` child IDs
 * and fallback status for constrained response matching and next-utterance prediction.
 */
export function extractMessageButtons<TRef>(
  template: Template<TRef>,
): ExtractedMessageButton[] {
  const templateTitle = template.title?.trim() || "Untitled Template";
  const templateId =
    template.id?.trim() || slugifyTemplateTitle(templateTitle);
  const flattened = flattenHierarchy(template.hierarchy);
  const extracted: ExtractedMessageButton[] = [];

  for (const { buttonId } of flattened) {
    const button = template.buttons[buttonId];
    if (!button || button.type !== "Message") {
      continue;
    }

    const childIds = getDirectChildIds(template.hierarchy, buttonId).filter(
      (childId) => template.buttons[childId]?.type === "Message",
    );

    extracted.push({
      buttonKey: buttonId,
      templateId,
      templateTitle,
      details: button.details,
      labelColor: button.labelColor,
      childIds,
      isFallback: resolveIsFallback(button.details),
    });
  }

  return extracted;
}
