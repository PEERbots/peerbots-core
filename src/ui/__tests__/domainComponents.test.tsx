import React from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { PeerbotsI18nProvider } from "../../i18n";
import {
  PEERBOTS_EMOTIONS,
  type RobotControlButton,
  type RobotControlButtonAction,
  type Template,
} from "../../templates/types";
import {
  EmotionSelector,
  PeerbotsEmotionIcon,
} from "../forms/EmotionSelector";
import { LanguageSelector } from "../forms/LanguageSelector";
import { VoiceSelector } from "../forms/VoiceSelector";
import { PeerbotsButton } from "../patterns/PeerbotsButton";
import { PeerbotsButtonDisplay } from "../patterns/PeerbotsButtonDisplay";
import {
  PeerbotsButtonRow,
  useSelectionInput,
} from "../patterns/PeerbotsButtonRow";

type AnyElement = React.ReactElement<Record<string, unknown>>;

function captureElement(
  renderFn: () => React.ReactElement | null,
  providerLabels?: React.ComponentProps<typeof PeerbotsI18nProvider>["labels"],
): AnyElement | null {
  let captured: AnyElement | null = null;
  function Harness() {
    captured = renderFn() as AnyElement | null;
    return captured;
  }
  const tree = providerLabels ? (
    <PeerbotsI18nProvider labels={providerLabels}>
      <Harness />
    </PeerbotsI18nProvider>
  ) : (
    <Harness />
  );
  renderToString(tree);
  return captured;
}

function findElements(
  node: unknown,
  predicate: (el: AnyElement) => boolean,
): AnyElement[] {
  const results: AnyElement[] = [];
  function visit(current: unknown) {
    if (!current) return;
    if (Array.isArray(current)) {
      current.forEach(visit);
      return;
    }
    if (React.isValidElement(current)) {
      const el = current as AnyElement;
      if (predicate(el)) {
        results.push(el);
      }
      visit(el.props?.children);
      if (el.props?.trigger) {
        visit(el.props.trigger);
      }
    }
  }
  visit(node);
  return results;
}

describe("Domain UI Components", () => {
  describe("EmotionSelector & PeerbotsEmotionIcon", () => {
    it("renders all 6 emotions with accessible radiogroup and radio buttons", () => {
      const html = renderToString(
        <EmotionSelector
          selectedEmotion="Happy"
          size="lg"
          showTooltips={false}
        />,
      );
      expect(html).toContain('role="radiogroup"');
      expect(html).toContain('aria-label="Emotion selector"');
      expect(html).toContain('aria-checked="true"');
      for (const emotion of PEERBOTS_EMOTIONS) {
        expect(html).toContain(`Select emotion ${emotion}`);
      }
    });

    it("renders with tooltips enabled, custom icons (URL & ReactNode), and non-decorative SVG", () => {
      const htmlWithTooltip = renderToString(
        <EmotionSelector
          value="Concerned"
          size="sm"
          showTooltips
          emotionIcons={{
            Happy: "https://example.com/happy.svg",
            Sad: <span data-testid="custom-sad">:(</span>,
          }}
          emotionLabels={{ Concerned: "Preocupado" }}
        />,
      );
      expect(htmlWithTooltip).toContain("https://example.com/happy.svg");
      expect(htmlWithTooltip).toContain("custom-sad");
      expect(htmlWithTooltip).toContain("Select emotion Preocupado");

      const nonDecorativeSvg = renderToString(
        <PeerbotsEmotionIcon
          emotion="Surprised"
          decorative={false}
          label="Wow"
        />,
      );
      expect(nonDecorativeSvg).toContain('role="img"');
      expect(nonDecorativeSvg).toContain('aria-label="Wow"');

      const nonDecorativeImg = renderToString(
        <PeerbotsEmotionIcon
          emotion="Sleepy"
          customIcon="/sleepy.png"
          decorative={false}
        />,
      );
      expect(nonDecorativeImg).toContain('alt="Sleepy"');
    });

    it("invokes onEmotionSelect and onChange unless disabled", () => {
      const onEmotionSelect = vi.fn();
      const onChange = vi.fn();
      const tree = captureElement(() =>
        EmotionSelector({
          selectedEmotion: "Neutral",
          showTooltips: false,
          onEmotionSelect,
          onChange,
        }),
      );
      const happyBtn = findElements(
        tree,
        (el) => el.props["aria-label"] === "Select emotion Happy",
      )[0];
      expect(happyBtn).toBeDefined();
      (happyBtn.props.onClick as () => void)();
      expect(onEmotionSelect).toHaveBeenCalledWith("Happy");
      expect(onChange).toHaveBeenCalledWith("Happy");

      const disabledSelect = vi.fn();
      const disabledTree = captureElement(() =>
        EmotionSelector({
          disabled: true,
          showTooltips: false,
          onEmotionSelect: disabledSelect,
        }),
      );
      const sadBtn = findElements(
        disabledTree,
        (el) => el.props["aria-label"] === "Select emotion Sad",
      )[0];
      (sadBtn.props.onClick as () => void)();
      expect(disabledSelect).not.toHaveBeenCalled();
    });
  });

  describe("VoiceSelector", () => {
    const sampleVoices = [
      {
        name: "com.apple.voice.compact.en-US.Samantha",
        voiceURI: "urn:samantha",
        lang: "en-US",
      },
      {
        name: "AWS - Matthew",
        voiceURI: "aws:Matthew",
        lang: "en-US",
      },
      {
        name: "Mónica",
        voiceURI: "urn:monica",
        lang: "es-ES",
      },
    ];

    it("renders language and voice fields and resolves voice selection", () => {
      const onVoiceChange = vi.fn();
      const onLanguageChange = vi.fn();

      const html = renderToString(
        <VoiceSelector
          voices={sampleVoices}
          selectedLanguage="English"
          selectedVoiceUri="Samantha"
          onVoiceChange={onVoiceChange}
          onLanguageChange={onLanguageChange}
        />,
      );
      expect(html).toContain("Language");
      expect(html).toContain("Voice");
      expect(html).toContain("English");
      expect(html).toContain("Samantha");

      const tree = captureElement(
        () =>
          VoiceSelector({
            voices: sampleVoices,
            selectedLanguage: null,
            selectedVoiceUri: "unmatched-voice",
            onVoiceChange,
            onLanguageChange,
          }),
        { voice: { language: "Idioma", voice: "Voz" } },
      );
      const selects = findElements(
        tree,
        (el) =>
          el.props["aria-label"] === "Idioma" ||
          el.props["aria-label"] === "Voz",
      );
      expect(selects).toHaveLength(2);
      (selects[0].props.onChange as (val: string | null) => void)("Spanish");
      expect(onLanguageChange).toHaveBeenCalledWith("Spanish");
      (selects[1].props.onChange as (val: string | null) => void)("urn:monica");
      expect(onVoiceChange).toHaveBeenCalledWith("urn:monica");
    });
  });

  describe("LanguageSelector", () => {
    it("renders default, topbar, and sidebar (expanded + collapsed) variants with badges", () => {
      const defaultHtml = renderToString(
        <LanguageSelector value="es" onChange={() => undefined} />,
      );
      expect(defaultHtml).toContain("Español (Spanish)");

      const topbarHtml = renderToString(
        <LanguageSelector
          value="ar"
          variant="topbar"
          badge="beta"
          onChange={() => undefined}
        />,
      );
      expect(topbarHtml).toContain("العربية");
      expect(topbarHtml).toContain("Beta");

      const sidebarExpandedHtml = renderToString(
        <LanguageSelector
          value="fr"
          variant="sidebar"
          badge="new"
          onChange={() => undefined}
        />,
      );
      expect(sidebarExpandedHtml).toContain("Français");
      expect(sidebarExpandedHtml).toContain("New");
      expect(sidebarExpandedHtml).toContain("pb:pe-1");

      const sidebarCollapsedHtml = renderToString(
        <LanguageSelector
          value="en"
          variant="sidebar"
          isCollapsed
          badge
          onChange={() => undefined}
        />,
      );
      expect(sidebarCollapsedHtml).toContain("EN");
      expect(sidebarCollapsedHtml).toContain("pb:-end-1");
    });

    it("handles language selection across default and popover menu variants", () => {
      const onChange = vi.fn();
      const defaultTree = captureElement(() =>
        LanguageSelector({
          value: "unknown-code",
          languages: [],
          variant: "default",
          onChange,
        }),
      );
      const selectEl = findElements(
        defaultTree,
        (el) => typeof el.props.onChange === "function",
      )[0];
      (selectEl.props.onChange as (v: string | null) => void)("fr");
      expect(onChange).toHaveBeenCalledWith("fr");

      const topbarChange = vi.fn();
      const topbarTree = captureElement(() =>
        LanguageSelector({
          value: "en",
          variant: "topbar",
          onChange: topbarChange,
        }),
      );
      const menuHtml = renderToString(
        topbarTree?.props.children as React.ReactElement,
      );
      expect(menuHtml).toContain('role="group"');
      expect(menuHtml).toContain('aria-pressed="true"');
      expect(menuHtml).toContain("pb:ms-2");

      const esButton = findElements(
        topbarTree?.props.children,
        (el) => el.type === "button" && el.props["aria-pressed"] === false,
      )[0];
      (esButton.props.onClick as () => void)();
      expect(topbarChange).toHaveBeenCalledWith("es");
    });
  });

  describe("PeerbotsButton", () => {
    const msgButton: RobotControlButton = {
      type: "Message",
      labelColor: "Black",
      details: {
        title: "Greet",
        speech: "Hello!",
        color: "Yellow",
        emotion: "Happy",
      },
    };

    const logButton: RobotControlButton = {
      type: "Log",
      labelColor: "Green",
      details: {
        title: "Mark Step",
        details: "Step 1",
      },
    };

    it("renders Message and Log buttons with RTL-safe logical classes and aria-pressed", () => {
      const msgHtml = renderToString(
        <PeerbotsButton button={msgButton} selected />,
      );
      expect(msgHtml).toContain("Greet");
      expect(msgHtml).toContain('aria-pressed="true"');
      expect(msgHtml).toContain("pb:-end-3.5");
      expect(msgHtml).toContain("#FDFEFE");

      const logHtml = renderToString(
        <PeerbotsButton buttonInfo={logButton} selected={false} />,
      );
      expect(logHtml).toContain("Mark Step");
      expect(logHtml).toContain('aria-pressed="false"');
      expect(logHtml).not.toContain("pb:-end-3.5");

      expect(renderToString(<PeerbotsButton />)).toBe("");
    });

    it("invokes onClick when enabled and blocks when disabled", () => {
      const onClick = vi.fn();
      const tree = captureElement(() =>
        PeerbotsButton({ button: msgButton, onClick }),
      );
      const btn = findElements(tree, (el) => el.type === "button")[0];
      (btn.props.onClick as () => void)();
      expect(onClick).toHaveBeenCalledTimes(1);

      const disabledClick = vi.fn();
      const disabledTree = captureElement(() =>
        PeerbotsButton({
          button: msgButton,
          disabled: true,
          onClick: disabledClick,
        }),
      );
      const disabledBtn = findElements(
        disabledTree,
        (el) => el.type === "button",
      )[0];
      (disabledBtn.props.onClick as () => void)();
      expect(disabledClick).not.toHaveBeenCalled();
    });
  });

  describe("PeerbotsButtonRow & useSelectionInput", () => {
    const messageRow: RobotControlButton = {
      type: "Message",
      labelColor: "Light Blue",
      details: {
        title: "Hello",
        speech: "Hello there",
        color: "Blue",
        emotion: "Neutral",
      },
    };

    const logRow: RobotControlButton = {
      type: "Log",
      labelColor: "Grey",
      details: {
        title: "Note",
        details: "Logged observation",
      },
    };

    it("renders unique IDs across duplicate button titles and supports null safety", () => {
      expect(
        renderToString(<PeerbotsButtonRow onAction={() => undefined} />),
      ).toBe("");

      const html = renderToString(
        <div>
          <PeerbotsButtonRow
            button={messageRow}
            selected
            onAction={() => undefined}
          />
          <PeerbotsButtonRow
            button={messageRow}
            selected={false}
            onAction={() => undefined}
          />
        </div>,
      );
      const idMatches = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
      expect(new Set(idMatches).size).toBe(idMatches.length);
      expect(html).toContain("pb:ms-1");
    });

    it("dispatches selection, click, save (with syncVals), type switch, move, and delete actions", () => {
      const actions: RobotControlButtonAction[] = [];
      const tree = captureElement(() =>
        PeerbotsButtonRow({
          button: messageRow,
          buttonId: "b1",
          selected: false,
          syncVals: true,
          onAction: (a) => actions.push(a),
        }),
      );

      // Checkbox select / deselect
      const checkbox = findElements(
        tree,
        (el) =>
          typeof el.props["aria-label"] === "string" &&
          (el.props["aria-label"] as string).startsWith("Select button:"),
      )[0];
      (
        checkbox.props.onChange as (e: { target: { checked: boolean } }) => void
      )({ target: { checked: true } });
      (
        checkbox.props.onChange as (e: { target: { checked: boolean } }) => void
      )({ target: { checked: false } });

      // Send button
      const sendBtn = findElements(
        tree,
        (el) =>
          typeof el.props["aria-label"] === "string" &&
          (el.props["aria-label"] as string).startsWith("Send message:"),
      )[0];
      (sendBtn.props.onClick as () => void)();

      // Title input focus & synced change
      const titleInput = findElements(
        tree,
        (el) => el.props["aria-label"] === "Title",
      )[0];
      (titleInput.props.onFocus as () => void)();
      (
        titleInput.props.onChange as (e: {
          target: { value: string; selectionStart: number };
        }) => void
      )({ target: { value: "Synced Greeting", selectionStart: 6 } });

      // Speech input focus & synced change
      const speechInput = findElements(
        tree,
        (el) => el.props["aria-label"] === "Speech phrase",
      )[0];
      (speechInput.props.onFocus as () => void)();
      (
        speechInput.props.onChange as (e: {
          target: { value: string; selectionStart: number };
        }) => void
      )({ target: { value: "Updated Speech", selectionStart: 4 } });

      // Label color, Robot color, Emotion, and Type -> Log
      const labelColorSelect = findElements(
        tree,
        (el) => el.props["aria-label"] === "Label Color",
      )[0];
      (labelColorSelect.props.onFocus as () => void)();
      (labelColorSelect.props.onChange as (v: string) => void)("Purple");

      const faceColorSelect = findElements(
        tree,
        (el) => el.props["aria-label"] === "Face Color",
      )[0];
      (faceColorSelect.props.onFocus as () => void)();
      (faceColorSelect.props.onChange as (v: string) => void)("Green");

      const emotionSelect = findElements(
        tree,
        (el) => el.props["aria-label"] === "Emotion",
      )[0];
      (emotionSelect.props.onFocus as () => void)();
      (emotionSelect.props.onChange as (v: string) => void)("Surprised");

      const typeSelect = findElements(
        tree,
        (el) => el.props["aria-label"] === "Type",
      )[0];
      (typeSelect.props.onFocus as () => void)();
      (typeSelect.props.onChange as (v: string) => void)("Log");

      // Move Up, Move Down, Delete
      const moveUpBtn = findElements(
        tree,
        (el) => el.props["aria-label"] === "Move up",
      )[0];
      (moveUpBtn.props.onClick as () => void)();

      const moveDownBtn = findElements(
        tree,
        (el) => el.props["aria-label"] === "Move down",
      )[0];
      (moveDownBtn.props.onClick as () => void)();

      const deleteBtn = findElements(
        tree,
        (el) => el.props["aria-label"] === "Delete button",
      )[0];
      (deleteBtn.props.onClick as () => void)();

      expect(actions).toContainEqual({ type: "ADD TO SELECTION" });
      expect(actions).toContainEqual({ type: "REMOVE FROM SELECTION" });
      expect(actions).toContainEqual({ type: "CLICK" });
      expect(actions).toContainEqual({
        type: "SAVE",
        newButton: {
          ...messageRow,
          details: {
            ...messageRow.details,
            title: "Synced Greeting",
            speech: "Synced Greeting",
          },
        },
      });
      expect(actions).toContainEqual({
        type: "SAVE",
        newButton: {
          type: "Log",
          labelColor: "Light Blue",
          details: {
            title: "Hello",
            details: "Hello there",
          },
        },
      });
      expect(actions).toContainEqual({ type: "MOVE", direction: "BACK" });
      expect(actions).toContainEqual({ type: "MOVE", direction: "FORWARD" });
      expect(actions).toContainEqual({ type: "DELETE" });

      // Test Log row editing & switching Log -> Message
      const logActions: RobotControlButtonAction[] = [];
      const logTree = captureElement(() =>
        PeerbotsButtonRow({
          buttonInfo: logRow,
          syncVals: true,
          onAction: (a) => logActions.push(a),
        }),
      );
      const logTitleInput = findElements(
        logTree,
        (el) => el.props["aria-label"] === "Title",
      )[0];
      (
        logTitleInput.props.onChange as (e: {
          target: { value: string; selectionStart: number };
        }) => void
      )({ target: { value: "New Log Title", selectionStart: 3 } });

      const detailsInput = findElements(
        logTree,
        (el) => el.props["aria-label"] === "Event details",
      )[0];
      (detailsInput.props.onFocus as () => void)();
      (
        detailsInput.props.onChange as (e: {
          target: { value: string; selectionStart: number };
        }) => void
      )({ target: { value: "New Details", selectionStart: 5 } });

      const logTypeSelect = findElements(
        logTree,
        (el) => el.props["aria-label"] === "Type",
      )[0];
      (logTypeSelect.props.onChange as (v: string) => void)("Message");

      expect(logActions).toContainEqual({
        type: "SAVE",
        newButton: {
          type: "Message",
          labelColor: "Grey",
          details: {
            title: "Note",
            speech: "Logged observation",
            color: "Grey",
            emotion: "Neutral",
          },
        },
      });

      // Verify useSelectionInput hook return shape directly
      let hookResult: ReturnType<typeof useSelectionInput> | undefined;
      captureElement(() => {
        hookResult = useSelectionInput("abc");
        return <div />;
      });
      expect(hookResult?.cursor).toBeNull();
    });
  });

  describe("PeerbotsButtonDisplay", () => {
    const sampleTemplate: Template = {
      title: "Demo",
      description: "Desc",
      buttons: {
        b1: {
          type: "Message",
          labelColor: "Blue",
          details: {
            title: "Parent",
            speech: "Parent speech",
            color: "Yellow",
            emotion: "Happy",
          },
        },
        b2: {
          type: "Message",
          labelColor: "Green",
          details: {
            title: "Child",
            speech: "Child speech",
            color: "Green",
            emotion: "Neutral",
          },
        },
        b3: {
          type: "Log",
          labelColor: "Grey",
          details: {
            title: "Audit",
            details: "Logged",
          },
        },
      },
      hierarchy: {
        root: ["b1", "b3", "missing-id"],
        b1: ["b2"],
      },
    };

    it("renders Buttons view and triggers SELECT + CLICK on button press", () => {
      const onButtonAction = vi.fn();
      const html = renderToString(
        <PeerbotsButtonDisplay
          template={sampleTemplate}
          view="Buttons"
          selectedButtonId="b1"
          onButtonAction={onButtonAction}
        />,
      );
      expect(html).toContain("Parent");
      expect(html).toContain("Child");
      expect(html).toContain("Audit");

      const tree = captureElement(() =>
        PeerbotsButtonDisplay({
          template: sampleTemplate,
          view: "Buttons",
          selectedButtonId: "b1",
          onButtonAction,
        }),
      );
      const peerbotsBtns = findElements(
        tree,
        (el) => el.type === PeerbotsButton,
      );
      expect(peerbotsBtns).toHaveLength(3);
      (peerbotsBtns[0].props.onClick as () => void)();
      expect(onButtonAction).toHaveBeenCalledWith(
        sampleTemplate.buttons.b1,
        "b1",
        { type: "SELECT" },
      );
      expect(onButtonAction).toHaveBeenCalledWith(
        sampleTemplate.buttons.b1,
        "b1",
        { type: "CLICK" },
      );
    });

    it("renders Table view with logical hierarchy indentation, sync switch, and bulk multi-select actions", () => {
      const onButtonAction = vi.fn();
      const onClearSelection = vi.fn();
      const onSyncTitleSpeechChange = vi.fn();

      const tableHtml = renderToString(
        <PeerbotsButtonDisplay
          template={sampleTemplate}
          view="Table"
          multiSelectedButtonIds={["b1", "b2", "b3"]}
          onClearSelection={onClearSelection}
          onSyncTitleSpeechChange={onSyncTitleSpeechChange}
          onButtonAction={onButtonAction}
        />,
      );
      expect(tableHtml).toContain("3 selected");
      expect(tableHtml).toContain("padding-inline-start:24px");

      const tree = captureElement(() =>
        PeerbotsButtonDisplay({
          template: sampleTemplate,
          view: "Table",
          syncTitleSpeech: true,
          multiSelectedButtonIds: ["b1", "b2", "b3"],
          onClearSelection,
          onSyncTitleSpeechChange,
          onButtonAction,
        }),
      );

      // Toggle sync switch
      const syncSwitch = findElements(
        tree,
        (el) => el.props["aria-label"] === "Sync button title and speech",
      )[0];
      (syncSwitch.props.onChange as (checked: boolean) => void)(false);
      expect(onSyncTitleSpeechChange).toHaveBeenCalledWith(false);

      // Clear selection checkbox
      const clearCheckbox = findElements(
        tree,
        (el) => el.props["aria-label"] === "Clear selected buttons",
      )[0];
      (clearCheckbox.props.onChange as () => void)();
      expect(onClearSelection).toHaveBeenCalledTimes(1);

      // Bulk label color, face color, emotion, move up, move down
      const bulkLabelColor = findElements(
        tree,
        (el) => el.props["aria-label"] === "Apply all... Label Color",
      )[0];
      (bulkLabelColor.props.onChange as (v: string) => void)("Red");

      const bulkFaceColor = findElements(
        tree,
        (el) => el.props["aria-label"] === "Apply all... Face Color",
      )[0];
      (bulkFaceColor.props.onChange as (v: string) => void)("Orange");

      const bulkEmotion = findElements(
        tree,
        (el) => el.props["aria-label"] === "Apply all... Emotion",
      )[0];
      (bulkEmotion.props.onChange as (v: string) => void)("Sleepy");

      const bulkMoveUp = findElements(
        tree,
        (el) => el.props["aria-label"] === "Move up",
      )[0];
      (bulkMoveUp.props.onClick as () => void)();

      const bulkMoveDown = findElements(
        tree,
        (el) => el.props["aria-label"] === "Move down",
      )[0];
      (bulkMoveDown.props.onClick as () => void)();

      // Forward row action
      const rows = findElements(tree, (el) => el.type === PeerbotsButtonRow);
      expect(rows).toHaveLength(3);
      (rows[0].props.onAction as (a: RobotControlButtonAction) => void)({
        type: "DELETE",
      });

      expect(onButtonAction).toHaveBeenCalledWith(
        sampleTemplate.buttons.b1,
        "b1",
        { type: "DELETE" },
      );

      // Custom view & unknown view fallback
      const customHtml = renderToString(
        <PeerbotsButtonDisplay
          template={sampleTemplate}
          view="Flow"
          onButtonAction={onButtonAction}
          renderCustomView={({ view }) => <div>{`Custom: ${view}`}</div>}
        />,
      );
      expect(customHtml).toContain("Custom: Flow");

      expect(
        renderToString(
          <PeerbotsButtonDisplay
            template={sampleTemplate}
            view="Unknown"
            onButtonAction={onButtonAction}
          />,
        ),
      ).toBe("");
    });
  });
});
