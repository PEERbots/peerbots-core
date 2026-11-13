import { moveButtonInHierarchy } from "../../../templates/reordering";
import type { Template, TemplateHierarchy } from "../../../templates/types";
import type { PeerbotsControlAction } from "./types";

/**
 * Pure, immutable state reducer that applies a {@link PeerbotsControlAction}
 * (`SAVE`, `MOVE`, `DELETE`) to a canonical Peerbots {@link Template}.
 *
 * - `"SAVE"`: Immutably updates `template.buttons[buttonId]` with `action.newButton`.
 * - `"MOVE"`: Reorders `buttonId` one step backward (`"up"`) or forward (`"down"`)
 *   within its sibling array via {@link moveButtonInHierarchy}.
 * - `"DELETE"`: Removes `buttonId` from `template.buttons` and all parent arrays in
 *   `template.hierarchy`, promoting any direct children of `buttonId` into its parent's
 *   sibling list so surviving child buttons never become orphaned.
 * - `"SELECT"` / `"CLICK"` / `"ADD TO SELECTION"` / `"REMOVE FROM SELECTION"`:
 *   Returns `template` unchanged (handled by UI selection or robot speech state).
 *
 * @param template - Current Peerbots template state.
 * @param buttonId - Target button key in `template.buttons`.
 * @param action - Dispatched control action from `ButtonView`, `TableView`, `FlowView`, or `PeerbotsButtonDisplay`.
 * @returns Updated `Template` (or the original `template` reference when no structural mutation applies).
 */
export function applyControlActionToTemplate<TRef = unknown>(
  template: Template<TRef>,
  buttonId: string,
  action: PeerbotsControlAction,
): Template<TRef> {
  if (!buttonId) {
    return template;
  }

  switch (action.type) {
    case "SAVE": {
      const updated = action.newButton ?? action.newButtonInfo;
      if (!updated) {
        return template;
      }
      return {
        ...template,
        buttons: {
          ...template.buttons,
          [buttonId]: updated,
        },
      };
    }

    case "MOVE": {
      const nextHierarchy = moveButtonInHierarchy(
        template.hierarchy,
        buttonId,
        action.direction === "BACK" ? "up" : "down",
      );
      if (nextHierarchy === template.hierarchy) {
        return template;
      }
      return {
        ...template,
        hierarchy: nextHierarchy,
      };
    }

    case "DELETE": {
      const nextButtons = { ...template.buttons };
      delete nextButtons[buttonId];

      const rawChildren = Array.isArray(template.hierarchy?.[buttonId])
        ? template.hierarchy[buttonId]
        : [];
      const promotedChildren = rawChildren.filter(
        (childId) => childId !== buttonId && Boolean(nextButtons[childId]),
      );

      const replaceOrRemove = (ids: readonly string[]): string[] => {
        const result: string[] = [];
        const seen = new Set<string>();
        for (const id of ids) {
          if (id === buttonId) {
            for (const childId of promotedChildren) {
              if (!seen.has(childId) && !ids.includes(childId)) {
                seen.add(childId);
                result.push(childId);
              }
            }
            continue;
          }
          if (!seen.has(id)) {
            seen.add(id);
            result.push(id);
          }
        }
        return result;
      };

      const rawRoot = Array.isArray(template.hierarchy?.root)
        ? template.hierarchy.root
        : [];
      let buttonWasInParent = rawRoot.includes(buttonId);
      for (const [key, list] of Object.entries(template.hierarchy ?? {})) {
        if (key !== "root" && key !== buttonId && Array.isArray(list)) {
          if (list.includes(buttonId)) {
            buttonWasInParent = true;
          }
        }
      }

      let nextRoot = replaceOrRemove(rawRoot);
      if (!buttonWasInParent && promotedChildren.length > 0) {
        const existing = new Set(nextRoot);
        for (const childId of promotedChildren) {
          if (!existing.has(childId)) {
            existing.add(childId);
            nextRoot = [...nextRoot, childId];
          }
        }
      }

      const nextHierarchy: TemplateHierarchy = {
        root: nextRoot,
      };

      for (const [parentKey, children] of Object.entries(
        template.hierarchy ?? {},
      )) {
        if (
          parentKey === "root" ||
          parentKey === buttonId ||
          !Array.isArray(children)
        ) {
          continue;
        }
        const cleaned = replaceOrRemove(children);
        if (cleaned.length > 0) {
          nextHierarchy[parentKey] = cleaned;
        }
      }

      return {
        ...template,
        buttons: nextButtons,
        hierarchy: nextHierarchy,
      };
    }

    case "CLICK":
    case "SELECT":
    case "ADD TO SELECTION":
    case "REMOVE FROM SELECTION":
    default:
      return template;
  }
}
