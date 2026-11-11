import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import type { Template, TemplateHierarchy } from "../../templates/types";
import { Button } from "../forms/Button";
import { PeerbotsButtonDisplay } from "./PeerbotsButtonDisplay";

const meta: Meta<typeof PeerbotsButtonDisplay> = {
  title: "Patterns/PeerbotsButtonDisplay",
  component: PeerbotsButtonDisplay,
};

export default meta;
type Story = StoryObj<typeof PeerbotsButtonDisplay>;

const initialTemplate: Template = {
  title: "Play Session",
  description: "Turn-taking and emotional check-in script",
  buttons: {
    "btn-greet": {
      type: "Message",
      labelColor: "Light Blue",
      details: {
        title: "Wave Hello",
        speech: "Hi friend! Ready to build blocks?",
        color: "Yellow",
        emotion: "Happy",
      },
    },
    "btn-followup": {
      type: "Message",
      labelColor: "Green",
      details: {
        title: "Your Turn",
        speech: "Your turn to add a block!",
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
    root: ["btn-greet", "btn-break", "btn-log"],
    "btn-greet": ["btn-followup"],
  },
};

export const Default: Story = {
  render: function Render() {
    const [template, setTemplate] = useState<Template>(initialTemplate);
    const [selectedId, setSelectedId] = useState<string | null>("btn-greet");

    return (
      <div className="pb:p-4">
        <PeerbotsButtonDisplay
          template={template}
          view="Buttons"
          selectedButtonId={selectedId}
          onButtonAction={(_btn, buttonId, action) => {
            if (action.type === "SELECT") {
              setSelectedId(buttonId);
            } else if (action.type === "SAVE") {
              setTemplate((prev) => ({
                ...prev,
                buttons: { ...prev.buttons, [buttonId]: action.newButton },
              }));
            }
          }}
        />
      </div>
    );
  },
};

export const Variations: Story = {
  render: function Render() {
    const [template, setTemplate] = useState<Template>(initialTemplate);
    const [view, setView] = useState<"Buttons" | "Table">("Table");
    const [selectedId, setSelectedId] = useState<string | null>("btn-greet");
    const [multiSelected, setMultiSelected] = useState<string[]>([
      "btn-greet",
      "btn-followup",
    ]);

    return (
      <div className="pb:flex pb:flex-col pb:gap-4 pb:p-4">
        <div className="pb:flex pb:items-center pb:gap-2">
          <Button
            size="sm"
            variant={view === "Buttons" ? "solid" : "outline"}
            color="teal"
            onClick={() => setView("Buttons")}
          >
            Buttons View
          </Button>
          <Button
            size="sm"
            variant={view === "Table" ? "solid" : "outline"}
            color="teal"
            onClick={() => setView("Table")}
          >
            Table View (Nested Hierarchy + Multi-Select)
          </Button>
        </div>

        <PeerbotsButtonDisplay
          template={template}
          view={view}
          selectedButtonId={selectedId}
          multiSelectedButtonIds={multiSelected}
          onClearSelection={() => setMultiSelected([])}
          onButtonAction={(_btn, buttonId, action) => {
            if (action.type === "SELECT") {
              setSelectedId(buttonId);
            } else if (action.type === "ADD TO SELECTION") {
              setMultiSelected((prev) =>
                prev.includes(buttonId) ? prev : [...prev, buttonId],
              );
            } else if (action.type === "REMOVE FROM SELECTION") {
              setMultiSelected((prev) => prev.filter((id) => id !== buttonId));
            } else if (action.type === "SAVE") {
              setTemplate((prev) => ({
                ...prev,
                buttons: { ...prev.buttons, [buttonId]: action.newButton },
              }));
            } else if (action.type === "DELETE") {
              setTemplate((prev) => {
                const nextButtons = { ...prev.buttons };
                delete nextButtons[buttonId];
                const nextHierarchy: TemplateHierarchy = {
                  root: prev.hierarchy.root.filter((id) => id !== buttonId),
                };
                for (const [k, ids] of Object.entries(prev.hierarchy)) {
                  if (k !== "root" && k !== buttonId) {
                    nextHierarchy[k] = ids.filter((id) => id !== buttonId);
                  }
                }
                return {
                  ...prev,
                  buttons: nextButtons,
                  hierarchy: nextHierarchy,
                };
              });
            }
          }}
        />
      </div>
    );
  },
};
