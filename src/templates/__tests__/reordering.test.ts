import { describe, expect, it } from "vitest";
import {
  figureOutNewOrder,
  moveTemplateInList,
  partitionByArchived,
  reorderHierarchySiblings,
  reorderTemplatesInfo,
  setTemplateInfoArchived,
  type TemplateHierarchy,
  type TemplateInfo,
} from "../index";

describe("figureOutNewOrder — single-button signature (ported from app.peerbots.org)", () => {
  const initialOrder = ["A", "B", "C", "D"];

  it("should move a button BACK from the middle", () => {
    const result = figureOutNewOrder("C", "BACK", initialOrder);
    expect(result).toEqual(["A", "C", "B", "D"]);
  });

  it("should not change anything when moving BACK from the start", () => {
    const result = figureOutNewOrder("A", "BACK", initialOrder);
    expect(result).toEqual(initialOrder);
  });

  it("should move a button FORWARD from the middle", () => {
    const result = figureOutNewOrder("B", "FORWARD", initialOrder);
    expect(result).toEqual(["A", "C", "B", "D"]);
  });

  it("should not change anything when moving FORWARD from the end", () => {
    const result = figureOutNewOrder("D", "FORWARD", initialOrder);
    expect(result).toEqual(initialOrder);
  });

  it("should handle an unknown button ID gracefully", () => {
    const result = figureOutNewOrder("X", "FORWARD", initialOrder);
    expect(result).toEqual(initialOrder);
  });

  it("should handle an empty list", () => {
    const result = figureOutNewOrder("A", "FORWARD", []);
    expect(result).toEqual([]);
  });

  it("should handle a single-item list", () => {
    const result = figureOutNewOrder("A", "FORWARD", ["A"]);
    expect(result).toEqual(["A"]);
  });

  it("never mutates the input array", () => {
    const snapshot = [...initialOrder];
    const moved = figureOutNewOrder("B", "FORWARD", initialOrder);
    expect(initialOrder).toEqual(snapshot);
    expect(moved).not.toBe(initialOrder);
  });
});

describe("figureOutNewOrder — batch Set / array signature", () => {
  const list = ["A", "B", "C", "D", "E"];

  it("moves a contiguous multi-selection block BACK together", () => {
    expect(figureOutNewOrder(list, new Set(["B", "C"]), "BACK")).toEqual([
      "B",
      "C",
      "A",
      "D",
      "E",
    ]);
  });

  it("moves a contiguous multi-selection block FORWARD together", () => {
    expect(figureOutNewOrder(list, ["B", "C"], "FORWARD")).toEqual([
      "A",
      "D",
      "B",
      "C",
      "E",
    ]);
  });

  it("moves non-contiguous selected items independently in direction BACK", () => {
    expect(figureOutNewOrder(list, new Set(["B", "E"]), "BACK")).toEqual([
      "B",
      "A",
      "C",
      "E",
      "D",
    ]);
  });

  it("moves non-contiguous selected items independently in direction FORWARD", () => {
    expect(figureOutNewOrder(list, new Set(["A", "C"]), "FORWARD")).toEqual([
      "B",
      "A",
      "D",
      "C",
      "E",
    ]);
  });

  it("pins a leading contiguous block at index 0 when moving BACK", () => {
    expect(figureOutNewOrder(list, new Set(["A", "B"]), "BACK")).toEqual(list);
    expect(figureOutNewOrder(list, new Set(["A", "B", "D"]), "BACK")).toEqual([
      "A",
      "B",
      "D",
      "C",
      "E",
    ]);
  });

  it("pins a trailing contiguous block at end boundary when moving FORWARD", () => {
    expect(figureOutNewOrder(list, new Set(["D", "E"]), "FORWARD")).toEqual(
      list,
    );
    expect(
      figureOutNewOrder(list, new Set(["B", "D", "E"]), "FORWARD"),
    ).toEqual(["A", "C", "B", "D", "E"]);
  });

  it("returns unchanged order for empty selection or full-list selection", () => {
    expect(figureOutNewOrder(list, new Set(), "BACK")).toEqual(list);
    expect(figureOutNewOrder(list, new Set(list), "FORWARD")).toEqual(list);
  });
});

describe("reorderHierarchySiblings", () => {
  it("reorders root buttons without affecting nested child lists", () => {
    const hierarchy: TemplateHierarchy = {
      root: ["r1", "r2", "r3"],
      r1: ["c1", "c2"],
    };
    const next = reorderHierarchySiblings(hierarchy, "r2", "BACK");
    expect(next).toEqual({
      root: ["r2", "r1", "r3"],
      r1: ["c1", "c2"],
    });
  });

  it("reorders nested child lists cleanly without mutating the input hierarchy", () => {
    const hierarchy: TemplateHierarchy = {
      root: ["r1", "r2"],
      r1: ["c1", "c2", "c3", "c4"],
      r2: ["x1", "x2"],
    };
    const originalR1 = [...hierarchy.r1];

    const next = reorderHierarchySiblings(
      hierarchy,
      new Set(["c2", "c3"]),
      "FORWARD",
    );

    expect(next.r1).toEqual(["c1", "c4", "c2", "c3"]);
    expect(next.r2).toEqual(["x1", "x2"]);
    expect(hierarchy.r1).toEqual(originalR1);
    expect(next).not.toBe(hierarchy);
    expect(next.r1).not.toBe(hierarchy.r1);
  });

  it("supports simultaneous sibling reordering across root and nested child arrays", () => {
    const hierarchy: TemplateHierarchy = {
      root: ["r1", "r2"],
      r1: ["c1", "c2"],
    };
    const next = reorderHierarchySiblings(
      hierarchy,
      new Set(["r2", "c2"]),
      "BACK",
    );
    expect(next).toEqual({
      root: ["r2", "r1"],
      r1: ["c2", "c1"],
    });
  });

  it("handles empty string selection as a safe no-op copy", () => {
    const hierarchy: TemplateHierarchy = {
      root: ["r1", "r2"],
    };
    const next = reorderHierarchySiblings(hierarchy, "", "FORWARD");
    expect(next).toEqual(hierarchy);
    expect(next).not.toBe(hierarchy);
  });
});

describe("Template collection reordering & archiving helpers", () => {
  const sampleTemplates: TemplateInfo[] = [
    { id: "t1", title: "Template 1" },
    { id: "t2", title: "Template 2 (Archived)", archived: true },
    { id: "t3", title: "Template 3" },
    { id: "t4", title: "Template 4" },
  ];

  it("partitions templates or collections into active and archived lists", () => {
    const { active, archived } = partitionByArchived(sampleTemplates);
    expect(active.map((t) => t.id)).toEqual(["t1", "t3", "t4"]);
    expect(archived.map((t) => t.id)).toEqual(["t2"]);

    const collections = [
      { id: "c1", data: { name: "Col 1", archived: false } },
      { id: "c2", data: { name: "Col 2", archived: true } },
    ];
    const partitionedCols = partitionByArchived(
      collections,
      (c) => Boolean(c.data.archived),
    );
    expect(partitionedCols.active.map((c) => c.id)).toEqual(["c1"]);
    expect(partitionedCols.archived.map((c) => c.id)).toEqual(["c2"]);
  });

  it("reorders active templates BACK and FORWARD while preserving archived slots", () => {
    const movedBack = reorderTemplatesInfo(sampleTemplates, "t3", "BACK");
    expect(movedBack.map((t) => t.id)).toEqual(["t3", "t2", "t1", "t4"]);

    const movedForward = reorderTemplatesInfo(sampleTemplates, "t3", "FORWARD");
    expect(movedForward.map((t) => t.id)).toEqual(["t1", "t2", "t4", "t3"]);

    // Boundary checks
    expect(
      reorderTemplatesInfo(sampleTemplates, "t1", "BACK").map((t) => t.id),
    ).toEqual(["t1", "t2", "t3", "t4"]);
    expect(
      reorderTemplatesInfo(sampleTemplates, "t4", "FORWARD").map((t) => t.id),
    ).toEqual(["t1", "t2", "t3", "t4"]);
  });

  it("moves an active template to a target active template's slot via moveTemplateInList", () => {
    const movedToFirst = moveTemplateInList(sampleTemplates, "t4", "t1");
    expect(movedToFirst.map((t) => t.id)).toEqual(["t4", "t2", "t1", "t3"]);

    const movedToLast = moveTemplateInList(sampleTemplates, "t1", "t4");
    expect(movedToLast.map((t) => t.id)).toEqual(["t3", "t2", "t4", "t1"]);
  });

  it("toggles the archived status of a template in templatesInfo immutably", () => {
    const archivedT3 = setTemplateInfoArchived(sampleTemplates, "t3", true);
    expect(archivedT3.find((t) => t.id === "t3")?.archived).toBe(true);
    expect(sampleTemplates.find((t) => t.id === "t3")?.archived).toBeUndefined();

    const unarchivedT2 = setTemplateInfoArchived(sampleTemplates, "t2", false);
    expect(unarchivedT2.find((t) => t.id === "t2")?.archived).toBe(false);
  });
});
