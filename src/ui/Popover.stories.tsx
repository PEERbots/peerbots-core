import type { Meta, StoryObj } from "@storybook/react";
import { Popover } from "./Popover";
import { Button } from "./Button";
import { Input } from "./Input";
import { Text } from "./Typography";
import { Icon } from "./Icon";
import React from "react";

const meta: Meta<typeof Popover> = {
  title: "Feedback/Popover",
  component: Popover,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    side: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
    },
    align: {
      control: "select",
      options: ["start", "center", "end"],
    },
    variant: {
      control: "select",
      options: ["surface", "glass", "outline", "flat"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  args: {
    title: "Quick Settings",
    trigger: <Button color="teal">Open Popover</Button>,
    children: (
      <div className="pb:space-y-3 pb:py-1">
        <Text size="xs" color="muted">
          Adjust the active robot connection stream rate.
        </Text>
        <Input placeholder="Rate (Hz)" defaultValue="60" />
        <Button size="sm" color="teal" className="pb:w-full">
          Save Preset
        </Button>
      </div>
    ),
    side: "bottom",
    align: "center",
  },
};

export const ExportActionsPopover: Story = {
  render: () => (
    <Popover
      title="Export CAD Configuration"
      trigger={
        <Button color="neutral" leftIcon={<Icon name="arrowDownTray" />}>
          Export
        </Button>
      }
      side="bottom"
      align="end"
    >
      <div className="pb:flex pb:flex-col pb:gap-2 pb:w-64 pb:py-1">
        <button
          type="button"
          className="pb:flex pb:items-center pb:gap-2.5 pb:p-2 pb:rounded-xl pb:hover:bg-gray-100 pb:text-left pb:cursor-pointer pb:transition-colors"
        >
          <div className="pb:w-7 pb:h-7 pb:rounded-lg pb:bg-peerbots-teal/15 pb:text-peerbots-darkteal pb:flex pb:items-center pb:justify-center">
            <Icon name="code" className="pb:w-4 pb:h-4" />
          </div>
          <div>
            <div className="pb:text-xs pb:font-bold pb:text-gray-900">Download JSON</div>
            <div className="pb:text-[10px] pb:text-gray-500">Raw parameter payload</div>
          </div>
        </button>

        <button
          type="button"
          className="pb:flex pb:items-center pb:gap-2.5 pb:p-2 pb:rounded-xl pb:hover:bg-gray-100 pb:text-left pb:cursor-pointer pb:transition-colors"
        >
          <div className="pb:w-7 pb:h-7 pb:rounded-lg pb:bg-peerbots-pink/15 pb:text-peerbots-pink pb:flex pb:items-center pb:justify-center">
            <Icon name="cube" className="pb:w-4 pb:h-4" />
          </div>
          <div>
            <div className="pb:text-xs pb:font-bold pb:text-gray-900">Export 3MF / STL</div>
            <div className="pb:text-[10px] pb:text-gray-500">3D printable mesh parts</div>
          </div>
        </button>
      </div>
    </Popover>
  ),
};

export const GlassPopoverInContext: Story = {
  render: () => (
    <div className="pb:relative pb:w-[500px] pb:h-72 pb:rounded-3xl pb:bg-gradient-to-br pb:from-slate-900 pb:via-indigo-950 pb:to-teal-950 pb:flex pb:items-center pb:justify-center pb:overflow-hidden pb:p-6">
      <div className="pb:text-center pb:text-white/60 pb:text-xs pb:space-y-1">
        <div>3D Robot Viewport Stage</div>
      </div>

      <div className="pb:absolute pb:top-6 pb:right-6">
        <Popover
          title="Viewport HUD"
          variant="glass"
          trigger={
            <Button variant="outline" color="teal" size="sm">
              Camera HUD
            </Button>
          }
          side="bottom"
          align="end"
        >
          <div className="pb:space-y-2 pb:w-56 pb:py-1">
            <Text size="xs" color="muted">
              Translucent glass popover floating over 3D canvas.
            </Text>
            <div className="pb:flex pb:gap-2">
              <Button size="xs" color="teal" className="pb:flex-1">Reset</Button>
              <Button size="xs" color="neutral" className="pb:flex-1">Snap</Button>
            </div>
          </div>
        </Popover>
      </div>
    </div>
  ),
};
