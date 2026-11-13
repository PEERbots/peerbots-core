import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import type { RobotControlButton, Template } from "../../../templates/types";
import { PeerbotsEmotionIcon } from "../../forms/EmotionSelector";
import {
  PEERBOTS_COLOR_MAP,
  PEERBOTS_FONT_COLOR_MAP,
} from "../../forms/PeerbotsColorSelector";
import { TableView } from "./TableView";
import { applyControlActionToTemplate } from "./applyControlAction";
import type { PeerbotsControlAction } from "./types";

const meta: Meta<typeof TableView> = {
  title: "Patterns/Template Views/TableView",
  component: TableView,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Semantic `<Table>` spreadsheet editor for Peerbots templates. Features sticky column headers with zero duplicate row labels, WCAG AA colored Button Title & Color `<Select>` pills (`PEERBOTS_COLOR_MAP` + `PEERBOTS_FONT_COLOR_MAP`), a 28×28 Robot Face Expression preview tile in the Emotion column, Shift+Click multi-selection, bulk reordering/deletion, `Sync Speech with Title`, and column `Apply All` popovers.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TableView>;

const createClassroomTemplate = (): Template => ({
  id: "classroom-checkin",
  title: "Morning Classroom Check-In",
  description: "Structured greeting, emotional check-in, and activity prompt",
  buttons: {
    "btn-welcome": {
      type: "Message",
      labelColor: "Light Blue",
      details: {
        title: "Hello & Welcome",
        speech: "Hello & Welcome",
        color: "Yellow",
        emotion: "Happy",
      },
    },
    "btn-feeling": {
      type: "Message",
      labelColor: "Green",
      details: {
        title: "How Do You Feel?",
        speech: "How is everyone feeling this morning?",
        color: "Green",
        emotion: "Neutral",
      },
    },
    "btn-excited": {
      type: "Message",
      labelColor: "Orange",
      details: {
        title: "So Excited!",
        speech: "Wow, that sounds super exciting!",
        color: "Orange",
        emotion: "Surprised",
      },
    },
    "btn-calm": {
      type: "Message",
      labelColor: "Purple",
      details: {
        title: "Calm Breaths",
        speech: "Let us take three slow, gentle breaths together.",
        color: "Blue",
        emotion: "Concerned",
      },
    },
    "btn-night": {
      type: "Message",
      labelColor: "Black",
      details: {
        title: "Lights Out Rest",
        speech: "Closing my eyes for a quiet rest.",
        color: "Black",
        emotion: "Sleepy",
      },
    },
    "btn-log": {
      type: "Log",
      labelColor: "Grey",
      details: {
        title: "Log Check-In Complete",
        details: "Completed morning greeting sequence",
      },
    },
  },
  hierarchy: {
    root: ["btn-welcome", "btn-calm", "btn-night", "btn-log"],
    "btn-welcome": ["btn-feeling"],
    "btn-feeling": ["btn-excited"],
  },
});

function TableRobotPreviewBanner({
  button,
  lastAction,
}: {
  button?: RobotControlButton;
  lastAction: string;
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
      className="pb:mb-4 pb:flex pb:flex-wrap pb:items-center pb:justify-between pb:gap-3 pb:rounded-xl pb:border pb:border-teal-200 pb:bg-teal-50/50 pb:px-4 pb:py-2.5"
    >
      {button ? (
        <div className="pb:flex pb:items-center pb:gap-3 pb:min-w-0">
          {button.type === "Message" && (
            <span
              aria-hidden="true"
              className="pb:inline-flex pb:h-9 pb:w-9 pb:shrink-0 pb:items-center pb:justify-center pb:rounded-lg pb:border pb:border-black/25 pb:p-1 pb:shadow-xs"
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
          <div className="pb:min-w-0">
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
              {button.type === "Message" && (
                <span className="pb:text-xs pb:text-gray-700">
                  ({button.details.color} • {button.details.emotion})
                </span>
              )}
            </div>
            <p className="pb:mt-0.5 pb:truncate pb:text-xs pb:text-gray-800">
              {button.type === "Message"
                ? `Speech: "${button.details.speech}"`
                : `Log details: "${button.details.details}"`}
            </p>
          </div>
        </div>
      ) : (
        <span className="pb:text-xs pb:text-gray-700">
          <strong>Last Robot Action Preview:</strong> Click any row&apos;s Play
          button to preview its robot face color, emotion, and speech.
        </span>
      )}
      <span className="pb:rounded-md pb:border pb:border-gray-200 pb:bg-white pb:px-2.5 pb:py-1 pb:font-mono pb:text-[11px] pb:text-gray-700">
        {lastAction}
      </span>
    </div>
  );
}

export const InteractiveTableEditor: Story = {
  render: function Render() {
    const [template, setTemplate] = useState<Template>(createClassroomTemplate);
    const [selectedId, setSelectedId] = useState<string | null>("btn-welcome");
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

    return (
      <div>
        <TableRobotPreviewBanner
          button={selectedId ? template.buttons[selectedId] : undefined}
          lastAction={lastAction}
        />
        <TableView
          template={template}
          selectedButtonId={selectedId}
          onButtonAction={handleAction}
        />
      </div>
    );
  },
};

export const UnsyncedCustomSpeechEditing: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Starts with `defaultSyncSpeech={false}` so educators can customize short controller button titles independently from full spoken sentences.",
      },
    },
  },
  render: function Render() {
    const [template, setTemplate] = useState<Template>(createClassroomTemplate);
    const [selectedId, setSelectedId] = useState<string | null>("btn-feeling");
    const [lastAction, setLastAction] = useState<string>("Unsynced Speech");

    return (
      <div>
        <TableRobotPreviewBanner
          button={selectedId ? template.buttons[selectedId] : undefined}
          lastAction={lastAction}
        />
        <TableView
          template={template}
          selectedButtonId={selectedId}
          defaultSyncSpeech={false}
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

export const MultiSelectionAndBulkApplyAll: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Pre-selects multiple rows to showcase the `TableBulkActionBar` (`Move Back`, `Move Forward`, `Delete`) and column header `Apply All` popovers (`Label Color`, `Robot Color`, `Emotion`) scoped to selected rows or all rows.",
      },
    },
  },
  render: function Render() {
    const [template, setTemplate] = useState<Template>(createClassroomTemplate);
    const [selectedId, setSelectedId] = useState<string | null>("btn-welcome");
    const [selectedIds, setSelectedIds] = useState<string[]>([
      "btn-welcome",
      "btn-feeling",
      "btn-excited",
    ]);
    const [lastAction, setLastAction] = useState<string>("3 rows selected");

    return (
      <div>
        <TableRobotPreviewBanner
          button={selectedId ? template.buttons[selectedId] : undefined}
          lastAction={lastAction}
        />
        <TableView
          template={template}
          selectedButtonId={selectedId}
          selectedButtonIds={selectedIds}
          onSelectedButtonIdsChange={setSelectedIds}
          onClearSelection={() => setSelectedIds([])}
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

export const ComfortableVsCompactDensity: Story = {
  render: function Render() {
    const [compactTemplate, setCompactTemplate] = useState<Template>(
      createClassroomTemplate,
    );
    const [comfortableTemplate, setComfortableTemplate] = useState<Template>(
      createClassroomTemplate,
    );

    return (
      <div className="pb:space-y-8">
        <div>
          <h3 className="pb:mb-2 pb:text-sm pb:font-bold pb:text-gray-900">
            Compact Density (`density=&quot;compact&quot;` — Default)
          </h3>
          <TableView
            template={compactTemplate}
            density="compact"
            onButtonAction={(_btn, id, action) =>
              setCompactTemplate((prev) =>
                applyControlActionToTemplate(prev, id, action),
              )
            }
          />
        </div>
        <div>
          <h3 className="pb:mb-2 pb:text-sm pb:font-bold pb:text-gray-900">
            Comfortable Density (`density=&quot;comfortable&quot;`)
          </h3>
          <TableView
            template={comfortableTemplate}
            density="comfortable"
            onButtonAction={(_btn, id, action) =>
              setComfortableTemplate((prev) =>
                applyControlActionToTemplate(prev, id, action),
              )
            }
          />
        </div>
      </div>
    );
  },
};

export const ReadOnlyDisabledState: Story = {
  render: () => (
    <TableView
      template={createClassroomTemplate()}
      selectedButtonId="btn-welcome"
      disabled
      onButtonAction={() => undefined}
    />
  ),
};

export const EmptyState: Story = {
  render: () => (
    <TableView
      template={{
        title: "Empty Template",
        buttons: {},
        hierarchy: { root: [] },
      }}
      onButtonAction={() => undefined}
    />
  ),
};
