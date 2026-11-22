import React from "react";
import axe from "axe-core";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Template } from "../../templates/types";
import { CodeView } from "../patterns/control-views/CodeView";

afterEach(() => {
  cleanup();
});

const makeCyclicTemplate = (): Template => ({
  id: "cyclic-test",
  title: "Greeting Loop",
  buttons: {
    "1": {
      type: "Message",
      labelColor: "Green",
      details: {
        title: "Say Hello",
        speech: "Hello friend!",
        color: "Blue",
        emotion: "Happy",
      },
    },
    "2": {
      type: "Log",
      labelColor: "Grey",
      details: {
        title: "Wave Logged",
        details: "Child waved back",
      },
    },
  },
  hierarchy: {
    root: ["1"],
    "1": ["2"],
    "2": ["1"],
  },
});

describe("CodeView", () => {
  it("renders formatted PTTF lines, updates explainer on hover, switches to JSON, and has zero axe violations", async () => {
    const onButtonAction = vi.fn();
    const template = makeCyclicTemplate();

    const { container } = render(
      <CodeView template={template} onButtonAction={onButtonAction} />,
    );

    const list = screen.getByRole("list", {
      name: "Formatted template code lines",
    });
    const items = within(list).getAllByRole("listitem");
    expect(items.length).toBeGreaterThanOrEqual(4);

    // Hover the Log line (item index 2: 0=comment, 1=Say Hello, 2=Wave Logged, 3=jump)
    fireEvent.mouseEnter(items[2]);
    const explainer = screen.getByLabelText("Interactive code explainer");
    expect(
      within(explainer).getByRole("button", { name: "Wave Logged" }),
    ).toBeInTheDocument();
    expect(
      within(explainer).getByText(
        /Event notes recorded when clicked: "Child waved back"/i,
      ),
    ).toBeInTheDocument();

    // Hover the jump/cycle line
    fireEvent.mouseEnter(items[3]);
    expect(within(explainer).getByText(/Loops back to/i)).toBeInTheDocument();

    // Clicking a button line dispatches SELECT
    fireEvent.click(items[1]);
    expect(onButtonAction).toHaveBeenCalledWith(
      template.buttons["1"],
      "1",
      { type: "SELECT" },
    );

    // Switch to JSON format and verify JSON syntax + explainer
    fireEvent.click(screen.getByRole("button", { name: "JSON" }));
    const jsonList = screen.getByRole("list", {
      name: "Formatted template code lines",
    });
    expect(within(jsonList).getByText('"buttons"')).toBeInTheDocument();
    expect(within(jsonList).getByText('"hierarchy"')).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: /copy/i }),
    ).not.toBeInTheDocument();

    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });

  it("supports unified live editing with syntax highlighting, live explainer, Format, Unsaved/Discard, diagnostics, and Apply Changes", () => {
    const onTemplateChange = vi.fn();
    const template = makeCyclicTemplate();

    render(
      <CodeView
        template={template}
        onTemplateChange={onTemplateChange}
      />,
    );

    const textarea = screen.getByLabelText(
      "Template code editor",
    ) as HTMLTextAreaElement;
    expect(textarea.value).toContain("Say Hello | Hello friend!");
    expect(textarea.value).toContain("! [Grey] Wave Logged | Child waved back");
    expect(screen.queryByText("Unsaved")).not.toBeInTheDocument();

    // Explainer aside is visible in unified editor too
    const explainer = screen.getByLabelText("Interactive code explainer");
    expect(
      within(explainer).getByText("What This Produces"),
    ).toBeInTheDocument();

    // Typing a Log line with `!` and moving cursor to it updates the live explainer & shows Unsaved/Discard
    const nextText = "// Updated\n! [Purple] Break Logged | Requested break";
    fireEvent.change(textarea, {
      target: {
        value: nextText,
        selectionStart: nextText.length,
      },
    });
    expect(screen.getByText("Unsaved")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Discard" })).toBeInTheDocument();
    expect(
      within(explainer).getByRole("button", { name: "Break Logged" }),
    ).toBeInTheDocument();
    expect(
      within(explainer).getByText(/Log button \(!\)/i),
    ).toBeInTheDocument();

    // Clicking Discard reverts draftCode and hides Unsaved
    fireEvent.click(screen.getByRole("button", { name: "Discard" }));
    expect(textarea.value).toContain("Say Hello | Hello friend!");
    expect(screen.queryByText("Unsaved")).not.toBeInTheDocument();

    // Re-apply edit for token hover & diagnostics tests
    fireEvent.change(textarea, {
      target: {
        value: nextText,
        selectionStart: nextText.length,
      },
    });

    // Hovering a token in Syntax Breakdown highlights that section in the Edit overlay
    const logTypeItem = within(explainer)
      .getByText(/Log button \(!\)/i)
      .closest("li");
    expect(logTypeItem).not.toBeNull();
    fireEvent.mouseEnter(logTypeItem!);
    const highlightedToken = document.querySelector(
      "pre span.pb\\:underline",
    );
    expect(highlightedToken).not.toBeNull();
    expect(highlightedToken?.textContent).toBe("! ");
    fireEvent.mouseLeave(logTypeItem!);

    // Shows diagnostics for bad jump & indentation
    fireEvent.change(textarea, {
      target: {
        value: "// Updated\n  :) Hi there\n    -> #missing",
        selectionStart: 0,
      },
    });

    const diagnostics = screen.getByRole("status", {
      name: "Code diagnostics",
    });
    expect(within(diagnostics).getByText(/#missing/i)).toBeInTheDocument();

    // Fix the code and click Format, verify Ctrl+Z undoes Format, then re-Format and Apply Changes
    const unformatted = "// Updated\n[Green -> Red] :) Hi | Hello!";
    fireEvent.change(textarea, {
      target: {
        value: unformatted,
        selectionStart: 0,
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Format" }));
    expect(textarea.value).toContain("- [Green -> Red] :) Hi | Hello!");

    fireEvent.keyDown(textarea, { key: "z", ctrlKey: true });
    expect(textarea.value).toBe(unformatted);

    fireEvent.click(screen.getByRole("button", { name: "Format" }));
    fireEvent.click(screen.getByRole("button", { name: "Apply Changes" }));
    expect(onTemplateChange).toHaveBeenCalledTimes(1);
    const updated = onTemplateChange.mock.calls[0][0] as Template;
    expect(updated.title).toBe("Updated");
    expect(Object.keys(updated.buttons)).toHaveLength(1);
  });

  it("shows context-aware color autocomplete, supports Ctrl+Z undo after insert, and validates Log lines", () => {
    const template = makeCyclicTemplate();
    render(
      <CodeView
        template={template}
        onTemplateChange={vi.fn()}
      />,
    );

    const textarea = screen.getByLabelText(
      "Template code editor",
    ) as HTMLTextAreaElement;

    const draft = "// Test\n- [pur";
    fireEvent.change(textarea, {
      target: { value: draft, selectionStart: draft.length },
    });

    const listbox = screen.getByRole("listbox", {
      name: /Button Color or Emotion/i,
    });
    const purpleOption = within(listbox).getByRole("option", {
      name: /Purple/i,
    });
    expect(purpleOption).toBeInTheDocument();

    fireEvent.click(purpleOption);
    expect(textarea.value).toBe("// Test\n- [Purple] ");

    // Ctrl+Z undoes the programmatic autocomplete insert
    fireEvent.keyDown(textarea, { key: "z", ctrlKey: true });
    expect(textarea.value).toBe("// Test\n- [pur");

    // Typing an invalid Log modifier (robot color + emotion) shows line-specific warnings in explainer
    const badLog = "// Test\n! [Grey -> Red] :) Marker";
    fireEvent.change(textarea, {
      target: { value: badLog, selectionStart: badLog.length },
    });
    const explainer = screen.getByLabelText("Interactive code explainer");
    expect(
      within(explainer).getByText(/do not have a robot face color/i),
    ).toBeInTheDocument();
    expect(
      within(explainer).getByText(/do not have a robot facial expression/i),
    ).toBeInTheDocument();
  });

  it("preserves template id and content association metadata across shorthand and JSON edits", () => {
    const onTemplateChange = vi.fn();
    const copyDate = new Date("2026-01-15T12:00:00Z");
    const template: Template = {
      ...makeCyclicTemplate(),
      id: "orig-template-id",
      contentID: "orig-content-id",
      contentName: "Original Collection",
      copyOf: { id: "marketplace-source-id", path: "content/marketplace-source-id" },
      copyDate,
      sourceContentId: "source-pkg-1",
    };

    render(
      <CodeView
        template={template}
        onTemplateChange={onTemplateChange}
        defaultFormat="json"
      />,
    );

    const textarea = screen.getByLabelText(
      "Template code editor",
    ) as HTMLTextAreaElement;

    // Raw JSON view omits immutable id and content association fields by default
    expect(textarea.value).not.toContain('"orig-template-id"');
    expect(textarea.value).not.toContain('"orig-content-id"');

    // Attempt to overwrite id, contentID, contentName, copyOf, and sourceContentId in JSON mode
    const tamperedJson = JSON.stringify(
      {
        id: "tampered-id",
        contentID: "tampered-content-id",
        contentName: "Tampered Collection",
        copyOf: { id: "other" },
        sourceContentId: "tampered-source",
        title: "Updated JSON Title",
        description: "New JSON description",
        buttons: template.buttons,
        hierarchy: template.hierarchy,
      },
      null,
      2,
    );

    fireEvent.change(textarea, {
      target: { value: tamperedJson, selectionStart: 0 },
    });

    const diagnostics = screen.getByRole("status", {
      name: "Code diagnostics",
    });
    expect(
      within(diagnostics).getByText(
        /Template "id" and content association cannot be changed in Code View/i,
      ),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Apply Changes" }));
    expect(onTemplateChange).toHaveBeenCalledTimes(1);
    const updatedFromJson = onTemplateChange.mock.calls[0][0] as Template;
    expect(updatedFromJson.title).toBe("Updated JSON Title");
    expect(updatedFromJson.description).toBe("New JSON description");
    expect(updatedFromJson.id).toBe("orig-template-id");
    expect(updatedFromJson.contentID).toBe("orig-content-id");
    expect(updatedFromJson.contentName).toBe("Original Collection");
    expect(updatedFromJson.copyOf).toEqual({
      id: "marketplace-source-id",
      path: "content/marketplace-source-id",
    });
    expect(updatedFromJson.copyDate).toBe(copyDate);
    expect(updatedFromJson.sourceContentId).toBe("source-pkg-1");

    // Switch to shorthand mode and apply a change — identity and content association are still preserved
    onTemplateChange.mockClear();
    fireEvent.click(screen.getByRole("button", { name: "Shorthand" }));
    const nextShorthand = "// Updated Shorthand Title\n- [Green] Hello";
    fireEvent.change(textarea, {
      target: { value: nextShorthand, selectionStart: nextShorthand.length },
    });
    fireEvent.click(screen.getByRole("button", { name: "Apply Changes" }));
    expect(onTemplateChange).toHaveBeenCalledTimes(1);
    const updatedFromShorthand = onTemplateChange.mock.calls[0][0] as Template;
    expect(updatedFromShorthand.title).toBe("Updated Shorthand Title");
    expect(updatedFromShorthand.id).toBe("orig-template-id");
    expect(updatedFromShorthand.contentID).toBe("orig-content-id");
    expect(updatedFromShorthand.contentName).toBe("Original Collection");
    expect(updatedFromShorthand.copyOf).toEqual({
      id: "marketplace-source-id",
      path: "content/marketplace-source-id",
    });
    expect(updatedFromShorthand.copyDate).toBe(copyDate);
    expect(updatedFromShorthand.sourceContentId).toBe("source-pkg-1");
  });

  it("renders resizable side-by-side explainer panel with keyboard/double-click resize and toggle", () => {
    const template = makeCyclicTemplate();
    render(<CodeView template={template} onTemplateChange={vi.fn()} />);

    const explainer = screen.getByLabelText("Interactive code explainer");
    expect(explainer.className).toContain("pb:lg:w-[var(--explainer-width)]");
    expect(explainer.style.getPropertyValue("--explainer-width")).toBe("40%");

    const splitContainer = explainer.parentElement!;
    expect(splitContainer.className).toContain("pb:lg:flex-row");

    const separator = screen.getByRole("separator", {
      name: /Resize code explainer panel/i,
    });
    expect(separator).toHaveAttribute("aria-valuenow", "40");

    // Keyboard resize wider & narrower + double-click reset
    fireEvent.keyDown(separator, { key: "ArrowLeft" });
    expect(separator).toHaveAttribute("aria-valuenow", "43");
    expect(explainer.style.getPropertyValue("--explainer-width")).toBe("43%");

    fireEvent.keyDown(separator, { key: "ArrowRight" });
    expect(separator).toHaveAttribute("aria-valuenow", "40");

    fireEvent.keyDown(separator, { key: "ArrowLeft", shiftKey: true });
    expect(separator).toHaveAttribute("aria-valuenow", "48");

    fireEvent.doubleClick(separator);
    expect(separator).toHaveAttribute("aria-valuenow", "40");

    // Toggle explainer off & back on
    const toggleBtn = screen.getByRole("button", { name: /Explainer On/i });
    expect(toggleBtn).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(toggleBtn);
    expect(
      screen.queryByLabelText("Interactive code explainer"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("separator", {
        name: /Resize code explainer panel/i,
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Explainer Off/i }),
    ).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(screen.getByRole("button", { name: /Explainer Off/i }));
    expect(
      screen.getByLabelText("Interactive code explainer"),
    ).toBeInTheDocument();
  });

  it("toggles between unlocked live edit and locked read-only play mode via the Lock/Unlock button with zero axe violations", async () => {
    const onTemplateChange = vi.fn();
    const onButtonAction = vi.fn();
    const template = makeCyclicTemplate();

    const { container } = render(
      <CodeView
        template={template}
        onTemplateChange={onTemplateChange}
        onButtonAction={onButtonAction}
      />,
    );

    // Unlocked by default: editor textarea + Apply Changes + gutter Play buttons
    expect(screen.getByLabelText("Template code editor")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Apply Changes" }),
    ).toBeInTheDocument();

    const lockBtn = screen.getByRole("button", { name: "Lock code editor" });
    expect(lockBtn).toHaveAttribute("aria-pressed", "false");

    // Gutter Play buttons work in unlocked edit mode (Shorthand)
    const playHelloEdit = screen.getByRole("button", {
      name: "Play button: Say Hello",
    });
    expect(playHelloEdit).toHaveAttribute("tabindex", "-1");
    fireEvent.click(playHelloEdit);
    expect(onButtonAction).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "Message",
        details: expect.objectContaining({ title: "Say Hello" }),
      }),
      expect.any(String),
      { type: "SELECT" },
    );

    // Clicking Lock switches to read-only play mode
    fireEvent.click(lockBtn);
    expect(
      screen.queryByLabelText("Template code editor"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Apply Changes" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Unlock code editor" }),
    ).toHaveAttribute("aria-pressed", "true");

    // Gutter Play button still works in locked read-only mode
    onButtonAction.mockClear();
    fireEvent.click(
      screen.getByRole("button", { name: "Play button: Wave Logged" }),
    );
    expect(onButtonAction).toHaveBeenCalledWith(
      template.buttons["2"],
      "2",
      { type: "SELECT" },
    );

    const results = await axe.run(container);
    expect(results.violations).toEqual([]);

    // Unlocking restores live editor
    fireEvent.click(
      screen.getByRole("button", { name: "Unlock code editor" }),
    );
    expect(screen.getByLabelText("Template code editor")).toBeInTheDocument();
  });

  it("places one Play button on the first line of every button in expanded JSON, supports Ctrl/Cmd+Enter, and suppresses Play on malformed/ambiguous JSON", () => {
    const onTemplateChange = vi.fn();
    const onButtonAction = vi.fn();
    const template = makeCyclicTemplate();

    render(
      <CodeView
        template={template}
        defaultFormat="json"
        onTemplateChange={onTemplateChange}
        onButtonAction={onButtonAction}
      />,
    );

    // Exactly 2 Play buttons in expanded JSON (one on the first line of each button object)
    const playButtons = screen.getAllByRole("button", {
      name: /^Play button:/,
    });
    expect(playButtons).toHaveLength(2);
    expect(
      screen.getByRole("button", { name: "Play button: Say Hello" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Play button: Wave Logged" }),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Play button: Say Hello" }),
    );
    expect(onButtonAction).toHaveBeenCalledWith(
      template.buttons["1"],
      "1",
      { type: "SELECT" },
    );

    // Ctrl+Enter on the first line of button "1" plays it
    const textarea = screen.getByLabelText(
      "Template code editor",
    ) as HTMLTextAreaElement;
    onButtonAction.mockClear();
    const btn1Pos = textarea.value.indexOf('"1": {');
    fireEvent.click(textarea, { target: { selectionStart: btn1Pos } });
    fireEvent.select(textarea, { target: { selectionStart: btn1Pos } });
    fireEvent.keyDown(textarea, { key: "Enter", ctrlKey: true });
    expect(onButtonAction).toHaveBeenCalledWith(
      template.buttons["1"],
      "1",
      { type: "SELECT" },
    );

    // 1. Broken JSON -> ALL Play buttons suppressed (no stale line drift)
    fireEvent.change(textarea, {
      target: { value: "{ broken json", selectionStart: 5 },
    });
    expect(
      screen.queryAllByRole("button", { name: /^Play button:/ }),
    ).toHaveLength(0);

    // 2. Minified JSON (multiple buttons on the same line) -> ambiguous line suppressed
    fireEvent.change(textarea, {
      target: { value: JSON.stringify(template), selectionStart: 0 },
    });
    expect(
      screen.queryAllByRole("button", { name: /^Play button:/ }),
    ).toHaveLength(0);

    // 3. Invalid button field types (speech: 123) -> invalid button suppressed, valid sibling stays playable
    const partiallyInvalid = JSON.stringify(
      {
        title: "Mixed",
        buttons: {
          "1": {
            type: "Message",
            labelColor: "Green",
            details: { title: "Bad Speech", speech: 123 },
          },
          "2": {
            type: "Log",
            labelColor: "Grey",
            details: { title: "Good Log", details: "Valid note" },
          },
        },
        hierarchy: { root: ["1", "2"] },
      },
      null,
      2,
    );
    fireEvent.change(textarea, {
      target: { value: partiallyInvalid, selectionStart: 0 },
    });
    expect(
      screen.queryByRole("button", { name: "Play button: Bad Speech" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Play button: Good Log" }),
    ).toBeInTheDocument();

    // 4. Duplicate button keys in JSON -> duplicate key suppressed
    const duplicateKeyJson = `{
  "title": "Dupes",
  "buttons": {
    "1": { "type": "Message", "labelColor": "Green", "details": { "title": "First", "speech": "Hi" } },
    "1": { "type": "Message", "labelColor": "Green", "details": { "title": "Second", "speech": "Bye" } },
    "2": { "type": "Log", "labelColor": "Grey", "details": { "title": "Unique Log", "details": "Ok" } }
  },
  "hierarchy": { "root": ["1", "2"] }
}`;
    fireEvent.change(textarea, {
      target: { value: duplicateKeyJson, selectionStart: 0 },
    });
    expect(
      screen.queryByRole("button", { name: "Play button: First" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Play button: Second" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Play button: Unique Log" }),
    ).toBeInTheDocument();
  });
});


