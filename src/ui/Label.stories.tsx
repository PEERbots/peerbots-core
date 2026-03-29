import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "./Label";
import { Input } from "./Input";
import { Text } from "./Typography";

const meta: Meta<typeof Label> = {
  title: "UI/Label",
  component: Label,
  tags: ["autodocs"],
  args: {
    children: "Label Text",
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {};

export const Variations: Story = {
  render: () => (
    <div className="flex flex-col gap-12 p-4">
      <div className="space-y-2">
        <Text variant="small" className="font-bold underline uppercase">
          With Tooltip
        </Text>
        <Label tooltip="Extra information here.">Hover the help icon</Label>
      </div>
      <div className="space-y-2">
        <Text variant="small" className="font-bold underline uppercase">
          With Associated Input
        </Text>
        <div className="space-y-1">
          <Label htmlFor="v-input" tooltip="This is required">
            Email Address
          </Label>
          <Input id="v-input" placeholder="user@example.com" />
        </div>
      </div>
    </div>
  ),
};
