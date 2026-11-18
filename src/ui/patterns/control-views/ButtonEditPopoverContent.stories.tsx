import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import type { RobotControlButton } from "../../../templates/types";
import { Text } from "../../foundations/Typography";
import { SingleButtonEditPanel } from "./ButtonEditPopoverContent";

const INITIAL_BUTTON: RobotControlButton = {
  type: "Message",
  labelColor: "Green",
  details: {
    title: "Wave Hello",
    speech: "Hi there! Nice to meet you.",
    color: "Light Blue",
    emotion: "Happy",
  },
};

const meta: Meta<typeof SingleButtonEditPanel> = {
  title: "Templates/SingleButtonEditPanel",
  component: SingleButtonEditPanel,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Shared button-editing form used in three places: as `variant='panel'` inside `PeerbotsButtonEditor`, and as `variant='popover'` inside `FlowView` (node double-click toolbar) and `ButtonView` (grid edit popover).",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SingleButtonEditPanel>;

export const Default: Story = {
  render: () => {
    const [button, setButton] = useState<RobotControlButton>(INITIAL_BUTTON);
    const [isRoot, setIsRoot] = useState(true);
    return (
      <SingleButtonEditPanel
        buttonId="btn-1"
        button={button}
        isRoot={isRoot}
        variant="popover"
        onSave={setButton}
        onToggleRoot={() => setIsRoot((prev) => !prev)}
        onAddChild={() => {}}
        onDuplicate={() => {}}
        onDelete={() => {}}
        onClose={() => {}}
      />
    );
  },
};

export const Variations: Story = {
  render: () => {
    const [popoverBtn, setPopoverBtn] =
      useState<RobotControlButton>(INITIAL_BUTTON);
    const [panelBtn, setPanelBtn] = useState<RobotControlButton>({
      type: "Log",
      labelColor: "Grey",
      details: {
        title: "Session Started",
        details: "Participant greeted robot",
      },
    });
    return (
      <div className="pb:flex pb:flex-wrap pb:items-start pb:gap-8">
        <div className="pb:space-y-2">
          <Text size="xs" weight="semibold" color="muted">
            variant=&quot;popover&quot; (FlowView &amp; ButtonView)
          </Text>
          <SingleButtonEditPanel
            buttonId="pop-1"
            button={popoverBtn}
            isRoot
            variant="popover"
            onSave={setPopoverBtn}
            onToggleRoot={() => {}}
            onAddChild={() => {}}
            onDuplicate={() => {}}
            onDelete={() => {}}
            onClose={() => {}}
          />
        </div>
        <div className="pb:w-80 pb:rounded-xl pb:border pb:border-gray-200 pb:bg-white pb:p-4 pb:shadow-sm pb:space-y-2">
          <Text size="xs" weight="semibold" color="muted">
            variant=&quot;panel&quot; (PeerbotsButtonEditor)
          </Text>
          <SingleButtonEditPanel
            buttonId="pan-1"
            button={panelBtn}
            isRoot={false}
            variant="panel"
            showPreview
            onSave={setPanelBtn}
            onToggleRoot={() => {}}
            onAddChild={() => {}}
            onDuplicate={() => {}}
            onDelete={() => {}}
          />
        </div>
      </div>
    );
  },
};
