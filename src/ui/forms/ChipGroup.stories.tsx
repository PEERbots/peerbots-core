import type { Meta, StoryObj } from "@storybook/react";
import { ChipGroup } from "./ChipGroup";
import { Icon } from "../foundations/Icon";
import { Heading, Text } from "../foundations/Typography";
import React, { useState } from "react";

const CHIP_GROUP_DECISION_MD = `
Wrapping or horizontally scrollable pill group supporting **both single-select (\`role="radiogroup"\`) and multi-select (\`multiple={true}\`, \`role="group"\`)**, optional icons, and count/status badges.

| Control | Option Count | Selection Mode | Layout & Lifecycle | Typical Use Case |
|---|---|---|---|---|
| **\`<ChipGroup>\`** | **3–12+ static/dynamic** | Single **or** Multi-select (\`multiple\`) | Wrapping or scrolling pills + icons & badges | Multi-facet capability filters, category tags |
| **\`<TabRadio>\`** | **2–5 static** | Single-select | Compact bordered segmented track | View mode toggles (\`Buttons \\| Table \\| Flow\`), binary/ternary settings |
| **\`<TabSelection>\`** | **1–10+ dynamic** | Single active workspace tab | Accessible \`tablist\`/\`tab\` strip with \`+\` Add, Rename, and \`×\` Close | Multi-template editor tabs, user-created collections |
`.trim();

const meta: Meta<typeof ChipGroup> = {
  title: "Forms/Selection Controls/ChipGroup",
  component: ChipGroup,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: CHIP_GROUP_DECISION_MD,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["soft", "solid", "outline"],
    },
    color: {
      control: "select",
      options: ["teal", "pink", "primary", "neutral", "danger"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    radius: {
      control: "select",
      options: ["none", "sm", "md", "lg", "pill"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ChipGroup>;

const sampleOptions = [
  { value: "all", label: "All Bots" },
  { value: "moddy", label: "Moddy Face", badge: "New" },
  { value: "eva", label: "EVA Head" },
  { value: "buddy", label: "Buddy v2" },
  { value: "biped", label: "Biped 3D", badge: "Soon", disabled: true },
];

export const Default: Story = {
  args: {
    options: sampleOptions,
    defaultValue: "moddy",
    color: "teal",
    variant: "soft",
    size: "md",
    radius: "pill",
  },
};

export const MultiSelectFilter: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>(["audio", "video"]);
    return (
      <div className="pb:flex pb:flex-col pb:gap-3 pb:p-6 pb:bg-white pb:rounded-2xl pb:max-w-xl">
        <Heading level={4} className="pb:text-sm pb:font-bold">
          Capabilities Filter (Multi-Select)
        </Heading>
        <ChipGroup
          multiple
          values={selected}
          onMultipleChange={setSelected}
          color="pink"
          variant="soft"
          options={[
            { value: "audio", label: "Audio Output", icon: <Icon name="speakerWave" className="pb:w-3.5 pb:h-3.5 pb:me-1" /> },
            { value: "video", label: "Camera Vision", icon: <Icon name="face" className="pb:w-3.5 pb:h-3.5 pb:me-1" /> },
            { value: "motors", label: "Servos & Motors" },
            { value: "leds", label: "RGB Matrix" },
            { value: "imu", label: "Gyro/IMU", disabled: true, badge: "Experimental" },
          ]}
        />
        <Text size="xs" color="muted">
          Selected: {selected.join(", ") || "None"}
        </Text>
      </div>
    );
  },
};

export const VariantsAndColors: Story = {
  render: () => (
    <div className="pb:flex pb:flex-col pb:gap-6 pb:p-6 pb:bg-gray-50 pb:rounded-2xl pb:max-w-2xl">
      <div>
        <Text size="xs" weight="bold" color="muted" className="pb:uppercase pb:mb-2">
          Teal Soft (Default)
        </Text>
        <ChipGroup options={sampleOptions} defaultValue="moddy" color="teal" variant="soft" />
      </div>

      <div>
        <Text size="xs" weight="bold" color="muted" className="pb:uppercase pb:mb-2">
          Pink Solid Pill
        </Text>
        <ChipGroup options={sampleOptions} defaultValue="eva" color="pink" variant="solid" />
      </div>

      <div>
        <Text size="xs" weight="bold" color="muted" className="pb:uppercase pb:mb-2">
          Primary Electric Outline
        </Text>
        <ChipGroup options={sampleOptions} defaultValue="all" color="primary" variant="outline" />
      </div>

      <div>
        <Text size="xs" weight="bold" color="muted" className="pb:uppercase pb:mb-2">
          Rounded Rect (radius="md")
        </Text>
        <ChipGroup options={sampleOptions} defaultValue="buddy" color="teal" radius="md" />
      </div>
    </div>
  ),
};
