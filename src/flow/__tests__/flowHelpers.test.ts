import { describe, expect, it } from "vitest";
import type { RobotControlButton, Template } from "../../templates/types";
import {
  addHierarchyConnection,
  removeHierarchyConnection,
  reorderHierarchySiblingsFromPositions,
  templateToFlowElements,
  toggleRootButtonInHierarchy,
} from "../flowHelpers";

const makeButton = (title: string): RobotControlButton => ({
  type: "Message",
  labelColor: "Light Blue",
  details: {
    title,
    speech: title,
    color: "Light Blue",
    emotion: "Neutral",
  },
});

describe("templateToFlowElements", () => {
  it("returns empty arrays for a template with no buttons", () => {
    const template: Template = {
      title: "Empty",
      buttons: {},
      hierarchy: { root: [] },
    };
    const { nodes, edges } = templateToFlowElements(template);
    expect(nodes).toHaveLength(0);
    expect(edges).toHaveLength(0);
  });

  it("creates nodes but no edges for a flat root-only hierarchy", () => {
    const template: Template = {
      title: "Flat",
      buttons: {
        a: makeButton("A"),
        b: makeButton("B"),
        c: makeButton("C"),
      },
      hierarchy: { root: ["a", "b", "c"] },
    };
    const { nodes, edges } = templateToFlowElements(template);

    expect(nodes).toHaveLength(3);
    expect(nodes[0].id).toBe("a");
    expect(nodes[1].id).toBe("b");
    expect(nodes[2].id).toBe("c");
    expect(edges).toHaveLength(0);
  });

  it("creates edges only from hierarchy sub-keys", () => {
    const template: Template = {
      title: "Nested",
      buttons: {
        root1: makeButton("Root 1"),
        child1: makeButton("Child 1"),
        child2: makeButton("Child 2"),
      },
      hierarchy: {
        root: ["root1"],
        root1: ["child1", "child2"],
      },
    };
    const { nodes, edges } = templateToFlowElements(template);

    expect(nodes).toHaveLength(3);
    expect(edges).toHaveLength(2);
    expect(edges).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ source: "root1", target: "child1" }),
        expect.objectContaining({ source: "root1", target: "child2" }),
      ]),
    );
  });

  it("uses peerbotsButton node type for all nodes", () => {
    const template: Template = {
      title: "Types",
      buttons: { x: makeButton("X") },
      hierarchy: { root: ["x"] },
    };
    const { nodes } = templateToFlowElements(template);
    expect(nodes[0].type).toBe("peerbotsButton");
  });

  it("uses uniform smoothstep edge type with arrow markers", () => {
    const template: Template = {
      title: "EdgeType",
      buttons: {
        a: makeButton("A"),
        b: makeButton("B"),
      },
      hierarchy: { root: ["a"], a: ["b"] },
    };
    const { edges } = templateToFlowElements(template);
    expect(edges).toHaveLength(1);
    expect(edges[0].type).toBe("smoothstep");
    expect(edges[0].markerEnd).toBeDefined();
  });

  describe("TB direction (default)", () => {
    it("positions parent above children", () => {
      const template: Template = {
        title: "TB-children",
        buttons: {
          p: makeButton("Parent"),
          c1: makeButton("Child 1"),
          c2: makeButton("Child 2"),
        },
        hierarchy: { root: ["p"], p: ["c1", "c2"] },
      };
      const { nodes } = templateToFlowElements(template, "TB");
      const parent = nodes.find((n) => n.id === "p")!;
      const child1 = nodes.find((n) => n.id === "c1")!;
      const child2 = nodes.find((n) => n.id === "c2")!;

      expect(parent.position.y).toBeLessThan(child1.position.y);
      expect(parent.position.y).toBeLessThan(child2.position.y);
    });
  });

  describe("LR direction", () => {
    it("positions parent to the left of children", () => {
      const template: Template = {
        title: "LR-children",
        buttons: {
          p: makeButton("Parent"),
          c1: makeButton("Child 1"),
          c2: makeButton("Child 2"),
        },
        hierarchy: { root: ["p"], p: ["c1", "c2"] },
      };
      const { nodes } = templateToFlowElements(template, "LR");
      const parent = nodes.find((n) => n.id === "p")!;
      const child1 = nodes.find((n) => n.id === "c1")!;
      const child2 = nodes.find((n) => n.id === "c2")!;

      expect(parent.position.x).toBeLessThan(child1.position.x);
      expect(parent.position.x).toBeLessThan(child2.position.x);
    });
  });

  it("does not create duplicate nodes", () => {
    const template: Template = {
      title: "Dedup",
      buttons: {
        a: makeButton("A"),
        b: makeButton("B"),
      },
      hierarchy: {
        root: ["a", "b"],
        a: ["b"],
      },
    };
    const { nodes } = templateToFlowElements(template);
    const ids = nodes.map((n) => n.id);
    expect(ids).toEqual([...new Set(ids)]);
    expect(nodes).toHaveLength(2);
  });

  it("does not produce duplicate edge IDs", () => {
    const template: Template = {
      title: "NoDupEdges",
      buttons: {
        a: makeButton("A"),
        b: makeButton("B"),
        c: makeButton("C"),
      },
      hierarchy: {
        root: ["a", "b", "c"],
        a: ["b", "b"],
      },
    };
    const { edges } = templateToFlowElements(template);
    const edgeIds = edges.map((e) => e.id);
    expect(edgeIds).toEqual([...new Set(edgeIds)]);
    expect(edges).toHaveLength(1);
    expect(edges[0]).toMatchObject({ source: "a", target: "b" });
  });

  it("assigns valid positions to all nodes", () => {
    const template: Template = {
      title: "Positions",
      buttons: {
        a: makeButton("A"),
        b: makeButton("B"),
        c: makeButton("C"),
      },
      hierarchy: {
        root: ["a"],
        a: ["b", "c"],
      },
    };
    const { nodes } = templateToFlowElements(template);
    for (const node of nodes) {
      expect(typeof node.position.x).toBe("number");
      expect(typeof node.position.y).toBe("number");
      expect(Number.isFinite(node.position.x)).toBe(true);
      expect(Number.isFinite(node.position.y)).toBe(true);
    }
  });

  it("handles deep chains correctly", () => {
    const template: Template = {
      title: "DeepChain",
      buttons: {
        a: makeButton("A"),
        b: makeButton("B"),
        c: makeButton("C"),
        d: makeButton("D"),
      },
      hierarchy: {
        root: ["a"],
        a: ["b"],
        b: ["c"],
        c: ["d"],
      },
    };
    const { nodes, edges } = templateToFlowElements(template, "TB");

    expect(nodes).toHaveLength(4);
    expect(edges).toHaveLength(3);

    const a = nodes.find((n) => n.id === "a")!;
    const b = nodes.find((n) => n.id === "b")!;
    const c = nodes.find((n) => n.id === "c")!;
    const d = nodes.find((n) => n.id === "d")!;

    expect(a.position.y).toBeLessThan(b.position.y);
    expect(b.position.y).toBeLessThan(c.position.y);
    expect(c.position.y).toBeLessThan(d.position.y);
  });

  describe("orphan and incomplete button map guards", () => {
    it("skips edges when parentId or childId is missing from template.buttons without crashing Dagre", () => {
      const template: Template = {
        title: "OrphanEdges",
        buttons: {
          validRoot: makeButton("Valid Root"),
          validChild: makeButton("Valid Child"),
        },
        hierarchy: {
          root: ["validRoot", "missingRoot"],
          validRoot: ["validChild", "missingChild"],
          missingParent: ["validChild", "missingChild"],
        },
      };

      const { nodes, edges } = templateToFlowElements(template, "TB");
      expect(nodes.map((n) => n.id)).toEqual(["validRoot", "validChild"]);
      expect(edges).toHaveLength(1);
      expect(edges[0]).toMatchObject({
        id: "e-validRoot-validChild",
        source: "validRoot",
        target: "validChild",
      });
      for (const node of nodes) {
        expect(Number.isFinite(node.position.x)).toBe(true);
        expect(Number.isFinite(node.position.y)).toBe(true);
      }
    });

    it("handles hierarchy sub-keys visited in reverse order or unrooted parent nodes", () => {
      const template: Template = {
        title: "OutOfOrderSubKeys",
        buttons: {
          a: makeButton("A"),
          b: makeButton("B"),
          c: makeButton("C"),
        },
        hierarchy: {
          root: ["a"],
          b: ["c"],
          a: ["b"],
        },
      };

      const { nodes, edges } = templateToFlowElements(template, "TB");
      expect(nodes).toHaveLength(3);
      expect(edges).toHaveLength(2);
      for (const node of nodes) {
        expect(Number.isFinite(node.position.x)).toBe(true);
        expect(Number.isFinite(node.position.y)).toBe(true);
      }
    });

    it("preserves unlinked buttons in template.buttons as isUnlinked instead of dropping them", () => {
      const template: Template = {
        title: "UnlinkedSafety",
        buttons: {
          root1: makeButton("Root 1"),
          orphan: makeButton("Orphan Button"),
        },
        hierarchy: { root: ["root1"] },
      };

      const { nodes, edges } = templateToFlowElements(template, "TB");
      expect(edges).toHaveLength(0);
      expect(nodes).toHaveLength(2);
      const rootNode = nodes.find((n) => n.id === "root1")!;
      const orphanNode = nodes.find((n) => n.id === "orphan")!;
      expect(rootNode.data.isRoot).toBe(true);
      expect(rootNode.data.isUnlinked).toBe(false);
      expect(orphanNode.data.isRoot).toBe(false);
      expect(orphanNode.data.isUnlinked).toBe(true);
    });
  });

  describe("multi-reference DAGs, cycles, singleton packing, and authoring helpers", () => {
    it("handles converging root branches, dual root+child membership, and retry loops cleanly", () => {
      const template: Template = {
        title: "ConvergingDAG",
        buttons: {
          r1: makeButton("Ask Question"),
          r2: makeButton("Quick Praise"),
          hint: makeButton("Give Hint"),
          praise: makeButton("Great Job!"),
        },
        hierarchy: {
          root: ["r1", "r2", "praise"],
          r1: ["hint", "praise"],
          hint: ["r1"], // retry cycle back to r1
          r2: ["praise"], // second parent converging on praise
        },
      };

      const { nodes, edges } = templateToFlowElements(template, "TB");
      expect(nodes).toHaveLength(4);
      expect(edges).toHaveLength(4);
      const r1 = nodes.find((n) => n.id === "r1")!;
      const praise = nodes.find((n) => n.id === "praise")!;
      // Shared root+child button "praise" still flows downstream below its parent r1
      expect(r1.position.y).toBeLessThan(praise.position.y);
      expect(praise.data.isRoot).toBe(true);
    });

    it("packs many standalone root singletons into a bounded multi-column grid", () => {
      const buttons: Record<string, RobotControlButton> = {};
      const root: string[] = [];
      for (let i = 1; i <= 8; i++) {
        const id = `s-${i}`;
        buttons[id] = makeButton(`Button ${i}`);
        root.push(id);
      }
      const { nodes } = templateToFlowElements(
        { title: "Grid", buttons, hierarchy: { root } },
        "TB",
      );
      const uniqueY = new Set(nodes.map((n) => n.position.y));
      expect(uniqueY.size).toBe(2); // 8 singletons in 4 columns = 2 rows
    });

    it("reorders only affected hierarchy sibling arrays by canvas axis on drag", () => {
      const hierarchy = {
        root: ["a", "b", "c"],
        a: ["x", "y"],
      };
      const positions = new Map([
        ["a", { x: 100, y: 0 }],
        ["b", { x: 400, y: 0 }],
        ["c", { x: 250, y: 0 }], // dragged c between a and b
        ["x", { x: 0, y: 120 }],
        ["y", { x: 200, y: 120 }],
      ]);

      const updated = reorderHierarchySiblingsFromPositions(
        hierarchy,
        ["c"],
        positions,
        "TB",
      );
      expect(updated?.root).toEqual(["a", "c", "b"]);
      expect(updated?.a).toEqual(["x", "y"]);

      expect(
        reorderHierarchySiblingsFromPositions(hierarchy, ["c"], positions, "TB"),
      ).not.toBeNull();
    });

    it("adds, removes, and toggles root connections immutably", () => {
      const base = { root: ["a"], a: ["b"] };
      const added = addHierarchyConnection(base, "a", "c");
      expect(added.a).toEqual(["b", "c"]);
      expect(addHierarchyConnection(added, "a", "a")).toBe(added); // self-loop blocked
      expect(addHierarchyConnection(added, "a", "c")).toBe(added); // dup blocked

      const removed = removeHierarchyConnection(added, "a", "b");
      expect(removed.a).toEqual(["c"]);
      const removedLast = removeHierarchyConnection(removed, "a", "c");
      expect(removedLast.a).toBeUndefined();

      const toggledOff = toggleRootButtonInHierarchy(base, "a");
      expect(toggledOff.root).toEqual([]);
      const toggledOn = toggleRootButtonInHierarchy(toggledOff, "a");
      expect(toggledOn.root).toEqual(["a"]);
    });
  });
});
