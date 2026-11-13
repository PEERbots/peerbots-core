import React from "react";
import axe from "axe-core";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PeerbotsI18nProvider } from "../../i18n";
import {
  PEERBOTS_EMOTIONS,
  type RobotControlButton,
  type Template,
} from "../../templates/types";
import {
  emotion_mapping,
  PEERBOTS_EMOTION_IMAGES,
} from "../forms/emotionMapper";
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
import type { RobotControlButtonAction } from "../patterns/control-views/types";

afterEach(() => {
  cleanup();
});

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
  describe("emotionMapper, EmotionSelector & PeerbotsEmotionIcon", () => {
    it("maps all 6 Peerbots emotions to robot face PNGs with Happy === Neutral and emotion_mapping alias", () => {
      expect(emotion_mapping).toBe(PEERBOTS_EMOTION_IMAGES);
      for (const emotion of PEERBOTS_EMOTIONS) {
        expect(typeof PEERBOTS_EMOTION_IMAGES[emotion]).toBe("string");
        expect(PEERBOTS_EMOTION_IMAGES[emotion].length).toBeGreaterThan(0);
      }
      expect(PEERBOTS_EMOTION_IMAGES.Happy).toBe(
        PEERBOTS_EMOTION_IMAGES.Neutral,
      );
      expect(PEERBOTS_EMOTION_IMAGES.Sleepy).toContain("Sleep");
      expect(PEERBOTS_EMOTION_IMAGES.Surprised).toContain("Surprised");
      expect(PEERBOTS_EMOTION_IMAGES.Sad).toContain("Sad");
      expect(PEERBOTS_EMOTION_IMAGES.Concerned).toContain("Concerned");
    });

    it("renders compact icon-only buttons using PNG <img> icons on Peerbots primary teal background with zero axe violations", async () => {
      const { container } = render(
        <EmotionSelector selectedEmotion="Happy" />,
      );
      const group = screen.getByRole("radiogroup", {
        name: "Emotion selector",
      });
      expect(group).toBeInTheDocument();

      // Zero SVG elements — all default emotion icons are PNG <img> elements
      expect(container.querySelectorAll("svg")).toHaveLength(0);
      const imgs = container.querySelectorAll("img");
      expect(imgs).toHaveLength(6);

      const happyRadio = screen.getByRole("radio", {
        name: "Select emotion Happy",
      });
      const neutralRadio = screen.getByRole("radio", {
        name: "Select emotion Neutral",
      });
      expect(happyRadio).toHaveAttribute("aria-checked", "true");
      // Compact icon-only buttons must not render stacked visible label text inside the button
      expect(happyRadio.textContent).toBe("");
      expect(neutralRadio.textContent).toBe("");
      expect(happyRadio.className).toContain("pb:h-8");
      expect(happyRadio.className).toContain("pb:w-8");
      expect(happyRadio.className).toContain("pb:bg-primary");
      expect(happyRadio.className).toContain("hover:pb:bg-peerbots-teal");
      expect(happyRadio.className).toContain("pb:border-2");
      expect(happyRadio.className).toContain("pb:border-gray-950");
      expect(neutralRadio.className).toContain("pb:bg-primary");
      expect(neutralRadio.className).toContain("hover:pb:bg-peerbots-teal");
      expect(neutralRadio.className).toContain("pb:border-teal-800/25");

      const happyImg = happyRadio.querySelector("img")!;
      const neutralImg = neutralRadio.querySelector("img")!;
      expect(happyImg.getAttribute("src")).toBe(neutralImg.getAttribute("src"));

      const axeResults = await axe.run(container, {
        rules: { "color-contrast": { enabled: false } },
      });
      expect(axeResults.violations).toEqual([]);
    });

    it("supports showTooltips={false}, size presets, custom icons (URL & ReactNode), and non-decorative img alt text", () => {
      const htmlWithoutTooltip = renderToString(
        <EmotionSelector
          value="Concerned"
          size="lg"
          showTooltips={false}
          emotionIcons={{
            Happy: "https://example.com/happy.png",
            Sad: <span data-testid="custom-sad">:(</span>,
          }}
          emotionLabels={{ Concerned: "Preocupado" }}
        />,
      );
      expect(htmlWithoutTooltip).toContain("pb:h-10 pb:w-10");
      expect(htmlWithoutTooltip).toContain("https://example.com/happy.png");
      expect(htmlWithoutTooltip).toContain("custom-sad");
      expect(htmlWithoutTooltip).toContain("Select emotion Preocupado");

      const nonDecorativeDefault = renderToString(
        <PeerbotsEmotionIcon
          emotion="Surprised"
          decorative={false}
          label="Wow"
        />,
      );
      expect(nonDecorativeDefault).toContain("<img");
      expect(nonDecorativeDefault).toContain('alt="Wow"');

      const nonDecorativeCustomNode = renderToString(
        <PeerbotsEmotionIcon
          emotion="Sad"
          customIcon={<span>SadNode</span>}
          decorative={false}
          label="Sad custom"
        />,
      );
      expect(nonDecorativeCustomNode).toContain('role="img"');
      expect(nonDecorativeCustomNode).toContain('aria-label="Sad custom"');
    });

    it("invokes onEmotionSelect and onChange unless disabled", () => {
      const onEmotionSelect = vi.fn();
      const onChange = vi.fn();
      render(
        <EmotionSelector
          selectedEmotion="Neutral"
          onEmotionSelect={onEmotionSelect}
          onChange={onChange}
        />,
      );

      fireEvent.click(
        screen.getByRole("radio", { name: "Select emotion Happy" }),
      );
      expect(onEmotionSelect).toHaveBeenCalledWith("Happy");
      expect(onChange).toHaveBeenCalledWith("Happy");

      cleanup();
      const disabledSelect = vi.fn();
      render(
        <EmotionSelector disabled onEmotionSelect={disabledSelect} />,
      );
      fireEvent.click(
        screen.getByRole("radio", { name: "Select emotion Sad" }),
      );
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
        title: "Hello & Welcome",
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

    it("keeps accessible name strictly equal to visible title without appending emotion label", () => {
      const { container } = render(<PeerbotsButton button={msgButton} selected />);
      const btn = screen.getByRole("button", { name: "Hello & Welcome" });
      expect(btn).toBeInTheDocument();
      expect(btn).toHaveAttribute("aria-pressed", "true");
      expect(
        screen.queryByRole("button", { name: /Happy/i }),
      ).not.toBeInTheDocument();

      const badgeImg = container.querySelector("img")!;
      expect(badgeImg).toHaveAttribute("alt", "");
      expect(badgeImg).toHaveAttribute("aria-hidden", "true");
    });

    it("renders Message and Log buttons with RTL-safe logical classes and null safety", () => {
      const msgHtml = renderToString(
        <PeerbotsButton button={msgButton} selected />,
      );
      expect(msgHtml).toContain("Hello &amp; Welcome");
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
      render(<PeerbotsButton button={msgButton} onClick={onClick} />);
      fireEvent.click(screen.getByRole("button", { name: "Hello & Welcome" }));
      expect(onClick).toHaveBeenCalledTimes(1);

      cleanup();
      const disabledClick = vi.fn();
      render(
        <PeerbotsButton
          button={msgButton}
          disabled
          onClick={disabledClick}
        />,
      );
      fireEvent.click(screen.getByRole("button", { name: "Hello & Welcome" }));
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

    it("dispatches selection, click, save (with syncVals and newButtonInfo), type switch, move, and delete actions", () => {
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

      const sendBtn = findElements(
        tree,
        (el) =>
          typeof el.props["aria-label"] === "string" &&
          (el.props["aria-label"] as string).startsWith("Send message:"),
      )[0];
      (sendBtn.props.onClick as () => void)();

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

      const typeSelect = findElements(
        tree,
        (el) => el.props["aria-label"] === "Type",
      )[0];
      (typeSelect.props.onChange as (v: string) => void)("Log");

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
      expect(actions).toContainEqual(
        expect.objectContaining({
          type: "SAVE",
          newButton: {
            ...messageRow,
            details: {
              ...messageRow.details,
              title: "Synced Greeting",
              speech: "Synced Greeting",
            },
          },
          newButtonInfo: {
            ...messageRow,
            details: {
              ...messageRow.details,
              title: "Synced Greeting",
              speech: "Synced Greeting",
            },
          },
        }),
      );
      expect(actions).toContainEqual({ type: "MOVE", direction: "BACK" });
      expect(actions).toContainEqual({ type: "MOVE", direction: "FORWARD" });
      expect(actions).toContainEqual({ type: "DELETE" });

      const logActions: RobotControlButtonAction[] = [];
      const logTree = captureElement(() =>
        PeerbotsButtonRow({
          buttonInfo: logRow,
          syncVals: true,
          onAction: (a) => logActions.push(a),
        }),
      );
      const logTypeSelect = findElements(
        logTree,
        (el) => el.props["aria-label"] === "Type",
      )[0];
      (logTypeSelect.props.onChange as (v: string) => void)("Message");
      expect(logActions).toContainEqual(
        expect.objectContaining({
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
        }),
      );

      let hookResult: ReturnType<typeof useSelectionInput> | undefined;
      captureElement(() => {
        hookResult = useSelectionInput("abc");
        return <div />;
      });
      expect(hookResult?.cursor).toBeNull();
    });
  });

  describe("PeerbotsButtonDisplay Orchestrator", () => {
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

    it("switches seamlessly across Buttons, Table, and lazy Flow views with showViewSwitcher", async () => {
      const onButtonAction = vi.fn();
      const onViewChange = vi.fn();

      render(
        <PeerbotsButtonDisplay
          template={sampleTemplate}
          defaultView="Buttons"
          showViewSwitcher
          selectedButtonId="b1"
          onViewChange={onViewChange}
          onButtonAction={onButtonAction}
        />,
      );

      // Initially in Buttons view
      const parentBtn = screen.getByRole("button", { name: "Parent" });
      fireEvent.click(parentBtn);
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

      // Switch to Table view
      fireEvent.click(screen.getByRole("button", { name: "Table" }));
      expect(onViewChange).toHaveBeenCalledWith("Table");
      expect(screen.getByRole("table")).toBeInTheDocument();
      expect(
        screen.getByRole("textbox", { name: "Title: Parent" }),
      ).toHaveValue("Parent");

      // Switch to Flow view (lazy loaded)
      fireEvent.click(screen.getByRole("button", { name: "Flow" }));
      expect(onViewChange).toHaveBeenCalledWith("Flow");
      await waitFor(() => {
        expect(screen.getByText("Layout")).toBeInTheDocument();
        expect(
          screen.getByRole("button", { name: "Parent" }),
        ).toBeInTheDocument();
      });
    });

    it("supports custom view override and returns empty when unknown view has no renderer", () => {
      const onButtonAction = vi.fn();
      const customHtml = renderToString(
        <PeerbotsButtonDisplay
          template={sampleTemplate}
          view="CustomTimeline"
          onButtonAction={onButtonAction}
          renderCustomView={({ view }) => <div>{`Custom: ${view}`}</div>}
        />,
      );
      expect(customHtml).toContain("Custom: CustomTimeline");

      expect(
        renderToString(
          <PeerbotsButtonDisplay
            template={sampleTemplate}
            view="UnhandledView"
            onButtonAction={onButtonAction}
          />,
        ),
      ).toBe("");
    });
  });
});
