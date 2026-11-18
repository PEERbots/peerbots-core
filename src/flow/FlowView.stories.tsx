import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import type { RobotControlButton, Template } from "../templates/types";
import { PeerbotsEmotionIcon } from "../ui/forms/EmotionSelector";
import {
  PEERBOTS_COLOR_MAP,
  PEERBOTS_FONT_COLOR_MAP,
} from "../ui/forms/PeerbotsColorSelector";
import { applyControlActionToTemplate } from "../ui/patterns/control-views/applyControlAction";
import { FlowView } from "./FlowView";

const meta: Meta<typeof FlowView> = {
  title: "Templates/Views/FlowView",
  component: FlowView,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Modeless interactive conversation hierarchy graph editor for Peerbots templates powered by `@xyflow/react` and `@dagrejs/dagre` (`@peerbots/core/flow`). Supports simultaneous two-finger scroll panning, pinch/Ctrl+scroll zoom, `Space`+drag panning, marquee/`Shift`-click multi-select with selection-aware Batch Editing, double-click / `✎ Edit` inline popovers, sticky manual drag coordinates, sibling drag-reordering, and converging DAG + unlinked orphan layout.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FlowView>;

const createConversationTreeTemplate = (): Template => ({
  id: "conversation-tree",
  title: "Emotional Check-In (Message ↔ User Intent Flow)",
  description:
    "Branching conversation using Message (Robot Action) and Log (User Intent) nodes with converging follow-ups",
  buttons: {
    "m-greet": {
      type: "Message",
      labelColor: "Light Blue",
      details: {
        title: "Morning Greeting",
        speech: "Good morning! How is your body feeling today?",
        color: "Yellow",
        emotion: "Happy",
      },
    },
    "l-excited": {
      type: "Log",
      labelColor: "Green",
      details: {
        title: "Student: Excited",
        details: "Smiles, bounces, or shares high energy",
      },
    },
    "l-worried": {
      type: "Log",
      labelColor: "Purple",
      details: {
        title: "Student: Worried",
        details: "Covers ears, looks away, or says nervous",
      },
    },
    "l-break": {
      type: "Log",
      labelColor: "Orange",
      details: {
        title: "Requests a Break",
        details: "Spontaneous root user intent at any point",
      },
    },
    "m-game": {
      type: "Message",
      labelColor: "Green",
      details: {
        title: "Start Listening Game",
        speech: "Awesome energy! Let us pick our first game together.",
        color: "Green",
        emotion: "Surprised",
      },
    },
    "m-breathe": {
      type: "Message",
      labelColor: "Blue",
      details: {
        title: "3 Calm Belly Breaths",
        speech: "Thank you for telling me. Let us take three slow breaths.",
        color: "Blue",
        emotion: "Concerned",
      },
    },
    "m-quiet": {
      type: "Message",
      labelColor: "Orange",
      details: {
        title: "Quiet Break Time",
        speech: "Asking for a break is super smart! Take your time.",
        color: "Pink",
        emotion: "Sleepy",
      },
    },
    "m-praise": {
      type: "Message",
      labelColor: "Yellow",
      details: {
        title: "Great Job!",
        speech: "You did a wonderful job listening to your body!",
        color: "Yellow",
        emotion: "Happy",
      },
    },
  },
  hierarchy: {
    root: ["m-greet", "l-break"],
    "m-greet": ["l-excited", "l-worried"],
    "l-excited": ["m-game"],
    "l-worried": ["m-breathe"],
    "l-break": ["m-quiet"],
    "m-game": ["m-praise"],
    "m-breathe": ["m-praise"],
  },
});

function FlowRobotPreviewBanner({
  button,
  lastEvent,
}: {
  button?: RobotControlButton;
  lastEvent: string;
}) {
  const labelBg = button
    ? (PEERBOTS_COLOR_MAP[button.labelColor] ?? "#ABE3FA")
    : "#F3F4F6";
  const labelFg = button
    ? (PEERBOTS_FONT_COLOR_MAP[button.labelColor] ?? "#020307")
    : "#111827";
  const robotBg =
    button && button.type === "Message"
      ? (PEERBOTS_COLOR_MAP[button.details.color] ?? "#FDFEFE")
      : "#CECECE";

  return (
    <div
      role="status"
      aria-live="polite"
      className="pb:mb-3 pb:flex pb:flex-wrap pb:items-center pb:justify-between pb:gap-3 pb:rounded-xl pb:border pb:border-teal-200 pb:bg-teal-50/50 pb:px-4 pb:py-2.5"
    >
      {button ? (
        <div className="pb:flex pb:items-center pb:gap-3">
          {button.type === "Message" && (
            <span
              aria-hidden="true"
              className="pb:inline-flex pb:h-9 pb:w-9 pb:items-center pb:justify-center pb:rounded-lg pb:border pb:border-black/25 pb:p-1"
              style={{ backgroundColor: robotBg }}
            >
              <PeerbotsEmotionIcon
                emotion={button.details.emotion}
                decorative
                className={
                  button.details.color === "Black" ? "pb:invert" : undefined
                }
              />
            </span>
          )}
          <div>
            <div className="pb:flex pb:items-center pb:gap-2">
              <span className="pb:text-xs pb:font-bold pb:text-gray-900">
                Active Node:
              </span>
              <span
                className="pb:rounded-md pb:border pb:border-black/15 pb:px-2 pb:py-0.5 pb:text-xs pb:font-semibold"
                style={{ backgroundColor: labelBg, color: labelFg }}
              >
                {button.details.title}
              </span>
              <span className="pb:text-[11px] pb:font-semibold pb:text-teal-800">
                ({button.type})
              </span>
            </div>
            <p className="pb:mt-0.5 pb:text-xs pb:text-gray-800">
              {button.type === "Message"
                ? `Robot speaks: "${button.details.speech}"`
                : `User Intent / Log: "${button.details.details ?? ""}"`}
            </p>
          </div>
        </div>
      ) : (
        <span className="pb:text-xs pb:text-gray-700">
          Click a node to trigger, Shift/box-drag to multi-select, or double-click / click ✎ Edit to edit inline.
        </span>
      )}
      <span className="pb:rounded-md pb:border pb:border-gray-200 pb:bg-white pb:px-2.5 pb:py-1 pb:font-mono pb:text-xs pb:text-gray-700">
        {lastEvent}
      </span>
    </div>
  );
}

export const ModelessAuthoringFlow: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Modeless canvas supporting simultaneous trackpad scroll-pan, marquee/`Shift` multi-select (opening the Batch Edit Popover for 2+ nodes), double-click / `✎ Edit` inline editing, `+ Message`/`+ Log` creation, sticky drag positions, and edge wiring.",
      },
    },
  },
  render: function Render() {
    const [template, setTemplate] = useState<Template>(
      createConversationTreeTemplate,
    );
    const [selectedId, setSelectedId] = useState<string | null>("m-greet");
    const [lastEvent, setLastEvent] = useState<string>(
      "Box-drag or Shift+Click for Batch Edit · Double-click to Edit",
    );

    return (
      <div className="pb:w-full">
        <FlowRobotPreviewBanner
          button={selectedId ? template.buttons[selectedId] : undefined}
          lastEvent={lastEvent}
        />
        <div className="pb:h-[580px] pb:w-full pb:rounded-xl pb:border pb:border-gray-200 pb:overflow-hidden">
          <FlowView
            template={template}
            selectedButtonId={selectedId}
            defaultDirection="TB"
            showMiniMap
            onTemplateChange={(nextTemplate) => setTemplate(nextTemplate)}
            onButtonAction={(_btn, buttonId, action) => {
              setLastEvent(`${action.type} (${buttonId})`);
              if (action.type === "SELECT" || action.type === "CLICK") {
                setSelectedId(buttonId);
                return;
              }
              setTemplate((prev) =>
                applyControlActionToTemplate(prev, buttonId, action),
              );
            }}
          />
        </div>
      </div>
    );
  },
};

export const ReadOnlyFlow: Story = {
  render: () => (
    <div className="pb:h-[480px] pb:w-full pb:rounded-xl pb:border pb:border-gray-200 pb:overflow-hidden">
      <FlowView
        template={createConversationTreeTemplate()}
        selectedButtonId="m-greet"
        disabled
        onButtonAction={() => undefined}
      />
    </div>
  ),
};
