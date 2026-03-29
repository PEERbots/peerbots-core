import type { Meta, StoryObj } from "@storybook/react";
import { TabRadio, TabRadioOption } from "./TabRadio";
import { useState } from "react";
import { Icon } from "./Icon";
import { Heading, Text } from "./Typography";
import React from "react";

const meta = {
  title: "UI/TabRadio",
  component: TabRadio,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "primary", "danger"],
    },
    onChange: { action: "changed" },
  },
} satisfies Meta<typeof TabRadio>;

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper to manage state in the story
const TabRadioWithState = <T extends string>(
  args: React.ComponentProps<typeof TabRadio<T>>,
) => {
  const [value, setValue] = useState(args.value);
  return (
    <TabRadio
      {...args}
      value={value}
      onChange={(val) => {
        setValue(val);
        args.onChange?.(val);
      }}
    />
  );
};

const textOptions = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
] as const;

export const Default: Story = {
  args: {
    options: textOptions as readonly TabRadioOption<string>[],
    value: "daily",
    onChange: () => {},
  },
  render: (args) => <TabRadioWithState {...args} />,
};

export const Variations: Story = {
  args: {
    options: textOptions as readonly TabRadioOption<string>[],
    value: "daily",
    onChange: () => {},
  },
  render: () => (
    <div className="flex flex-col gap-12 p-4 min-w-[400px]">
      <div className="space-y-4">
        <Heading level={4} className="text-sm font-medium text-black uppercase">
          Variants
        </Heading>
        <div className="space-y-6">
          <div className="space-y-2">
            <Text variant="small" className="italic">
              Default
            </Text>
            <TabRadioWithState
              options={textOptions as readonly TabRadioOption<string>[]}
              value="daily"
              variant="default"
              onChange={() => {}}
            />
          </div>
          <div className="space-y-2">
            <Text variant="small" className="italic">
              Primary
            </Text>
            <TabRadioWithState
              options={textOptions as readonly TabRadioOption<string>[]}
              value="daily"
              variant="primary"
              onChange={() => {}}
            />
          </div>
          <div className="space-y-2">
            <Text variant="small" className="italic">
              Danger
            </Text>
            <TabRadioWithState
              options={textOptions as readonly TabRadioOption<string>[]}
              value="daily"
              variant="danger"
              onChange={() => {}}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Heading level={4} className="text-sm font-medium text-black uppercase">
          With Icons
        </Heading>
        <TabRadioWithState
          value="Message"
          onChange={() => {}}
          options={
            [
              {
                value: "Message",
                label: (
                  <div className="flex items-center gap-1">
                    <Icon size="sm" className="w-4 h-4">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                      />
                    </Icon>
                    Message
                  </div>
                ),
              },
              {
                value: "Log",
                label: (
                  <div className="flex items-center gap-1">
                    <Icon size="sm" className="w-4 h-4">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                      />
                    </Icon>
                    Log
                  </div>
                ),
              },
            ] as const
          }
        />
      </div>
    </div>
  ),
};
