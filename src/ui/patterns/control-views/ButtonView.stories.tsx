import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import type { RobotControlButton, Template } from "../../../templates/types";
import { PeerbotsEmotionIcon } from "../../forms/EmotionSelector";
import {
  PEERBOTS_COLOR_MAP,
  PEERBOTS_FONT_COLOR_MAP,
} from "../../forms/PeerbotsColorSelector";
import { ButtonView } from "./ButtonView";

const meta: Meta<typeof ButtonView> = {
  title: "Templates/Views/ButtonView",
  component: ButtonView,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Responsive grid controller view rendering every visible `RobotControlButton` in `template.hierarchy` order. Message buttons display their label color fill and a corner badge previewing the robot's screen color and facial expression.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ButtonView>;

const createButtonGridTemplate = (): Template => ({
  id: "greeting-grid",
  title: "Circle Time Controller",
  description: "Quick-fire social greeting and classroom prompts",
  buttons: {
    "btn-hello": {
      type: "Message",
      labelColor: "Light Blue",
      details: {
        title: "Good Morning!",
        speech: "Good morning everyone! Let us wave hello.",
        color: "Yellow",
        emotion: "Happy",
      },
    },
    "btn-wow": {
      type: "Message",
      labelColor: "Orange",
      details: {
        title: "Awesome Job!",
        speech: "Whoa! You built that all by yourself!",
        color: "Orange",
        emotion: "Surprised",
      },
    },
    "btn-calm": {
      type: "Message",
      labelColor: "Purple",
      details: {
        title: "Gentle Breaths",
        speech: "Let us smell the flower and blow out the candle.",
        color: "Blue",
        emotion: "Concerned",
      },
    },
    "btn-sad": {
      type: "Message",
      labelColor: "Blue",
      details: {
        title: "Feeling Sad",
        speech: "It is okay to feel sad sometimes. Do you want a hug?",
        color: "Light Blue",
        emotion: "Sad",
      },
    },
    "btn-sleepy": {
      type: "Message",
      labelColor: "Pink",
      details: {
        title: "Rest Time",
        speech: "My battery is feeling sleepy. Let us rest quietly.",
        color: "Pink",
        emotion: "Sleepy",
      },
    },
    "btn-neutral": {
      type: "Message",
      labelColor: "Green",
      details: {
        title: "Ready to Listen",
        speech: "My ears are ready. Tell me your idea!",
        color: "Green",
        emotion: "Neutral",
      },
    },
  },
  hierarchy: {
    root: [
      "btn-hello",
      "btn-wow",
      "btn-calm",
      "btn-sad",
      "btn-sleepy",
      "btn-neutral",
    ],
  },
});

function LastRobotPreview({
  button,
  clickCount,
}: {
  button?: RobotControlButton;
  clickCount: number;
}) {
  if (!button) return null;
  const labelBg = PEERBOTS_COLOR_MAP[button.labelColor] ?? "#ABE3FA";
  const labelFg = PEERBOTS_FONT_COLOR_MAP[button.labelColor] ?? "#020307";
  const robotBg =
    button.type === "Message"
      ? (PEERBOTS_COLOR_MAP[button.details.color] ?? "#FDFEFE")
      : "#CECECE";

  return (
    <div
      role="status"
      aria-live="polite"
      className="pb:mb-4 pb:flex pb:flex-wrap pb:items-center pb:justify-between pb:gap-3 pb:rounded-xl pb:border pb:border-teal-200 pb:bg-teal-50/50 pb:px-4 pb:py-2.5"
    >
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
              ? `Robot speaks: "${button.details.speech}" (${button.details.emotion})`
              : `Logged observation: "${button.details.details}"`}
          </p>
        </div>
      </div>
      <span className="pb:rounded-md pb:border pb:border-gray-200 pb:bg-white pb:px-2.5 pb:py-1 pb:font-mono pb:text-xs pb:text-gray-700">
        Triggers: {clickCount}
      </span>
    </div>
  );
}

export const DefaultGrid: Story = {
  render: function Render() {
    const [template] = useState<Template>(createButtonGridTemplate);
    const [selectedId, setSelectedId] = useState<string | null>("btn-hello");
    const [clicks, setClicks] = useState<number>(1);

    return (
      <div>
        <LastRobotPreview
          button={selectedId ? template.buttons[selectedId] : undefined}
          clickCount={clicks}
        />
        <ButtonView
          template={template}
          selectedButtonId={selectedId}
          onButtonAction={(_btn, buttonId, action) => {
            if (action.type === "SELECT") {
              setSelectedId(buttonId);
            } else if (action.type === "CLICK") {
              setClicks((c) => c + 1);
            }
          }}
        />
      </div>
    );
  },
};

export const MixedMessageAndLogButtons: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Showcases `Message` buttons (solid fill + top-right Robot Face badge) alongside Option 1 `Log` buttons (tinted surface + dashed border + top-left `zap` badge). Right-click any button to open the concise inline Edit Popover.",
      },
    },
  },
  render: function Render() {
    const base = createButtonGridTemplate();
    const initialTemplate: Template = {
      ...base,
      buttons: {
        ...base.buttons,
        "log-joint-attention": {
          type: "Log",
          labelColor: "Green",
          details: {
            title: "Log Joint Attention",
            details: "Child looked at robot and partner",
          },
        },
        "log-turn-complete": {
          type: "Log",
          labelColor: "Purple",
          details: {
            title: "Log Turn Complete",
            details: "Completed turn-taking prompt",
          },
        },
      },
      hierarchy: {
        root: [
          "btn-hello",
          "btn-wow",
          "log-joint-attention",
          "btn-calm",
          "log-turn-complete",
        ],
      },
    };
    const [template, setTemplate] = useState<Template>(initialTemplate);
    const [selectedId, setSelectedId] = useState<string | null>(
      "log-joint-attention",
    );
    const [clicks, setClicks] = useState<number>(1);

    return (
      <div>
        <LastRobotPreview
          button={selectedId ? template.buttons[selectedId] : undefined}
          clickCount={clicks}
        />
        <ButtonView
          template={template}
          selectedButtonId={selectedId}
          onTemplateChange={setTemplate}
          onButtonAction={(_btn, buttonId, action) => {
            if (action.type === "SELECT") setSelectedId(buttonId);
            if (action.type === "CLICK") setClicks((c) => c + 1);
          }}
        />
      </div>
    );
  },
};

export const MultiSelectedHighlighting: Story = {
  render: () => (
    <ButtonView
      template={createButtonGridTemplate()}
      selectedButtonIds={["btn-hello", "btn-calm", "btn-neutral"]}
      onButtonAction={() => undefined}
    />
  ),
};

export const DisabledState: Story = {
  render: () => (
    <ButtonView
      template={createButtonGridTemplate()}
      selectedButtonId="btn-hello"
      disabled
      onButtonAction={() => undefined}
    />
  ),
};

export const EmptyState: Story = {
  render: () => (
    <ButtonView
      template={{
        title: "Empty Template",
        buttons: {},
        hierarchy: { root: [] },
      }}
      onButtonAction={() => undefined}
    />
  ),
};
