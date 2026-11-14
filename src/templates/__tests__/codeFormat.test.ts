import { describe, expect, it } from "vitest";
import {
  analyzeTemplateCode,
  formatTemplateToCode,
  getCodeAutocompleteContext,
  parseCodeToTemplate,
  serializeTemplateToCode,
} from "../codeFormat";
import { EXAMPLE_QA_AND_COLORS_TEMPLATE } from "../examples";
import type { Template } from "../types";

describe("Template Code Format (PTTF)", () => {
  it("formats a simple flat template cleanly without noise", () => {
    const template: Template = {
      title: "Quick Greetings",
      buttons: {
        a: {
          type: "Message",
          labelColor: "Light Blue",
          details: {
            title: "Hello",
            speech: "Hello",
            color: "Light Blue",
            emotion: "Neutral",
          },
        },
        b: {
          type: "Message",
          labelColor: "Green",
          details: {
            title: "Wave",
            speech: "Hi there, friend!",
            color: "Blue",
            emotion: "Happy",
          },
        },
      },
      hierarchy: {
        root: ["a", "b"],
      },
    };

    const code = serializeTemplateToCode(template);
    expect(code).toBe(
      [
        "// Quick Greetings",
        "- Hello",
        "- [Green -> Blue] :) Wave | Hi there, friend!",
      ].join("\n"),
    );
  });

  it("round-trips EXAMPLE_QA_AND_COLORS_TEMPLATE preserving hierarchy, colors, and emotions", () => {
    const formatted = formatTemplateToCode(EXAMPLE_QA_AND_COLORS_TEMPLATE);
    expect(formatted.lines.length).toBeGreaterThan(15);

    const { template: reparsed, diagnostics } = parseCodeToTemplate(
      formatted.code,
    );
    expect(diagnostics).toEqual([]);
    expect(reparsed.title).toBe(EXAMPLE_QA_AND_COLORS_TEMPLATE.title);
    expect(Object.keys(reparsed.buttons)).toHaveLength(
      Object.keys(EXAMPLE_QA_AND_COLORS_TEMPLATE.buttons).length,
    );
    expect(reparsed.hierarchy.root).toHaveLength(3);

    // Re-serializing the reparsed template should produce identical code
    const reformatted = serializeTemplateToCode(reparsed);
    expect(reformatted).toBe(formatted.code);
  });

  it("preserves cycles via #anchor and -> #anchor without infinite recursion", () => {
    const cyclic: Template = {
      title: "Looping Check-In",
      buttons: {
        q1: {
          type: "Message",
          labelColor: "Green",
          details: {
            title: "How are you?",
            speech: "How are you feeling?",
            color: "Light Blue",
            emotion: "Neutral",
          },
        },
        r1: {
          type: "Message",
          labelColor: "Light Blue",
          details: {
            title: "I am sad",
            speech: "That sounds hard.",
            color: "Blue",
            emotion: "Sad",
          },
        },
      },
      hierarchy: {
        root: ["q1"],
        q1: ["r1"],
        r1: ["q1"],
      },
    };

    const formatted = formatTemplateToCode(cyclic);
    expect(formatted.code).toContain("#how-are-you");
    expect(formatted.code).toContain("-> #how-are-you");

    const jumpLine = formatted.lines.find((l) => l.kind === "jump");
    expect(jumpLine?.isCycle).toBe(true);
    expect(jumpLine?.summary).toContain("Loop back");

    const { template: reparsed, diagnostics } = parseCodeToTemplate(
      formatted.code,
    );
    expect(diagnostics).toEqual([]);

    const rootId = reparsed.hierarchy.root[0];
    const childId = reparsed.hierarchy[rootId]?.[0];
    expect(childId).toBeDefined();
    expect(reparsed.hierarchy[childId!]).toEqual([rootId]);
  });

  it("round-trips Log buttons, Concerned emotion, metadata, and Unlinked buttons", () => {
    const complex: Template = {
      title: "Clinical Session",
      buttons: {
        m1: {
          type: "Message",
          labelColor: "Light Blue",
          details: {
            title: "Check in",
            speech: "Are you okay?",
            color: "Yellow",
            emotion: "Concerned",
            metadata: { goal: "Empathy", score: 2 },
          },
        },
        l1: {
          type: "Log",
          labelColor: "Grey",
          details: {
            title: "Session Marker",
            details: "Child initiated greeting",
          },
        },
        orphan: {
          type: "Message",
          labelColor: "Pink",
          details: {
            title: "Spare Button",
            speech: "Spare Button",
            color: "Light Blue",
            emotion: "Neutral",
          },
        },
      },
      hierarchy: {
        root: ["m1", "l1"],
      },
    };

    const formatted = formatTemplateToCode(complex);
    expect(formatted.code).toContain("[-> Yellow] [Concerned]");
    expect(formatted.code).toContain('{ goal: "Empathy", score: 2 }');
    expect(formatted.code).toContain("! [Grey] Session Marker | Child initiated greeting");
    expect(formatted.code).toContain("## Unlinked");
    expect(formatted.code).toContain("- [Pink] Spare Button");

    const { template: reparsed, diagnostics } = parseCodeToTemplate(
      formatted.code,
    );
    expect(diagnostics).toEqual([]);
    expect(Object.keys(reparsed.buttons)).toHaveLength(3);
    expect(reparsed.hierarchy.root).toHaveLength(2);

    const logBtn = Object.values(reparsed.buttons).find((b) => b.type === "Log");
    expect(logBtn?.labelColor).toBe("Grey");
    expect(logBtn?.details.title).toBe("Session Marker");
    if (logBtn?.type === "Log") {
      expect(logBtn.details.details).toBe("Child initiated greeting");
    }

    const msgBtn = reparsed.buttons[reparsed.hierarchy.root[0]];
    expect(msgBtn.type).toBe("Message");
    if (msgBtn.type === "Message") {
      expect(msgBtn.details.emotion).toBe("Concerned");
      expect(msgBtn.details.color).toBe("Yellow");
      expect(msgBtn.details.metadata).toEqual({ goal: "Empathy", score: 2 });
    }
  });

  it("still parses legacy [Log] bracket syntax and preserves exact 1:1 line tokens in analyzeTemplateCode", () => {
    const raw = [
      "// Session",
      "- [Log] [Grey] Legacy Log | Event details",
      "  ! [Purple] Nested Log | Child event",
    ].join("\n");

    const { template, lines, diagnostics } = analyzeTemplateCode(raw);
    expect(diagnostics).toEqual([]);
    expect(Object.keys(template.buttons)).toHaveLength(2);
    expect(lines).toHaveLength(3);

    const rawLines = raw.split("\n");
    lines.forEach((line, idx) => {
      expect(line.tokens.map((t) => t.text).join("")).toBe(rawLines[idx]);
    });

    expect(lines[1].button?.type).toBe("Log");
    expect(lines[2].button?.type).toBe("Log");
    expect(lines[2].depth).toBe(1);
  });

  it("supports layman plain-text input with colon Title: Speech and emits diagnostics for bad jumps", () => {
    const raw = [
      "Welcome: Hello everyone!",
      "  :) Ask question",
      "    -> #missing-anchor",
    ].join("\n");

    const { template, diagnostics } = parseCodeToTemplate(raw, {
      title: "Classroom",
    });
    expect(template.title).toBe("Classroom");
    expect(template.hierarchy.root).toHaveLength(1);
    const rootBtn = template.buttons[template.hierarchy.root[0]];
    expect(rootBtn.details.title).toBe("Welcome");
    if (rootBtn.type === "Message") {
      expect(rootBtn.details.speech).toBe("Hello everyone!");
    }
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe("error");
    expect(diagnostics[0].message).toContain("#missing-anchor");
  });

  it("provides context-aware autocomplete for colors, robot colors, anchors, and emotions", () => {
    const labelCtx = getCodeAutocompleteContext("- [gr", 5);
    expect(labelCtx?.kind).toBe("labelColor");
    expect(labelCtx?.suggestions.map((s) => s.label)).toContain("Green");
    expect(labelCtx?.suggestions.map((s) => s.label)).toContain("Grey");

    const robotCtx = getCodeAutocompleteContext("- [Green -> r", 13);
    expect(robotCtx?.kind).toBe("robotColor");
    expect(robotCtx?.suggestions[0]?.label).toBe("Red");
    expect(robotCtx?.suggestions[0]?.insertText).toBe("Red] ");

    const anchorCtx = getCodeAutocompleteContext("  - -> #che", 11, [
      { anchor: "#check-in", title: "Check In" },
      { anchor: "#bye", title: "Bye" },
    ]);
    expect(anchorCtx?.kind).toBe("anchor");
    expect(anchorCtx?.suggestions.map((s) => s.label)).toEqual(["#check-in"]);

    const emotionCtx = getCodeAutocompleteContext("- :", 3);
    expect(emotionCtx?.kind).toBe("emotion");
    expect(emotionCtx?.suggestions.map((s) => s.label)).toContain(":)");
  });

  it("validates Log lines in autocomplete and emits line-level warnings for robot color or emotion on Log buttons", () => {
    // Log line autocomplete should only suggest colors (no emotions, no -> robotColor)
    const logBracketCtx = getCodeAutocompleteContext("! [", 3);
    expect(logBracketCtx?.heading).toBe("Log Button Color");
    expect(logBracketCtx?.suggestions.map((s) => s.label)).not.toContain(
      "Happy",
    );
    expect(getCodeAutocompleteContext("! [Grey -> ", 11)).toBeNull();
    expect(getCodeAutocompleteContext("! :", 3)).toBeNull();

    // Parser emits line-by-line warnings when robot color or emotion is given to a Log button
    const { diagnostics } = parseCodeToTemplate(
      [
        "// Test",
        "! [Grey -> Red] :) Bad Log",
      ].join("\n"),
    );
    expect(diagnostics).toHaveLength(2);
    expect(diagnostics[0].lineNumber).toBe(2);
    expect(diagnostics[0].severity).toBe("warning");
    expect(diagnostics[0].message).toContain("robot face color");
    expect(diagnostics[1].lineNumber).toBe(2);
    expect(diagnostics[1].message).toContain("facial expression");
  });
});
