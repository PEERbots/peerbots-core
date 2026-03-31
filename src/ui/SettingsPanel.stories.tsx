import type { Meta, StoryObj } from "@storybook/react";
import { SettingsPanel } from "./SettingsPanel";
import { Button } from "./Button";
import { Checkbox } from "./Checkbox";
import { Heading, Text } from "./Typography";
import { Label } from "./Label";

const meta: Meta<typeof SettingsPanel> = {
  title: "UI/SettingsPanel",
  component: SettingsPanel,
  tags: ["autodocs"],
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Account Settings",
    children: (
      <div className="pb:space-y-4">
        <Text>This is the content of the settings panel.</Text>
        <div className="pb:flex pb:gap-2">
          <Button variant="primary">Save Changes</Button>
          <Button variant="secondary">Cancel</Button>
        </div>
      </div>
    ),
  },
};

export const Variations: Story = {
  render: () => (
    <div className="pb:flex pb:flex-col pb:gap-12 pb:p-4 pb:max-w-2xl pb:bg-gray-50">
      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase">
          Default
        </Heading>
        <SettingsPanel title="Notification Settings">
          <div className="pb:space-y-4">
            <Text>Manage how you receive notifications.</Text>
            <div className="pb:flex pb:items-center pb:gap-2 pb:p-2 pb:rounded pb:bg-white">
              <Checkbox id="email-notif" />
              <Label htmlFor="email-notif" className="pb:text-sm">
                Email Notifications
              </Label>
            </div>
          </div>
        </SettingsPanel>
      </div>

      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase">
          No Title
        </Heading>
        <SettingsPanel>
          <Text className="pb:italic">
            Panel without a title rendered as a simple container.
          </Text>
        </SettingsPanel>
      </div>

      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase">
          Collapsible States
        </Heading>
        <div className="pb:space-y-4">
          <SettingsPanel title="Collapsible (Default Open)" collapsible={true}>
            <Text>This panel can be toggled and starts open.</Text>
          </SettingsPanel>
          <SettingsPanel
            title="Collapsible (Default Closed)"
            collapsible={true}
            defaultOpen={false}
          >
            <Text>This panel starts closed to save space.</Text>
          </SettingsPanel>
        </div>
      </div>
    </div>
  ),
};
