import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import type { RobotControlButton } from "../../templates/types";
import { PeerbotsButtonRow } from "./PeerbotsButtonRow";

const meta: Meta<typeof PeerbotsButtonRow> = {
  title: "Patterns/Deprecated/PeerbotsButtonRow",
  component: PeerbotsButtonRow,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "> **Deprecated:** Prefer `<TableView>` (under `Patterns/Template Views/TableView`) or `<PeerbotsButtonDisplay view=\"Table\">`. `<TableView>` renders semantic `<Table>` rows with sticky column headers, zero duplicate row labels, WCAG AA colored button/robot pills, 28×28 robot face expression preview tiles, Shift+Click multi-selection, bulk actions, and column Apply-All popovers.\n\n`PeerbotsButtonRow` is retained solely for backward compatibility with legacy 11-column CSS grid layouts.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PeerbotsButtonRow>;

export const Default: Story = {
  render: function Render() {
    const [button, setButton] = useState<RobotControlButton>({
      type: "Message",
      labelColor: "Light Blue",
      details: {
        title: "Say Hello",
        speech: "Hello! How are you feeling today?",
        color: "Yellow",
        emotion: "Happy",
      },
    });
    const [selected, setSelected] = useState(false);

    return (
      <div className="pb:min-w-[820px] pb:p-4">
        <PeerbotsButtonRow
          button={button}
          selected={selected}
          syncVals={false}
          onAction={(action) => {
            if (action.type === "SAVE") {
              setButton(action.newButton);
            } else if (action.type === "ADD TO SELECTION") {
              setSelected(true);
            } else if (action.type === "REMOVE FROM SELECTION") {
              setSelected(false);
            }
          }}
        />
      </div>
    );
  },
};

export const Variations: Story = {
  render: function Render() {
    const [msgBtn, setMsgBtn] = useState<RobotControlButton>({
      type: "Message",
      labelColor: "Purple",
      details: {
        title: "Synced Prompt",
        speech: "Synced Prompt",
        color: "Green",
        emotion: "Surprised",
      },
    });
    const [logBtn, setLogBtn] = useState<RobotControlButton>({
      type: "Log",
      labelColor: "Grey",
      details: {
        title: "Session Note",
        details: "Observed shared attention",
      },
    });

    return (
      <div className="pb:flex pb:flex-col pb:gap-4 pb:min-w-[820px] pb:p-4">
        <div>
          <span className="pb:text-xs pb:font-bold pb:text-gray-600 pb:block pb:mb-1">
            Message Row (Synced Title &amp; Speech, Selected)
          </span>
          <PeerbotsButtonRow
            button={msgBtn}
            selected
            syncVals
            onAction={(action) => {
              if (action.type === "SAVE") setMsgBtn(action.newButton);
            }}
          />
        </div>
        <div>
          <span className="pb:text-xs pb:font-bold pb:text-gray-600 pb:block pb:mb-1">
            Log Event Row
          </span>
          <PeerbotsButtonRow
            button={logBtn}
            selected={false}
            syncVals={false}
            onAction={(action) => {
              if (action.type === "SAVE") setLogBtn(action.newButton);
            }}
          />
        </div>
        <div>
          <span className="pb:text-xs pb:font-bold pb:text-gray-600 pb:block pb:mb-1">
            Disabled Row
          </span>
          <PeerbotsButtonRow
            button={msgBtn}
            disabled
            onAction={() => undefined}
          />
        </div>
      </div>
    );
  },
};
