import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import type { RobotControlButton } from "../../templates/types";
import { PeerbotsButton } from "./PeerbotsButton";

const meta: Meta<typeof PeerbotsButton> = {
  title: "Patterns/PeerbotsButton",
  component: PeerbotsButton,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof PeerbotsButton>;

const sampleMessageButton: RobotControlButton = {
  type: "Message",
  labelColor: "Light Blue",
  details: {
    title: "Greet Friend",
    speech: "Hi there! Want to play together?",
    color: "Yellow",
    emotion: "Happy",
  },
};

export const Default: Story = {
  render: function Render() {
    const [selected, setSelected] = useState(false);
    return (
      <div className="pb:w-64 pb:p-4">
        <PeerbotsButton
          button={sampleMessageButton}
          selected={selected}
          onClick={() => setSelected((prev) => !prev)}
        />
      </div>
    );
  },
};

export const Variations: Story = {
  render: function Render() {
    const [selectedIdx, setSelectedIdx] = useState<number>(0);

    const buttons: RobotControlButton[] = [
      sampleMessageButton,
      {
        type: "Message",
        labelColor: "Purple",
        details: {
          title: "Need a Break",
          speech: "Could we take a short quiet break?",
          color: "Blue",
          emotion: "Concerned",
        },
      },
      {
        type: "Log",
        labelColor: "Green",
        details: {
          title: "Student: Excited",
          details: "Child smiled and initiated turn-taking",
        },
      },
      {
        type: "Log",
        labelColor: "Orange",
        details: {
          title: "Requests a Break",
          details: "Student tapped break card or asked for quiet time",
        },
      },
    ];

    return (
      <div className="pb:flex pb:flex-col pb:gap-6 pb:p-4 pb:w-[640px]">
        <div className="pb:grid pb:grid-cols-2 pb:gap-3">
          {buttons.map((btn, idx) => (
            <PeerbotsButton
              key={btn.details.title}
              button={btn}
              selected={selectedIdx === idx}
              onClick={() => setSelectedIdx(idx)}
            />
          ))}
        </div>
        <div className="pb:border-t pb:border-gray-200 pb:pt-4" dir="rtl">
          <span className="pb:text-xs pb:font-bold pb:text-gray-600 pb:block pb:mb-2">
            RTL Layout (Logical Corner Badge Positioning)
          </span>
          <div className="pb:grid pb:grid-cols-2 pb:gap-3">
            <PeerbotsButton
              button={{
                type: "Message",
                labelColor: "Orange",
                details: {
                  title: "مرحبا يا صديقي",
                  speech: "مرحبا بك!",
                  color: "Pink",
                  emotion: "Surprised",
                },
              }}
              selected
            />
            <PeerbotsButton
              button={{
                type: "Log",
                labelColor: "Purple",
                details: {
                  title: "ملاحظة الجلسة",
                  details: "استجابة الطالب",
                },
              }}
            />
          </div>
        </div>
      </div>
    );
  },
};
