import { describe, expect, it } from "vitest";
import * as templatesModule from "../index";
import {
  PEERBOTS_COLORS,
  PEERBOTS_EMOTIONS,
  blankMessageButton,
  blankTemplate,
  connectionMessage,
  extractMessageButtons,
  flattenHierarchy,
  getDirectChildIds,
  getParentMap,
  getRootButtonIds,
  isRootButton,
  type ProvenanceRef,
  type Template,
  type TemplateHierarchy,
  type TemplateInfo,
} from "../index";

describe("templates/types & module purity", () => {
  it("exports canonical emotions, colors, and default message/template constants", () => {
    expect(PEERBOTS_EMOTIONS).toEqual([
      "Neutral",
      "Surprised",
      "Happy",
      "Sad",
      "Concerned",
      "Sleepy",
    ]);
    expect(PEERBOTS_COLORS).toEqual([
      "Light Blue",
      "Blue",
      "Green",
      "Red",
      "Purple",
      "Pink",
      "Yellow",
      "Orange",
      "Grey",
      "Black",
      "White",
    ]);
    expect(blankMessageButton.type).toBe("Message");
    expect(connectionMessage.title).toBe("Connecting");
    expect(blankTemplate.hierarchy.root).toEqual(["blank"]);
  });

  it("does not export UI reducer action types from @peerbots/core/templates", () => {
    expect("RobotControlButtonAction" in templatesModule).toBe(false);
  });

  it("supports Firestore DocumentReference-like ProvenanceRef without firebase dependency", () => {
    interface MockFirestoreDocRef {
      readonly id: string;
      readonly path: string;
      readonly firestore: { app: string };
    }
    const mockDocRef: MockFirestoreDocRef = {
      id: "tpl-123",
      path: "contents/c1/templates/tpl-123",
      firestore: { app: "peerbots" },
    };

    const ref: ProvenanceRef = mockDocRef;
    const defaultTemplate: Template = {
      ...blankTemplate,
      copyOf: mockDocRef,
    };
    const typedInfo: TemplateInfo<MockFirestoreDocRef> = {
      id: "tpl-123",
      title: "Typed Info",
      copyOf: mockDocRef,
    };

    expect(ref.id).toBe("tpl-123");
    expect(defaultTemplate.copyOf?.path).toBe("contents/c1/templates/tpl-123");
    expect(typedInfo.copyOf?.firestore.app).toBe("peerbots");
  });
});

describe("flattenHierarchy (ported from app.peerbots.org + edge cases)", () => {
  it("returns empty array for empty root", () => {
    const hierarchy: Template["hierarchy"] = { root: [] };
    expect(flattenHierarchy(hierarchy)).toEqual([]);
  });

  it("returns flat list for root-only hierarchy", () => {
    const hierarchy: Template["hierarchy"] = { root: ["a", "b", "c"] };
    expect(flattenHierarchy(hierarchy)).toEqual([
      { buttonId: "a", depth: 0 },
      { buttonId: "b", depth: 0 },
      { buttonId: "c", depth: 0 },
    ]);
  });

  it("interleaves children after their parent", () => {
    const hierarchy: Template["hierarchy"] = {
      root: ["a", "b"],
      a: ["a1", "a2"],
    };
    expect(flattenHierarchy(hierarchy)).toEqual([
      { buttonId: "a", depth: 0 },
      { buttonId: "a1", depth: 1 },
      { buttonId: "a2", depth: 1 },
      { buttonId: "b", depth: 0 },
    ]);
  });

  it("handles deeply nested hierarchy", () => {
    const hierarchy: Template["hierarchy"] = {
      root: ["a"],
      a: ["b"],
      b: ["c"],
      c: ["d"],
    };
    expect(flattenHierarchy(hierarchy)).toEqual([
      { buttonId: "a", depth: 0 },
      { buttonId: "b", depth: 1 },
      { buttonId: "c", depth: 2 },
      { buttonId: "d", depth: 3 },
    ]);
  });

  it("does not produce duplicate IDs when same button appears in root and as a child", () => {
    const hierarchy: Template["hierarchy"] = {
      root: ["a", "b"],
      a: ["b"],
    };
    const result = flattenHierarchy(hierarchy);
    const ids = result.map((r) => r.buttonId);
    expect(ids).toEqual([...new Set(ids)]);
    expect(result).toEqual([
      { buttonId: "a", depth: 0 },
      { buttonId: "b", depth: 1 },
    ]);
  });

  it("does not produce duplicate IDs when same button is child of multiple parents", () => {
    const hierarchy: Template["hierarchy"] = {
      root: ["a", "b"],
      a: ["shared"],
      b: ["shared"],
    };
    const result = flattenHierarchy(hierarchy);
    const ids = result.map((r) => r.buttonId);
    expect(ids).toEqual([...new Set(ids)]);
    expect(result).toEqual([
      { buttonId: "a", depth: 0 },
      { buttonId: "shared", depth: 1 },
      { buttonId: "b", depth: 0 },
    ]);
  });

  it("handles self-referencing cycle without infinite recursion", () => {
    const hierarchy: Template["hierarchy"] = {
      root: ["a"],
      a: ["a"],
    };
    expect(flattenHierarchy(hierarchy)).toEqual([{ buttonId: "a", depth: 0 }]);
  });

  it("handles indirect cycle without infinite recursion", () => {
    const hierarchy: Template["hierarchy"] = {
      root: ["a"],
      a: ["b"],
      b: ["a"],
    };
    expect(flattenHierarchy(hierarchy)).toEqual([
      { buttonId: "a", depth: 0 },
      { buttonId: "b", depth: 1 },
    ]);
  });

  it("handles longer cycle chain", () => {
    const hierarchy: Template["hierarchy"] = {
      root: ["a"],
      a: ["b"],
      b: ["c"],
      c: ["a"],
    };
    expect(flattenHierarchy(hierarchy)).toEqual([
      { buttonId: "a", depth: 0 },
      { buttonId: "b", depth: 1 },
      { buttonId: "c", depth: 2 },
    ]);
  });

  it("handles multiple roots with children", () => {
    const hierarchy: Template["hierarchy"] = {
      root: ["q1", "q2", "closing"],
      q1: ["good", "tryAgain"],
      q2: ["great"],
    };
    expect(flattenHierarchy(hierarchy)).toEqual([
      { buttonId: "q1", depth: 0 },
      { buttonId: "good", depth: 1 },
      { buttonId: "tryAgain", depth: 1 },
      { buttonId: "q2", depth: 0 },
      { buttonId: "great", depth: 1 },
      { buttonId: "closing", depth: 0 },
    ]);
  });

  it("ignores hierarchy keys that are not reachable from root", () => {
    const hierarchy: Template["hierarchy"] = {
      root: ["a"],
      orphan: ["x", "y"],
    };
    expect(flattenHierarchy(hierarchy)).toEqual([{ buttonId: "a", depth: 0 }]);
  });
});

describe("getRootButtonIds, getDirectChildIds, getParentMap, isRootButton", () => {
  it("deduplicates root button IDs and handles empty root safely", () => {
    expect(getRootButtonIds({ root: ["r1", "r2", "r1"] })).toEqual([
      "r1",
      "r2",
    ]);
    expect(getRootButtonIds({ root: [] })).toEqual([]);
    expect(
      getRootButtonIds({} as unknown as TemplateHierarchy),
    ).toEqual([]);
  });

  it("returns deduplicated direct child IDs while excluding self-references and 'root'", () => {
    const hierarchy: TemplateHierarchy = {
      root: ["r1", "r2"],
      r1: ["c1", "c2", "c1", "r1"],
    };
    expect(getDirectChildIds(hierarchy, "r1")).toEqual(["c1", "c2"]);
    expect(getDirectChildIds(hierarchy, "r2")).toEqual([]);
    expect(getDirectChildIds(hierarchy, "missing")).toEqual([]);
    expect(getDirectChildIds(hierarchy, "root")).toEqual([]);
    expect(getDirectChildIds(hierarchy, "")).toEqual([]);
  });

  it("builds accurate cycle-safe parent maps for nested, shared, and orphaned nodes", () => {
    const hierarchy: TemplateHierarchy = {
      root: ["r1", "r2"],
      r1: ["c1", "shared"],
      c1: ["gc1", "r1"], // cycle back to r1
      r2: ["shared", "c2"],
      orphan: ["ox"],
    };
    const parentMap = getParentMap(hierarchy);
    expect(parentMap).toEqual({
      r1: null,
      c1: "r1",
      gc1: "c1",
      shared: "r1",
      r2: null,
      c2: "r2",
    });
    expect(parentMap.ox).toBeUndefined();
  });

  it("identifies root buttons accurately with isRootButton", () => {
    const hierarchy: TemplateHierarchy = {
      root: ["r1", "r2", "promotedChild"],
      r1: ["c1", "promotedChild"],
    };
    expect(isRootButton(hierarchy, "r1")).toBe(true);
    expect(isRootButton(hierarchy, "r2")).toBe(true);
    expect(isRootButton(hierarchy, "c1")).toBe(false);
    // 'promotedChild' is visited under 'r1' first (depth 1), so not a root button
    expect(isRootButton(hierarchy, "promotedChild")).toBe(false);
    expect(isRootButton(hierarchy, "nonexistent")).toBe(false);
    expect(isRootButton(hierarchy, "")).toBe(false);
  });
});

describe("extractMessageButtons", () => {
  it("filters out Log buttons from both output and childIds while preserving DFS order", () => {
    const template: Template = {
      id: "checkin-tpl",
      title: "Morning Check-In",
      buttons: {
        q1: {
          type: "Message",
          labelColor: "Yellow",
          details: {
            title: "How are you?",
            speech: "Good morning! How are you feeling?",
            color: "Yellow",
            emotion: "Happy",
          },
        },
        ansHappy: {
          type: "Message",
          labelColor: "Green",
          details: {
            title: "Glad to hear",
            speech: "Yay! That makes me happy too!",
            color: "Green",
            emotion: "Happy",
          },
        },
        logNote: {
          type: "Log",
          labelColor: "Grey",
          details: {
            title: "Student responded",
            details: "Logged response",
          },
        },
      },
      hierarchy: {
        root: ["q1", "logNote"],
        q1: ["ansHappy", "logNote"],
      },
    };

    const extracted = extractMessageButtons(template);
    expect(extracted).toHaveLength(2);
    expect(extracted[0]).toEqual({
      buttonKey: "q1",
      templateId: "checkin-tpl",
      templateTitle: "Morning Check-In",
      details: template.buttons.q1.details,
      labelColor: "Yellow",
      childIds: ["ansHappy"],
      isFallback: false,
    });
    expect(extracted[1].buttonKey).toBe("ansHappy");
    expect(extracted[1].childIds).toEqual([]);
  });

  it("resolves isFallback from boolean field as well as string/numeric metadata", () => {
    const template: Template = {
      title: "Fallback Resolution Test",
      buttons: {
        boolTrue: {
          type: "Message",
          labelColor: "Orange",
          details: {
            title: "Bool True",
            speech: "Bool True",
            color: "Orange",
            emotion: "Concerned",
            isFallback: true,
          },
        },
        metaStringTrue: {
          type: "Message",
          labelColor: "Orange",
          details: {
            title: "Meta String",
            speech: "Meta String",
            color: "Orange",
            emotion: "Concerned",
            metadata: { isFallback: " TRUE " },
          },
        },
        metaNumOne: {
          type: "Message",
          labelColor: "Orange",
          details: {
            title: "Meta One",
            speech: "Meta One",
            color: "Orange",
            emotion: "Concerned",
            metadata: { isFallback: 1 },
          },
        },
        metaFalse: {
          type: "Message",
          labelColor: "Blue",
          details: {
            title: "Meta False",
            speech: "Meta False",
            color: "Blue",
            emotion: "Neutral",
            metadata: { isFallback: "false" },
          },
        },
      },
      hierarchy: {
        root: ["boolTrue", "metaStringTrue", "metaNumOne", "metaFalse", "dangling"],
      },
    };

    const extracted = extractMessageButtons(template);
    expect(extracted).toHaveLength(4);
    expect(extracted[0].templateId).toBe("fallback-resolution-test");
    expect(extracted.map((b) => b.isFallback)).toEqual([
      true,
      true,
      true,
      false,
    ]);
  });

  it("falls back to Untitled Template when title is empty", () => {
    const template: Template = {
      title: "   ",
      buttons: {
        b1: blankMessageButton,
      },
      hierarchy: { root: ["b1"] },
    };
    const extracted = extractMessageButtons(template);
    expect(extracted[0].templateTitle).toBe("Untitled Template");
    expect(extracted[0].templateId).toBe("untitled-template");
  });
});
