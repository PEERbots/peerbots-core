import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { EXAMPLE_QA_AND_COLORS_TEMPLATE } from "../../../templates/examples";
import type { Template } from "../../../templates/types";
import { CodeView } from "./CodeView";

const meta: Meta<typeof CodeView> = {
  title: "Templates/Views/CodeView",
  component: CodeView,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Human-readable Peerbots Template Text Format (PTTF) view with syntax highlighting, interactive hover/focus explainers showing the live `<PeerbotsButton>` each line produces, and an Edit & Format mode for round-trip authoring.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CodeView>;

const CYCLIC_AND_LOG_TEMPLATE: Template = {
  id: "social-checkin-loop",
  title: "Social Check-In (With Loop & Log)",
  buttons: {
    "1": {
      type: "Message",
      labelColor: "Green",
      details: {
        title: "Check In",
        speech: "How are you feeling right now?",
        color: "Light Blue",
        emotion: "Neutral",
      },
    },
    "2": {
      type: "Message",
      labelColor: "Blue",
      details: {
        title: "Happy",
        speech: "I am glad you are feeling happy!",
        color: "Yellow",
        emotion: "Happy",
      },
    },
    "3": {
      type: "Message",
      labelColor: "Purple",
      details: {
        title: "Need a Break",
        speech: "Let us take a slow breath together.",
        color: "Light Blue",
        emotion: "Concerned",
      },
    },
    "4": {
      type: "Log",
      labelColor: "Grey",
      details: {
        title: "Session Marker",
        details: "Child requested a sensory break",
      },
    },
  },
  hierarchy: {
    root: ["1", "4"],
    "1": ["2", "3"],
    "3": ["1"],
  },
};

export const Default: Story = {
  render: () => {
    const [template, setTemplate] = useState<Template>(
      CYCLIC_AND_LOG_TEMPLATE,
    );
    const [selectedButtonId, setSelectedButtonId] = useState<string | null>(
      "1",
    );

    return (
      <CodeView
        template={template}
        selectedButtonId={selectedButtonId}
        onTemplateChange={setTemplate}
        onButtonAction={(_btn, id, action) => {
          if (action.type === "SELECT" || action.type === "CLICK") {
            setSelectedButtonId(id);
          }
        }}
      />
    );
  },
};

export const Variations: Story = {
  render: () => {
    const [template, setTemplate] = useState<Template>(
      EXAMPLE_QA_AND_COLORS_TEMPLATE,
    );

    return (
      <div className="pb:flex pb:flex-col pb:gap-6">
        <div>
          <h3 className="pb:text-sm pb:font-semibold pb:text-gray-800 pb:mb-2">
            Full 17-Button Template (Editable)
          </h3>
          <CodeView
            template={template}
            onTemplateChange={setTemplate}
          />
        </div>
        <div>
          <h3 className="pb:text-sm pb:font-semibold pb:text-gray-800 pb:mb-2">
            Read-Only Compact Code (Explainer Off)
          </h3>
          <CodeView
            template={CYCLIC_AND_LOG_TEMPLATE}
            defaultShowExplainer={false}
          />
        </div>
      </div>
    );
  },
};
