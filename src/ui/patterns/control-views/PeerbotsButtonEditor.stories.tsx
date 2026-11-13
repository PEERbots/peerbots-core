import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import type { RobotControlButton } from "../../../templates/types";
import { PeerbotsButtonEditor } from "./PeerbotsButtonEditor";

const meta: Meta<typeof PeerbotsButtonEditor> = {
  title: "Patterns/Template Views/PeerbotsButtonEditor",
  component: PeerbotsButtonEditor,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Docked side-panel button editor wrapping `BasePanel` and `SingleButtonEditPanel`, sharing the same form fields, `Sync Speech with Title` toggle, and i18n surface as the FlowView and ButtonView edit popovers.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PeerbotsButtonEditor>;

const sampleMessageButton: RobotControlButton = {
  type: "Message",
  labelColor: "Light Blue",
  details: {
    title: "Greet User",
    speech: "Hello! It is great to meet you.",
    color: "Light Blue",
    emotion: "Happy",
  },
};

const sampleLogButton: RobotControlButton = {
  type: "Log",
  labelColor: "Yellow",
  details: {
    title: "Session Started",
    details: "Logged start of interaction",
  },
};

export const Default: Story = {
  render: () => {
    const [button, setButton] = useState<RobotControlButton>(sampleMessageButton);
    const [isRoot, setIsRoot] = useState(true);

    return (
      <div className="pb:w-80 pb:border pb:border-gray-200 pb:rounded-lg pb:p-3 pb:bg-gray-50">
        <PeerbotsButtonEditor
          buttonId="btn-1"
          button={button}
          isRoot={isRoot}
          onSave={setButton}
          onToggleRoot={setIsRoot}
          onMove={() => {}}
          onAddChild={() => {}}
          onDuplicate={() => {}}
          onDelete={() => {}}
          onClose={() => {}}
        />
      </div>
    );
  },
};

export const Variations: Story = {
  render: () => {
    const [logButton, setLogButton] = useState<RobotControlButton>(sampleLogButton);

    return (
      <div className="pb:flex pb:flex-wrap pb:gap-6">
        <div className="pb:w-80 pb:border pb:border-gray-200 pb:rounded-lg pb:p-3 pb:bg-gray-50">
          <PeerbotsButtonEditor
            buttonId="btn-log"
            button={logButton}
            onSave={setLogButton}
            onMove={() => {}}
            onDelete={() => {}}
            onClose={() => {}}
          />
        </div>
        <div className="pb:w-80 pb:border pb:border-gray-200 pb:rounded-lg pb:p-3 pb:bg-gray-50">
          <PeerbotsButtonEditor
            buttonId=""
            button={null}
            onClose={() => {}}
          />
        </div>
      </div>
    );
  },
};
