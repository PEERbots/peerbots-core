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
import { FlowView } from "../../flow/FlowView";
import { moveButtonInHierarchy } from "../../templates/reordering";
import type { Template } from "../../templates/types";
import { BatchButtonEditPanel } from "../patterns/control-views/ButtonEditPopoverContent";
import { ButtonView } from "../patterns/control-views/ButtonView";
import { TableView } from "../patterns/control-views/TableView";
import { applyControlActionToTemplate } from "../patterns/control-views/applyControlAction";
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

    it("renders zero duplicate row <label>s, vivid WCAG AA row color pills, 28x28 emotion preview tiles (with Black invert), active row emphasis, and zero axe violations", async () => {
      const template = makeRichTemplate();
      template.buttons["btn-dark"] = {
        type: "Message",
        labelColor: "Black",
        details: {
          title: "Night Mode",
          speech: "Goodnight!",
          color: "Black",
          emotion: "Sleepy",
        },
      };
      template.hierarchy.root.push("btn-dark");

      const { container } = render(
        <TableView
          template={template}
          selectedButtonId="btn-1"
          onButtonAction={() => undefined}
        />,
      );

      // Zero visible <label> elements inside tbody (headers label the columns visually)
      const tbody = container.querySelector("tbody")!;
      expect(tbody.querySelectorAll("label")).toHaveLength(0);

      // Active row emphasis on selectedButtonId="btn-1"
      const activeRows = tbody.querySelectorAll('tr[data-active="true"]');
      expect(activeRows).toHaveLength(1);

      // Every row has a 4px start-edge color accent bar
      const accents = tbody.querySelectorAll("[data-row-accent]");
      expect(accents).toHaveLength(5);
      expect(accents[0]).toHaveStyle({ backgroundColor: "rgb(95, 148, 214)" }); // Blue #5F94D6

      // Button Title input is styled as a colored Peerbots button pill
      const helloTitleInput = screen.getByRole("textbox", {
        name: "Title: Hello",
      });
      expect(helloTitleInput).toHaveStyle({
        backgroundColor: "rgb(95, 148, 214)",
        color: "rgb(2, 3, 7)",
      });

      const darkTitleInput = screen.getByRole("textbox", {
        name: "Title: Night Mode",
      });
      expect(darkTitleInput).toHaveStyle({
        backgroundColor: "rgb(77, 77, 77)",
        color: "rgb(253, 254, 254)",
      });

      // Label Color & Robot Color Select triggers are color-tinted pills
      const needHelpLabelSelect = screen.getByRole("combobox", {
        name: "Label Color: Need Help",
      });
      expect(needHelpLabelSelect).toHaveStyle({
        backgroundColor: "rgb(155, 134, 243)", // Purple #9B86F3
        color: "rgb(2, 3, 7)",
      });

      const needHelpRobotSelect = screen.getByRole("combobox", {
        name: "Robot Color: Need Help",
      });
      expect(needHelpRobotSelect).toHaveStyle({
        backgroundColor: "rgb(248, 237, 177)", // Yellow #F8EDB1
        color: "rgb(2, 3, 7)",
      });

      // 28x28 Robot Face Expression preview tiles rendered for the 4 Message rows (not Log row)
      const emotionTiles = tbody.querySelectorAll("[data-emotion-tile]");
      expect(emotionTiles).toHaveLength(4);
      const blackEmotionImg =
        emotionTiles[3].querySelector("img")!;
      expect(blackEmotionImg.className).toContain("pb:invert");

      // Play button uses soft teal styling and fires SELECT + CLICK
      const playBtn = screen.getByRole("button", {
        name: "Send message: Hello",
      });
      expect(playBtn.className).toContain("pb:bg-peerbots-teal/20");

      const axeResults = await axe.run(container, {
        rules: { "color-contrast": { enabled: false } },
      });
      expect(axeResults.violations).toEqual([]);
    });
  });

  describe("applyControlActionToTemplate & moveButtonInHierarchy", () => {
    it("handles SAVE, MOVE (BACK/FORWARD + boundaries), DELETE (leaf & parent promotion), and selection no-ops purely", () => {
      const initial = makeRichTemplate();

      // 1. Selection / trigger actions return exact same template reference
      expect(
        applyControlActionToTemplate(initial, "btn-1", { type: "SELECT" }),
      ).toBe(initial);
      expect(
        applyControlActionToTemplate(initial, "btn-1", { type: "CLICK" }),
      ).toBe(initial);
      expect(
        applyControlActionToTemplate(initial, "btn-1", {
          type: "ADD TO SELECTION",
        }),
      ).toBe(initial);
      expect(
        applyControlActionToTemplate(initial, "btn-1", {
          type: "REMOVE FROM SELECTION",
        }),
      ).toBe(initial);

      // 2. SAVE updates button immutably
      const updatedBtn = {
        ...initial.buttons["btn-2"],
        labelColor: "Orange" as const,
      };
      const saved = applyControlActionToTemplate(initial, "btn-2", {
        type: "SAVE",
        newButton: updatedBtn,
      });
      expect(saved).not.toBe(initial);
      expect(saved.buttons["btn-2"].labelColor).toBe("Orange");
      expect(initial.buttons["btn-2"].labelColor).toBe("Purple");

      // 3. MOVE uses moveButtonInHierarchy cleanly and respects boundaries
      expect(
        moveButtonInHierarchy(initial.hierarchy, "btn-1", "up"),
      ).toBe(initial.hierarchy);
      const movedBack = applyControlActionToTemplate(initial, "btn-2", {
        type: "MOVE",
        direction: "BACK",
      });
      expect(movedBack.hierarchy.root).toEqual(["btn-2", "btn-1", "btn-log"]);

      const movedForward = applyControlActionToTemplate(movedBack, "btn-1", {
        type: "MOVE",
        direction: "FORWARD",
      });
      expect(movedForward.hierarchy.root).toEqual([
        "btn-2",
        "btn-log",
        "btn-1",
      ]);

      // 4. DELETE on parent ("btn-1") removes "btn-1" and promotes surviving child "btn-1a" into root!
      const deletedParent = applyControlActionToTemplate(initial, "btn-1", {
        type: "DELETE",
      });
      expect(deletedParent.buttons["btn-1"]).toBeUndefined();
      expect(deletedParent.hierarchy["btn-1"]).toBeUndefined();
      expect(deletedParent.hierarchy.root).toEqual([
        "btn-1a",
        "btn-2",
        "btn-log",
      ]);

      // 5. DELETE on leaf ("btn-log") removes it cleanly
      const deletedLeaf = applyControlActionToTemplate(
        deletedParent,
        "btn-log",
        { type: "DELETE" },
      );
      expect(deletedLeaf.buttons["btn-log"]).toBeUndefined();
      expect(deletedLeaf.hierarchy.root).toEqual(["btn-1a", "btn-2"]);
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

    it("renders modeless Select/Pan drag toggle, + Message / + Log / Auto-Layout toolbar, and creates new root nodes", () => {
      const onTemplateChange = vi.fn();
      const template = makeRichTemplate();

      render(
        <FlowView
          template={template}
          onTemplateChange={onTemplateChange}
          onButtonAction={() => undefined}
        />,
      );

      // Option 1 Log button uses dashed border and zap badge SVG
      const logBtn = screen.getByRole("button", { name: "Session Marker" });
      expect(logBtn.className).toContain("pb:border-dashed");
      expect(logBtn.querySelector("svg")).not.toBeNull();

      // Modeless drag toggle (↖ Select / ✋ Pan)
      const selectBtn = screen.getByRole("button", { name: /Select/i });
      const panBtn = screen.getByRole("button", { name: /Pan/i });
      expect(selectBtn).toHaveAttribute("aria-pressed", "true");
      fireEvent.click(panBtn);
      expect(panBtn).toHaveAttribute("aria-pressed", "true");

      // + Message creates a new root Message button in template
      fireEvent.click(screen.getByRole("button", { name: "+ Message" }));
      expect(onTemplateChange).toHaveBeenCalledTimes(1);
      const nextTemplate = onTemplateChange.mock.calls[0][0] as Template;
      expect(Object.keys(nextTemplate.buttons).length).toBe(
        Object.keys(template.buttons).length + 1,
      );
      expect(nextTemplate.hierarchy.root.length).toBe(
        template.hierarchy.root.length + 1,
      );
    });
  });

  describe("ButtonView Right-Click Edit Popover & BatchButtonEditPanel", () => {
    it("opens the concise Edit Popover on right-click in ButtonView and saves title/emotion edits", () => {
      const onButtonAction = vi.fn();
      const onTemplateChange = vi.fn();
      const template = makeRichTemplate();

      render(
        <ButtonView
          template={template}
          onTemplateChange={onTemplateChange}
          onButtonAction={onButtonAction}
        />,
      );

      const helloBtn = screen.getByRole("button", { name: "Hello" });
      fireEvent.contextMenu(helloBtn);

      const titleInput = screen.getByRole("textbox", { name: "Title" });
      expect(titleInput).toHaveValue("Hello");
      fireEvent.change(titleInput, { target: { value: "Warm Hello" } });

      expect(onTemplateChange).toHaveBeenCalledTimes(1);
      const updated = onTemplateChange.mock.calls[0][0] as Template;
      expect(updated.buttons["btn-1"].details.title).toBe("Warm Hello");

      fireEvent.click(screen.getByRole("button", { name: "Close editor" }));
      expect(
        screen.queryByRole("textbox", { name: "Title" }),
      ).not.toBeInTheDocument();
    });

    it("shows scoped controls in BatchButtonEditPanel for mixed Message + Log selection", () => {
      const template = makeRichTemplate();
      const onApplyLabelColor = vi.fn();
      const onApplyFaceColor = vi.fn();
      const onApplyEmotion = vi.fn();
      const onClearSelection = vi.fn();

      render(
        <BatchButtonEditPanel
          selectedButtons={[
            { buttonId: "btn-1", button: template.buttons["btn-1"] },
            { buttonId: "btn-log", button: template.buttons["btn-log"] },
          ]}
          onApplyLabelColor={onApplyLabelColor}
          onApplyFaceColor={onApplyFaceColor}
          onApplyEmotion={onApplyEmotion}
          onClearSelection={onClearSelection}
        />,
      );

      expect(screen.getByText("1 Message · 1 Log")).toBeInTheDocument();
      expect(screen.getByText("(All 2)")).toBeInTheDocument();
      expect(screen.getByText("(1 Message)")).toBeInTheDocument();

      fireEvent.click(
        screen.getByRole("radio", { name: "Batch button label color Orange" }),
      );
      expect(onApplyLabelColor).toHaveBeenCalledWith("Orange");

      fireEvent.click(
        within(
          screen.getByRole("radiogroup", { name: "Batch robot emotion" }),
        ).getByRole("radio", { name: "Select emotion Surprised" }),
      );
      expect(onApplyEmotion).toHaveBeenCalledWith("Surprised");
    });
  });
});
