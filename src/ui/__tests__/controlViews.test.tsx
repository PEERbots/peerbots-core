import React from "react";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FlowView } from "../../flow/FlowView";
import type { Template } from "../../templates/types";
import { ButtonView } from "../patterns/control-views/ButtonView";
import { TableView } from "../patterns/control-views/TableView";
import type { PeerbotsControlAction } from "../patterns/control-views/types";

afterEach(() => {
  cleanup();
});

const makeRichTemplate = (): Template => ({
  id: "test-template",
  title: "Social Check-In",
  buttons: {
    "btn-1": {
      type: "Message",
      labelColor: "Blue",
      details: {
        title: "Hello",
        speech: "Hello there!",
        color: "Blue",
        emotion: "Happy",
      },
    },
    "btn-1a": {
      type: "Message",
      labelColor: "Green",
      details: {
        title: "How are you?",
        speech: "How are you feeling today?",
        color: "Green",
        emotion: "Neutral",
      },
    },
    "btn-2": {
      type: "Message",
      labelColor: "Purple",
      details: {
        title: "Need Help",
        speech: "Could you help me?",
        color: "Yellow",
        emotion: "Concerned",
      },
    },
    "btn-log": {
      type: "Log",
      labelColor: "Grey",
      details: {
        title: "Session Marker",
        details: "Child initiated greeting",
      },
    },
  },
  hierarchy: {
    root: ["btn-1", "btn-2", "btn-log"],
    "btn-1": ["btn-1a"],
  },
});

describe("Control Views Suite (ButtonView, TableView, FlowView)", () => {
  describe("ButtonView", () => {
    it("renders flattened buttons in responsive grid, highlights selection, and dispatches SELECT + CLICK", () => {
      const onButtonAction = vi.fn();
      const template = makeRichTemplate();

      render(
        <ButtonView
          template={template}
          selectedButtonId="btn-1"
          selectedButtonIds={["btn-2"]}
          onButtonAction={onButtonAction}
        />,
      );

      const helloBtn = screen.getByRole("button", { name: "Hello" });
      const childBtn = screen.getByRole("button", { name: "How are you?" });
      const needHelpBtn = screen.getByRole("button", { name: "Need Help" });
      const logBtn = screen.getByRole("button", { name: "Session Marker" });

      expect(helloBtn).toHaveAttribute("aria-pressed", "true");
      expect(needHelpBtn).toHaveAttribute("aria-pressed", "true");
      expect(childBtn).toHaveAttribute("aria-pressed", "false");
      expect(logBtn).toBeInTheDocument();

      fireEvent.click(childBtn);
      expect(onButtonAction).toHaveBeenCalledWith(
        template.buttons["btn-1a"],
        "btn-1a",
        { type: "SELECT" },
      );
      expect(onButtonAction).toHaveBeenCalledWith(
        template.buttons["btn-1a"],
        "btn-1a",
        { type: "CLICK" },
      );
    });

    it("renders EmptyState when template has zero valid buttons and respects disabled", () => {
      const onButtonAction = vi.fn();
      render(
        <ButtonView
          template={{
            title: "Empty",
            buttons: {},
            hierarchy: { root: [] },
          }}
          onButtonAction={onButtonAction}
        />,
      );
      expect(screen.getByText("No buttons in template")).toBeInTheDocument();

      cleanup();
      const template = makeRichTemplate();
      render(
        <ButtonView
          template={template}
          disabled
          onButtonAction={onButtonAction}
        />,
      );
      fireEvent.click(screen.getByRole("button", { name: "Hello" }));
      expect(onButtonAction).not.toHaveBeenCalled();
    });
  });

  describe("TableView (Ported app.peerbots.org + PR #26 Table Suite)", () => {
    it("renders buttons and their SVG icons (ported from app.peerbots.org TableView.test.tsx)", () => {
      const singleTemplate: Template = {
        id: "single-template",
        title: "Test Template",
        buttons: {
          "btn-1": {
            type: "Message",
            labelColor: "Blue",
            details: {
              title: "Hello",
              speech: "Hello there!",
              color: "Blue",
              emotion: "Happy",
            },
          },
        },
        hierarchy: { root: ["btn-1"] },
      };

      render(<TableView template={singleTemplate} onButtonAction={() => {}} />);

      const sendBtn = screen.getByRole("button", { name: /send message/i });
      expect(sendBtn).toBeInTheDocument();
      expect(sendBtn.querySelector("svg")).toBeInTheDocument();

      const moveUpBtn = screen.getByRole("button", { name: /move up/i });
      expect(moveUpBtn).toBeInTheDocument();
      expect(moveUpBtn.querySelector("svg")).toBeInTheDocument();

      const moveDownBtn = screen.getByRole("button", { name: /move down/i });
      expect(moveDownBtn).toBeInTheDocument();
      expect(moveDownBtn.querySelector("svg")).toBeInTheDocument();

      const deleteBtn = screen.getByRole("button", { name: /delete/i });
      expect(deleteBtn).toBeInTheDocument();
      expect(deleteBtn.querySelector("svg")).toBeInTheDocument();
    });

    it("syncs Speech with Title by default and allows independent Speech/Details edits when toggled off", () => {
      const actions: Array<{ id: string; action: PeerbotsControlAction }> = [];
      const template = makeRichTemplate();

      render(
        <TableView
          template={template}
          onButtonAction={(_btn, id, action) => actions.push({ id, action })}
        />,
      );

      // By default syncSpeech is true: Speech input is disabled
      const helloTitleInput = screen.getByRole("textbox", {
        name: "Title: Hello",
      });
      const helloSpeechInput = screen.getByRole("textbox", {
        name: "Speech phrase: Hello",
      });
      expect(helloSpeechInput).toBeDisabled();

      // Editing Title while synced updates BOTH title and speech
      fireEvent.change(helloTitleInput, { target: { value: "Hi Friends" } });
      expect(actions).toContainEqual({
        id: "btn-1",
        action: {
          type: "SAVE",
          newButton: {
            ...template.buttons["btn-1"],
            details: {
              ...template.buttons["btn-1"].details,
              title: "Hi Friends",
              speech: "Hi Friends",
            },
          },
          newButtonInfo: {
            ...template.buttons["btn-1"],
            details: {
              ...template.buttons["btn-1"].details,
              title: "Hi Friends",
              speech: "Hi Friends",
            },
          },
        },
      });

      // Toggle Sync Speech with Title switch OFF
      const syncSwitch = screen.getByRole("switch", {
        name: "Sync Speech with Title",
      });
      fireEvent.click(syncSwitch);
      expect(helloSpeechInput).not.toBeDisabled();

      // Editing Title when unsynced leaves original speech intact
      actions.length = 0;
      fireEvent.change(helloTitleInput, { target: { value: "Short Label" } });
      expect(actions).toContainEqual({
        id: "btn-1",
        action: expect.objectContaining({
          type: "SAVE",
          newButtonInfo: {
            ...template.buttons["btn-1"],
            details: {
              ...template.buttons["btn-1"].details,
              title: "Short Label",
              speech: "Hello there!",
            },
          },
        }),
      });

      // Editing Speech directly when unsynced updates speech only
      actions.length = 0;
      fireEvent.change(helloSpeechInput, {
        target: { value: "Expanded spoken sentence" },
      });
      expect(actions).toContainEqual({
        id: "btn-1",
        action: expect.objectContaining({
          type: "SAVE",
          newButtonInfo: {
            ...template.buttons["btn-1"],
            details: {
              ...template.buttons["btn-1"].details,
              title: "Hello",
              speech: "Expanded spoken sentence",
            },
          },
        }),
      });

      // Log row details input is also editable when unsynced
      const logDetailsInput = screen.getByRole("textbox", {
        name: "Event details: Session Marker",
      });
      expect(logDetailsInput).not.toBeDisabled();
      actions.length = 0;
      fireEvent.change(logDetailsInput, {
        target: { value: "Updated log note" },
      });
      expect(actions).toContainEqual({
        id: "btn-log",
        action: expect.objectContaining({
          type: "SAVE",
          newButtonInfo: {
            type: "Log",
            labelColor: "Grey",
            details: {
              title: "Session Marker",
              details: "Updated log note",
            },
          },
        }),
      });
    });

    it("enforces sibling boundaries on Move Back / Move Forward and dispatches row Play & Delete", () => {
      const actions: Array<{ id: string; action: PeerbotsControlAction }> = [];
      const template = makeRichTemplate();

      render(
        <TableView
          template={template}
          onButtonAction={(_btn, id, action) => actions.push({ id, action })}
        />,
      );

      // Root siblings: ["btn-1", "btn-2", "btn-log"]
      // btn-1 is first sibling -> Move up disabled, Move down enabled
      expect(
        screen.getByRole("button", { name: "Move up: Hello" }),
      ).toBeDisabled();
      expect(
        screen.getByRole("button", { name: "Move down: Hello" }),
      ).not.toBeDisabled();

      // btn-1a is only child of btn-1 -> both Move up and Move down disabled, depth-indented
      expect(
        screen.getByRole("button", { name: "Move up: How are you?" }),
      ).toBeDisabled();
      expect(
        screen.getByRole("button", { name: "Move down: How are you?" }),
      ).toBeDisabled();

      // btn-2 is middle sibling -> both enabled
      const moveUpBtn2 = screen.getByRole("button", {
        name: "Move up: Need Help",
      });
      const moveDownBtn2 = screen.getByRole("button", {
        name: "Move down: Need Help",
      });
      expect(moveUpBtn2).not.toBeDisabled();
      expect(moveDownBtn2).not.toBeDisabled();

      // btn-log is last sibling -> Move down disabled
      expect(
        screen.getByRole("button", { name: "Move down: Session Marker" }),
      ).toBeDisabled();

      fireEvent.click(moveUpBtn2);
      expect(actions).toContainEqual({
        id: "btn-2",
        action: { type: "MOVE", direction: "BACK" },
      });

      fireEvent.click(moveDownBtn2);
      expect(actions).toContainEqual({
        id: "btn-2",
        action: { type: "MOVE", direction: "FORWARD" },
      });

      fireEvent.click(
        screen.getByRole("button", { name: "Send message: Hello" }),
      );
      expect(actions).toContainEqual({
        id: "btn-1",
        action: { type: "CLICK" },
      });

      fireEvent.click(
        screen.getByRole("button", { name: "Delete button: Session Marker" }),
      );
      expect(actions).toContainEqual({
        id: "btn-log",
        action: { type: "DELETE" },
      });
    });

    it("supports multi-row Checkbox selection, Shift+Click range selection, and TableBulkActionBar batch actions", () => {
      const actions: Array<{ id: string; action: PeerbotsControlAction }> = [];
      const onSelectedChange = vi.fn();
      const template = makeRichTemplate();

      render(
        <TableView
          template={template}
          onSelectedButtonIdsChange={onSelectedChange}
          onButtonAction={(_btn, id, action) => actions.push({ id, action })}
        />,
      );

      // Visible rows order: 0="btn-1", 1="btn-1a", 2="btn-2", 3="btn-log"
      const row0Checkbox = screen.getByRole("checkbox", {
        name: "Select button: Hello",
      });
      const row2Checkbox = screen.getByRole("checkbox", {
        name: "Select button: Need Help",
      });

      // Click row 0
      fireEvent.click(row0Checkbox);
      expect(onSelectedChange).toHaveBeenLastCalledWith(["btn-1"]);

      // Shift+Click row 2 selects contiguous range [0..2] ("btn-1", "btn-1a", "btn-2")
      fireEvent.click(row2Checkbox, { shiftKey: true });
      expect(onSelectedChange).toHaveBeenLastCalledWith([
        "btn-1",
        "btn-1a",
        "btn-2",
      ]);

      // Header select-all checkbox is now indeterminate (3 of 4 selected)
      const selectAllCheckbox = screen.getByRole("checkbox", {
        name: "Select all buttons",
      });
      expect(selectAllCheckbox).toHaveAttribute("aria-checked", "mixed");

      // TableBulkActionBar is visible showing 3 selected
      const bulkToolbar = screen.getByRole("status");
      expect(bulkToolbar).toHaveTextContent("3 selected");

      // Trigger batch Move Back, Move Forward, and Clear Selection
      actions.length = 0;
      fireEvent.click(
        within(bulkToolbar).getByRole("button", { name: "Move selected back" }),
      );
      expect(
        actions.filter(
          (a) => a.action.type === "MOVE" && a.action.direction === "BACK",
        ),
      ).toHaveLength(3);

      actions.length = 0;
      fireEvent.click(
        within(bulkToolbar).getByRole("button", {
          name: "Move selected forward",
        }),
      );
      expect(
        actions.filter(
          (a) => a.action.type === "MOVE" && a.action.direction === "FORWARD",
        ),
      ).toHaveLength(3);

      // Batch Delete removes selected items and clears them from selection
      actions.length = 0;
      fireEvent.click(
        within(bulkToolbar).getByRole("button", {
          name: "Delete selected buttons",
        }),
      );
      expect(actions.filter((a) => a.action.type === "DELETE")).toHaveLength(3);
      expect(onSelectedChange).toHaveBeenLastCalledWith([]);
    });

    it("applies column-level batch Label Color, Robot Color, and Emotion via TableColumnApplyAllPopover", () => {
      const actions: Array<{ id: string; action: PeerbotsControlAction }> = [];
      const onBatchSave = vi.fn();
      const template = makeRichTemplate();

      // Case 1: No rows selected -> Emotion Apply-All applies to all 3 Message rows (skipping Log row!)
      render(
        <TableView
          template={template}
          onBatchSave={onBatchSave}
          onButtonAction={(_btn, id, action) => actions.push({ id, action })}
        />,
      );

      const emotionApplyTrigger = screen.getByRole("button", {
        name: "Apply all (Emotion)",
      });
      fireEvent.click(emotionApplyTrigger);

      const surprisedRadio = screen.getByRole("radio", {
        name: "Select emotion Surprised",
      });
      fireEvent.click(surprisedRadio);

      const applyAllBtn = screen.getByRole("button", {
        name: "Apply",
      });
      fireEvent.click(applyAllBtn);

      expect(onBatchSave).toHaveBeenCalledTimes(1);
      expect(actions).toHaveLength(3);
      expect(actions.map((a) => a.id)).toEqual(["btn-1", "btn-1a", "btn-2"]);
      for (const item of actions) {
        expect(item.action.type).toBe("SAVE");
        if (
          item.action.type === "SAVE" &&
          item.action.newButton.type === "Message"
        ) {
          expect(item.action.newButton.details.emotion).toBe("Surprised");
        }
      }

      // Case 2: Controlled selectedButtonIds={["btn-1", "btn-log"]} -> Label Color applies to both selected rows
      cleanup();
      actions.length = 0;
      onBatchSave.mockClear();

      render(
        <TableView
          template={template}
          selectedButtonIds={["btn-1", "btn-log"]}
          onBatchSave={onBatchSave}
          onButtonAction={(_btn, id, action) => actions.push({ id, action })}
        />,
      );

      fireEvent.click(
        screen.getByRole("button", { name: "Apply all (Label Color)" }),
      );
      expect(
        screen.getByRole("radio", { name: /Selected rows \(2\)/i }),
      ).toHaveAttribute("aria-checked", "true");
      fireEvent.click(
        screen.getByRole("radio", { name: "Select color Orange" }),
      );
      fireEvent.click(screen.getByRole("button", { name: "Apply" }));

      expect(onBatchSave).toHaveBeenCalledTimes(1);
      expect(actions.map((a) => a.id)).toEqual(["btn-1", "btn-log"]);
      for (const item of actions) {
        if (item.action.type === "SAVE") {
          expect(item.action.newButton.labelColor).toBe("Orange");
        }
      }
    });
  });

  describe("FlowView (@peerbots/core/flow)", () => {
    it("renders template nodes, dispatches SELECT + CLICK on node click, and toggles TB / LR layout direction", () => {
      const onButtonAction = vi.fn();
      const onDirectionChange = vi.fn();
      const template = makeRichTemplate();

      render(
        <FlowView
          template={template}
          selectedButtonId="btn-1"
          onDirectionChange={onDirectionChange}
          onButtonAction={onButtonAction}
        />,
      );

      const helloNodeBtn = screen.getByRole("button", { name: "Hello" });
      expect(helloNodeBtn).toHaveAttribute("aria-pressed", "true");
      expect(
        screen.getByRole("button", { name: "How are you?" }),
      ).toBeInTheDocument();

      // Clicking a node dispatches SELECT + CLICK
      const wrapperNode = helloNodeBtn.closest(".react-flow__node")!;
      fireEvent.click(wrapperNode);
      expect(onButtonAction).toHaveBeenCalledWith(
        template.buttons["btn-1"],
        "btn-1",
        { type: "SELECT" },
      );
      expect(onButtonAction).toHaveBeenCalledWith(
        template.buttons["btn-1"],
        "btn-1",
        { type: "CLICK" },
      );

      // Toggle layout direction from TB to LR via TabRadio
      const lrToggle = screen.getByRole("button", { name: /Left-Right/i });
      fireEvent.click(lrToggle);
      expect(onDirectionChange).toHaveBeenCalledWith("LR");
    });
  });
});
