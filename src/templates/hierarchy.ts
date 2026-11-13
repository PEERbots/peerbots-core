import type {
  Message,
  PeerbotsColor,
  Template,
  TemplateHierarchy,
} from "./types";

export type FlattenedButton = {
  buttonId: string;
  depth: number;
};

export interface ExtractedMessageButton {
  buttonKey: string;
  templateId: string;
  templateTitle: string;
  details: Message;
  labelColor: PeerbotsColor;
  childIds: string[];
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
 * Flattens a Template hierarchy into an ordered list of button entries with
 * depth info. Guarantees:
 *   - No duplicate IDs in the output
 *   - No infinite recursion from cycles
 *   - Children appear directly after their parent, indented one level deeper
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
 * Returns the deduplicated list of root-level button IDs in a hierarchy.
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
 * reachable `buttonId` in the hierarchy to its parent `buttonId` (or `null` for root-level buttons).
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
 * Returns `true` if `buttonId` is resolved as a root-level button in `hierarchy`
 * (`depth === 0` in `flattenHierarchy`), and `false` otherwise.
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
 * Extracts all reachable `"Message"` buttons from a `Template` in hierarchy-flattened
 * DFS order, preserving direct child IDs and fallback status for response matching
 * and hierarchy-aware next-utterance prediction.
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
