import type { TemplateHierarchy } from "./types";

/**
 * Direction in which to shift selected sibling buttons within an ordered list:
 * - `"BACK"`: Moves one slot earlier (toward index `0`).
 * - `"FORWARD"`: Moves one slot later (toward `length - 1`).
 */
export type ReorderDirection = "BACK" | "FORWARD";

function toSelectedSet(
  selectedIds: string | ReadonlySet<string> | readonly string[],
): Set<string> {
  if (typeof selectedIds === "string") {
    return selectedIds ? new Set([selectedIds]) : new Set();
  }
  if (selectedIds instanceof Set) {
    return new Set(selectedIds);
  }
  return new Set(selectedIds as readonly string[]);
}

function reorderSiblingArray(
  currentOrder: readonly string[],
  selected: ReadonlySet<string>,
  direction: ReorderDirection,
): string[] {
  const result = [...currentOrder];
  if (result.length <= 1 || selected.size === 0) {
    return result;
  }

  if (direction === "BACK") {
    for (let i = 0; i < result.length; i++) {
      if (!selected.has(result[i])) continue;
      if (i > 0 && !selected.has(result[i - 1])) {
        const prev = result[i - 1];
        result[i - 1] = result[i];
        result[i] = prev;
      }
    }
    return result;
  }

  if (direction === "FORWARD") {
    for (let i = result.length - 1; i >= 0; i--) {
      if (!selected.has(result[i])) continue;
      if (i < result.length - 1 && !selected.has(result[i + 1])) {
        const next = result[i + 1];
        result[i + 1] = result[i];
        result[i] = next;
      }
    }
    return result;
  }

  return result;
}

/**
 * Moves a single `buttonID` one position `"BACK"` (toward index `0`) or `"FORWARD"`
 * (toward `length - 1`) within `initialOrder` (`app.peerbots.org`-compatible signature).
 */
export function figureOutNewOrder(
  buttonID: string,
  direction: ReorderDirection,
  initialOrder: readonly string[],
): string[];
/**
 * Moves one or more `selectedIds` by one position `"BACK"` or `"FORWARD"` within
 * `currentOrder`, preserving relative order among multi-selected items and pinning
 * contiguous selected blocks when they reach list boundaries.
 */
export function figureOutNewOrder(
  currentOrder: readonly string[],
  selectedIds: ReadonlySet<string> | readonly string[],
  direction: ReorderDirection,
): string[];
export function figureOutNewOrder(
  first: string | readonly string[],
  second: ReorderDirection | ReadonlySet<string> | readonly string[],
  third: readonly string[] | ReorderDirection,
): string[] {
  if (typeof first === "string") {
    const buttonID = first;
    const direction = second as ReorderDirection;
    const initialOrder = third as readonly string[];
    return reorderSiblingArray(
      initialOrder,
      buttonID ? new Set([buttonID]) : new Set(),
      direction,
    );
  }

  const currentOrder = first;
  const selectedIds = second as ReadonlySet<string> | readonly string[];
  const direction = third as ReorderDirection;
  return reorderSiblingArray(
    currentOrder,
    toSelectedSet(selectedIds),
    direction,
  );
}

/**
 * Immutably reorders any `selectedIds` within their respective sibling lists
 * (`root` and every parent button's child array) in a {@link TemplateHierarchy}.
 */
export function reorderHierarchySiblings(
  hierarchy: TemplateHierarchy,
  selectedIds: string | ReadonlySet<string> | readonly string[],
  direction: ReorderDirection,
): TemplateHierarchy {
  const selected = toSelectedSet(selectedIds);
  const nextHierarchy: TemplateHierarchy = {
    root: reorderSiblingArray(
      Array.isArray(hierarchy?.root) ? hierarchy.root : [],
      selected,
      direction,
    ),
  };

  for (const [key, value] of Object.entries(hierarchy ?? {})) {
    if (key === "root" || !Array.isArray(value)) continue;
    nextHierarchy[key] = reorderSiblingArray(value, selected, direction);
  }

  return nextHierarchy;
}
