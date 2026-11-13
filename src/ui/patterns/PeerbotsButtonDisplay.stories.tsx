import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import type { RobotControlButton, Template } from "../../templates/types";
import { PeerbotsEmotionIcon } from "../forms/EmotionSelector";
import {
  PEERBOTS_COLOR_MAP,
  PEERBOTS_FONT_COLOR_MAP,
} from "../forms/PeerbotsColorSelector";
import {
  PeerbotsButtonDisplay,
  type PeerbotsTemplateView,
} from "./PeerbotsButtonDisplay";
import { applyControlActionToTemplate } from "./control-views/applyControlAction";
import type { PeerbotsControlAction } from "./control-views/types";

const meta: Meta<typeof PeerbotsButtonDisplay> = {
  title: "Patterns/Template Views/PeerbotsButtonDisplay",
  component: PeerbotsButtonDisplay,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Unified multi-view Peerbots template workspace combining a `<TabRadio>` view switcher (`Buttons`, `Table`, `Flow`) with `<ButtonView>`, `<TableView>`, and optional `<FlowView>`. Pair with `applyControlActionToTemplate` to handle inline edits, reordering, deletion, and column Apply-All across views.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PeerbotsButtonDisplay>;

const createPlaySessionTemplate = (): Template => ({
  id: "play-session",
  title: "Play Session",
  description: "Turn-taking, emotional check-in, and calming script",
  buttons: {
    "btn-greet": {
      type: "Message",
      labelColor: "Light Blue",
      details: {
        title: "Wave Hello",
        speech: "Hi friend! Ready to build blocks together?",
        color: "Yellow",
        emotion: "Happy",
      },
    },
    "btn-followup": {
      type: "Message",
      labelColor: "Green",
      details: {
        title: "Your Turn",
        speech: "Your turn to add a block to the tower!",
        color: "Green",
        emotion: "Surprised",
      },
    },
    "btn-break": {
      type: "Message",
      labelColor: "Purple",
      details: {
        title: "Take a Breather",
        speech: "Let us take three slow breaths together.",
        color: "Blue",
        emotion: "Concerned",
      },
    },
    "btn-night": {
      type: "Message",
      labelColor: "Black",
      details: {
        title: "Quiet Rest",
        speech: "Time for a calm, cozy rest.",
        color: "Black",
        emotion: "Sleepy",
      },
    },
    "btn-log": {
      type: "Log",
      labelColor: "Grey",
      details: {
        title: "Log Turn",
        details: "Completed turn-taking exchange",
      },
    },
  },
  hierarchy: {
    root: ["btn-greet", "btn-break", "btn-night", "btn-log"],
    "btn-greet": ["btn-followup"],
  },
});

function RobotActionPreviewBanner({
  activeButton,
  lastActionLabel,
}: {
  activeButton?: RobotControlButton;
  lastActionLabel: string;
}) {
  if (!activeButton) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="pb:mb-4 pb:flex pb:items-center pb:justify-between pb:gap-3 pb:rounded-xl pb:border pb:border-gray-200 pb:bg-gray-50 pb:px-4 pb:py-2.5 pb:text-xs pb:text-gray-700"
      >
        <span>
          <strong>Last Robot Action Preview:</strong> Click any button or row
          Play icon to trigger a robot expression.
        </span>
        <span className="pb:font-mono pb:text-gray-600">{lastActionLabel}</span>
      </div>
    );
  }

  const labelBg = PEERBOTS_COLOR_MAP[activeButton.labelColor] ?? "#ABE3FA";
  const labelFg = PEERBOTS_FONT_COLOR_MAP[activeButton.labelColor] ?? "#020307";
  const robotBg =
    activeButton.type === "Message"
      ? (PEERBOTS_COLOR_MAP[activeButton.details.color] ?? "#FDFEFE")
      : "#CECECE";

  return (
    <div
      role="status"
      aria-live="polite"
      className="pb:mb-4 pb:flex pb:flex-wrap pb:items-center pb:justify-between pb:gap-3 pb:rounded-xl pb:border pb:border-teal-200 pb:bg-teal-50/50 pb:px-4 pb:py-2.5"
    >
      <div className="pb:flex pb:items-center pb:gap-3 pb:min-w-0">
        {activeButton.type === "Message" && (
          <span
            aria-hidden="true"
            className="pb:inline-flex pb:h-9 pb:w-9 pb:shrink-0 pb:items-center pb:justify-center pb:rounded-lg pb:border pb:border-black/25 pb:p-1 pb:shadow-xs"
            style={{ backgroundColor: robotBg }}
          >
            <PeerbotsEmotionIcon
              emotion={activeButton.details.emotion}
              decorative
              className={
                activeButton.details.color === "Black" ? "pb:invert" : undefined
              }
            />
          </span>
        )}
        <div className="pb:min-w-0">
          <div className="pb:flex pb:items-center pb:gap-2">
            <span className="pb:text-xs pb:font-bold pb:text-gray-900">
              Last Robot Action Preview:
            </span>
            <span
              className="pb:inline-block pb:rounded-md pb:border pb:border-black/15 pb:px-2 pb:py-0.5 pb:text-xs pb:font-semibold"
              style={{ backgroundColor: labelBg, color: labelFg }}
            >
              {activeButton.details.title}
            </span>
            {activeButton.type === "Message" && (
              <span className="pb:text-xs pb:text-gray-700">
                ({activeButton.details.color} • {activeButton.details.emotion})
              </span>
            )}
          </div>
          <p className="pb:mt-0.5 pb:truncate pb:text-xs pb:text-gray-800">
            {activeButton.type === "Message"
              ? `Speech: "${activeButton.details.speech}"`
              : `Log note: "${activeButton.details.details}"`}
          </p>
        </div>
      </div>
      <span className="pb:rounded-md pb:bg-white pb:px-2 pb:py-1 pb:font-mono pb:text-[11px] pb:text-gray-700 pb:border pb:border-gray-200">
        {lastActionLabel}
      </span>
    </div>
  );
}

export const Default: Story = {
  render: function Render() {
    const [template, setTemplate] = useState<Template>(
      createPlaySessionTemplate,
    );
    const [selectedId, setSelectedId] = useState<string | null>("btn-greet");
    const [multiSelected, setMultiSelected] = useState<string[]>([]);
    const [lastAction, setLastAction] = useState<string>("Ready");

    const handleAction = (
      _btn: RobotControlButton,
      buttonId: string,
      action: PeerbotsControlAction,
    ) => {
      setLastAction(`${action.type} (${buttonId})`);
      if (action.type === "SELECT" || action.type === "CLICK") {
        setSelectedId(buttonId);
        return;
      }
      setTemplate((prev) =>
        applyControlActionToTemplate(prev, buttonId, action),
      );
      if (action.type === "DELETE" && selectedId === buttonId) {
        setSelectedId(null);
      }
    };

    const activeButton = selectedId ? template.buttons[selectedId] : undefined;

    return (
      <div className="pb:min-h-[560px]">
        <RobotActionPreviewBanner
          activeButton={activeButton}
          lastActionLabel={lastAction}
        />
        <PeerbotsButtonDisplay
          template={template}
          defaultView="Buttons"
          showViewSwitcher
          selectedButtonId={selectedId}
          selectedButtonIds={multiSelected}
          onSelectedButtonIdsChange={setMultiSelected}
          onClearSelection={() => setMultiSelected([])}
          onButtonAction={handleAction}
          onAddConnection={(sourceId, targetId) => {
            setLastAction(`CONNECT (${sourceId} -> ${targetId})`);
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
            setLastAction(`DISCONNECT (${sourceId} -x-> ${targetId})`);
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
    );
  },
};

export const ControlledTableMode: Story = {
  render: function Render() {
    const [template, setTemplate] = useState<Template>(
      createPlaySessionTemplate,
    );
    const [view, setView] = useState<PeerbotsTemplateView>("Table");
    const [selectedId, setSelectedId] = useState<string | null>("btn-greet");
    const [multiSelected, setMultiSelected] = useState<string[]>([
      "btn-greet",
      "btn-followup",
    ]);
    const [lastAction, setLastAction] = useState<string>("Controlled Table");

    return (
      <div className="pb:min-h-[540px]">
        <RobotActionPreviewBanner
          activeButton={selectedId ? template.buttons[selectedId] : undefined}
          lastActionLabel={lastAction}
        />
        <PeerbotsButtonDisplay
          template={template}
          view={view}
          onViewChange={setView}
          showViewSwitcher
          selectedButtonId={selectedId}
          selectedButtonIds={multiSelected}
          onSelectedButtonIdsChange={setMultiSelected}
          onClearSelection={() => setMultiSelected([])}
          onButtonAction={(_btn, buttonId, action) => {
            setLastAction(`${action.type} (${buttonId})`);
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
    );
  },
};

export const ControlledFlowMode: Story = {
  render: function Render() {
    const [template, setTemplate] = useState<Template>(
      createPlaySessionTemplate,
    );
    const [view, setView] = useState<PeerbotsTemplateView>("Flow");
    const [selectedId, setSelectedId] = useState<string | null>("btn-greet");
    const [lastAction, setLastAction] = useState<string>("Controlled Flow");

    return (
      <div className="pb:h-[580px]">
        <RobotActionPreviewBanner
          activeButton={selectedId ? template.buttons[selectedId] : undefined}
          lastActionLabel={lastAction}
        />
        <PeerbotsButtonDisplay
          template={template}
          view={view}
          onViewChange={setView}
          showViewSwitcher
          selectedButtonId={selectedId}
          onButtonAction={(_btn, buttonId, action) => {
            setLastAction(`${action.type} (${buttonId})`);
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
    );
  },
};

export const ReadOnlyDisabledMode: Story = {
  render: function Render() {
    const [template] = useState<Template>(createPlaySessionTemplate);
    return (
      <div className="pb:min-h-[480px]">
        <PeerbotsButtonDisplay
          template={template}
          defaultView="Table"
          disabled
          selectedButtonId="btn-greet"
          onButtonAction={() => undefined}
        />
      </div>
    );
  },
};
