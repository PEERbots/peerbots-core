import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { FlowView } from "../../../flow/FlowView";
import type { Template, TemplateHierarchy } from "../../../templates/types";
import { ButtonView } from "./ButtonView";
import { TableView } from "./TableView";
import type { PeerbotsControlAction } from "./types";

const meta: Meta<typeof TableView> = {
  title: "Patterns/ControlViews",
  component: TableView,
};

export default meta;
type Story = StoryObj<typeof TableView>;

const createSampleTemplate = (): Template => ({
  id: "classroom-checkin",
  title: "Morning Classroom Check-In",
  description: "Structured greeting, emotional check-in, and activity prompt",
  buttons: {
    "btn-welcome": {
      type: "Message",
      labelColor: "Light Blue",
      details: {
        title: "Hello & Welcome",
        speech: "Good morning friends! Welcome to circle time.",
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
    "btn-rest": {
      type: "Message",
      labelColor: "Pink",
      details: {
        title: "Quiet Break",
        speech: "I am feeling a bit sleepy. Let us rest for a moment.",
        color: "Pink",
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
    root: ["btn-welcome", "btn-calm", "btn-rest", "btn-log"],
    "btn-welcome": ["btn-feeling"],
    "btn-feeling": ["btn-excited"],
  },
});

function applyControlActionToTemplate(
  prev: Template,
  buttonId: string,
  action: PeerbotsControlAction,
): Template {
  if (action.type === "SAVE") {
    return {
      ...prev,
      buttons: {
        ...prev.buttons,
        [buttonId]: action.newButton,
      },
    };
  }

  if (action.type === "DELETE") {
    const nextButtons = { ...prev.buttons };
    delete nextButtons[buttonId];
    const nextHierarchy: TemplateHierarchy = {
      root: prev.hierarchy.root.filter((id) => id !== buttonId),
    };
    for (const [parentKey, children] of Object.entries(prev.hierarchy)) {
      if (parentKey !== "root" && parentKey !== buttonId) {
        nextHierarchy[parentKey] = children.filter((id) => id !== buttonId);
      }
    }
    return {
      ...prev,
      buttons: nextButtons,
      hierarchy: nextHierarchy,
    };
  }

  if (action.type === "MOVE") {
    const nextHierarchy: TemplateHierarchy = { root: [...prev.hierarchy.root] };
    for (const [key, list] of Object.entries(prev.hierarchy)) {
      const idx = list.indexOf(buttonId);
      if (idx === -1) {
        nextHierarchy[key] = [...list];
        continue;
      }
      const copy = [...list];
      const targetIdx = action.direction === "BACK" ? idx - 1 : idx + 1;
      if (targetIdx >= 0 && targetIdx < copy.length) {
        const [moved] = copy.splice(idx, 1);
        copy.splice(targetIdx, 0, moved);
      }
      nextHierarchy[key] = copy;
    }
    return {
      ...prev,
      hierarchy: nextHierarchy,
    };
  }

  return prev;
}

export const ButtonsGrid: Story = {
  render: function Render() {
    const [template] = useState<Template>(createSampleTemplate);
    const [selectedId, setSelectedId] = useState<string | null>("btn-welcome");

    return (
      <div className="pb:p-4">
        <ButtonView
          template={template}
          selectedButtonId={selectedId}
          onButtonAction={(_btn, buttonId, action) => {
            if (action.type === "SELECT") {
              setSelectedId(buttonId);
            }
          }}
        />
      </div>
    );
  },
};

export const TableSuiteEditor: Story = {
  render: function Render() {
    const [template, setTemplate] = useState<Template>(createSampleTemplate);

    return (
      <div className="pb:p-4">
        <TableView
          template={template}
          defaultSelectedButtonIds={["btn-welcome", "btn-feeling"]}
          onButtonAction={(_btn, buttonId, action) => {
            setTemplate((prev) =>
              applyControlActionToTemplate(prev, buttonId, action),
            );
          }}
        />
      </div>
    );
  },
};

export const FlowGraphTopBottom: Story = {
  render: function Render() {
    const [template, setTemplate] = useState<Template>(createSampleTemplate);
    const [selectedId, setSelectedId] = useState<string | null>("btn-welcome");

    return (
      <div className="pb:h-[520px] pb:w-full pb:p-4">
        <FlowView
          template={template}
          selectedButtonId={selectedId}
          defaultDirection="TB"
          onButtonAction={(_btn, buttonId, action) => {
            if (action.type === "SELECT") {
              setSelectedId(buttonId);
            }
          }}
          onAddConnection={(sourceId, targetId) => {
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

export const FlowGraphLeftRight: Story = {
  render: function Render() {
    const [template] = useState<Template>(createSampleTemplate);
    const [selectedId, setSelectedId] = useState<string | null>("btn-feeling");

    return (
      <div className="pb:h-[520px] pb:w-full pb:p-4">
        <FlowView
          template={template}
          selectedButtonId={selectedId}
          defaultDirection="LR"
          onButtonAction={(_btn, buttonId, action) => {
            if (action.type === "SELECT") {
              setSelectedId(buttonId);
            }
          }}
        />
      </div>
    );
  },
};
