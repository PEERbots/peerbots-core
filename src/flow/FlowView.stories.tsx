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
          "Interactive conversation hierarchy graph editor for Peerbots templates powered by `@xyflow/react` and `@dagrejs/dagre` (imported from `@peerbots/core/flow`). Supports automatic Top-to-Bottom (`TB`) and Left-to-Right (`LR`) Dagre layout, node selection/triggering, and live parent→child connection editing.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FlowView>;

const createConversationTreeTemplate = (): Template => ({
  id: "conversation-tree",
  title: "Multi-Branch Check-In Tree",
  description: "Branching follow-up prompts based on student response",
  buttons: {
    "node-greet": {
      type: "Message",
      labelColor: "Light Blue",
      details: {
        title: "Morning Greeting",
        speech: "Good morning! How are you feeling today?",
        color: "Yellow",
        emotion: "Happy",
      },
    },
    "node-happy": {
      type: "Message",
      labelColor: "Green",
      details: {
        title: "Feeling Great!",
        speech: "Yay! Tell me one thing you are excited about today!",
        color: "Green",
        emotion: "Surprised",
      },
    },
    "node-tired": {
      type: "Message",
      labelColor: "Pink",
      details: {
        title: "Feeling Tired",
        speech: "I feel sleepy sometimes too. Want a gentle stretch?",
        color: "Pink",
        emotion: "Sleepy",
      },
    },
    "node-worried": {
      type: "Message",
      labelColor: "Purple",
      details: {
        title: "Feeling Worried",
        speech: "Thank you for telling me. Let us take three calm breaths.",
        color: "Blue",
        emotion: "Concerned",
      },
    },
    "node-activity": {
      type: "Message",
      labelColor: "Orange",
      details: {
        title: "Start Activity",
        speech: "Awesome! Let us pick our first game together.",
        color: "Orange",
        emotion: "Happy",
      },
    },
    "node-log": {
      type: "Log",
      labelColor: "Grey",
      details: {
        title: "Log Check-In",
        details: "Recorded student check-in branch",
      },
    },
  },
  hierarchy: {
    root: ["node-greet"],
    "node-greet": ["node-happy", "node-tired", "node-worried"],
    "node-happy": ["node-activity"],
    "node-tired": ["node-activity"],
    "node-worried": ["node-log"],
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
                Last Robot Action Preview:
              </span>
              <span
                className="pb:rounded-md pb:border pb:border-black/15 pb:px-2 pb:py-0.5 pb:text-xs pb:font-semibold"
                style={{ backgroundColor: labelBg, color: labelFg }}
              >
                {button.details.title}
              </span>
            </div>
            <p className="pb:mt-0.5 pb:text-xs pb:text-gray-800">
              {button.type === "Message"
                ? `Speech: "${button.details.speech}"`
                : `Log details: "${button.details.details}"`}
            </p>
          </div>
        </div>
      ) : (
        <span className="pb:text-xs pb:text-gray-700">
          Click any graph node to preview its robot response.
        </span>
      )}
      <span className="pb:rounded-md pb:border pb:border-gray-200 pb:bg-white pb:px-2.5 pb:py-1 pb:font-mono pb:text-[11px] pb:text-gray-700">
        {lastEvent}
      </span>
    </div>
  );
}

export const TopToBottomHierarchy: Story = {
  render: function Render() {
    const [template, setTemplate] = useState<Template>(
      createConversationTreeTemplate,
    );
    const [selectedId, setSelectedId] = useState<string | null>("node-greet");
    const [lastEvent, setLastEvent] = useState<string>("Layout: TB");

    return (
      <div className="pb:w-full">
        <FlowRobotPreviewBanner
          button={selectedId ? template.buttons[selectedId] : undefined}
          lastEvent={lastEvent}
        />
        <div className="pb:h-[500px] pb:w-full pb:rounded-xl pb:border pb:border-gray-200 pb:overflow-hidden">
          <FlowView
            template={template}
            selectedButtonId={selectedId}
            defaultDirection="TB"
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

export const LeftToRightHierarchy: Story = {
  render: function Render() {
    const [template] = useState<Template>(createConversationTreeTemplate);
    const [selectedId, setSelectedId] = useState<string | null>("node-happy");
    const [lastEvent, setLastEvent] = useState<string>("Layout: LR");

    return (
      <div className="pb:w-full">
        <FlowRobotPreviewBanner
          button={selectedId ? template.buttons[selectedId] : undefined}
          lastEvent={lastEvent}
        />
        <div className="pb:h-[500px] pb:w-full pb:rounded-xl pb:border pb:border-gray-200 pb:overflow-hidden">
          <FlowView
            template={template}
            selectedButtonId={selectedId}
            defaultDirection="LR"
            onButtonAction={(_btn, buttonId, action) => {
              setLastEvent(`${action.type} (${buttonId})`);
              if (action.type === "SELECT" || action.type === "CLICK") {
                setSelectedId(buttonId);
              }
            }}
          />
        </div>
      </div>
    );
  },
};

export const MultiBranchConversationTree: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Supports live node triggering plus connecting handles (`onAddConnection`) and deleting selected edges with Backspace/Delete (`onRemoveConnection`).",
      },
    },
  },
  render: function Render() {
    const [template, setTemplate] = useState<Template>(
      createConversationTreeTemplate,
    );
    const [selectedId, setSelectedId] = useState<string | null>("node-greet");
    const [lastEvent, setLastEvent] = useState<string>(
      "Drag between handles to connect nodes",
    );

    return (
      <div className="pb:w-full">
        <FlowRobotPreviewBanner
          button={selectedId ? template.buttons[selectedId] : undefined}
          lastEvent={lastEvent}
        />
        <div className="pb:h-[540px] pb:w-full pb:rounded-xl pb:border pb:border-gray-200 pb:overflow-hidden">
          <FlowView
            template={template}
            selectedButtonId={selectedId}
            defaultDirection="TB"
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
            onAddConnection={(sourceId, targetId) => {
              setLastEvent(`Connected ${sourceId} -> ${targetId}`);
              setTemplate((prev) => {
                const existing = prev.hierarchy[sourceId] ?? [];
                if (existing.includes(targetId)) return prev;
                return {
                  ...prev,
                  hierarchy: {
                    ...prev.hierarchy,
                    [sourceId]: [...existing, targetId],
                  },
                };
              });
            }}
            onRemoveConnection={(sourceId, targetId) => {
              setLastEvent(`Removed ${sourceId} -> ${targetId}`);
              setTemplate((prev) => ({
                ...prev,
                hierarchy: {
                  ...prev.hierarchy,
                  [sourceId]: (prev.hierarchy[sourceId] ?? []).filter(
                    (id) => id !== targetId,
                  ),
                },
              }));
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
        selectedButtonId="node-greet"
        disabled
        onButtonAction={() => undefined}
      />
    </div>
  ),
};
