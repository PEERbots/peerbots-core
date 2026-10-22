import type { Meta, StoryObj } from "@storybook/react";
import { Field } from "./Field";
import { Icon } from "../foundations/Icon";
import { Heading, Text } from "../foundations/Typography";
import { Button } from "./Button";
import { Input } from "./Input";
import { Slider } from "./Slider";
import { Select } from "./Select";
import { Switch } from "./Switch";
import { NumberField } from "./NumberField";
import { SliderWithNumberField } from "./SliderWithNumberField";
import { Checkbox } from "./Checkbox";

const meta: Meta<typeof Field> = {
  title: "Forms/Field",
  component: Field,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    description: { control: "text" },
    error: { control: "text" },
    tooltip: { control: "text" },
    fullWidth: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Field>;

export const Default: Story = {
  args: {
    label: "Email Address",
    description: "We'll never share your email.",
    tooltip: "Enter your primary email address",
    children: <Input placeholder="you@example.com" />,
  },
};

export const Variations: Story = {
  render: () => (
    <div className="pb:flex pb:flex-col pb:gap-12 pb:p-4 pb:max-w-2xl">
      <div className="pb:space-y-4">
        <Heading
          level={4}
          className="pb:text-sm pb:font-medium pb:text-black pb:uppercase pb:tracking-wider"
        >
          Basic Inputs
        </Heading>
        <div className="pb:grid pb:gap-6">
          <Field
            label="Text Input"
            description="Standard text field"
            tooltip="Helping text"
          >
            <Input placeholder="Enter something..." />
          </Field>
          <Field label="Password" error="Password is too weak">
            <Input type="password" defaultValue="123" />
          </Field>
          <Field label="Number Field">
            <NumberField showButtons defaultValue={10} />
          </Field>
        </div>
      </div>

      <div className="pb:space-y-4">
        <Heading
          level={4}
          className="pb:text-sm pb:font-medium pb:text-black pb:uppercase pb:tracking-wider"
        >
          Selection & Toggles
        </Heading>
        <div className="pb:grid pb:gap-6">
          <Field label="Select Language">
            <Select
              options={[
                { label: "English", value: "en" },
                { label: "Spanish", value: "es" },
                { label: "French", value: "fr" },
              ]}
              placeholder="Choose a language"
            />
          </Field>
          <Field
            label="Enable Notifications"
            className="pb:flex-row pb:items-center pb:justify-between"
          >
            <Switch />
          </Field>
          <Field
            label="Enable automation"
            labelPlacement="right"
            labelWeight="normal"
          >
            <Checkbox id="automation" />
          </Field>
        </div>
      </div>

      <div className="pb:space-y-4">
        <Heading
          level={4}
          className="pb:text-sm pb:font-medium pb:text-black pb:uppercase pb:tracking-wider"
        >
          Sliders
        </Heading>
        <div className="pb:grid pb:gap-6">
          <Field label="Simple Slider" tooltip="Adjust volume">
            <Slider defaultValue={50} />
          </Field>
          <Field label="Sensitivity">
            <SliderWithNumberField
              min={0}
              max={10}
              step={0.1}
              defaultValue={5}
            />
          </Field>
        </div>
      </div>

      <div className="pb:space-y-4">
        <Heading
          level={4}
          className="pb:text-sm pb:font-medium pb:text-black pb:uppercase pb:tracking-wider"
        >
          Layout Variations
        </Heading>
        <div className="pb:grid pb:gap-6">
          <Field
            label="Label on Left"
            labelPlacement="left"
            description="Label to the left"
          >
            <Input placeholder="Enter text..." />
          </Field>
          <Field
            label="Label on Right"
            labelPlacement="right"
            description="Label to the right"
          >
            <Input placeholder="Enter text..." />
          </Field>
          <Field label="With Search Icon" icon={<Icon name="search" />}>
            <Input placeholder="Search..." />
          </Field>
        </div>
      </div>

      <div className="pb:space-y-4">
        <Heading
          level={4}
          className="pb:text-sm pb:font-medium pb:text-black pb:uppercase pb:tracking-wider"
        >
          Full Width On vs Off
        </Heading>
        <div className="pb:space-y-6">
          <div className="pb:space-y-2">
            <Text variant="small" className="pb:font-bold">
              fullWidth=true (default) — stretches to 100% of container
            </Text>
            <div className="pb:flex pb:flex-wrap pb:items-center pb:gap-4 pb:rounded-lg pb:border pb:border-dashed pb:border-gray-300 pb:p-4">
              <Field label="Full Width Select" fullWidth>
                <Select
                  options={[
                    { label: "Happy", value: "happy" },
                    { label: "Calm", value: "calm" },
                  ]}
                  defaultValue="happy"
                />
              </Field>
              <Field
                label="Full Width Checkbox"
                labelPlacement="right"
                labelWeight="normal"
                fullWidth
              >
                <Checkbox id="fullwidth-check" />
              </Field>
            </div>
          </div>

          <div className="pb:space-y-2">
            <Text variant="small" className="pb:font-bold">
              fullWidth=false — auto-width side-by-side in a flex row
            </Text>
            <div className="pb:flex pb:flex-wrap pb:items-end pb:gap-4 pb:rounded-lg pb:border pb:border-dashed pb:border-gray-300 pb:p-4">
              <Field label="Send Emotion" fullWidth={false}>
                <Select
                  options={[
                    { label: "Happy", value: "happy" },
                    { label: "Surprised", value: "surprised" },
                  ]}
                  defaultValue="happy"
                />
              </Field>
              <Field label="Send Color" fullWidth={false}>
                <Select
                  options={[
                    { label: "Teal", value: "teal" },
                    { label: "Pink", value: "pink" },
                  ]}
                  defaultValue="teal"
                />
              </Field>
              <Field
                label="Auto-play"
                labelPlacement="right"
                labelWeight="normal"
                fullWidth={false}
                className="pb:pb-1.5"
              >
                <Checkbox id="inline-check" defaultChecked />
              </Field>
              <Button variant="primary">Send</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="pb:space-y-4">
        <Heading
          level={4}
          className="pb:text-sm pb:font-medium pb:text-black pb:uppercase pb:tracking-wider"
        >
          Field Groups
        </Heading>
        <div className="pb:border pb:rounded-lg pb:p-6 pb:bg-gray-50/50">
          <Heading level={5} className="pb:font-bold pb:mb-4">
            Settings Group
          </Heading>
          <div className="pb:flex pb:flex-col pb:gap-4">
            <Field
              label="Break up long sentences"
              labelPlacement="end"
              labelWeight="normal"
              description="Ensures buttons don't have too much text"
            >
              <Checkbox id="group-opt-1" />
            </Field>
            <Field
              label="Detect emotions"
              labelPlacement="end"
              labelWeight="normal"
              error="Requires active connection"
            >
              <Checkbox id="group-opt-2" />
            </Field>
          </div>
        </div>
      </div>
    </div>
  ),
};
