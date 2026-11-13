import Dagre from "@dagrejs/dagre";
import { MarkerType, type Edge, type Node } from "@xyflow/react";
import type {
  RobotControlButton,
  Template,
  TemplateHierarchy,
} from "../templates/types";
import type { FlowDirection, PeerbotsFlowNodeData } from "./types";

export type { FlowDirection, PeerbotsFlowNodeData };

const MIN_NODE_WIDTH = 180;
const MAX_NODE_WIDTH = 250;
const NODE_HEIGHT = 56;
const COMPONENT_GAP = 64;
const SINGLETON_GRID_COLS = 4;
const SINGLETON_GAP_X = 28;
const SINGLETON_GAP_Y = 24;

function computeNodeWidth(button: RobotControlButton): number {
  const titleLen = button.details?.title?.length ?? 0;
  const estimated = 92 + titleLen * 7;
  return Math.max(MIN_NODE_WIDTH, Math.min(MAX_NODE_WIDTH, estimated));
}

function dedupeIds(ids: readonly string[] | undefined): string[] {
  if (!Array.isArray(ids)) return [];
  const seen = new Set<string>();
  const result: string[] = [];
  for (const id of ids) {
    if (!id || seen.has(id)) continue;
    seen.add(id);
    result.push(id);
  }
  return result;
}

/**
 * Generates a unique button ID for newly created nodes in `template.buttons`.
 */
export function generateUniqueButtonId(
  template: Template,
  prefix = "btn",
): string {
  const existing = template.buttons ?? {};
  let index = Object.keys(existing).length + 1;
  let candidate = `${prefix}-${index}`;
  while (existing[candidate]) {
    index += 1;
    candidate = `${prefix}-${index}`;
  }
  return candidate;
}

/**
 * Creates a default `"Message"` or `"Log"` button ready for insertion into a `Template`.
 */
export function createDefaultButton(
  type: "Message" | "Log",
  title?: string,
): RobotControlButton {
  if (type === "Log") {
    return {
      type: "Log",
      labelColor: "Purple",
      details: {
        title: title ?? "New User Event",
        details: "",
      },
    };
  }
  return {
    type: "Message",
    labelColor: "Light Blue",
    details: {
      title: title ?? "New Message",
      speech: title ?? "Hello!",
      color: "Light Blue",
      emotion: "Neutral",
    },
  };
}

/**
 * Adds a `sourceId -> targetId` edge to `TemplateHierarchy` (ignoring self-loops and duplicates).
 */
export function addHierarchyConnection(
  hierarchy: TemplateHierarchy,
  sourceId: string,
  targetId: string,
): TemplateHierarchy {
  if (!sourceId || !targetId || sourceId === targetId || sourceId === "root") {
    return hierarchy;
  }
  const existing = dedupeIds(hierarchy?.[sourceId]);
  if (existing.includes(targetId)) {
    return hierarchy;
  }
  return {
    ...hierarchy,
    root: dedupeIds(hierarchy?.root),
    [sourceId]: [...existing, targetId],
  };
}

/**
 * Removes a `sourceId -> targetId` edge from `TemplateHierarchy`.
 */
export function removeHierarchyConnection(
  hierarchy: TemplateHierarchy,
  sourceId: string,
  targetId: string,
): TemplateHierarchy {
  const existing = dedupeIds(hierarchy?.[sourceId]);
  if (!existing.includes(targetId)) {
    return hierarchy;
  }
  const nextChildren = existing.filter((id) => id !== targetId);
  const nextHierarchy: TemplateHierarchy = {
    ...hierarchy,
    root: dedupeIds(hierarchy?.root),
  };
  if (nextChildren.length > 0) {
    nextHierarchy[sourceId] = nextChildren;
  } else {
    delete nextHierarchy[sourceId];
  }
  return nextHierarchy;
}

/**
 * Toggles whether `buttonId` is present in `hierarchy.root`.
 */
export function toggleRootButtonInHierarchy(
  hierarchy: TemplateHierarchy,
  buttonId: string,
): TemplateHierarchy {
  const root = dedupeIds(hierarchy?.root);
  const nextRoot = root.includes(buttonId)
    ? root.filter((id) => id !== buttonId)
    : [...root, buttonId];
  return {
    ...hierarchy,
    root: nextRoot,
  };
}

/**
 * Re-sorts only the `hierarchy` arrays (`root` or `hierarchy[parentId]`) that already
 * contain any `draggedIds`, ordering siblings by their current canvas coordinate
 * (`x` in `"TB"` mode, `y` in `"LR"` mode).
 */
export function reorderHierarchySiblingsFromPositions(
  hierarchy: TemplateHierarchy,
  draggedIds: ReadonlyArray<string>,
  nodePositions: ReadonlyMap<string, { x: number; y: number }>,
  direction: FlowDirection,
): TemplateHierarchy | null {
  if (draggedIds.length === 0) return null;
  const draggedSet = new Set(draggedIds);
  const axis = direction === "TB" ? "x" : "y";

  let changed = false;
  const nextHierarchy: TemplateHierarchy = {
    ...hierarchy,
    root: dedupeIds(hierarchy?.root),
  };

  const sortArrayIfAffected = (ids: string[]): string[] => {
    if (ids.length <= 1 || !ids.some((id) => draggedSet.has(id))) {
      return ids;
    }
    const sorted = [...ids].sort((a, b) => {
      const posA = nodePositions.get(a);
      const posB = nodePositions.get(b);
      if (!posA || !posB) return 0;
      return posA[axis] - posB[axis];
    });
    if (sorted.some((id, idx) => id !== ids[idx])) {
      changed = true;
    }
    return sorted;
  };

  nextHierarchy.root = sortArrayIfAffected(nextHierarchy.root);

  for (const [key, value] of Object.entries(hierarchy ?? {})) {
    if (key === "root" || !Array.isArray(value)) continue;
    const deduped = dedupeIds(value);
    nextHierarchy[key] = sortArrayIfAffected(deduped);
  }

  return changed ? nextHierarchy : null;
}

/**
 * Computes a clean initial canvas position for a newly created node relative to
 * its parent (if any) or the bounding box of existing nodes.
 */
export function computeNextButtonPosition(
  nodes: ReadonlyArray<Node>,
  parentId?: string | null,
  direction: FlowDirection = "TB",
): { x: number; y: number } {
  if (parentId) {
    const parent = nodes.find((n) => n.id === parentId);
    if (parent) {
      return direction === "TB"
        ? { x: parent.position.x + 24, y: parent.position.y + 120 }
        : { x: parent.position.x + 250, y: parent.position.y + 24 };
    }
  }
  if (nodes.length === 0) {
    return { x: 40, y: 40 };
  }
  const maxX = Math.max(...nodes.map((n) => n.position.x));
  const minY = Math.min(...nodes.map((n) => n.position.y));
  return { x: maxX + 240, y: minY };
}

/**
 * Converts a `Template`'s `buttons` and `hierarchy` into `@xyflow/react` Nodes and uniform
 * `smoothstep` Edges using a multi-reference, cycle-aware DAG layout:
 *
 * - **Repeated IDs / Converging DAGs**: Every valid button ID creates one canonical node;
 *   weakly connected components keep converging `root` branches in one Dagre graph.
 * - **Bounded Singleton Grid**: Standalone `root` buttons with zero edges pack into a compact grid.
 * - **Unlinked Safety Zone**: Buttons in `template.buttons` not referenced in `hierarchy` are still
 *   rendered in an `"Unlinked"` staging row so disconnecting an edge never hides a button.
 */
export function templateToFlowElements(
  template: Template,
  direction: FlowDirection = "TB",
): {
  nodes: Node<PeerbotsFlowNodeData>[];
  edges: Edge[];
} {
  const buttons = template.buttons ?? {};
  const hierarchy = template.hierarchy ?? { root: [] };
  const rootIds = dedupeIds(hierarchy.root).filter((id) => Boolean(buttons[id]));
  const rootSet = new Set(rootIds);

  // 1. Collect all valid directed edges and adjacency sets
  const edges: Edge[] = [];
  const seenEdges = new Set<string>();
  const outgoing = new Map<string, string[]>();
  const undirectedAdj = new Map<string, Set<string>>();

  const ensureAdj = (id: string) => {
    if (!undirectedAdj.has(id)) undirectedAdj.set(id, new Set());
    if (!outgoing.has(id)) outgoing.set(id, []);
  };

  for (const id of Object.keys(buttons)) {
    ensureAdj(id);
  }

  for (const [parentId, rawChildIds] of Object.entries(hierarchy)) {
    if (parentId === "root" || !buttons[parentId]) continue;
    const childIds = dedupeIds(rawChildIds).filter(
      (childId) => childId !== parentId && Boolean(buttons[childId]),
    );
    outgoing.set(parentId, childIds);
    for (const childId of childIds) {
      ensureAdj(parentId);
      ensureAdj(childId);
      undirectedAdj.get(parentId)!.add(childId);
      undirectedAdj.get(childId)!.add(parentId);

      const edgeId = `e-${parentId}-${childId}`;
      if (!seenEdges.has(edgeId)) {
        seenEdges.add(edgeId);
        edges.push({
          id: edgeId,
          source: parentId,
          target: childId,
          type: "smoothstep",
          markerEnd: { type: MarkerType.ArrowClosed },
        });
      }
    }
  }

  // 2. Compute reachability from hierarchy.root (marks true orphan/unlinked buttons)
  const reachableFromRoot = new Set<string>();
  const reachQueue = [...rootIds];
  while (reachQueue.length > 0) {
    const curr = reachQueue.shift()!;
    if (reachableFromRoot.has(curr)) continue;
    reachableFromRoot.add(curr);
    for (const next of outgoing.get(curr) ?? []) {
      if (!reachableFromRoot.has(next)) {
        reachQueue.push(next);
      }
    }
  }

  // 3. Collect all valid button IDs in canonical display order (root BFS first, then remaining keys)
  const orderedIds: string[] = [];
  const visitedOrder = new Set<string>();

  const dfsOrder = (id: string) => {
    if (visitedOrder.has(id) || !buttons[id]) return;
    visitedOrder.add(id);
    orderedIds.push(id);
    for (const childId of outgoing.get(id) ?? []) {
      dfsOrder(childId);
    }
  };

  for (const rId of rootIds) {
    dfsOrder(rId);
  }
  for (const key of Object.keys(buttons)) {
    dfsOrder(key);
  }

  if (orderedIds.length === 0) {
    return { nodes: [], edges: [] };
  }

  // 4. Build Node objects
  const nodeMap = new Map<string, Node<PeerbotsFlowNodeData>>();
  const nodeWidths = new Map<string, number>();

  for (const id of orderedIds) {
    const button = buttons[id];
    const width = computeNodeWidth(button);
    nodeWidths.set(id, width);
    nodeMap.set(id, {
      id,
      type: "peerbotsButton",
      position: { x: 0, y: 0 },
      initialWidth: width,
      initialHeight: NODE_HEIGHT,
      data: {
        button,
        buttonId: id,
        direction,
        isRoot: rootSet.has(id),
        isUnlinked: !reachableFromRoot.has(id),
      },
    });
  }

  // 5. Partition into Weakly Connected Components vs. Root Singletons vs. Unlinked Singletons
  const visitedComp = new Set<string>();
  const connectedComponents: string[][] = [];
  const rootSingletons: string[] = [];
  const unlinkedSingletons: string[] = [];

  for (const id of orderedIds) {
    if (visitedComp.has(id)) continue;
    const neighbors = undirectedAdj.get(id);
    if (!neighbors || neighbors.size === 0) {
      visitedComp.add(id);
      if (rootSet.has(id)) {
        rootSingletons.push(id);
      } else {
        unlinkedSingletons.push(id);
      }
      continue;
    }

    // BFS weakly connected component, preserving orderedIds order inside component
    const compSet = new Set<string>();
    const q = [id];
    while (q.length > 0) {
      const curr = q.shift()!;
      if (compSet.has(curr)) continue;
      compSet.add(curr);
      visitedComp.add(curr);
      for (const adj of undirectedAdj.get(curr) ?? []) {
        if (!compSet.has(adj)) q.push(adj);
      }
    }
    const compOrdered = orderedIds.filter((oid) => compSet.has(oid));
    connectedComponents.push(compOrdered);
  }

  // 6. Layout each connected component with Dagre & pack components cleanly
  let cursorX = 20;
  let cursorY = 20;
  let maxRowBottom = 20;

  for (const compIds of connectedComponents) {
    const compSet = new Set(compIds);
    const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
    g.setGraph({
      rankdir: direction,
      nodesep: 44,
      ranksep: 72,
      marginx: 0,
      marginy: 0,
      acyclicer: "greedy",
    });

    for (const id of compIds) {
      g.setNode(id, {
        width: nodeWidths.get(id) ?? MIN_NODE_WIDTH,
        height: NODE_HEIGHT,
      });
    }

    for (const edge of edges) {
      if (compSet.has(edge.source) && compSet.has(edge.target)) {
        g.setEdge(edge.source, edge.target);
      }
    }

    Dagre.layout(g);

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const id of compIds) {
      const dn = g.node(id);
      const w = nodeWidths.get(id) ?? MIN_NODE_WIDTH;
      if (!dn) continue;
      const left = dn.x - w / 2;
      const top = dn.y - NODE_HEIGHT / 2;
      minX = Math.min(minX, left);
      minY = Math.min(minY, top);
      maxX = Math.max(maxX, left + w);
      maxY = Math.max(maxY, top + NODE_HEIGHT);
    }

    for (const id of compIds) {
      const dn = g.node(id);
      const w = nodeWidths.get(id) ?? MIN_NODE_WIDTH;
      const node = nodeMap.get(id);
      if (!dn || !node) continue;
      node.position = {
        x: cursorX + (dn.x - w / 2 - minX),
        y: cursorY + (dn.y - NODE_HEIGHT / 2 - minY),
      };
    }

    const compW = Number.isFinite(maxX - minX) ? maxX - minX : MIN_NODE_WIDTH;
    const compH = Number.isFinite(maxY - minY) ? maxY - minY : NODE_HEIGHT;

    if (direction === "TB") {
      cursorX += compW + COMPONENT_GAP;
      maxRowBottom = Math.max(maxRowBottom, cursorY + compH);
    } else {
      cursorY += compH + COMPONENT_GAP;
      maxRowBottom = Math.max(maxRowBottom, cursorY);
    }
  }

  // 7. Pack standalone root singletons into a bounded multi-column grid
  const layoutSingletonGroup = (ids: string[], startY: number): number => {
    if (ids.length === 0) return startY;
    const cols = Math.min(SINGLETON_GRID_COLS, Math.max(1, ids.length));
    const colWidth = MAX_NODE_WIDTH + SINGLETON_GAP_X;
    let maxYUsed = startY;
    ids.forEach((id, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const node = nodeMap.get(id);
      if (!node) return;
      const x = 20 + col * colWidth;
      const y = startY + row * (NODE_HEIGHT + SINGLETON_GAP_Y);
      node.position = { x, y };
      maxYUsed = Math.max(maxYUsed, y + NODE_HEIGHT);
    });
    return maxYUsed + COMPONENT_GAP;
  };

  let nextSectionY =
    connectedComponents.length > 0 ? maxRowBottom + COMPONENT_GAP : 20;
  nextSectionY = layoutSingletonGroup(rootSingletons, nextSectionY);
  layoutSingletonGroup(unlinkedSingletons, nextSectionY);

  return {
    nodes: orderedIds.map((id) => nodeMap.get(id)!),
    edges,
  };
}
