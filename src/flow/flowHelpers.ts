import Dagre from "@dagrejs/dagre";
import { MarkerType, type Edge, type Node } from "@xyflow/react";
import type { Template } from "../templates/types";
import type { FlowDirection, PeerbotsFlowNodeData } from "./types";

export type { FlowDirection, PeerbotsFlowNodeData };

const NODE_WIDTH = 180;
const NODE_HEIGHT = 60;

/**
 * Converts a Template's hierarchy and buttons into `@xyflow/react` Nodes and Edges,
 * using Dagre for automatic graph layout.
 *
 * Root-level buttons are placed as nodes. Edges come strictly from hierarchy
 * sub-keys (parent -> child relationships), safely skipping any edge whose
 * `parentId` or `childId` is missing from `template.buttons`.
 */
export function templateToFlowElements(
  template: Template,
  direction: FlowDirection = "TB",
): {
  nodes: Node<PeerbotsFlowNodeData>[];
  edges: Edge[];
} {
  const nodes: Node<PeerbotsFlowNodeData>[] = [];
  const edges: Edge[] = [];
  const seen = new Set<string>();
  const seenEdges = new Set<string>();

  const buttons = template.buttons ?? {};
  const hierarchy = template.hierarchy ?? { root: [] };
  const rootIds = Array.isArray(hierarchy.root) ? hierarchy.root : [];

  // --- Collect all nodes from root ---
  for (const buttonId of rootIds) {
    if (seen.has(buttonId)) continue;
    const button = buttons[buttonId];
    if (!button) continue;
    seen.add(buttonId);

    nodes.push({
      id: buttonId,
      type: "peerbotsButton",
      position: { x: 0, y: 0 },
      initialWidth: NODE_WIDTH,
      initialHeight: NODE_HEIGHT,
      data: {
        button,
        buttonId,
      },
    });
  }

  // --- Collect child nodes and edges from hierarchy sub-keys ---
  for (const [parentId, childIds] of Object.entries(hierarchy)) {
    if (parentId === "root" || !Array.isArray(childIds)) continue;

    const parentButton = buttons[parentId];
    if (!parentButton) continue;

    for (const childId of childIds) {
      const childButton = buttons[childId];
      if (!childButton) continue;

      // Ensure parent node is registered even if omitted from hierarchy.root or visited before its own parent
      if (!seen.has(parentId)) {
        seen.add(parentId);
        nodes.push({
          id: parentId,
          type: "peerbotsButton",
          position: { x: 0, y: 0 },
          initialWidth: NODE_WIDTH,
          initialHeight: NODE_HEIGHT,
          data: {
            button: parentButton,
            buttonId: parentId,
          },
        });
      }

      // Add child node if not already placed
      if (!seen.has(childId)) {
        seen.add(childId);
        nodes.push({
          id: childId,
          type: "peerbotsButton",
          position: { x: 0, y: 0 },
          initialWidth: NODE_WIDTH,
          initialHeight: NODE_HEIGHT,
          data: {
            button: childButton,
            buttonId: childId,
          },
        });
      }

      // Parent -> child edge (deduplicated by edge ID)
      const edgeId = `e-${parentId}-${childId}`;
      if (!seenEdges.has(edgeId)) {
        seenEdges.add(edgeId);
        edges.push({
          id: edgeId,
          source: parentId,
          target: childId,
          type: "straight",
          markerEnd: { type: MarkerType.ArrowClosed },
        });
      }
    }
  }

  // --- Apply Dagre layout ---
  if (nodes.length > 0) {
    const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
    g.setGraph({
      rankdir: direction,
      nodesep: 40,
      ranksep: 60,
      marginx: 20,
      marginy: 20,
    });

    for (const node of nodes) {
      g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
    }

    for (const edge of edges) {
      g.setEdge(edge.source, edge.target);
    }

    Dagre.layout(g);

    // Apply computed positions (Dagre returns center coords, xyflow uses top-left)
    for (const node of nodes) {
      const dagreNode = g.node(node.id);
      if (dagreNode) {
        node.position = {
          x: dagreNode.x - NODE_WIDTH / 2,
          y: dagreNode.y - NODE_HEIGHT / 2,
        };
      }
    }
  }

  return { nodes, edges };
}
