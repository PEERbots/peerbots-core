import type {
  RobotControlButton,
  TemplateHierarchy,
} from "../../../templates/types";

export interface FlattenedTableEntry {
  buttonId: string;
  button: RobotControlButton;
  depth: number;
  isFirstSibling: boolean;
  isLastSibling: boolean;
}

/**
 * Entry emitted to {@link TableViewProps.onBatchSave} during column-level Apply-All updates.
 */
export interface TableViewBatchSaveEntry {
  /** Target button identifier in `template.buttons`. */
  buttonId: string;
  /** Updated button value to persist. */
  button: RobotControlButton;
}

/**
 * Flattens a template hierarchy while tracking sibling boundaries so
 * `Move Back` and `Move Forward` actions are accurately enabled/disabled.
 */
export function flattenTemplateForTable(
  hierarchy: TemplateHierarchy,
  buttons: Record<string, RobotControlButton>,
): FlattenedTableEntry[] {
  const result: FlattenedTableEntry[] = [];
  const seen = new Set<string>();

  function walk(ids: string[], depth: number, ancestors: Set<string>) {
    const validSiblingIds: string[] = [];
    const localSeen = new Set<string>();
    for (const id of ids) {
      if (seen.has(id) || localSeen.has(id) || ancestors.has(id)) continue;
      if (!buttons[id]) continue;
      localSeen.add(id);
      validSiblingIds.push(id);
    }

    validSiblingIds.forEach((id, siblingIdx) => {
      if (seen.has(id)) return;
      seen.add(id);

      result.push({
        buttonId: id,
        button: buttons[id],
        depth,
        isFirstSibling: siblingIdx === 0,
        isLastSibling: siblingIdx === validSiblingIds.length - 1,
      });

      const children = hierarchy[id];
      if (Array.isArray(children) && children.length > 0) {
        const nextAncestors = new Set(ancestors);
        nextAncestors.add(id);
        walk(children, depth + 1, nextAncestors);
      }
    });
  }

  const rootIds = Array.isArray(hierarchy?.root) ? hierarchy.root : [];
  walk(rootIds, 0, new Set());
  return result;
}
