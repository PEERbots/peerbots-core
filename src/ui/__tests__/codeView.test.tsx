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

    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });

  it("supports Edit mode with live syntax highlighting, live explainer, Format button, diagnostics, and Apply Changes", () => {
    const onTemplateChange = vi.fn();
    const template = makeCyclicTemplate();

    render(
      <CodeView
        template={template}
        onTemplateChange={onTemplateChange}
        defaultMode="edit"
      />,
    );

    const textarea = screen.getByLabelText(
      "Template code editor",
    ) as HTMLTextAreaElement;
    expect(textarea.value).toContain("Say Hello | Hello friend!");
    expect(textarea.value).toContain("! [Grey] Wave Logged | Child waved back");

    // Explainer aside is visible in Edit mode too
    const explainer = screen.getByLabelText("Interactive code explainer");
    expect(
      within(explainer).getByText("What This Produces"),
    ).toBeInTheDocument();

    // Typing a Log line with `!` and moving cursor to it updates the live explainer
    const nextText = "// Updated\n! [Purple] Break Logged | Requested break";
    fireEvent.change(textarea, {
      target: {
        value: nextText,
        selectionStart: nextText.length,
      },
    });
    expect(
      within(explainer).getByRole("button", { name: "Break Logged" }),
    ).toBeInTheDocument();
    expect(
      within(explainer).getByText(/Log button \(!\)/i),
    ).toBeInTheDocument();

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

    // Fix the code and click Format, then Apply Changes
    fireEvent.change(textarea, {
      target: {
        value: "// Updated\n[Green -> Red] :) Hi | Hello!",
        selectionStart: 0,
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Format" }));
    expect(textarea.value).toContain("- [Green -> Red] :) Hi | Hello!");

    fireEvent.click(screen.getByRole("button", { name: "Apply Changes" }));
    expect(onTemplateChange).toHaveBeenCalledTimes(1);
    const updated = onTemplateChange.mock.calls[0][0] as Template;
    expect(updated.title).toBe("Updated");
    expect(Object.keys(updated.buttons)).toHaveLength(1);
  });
});
