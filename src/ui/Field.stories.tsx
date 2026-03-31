import type { Meta, StoryObj } from "@storybook/react";
import { Field } from "./Field";
import { Icon } from "./Icon";
import { Heading } from "./Typography";
import { Input } from "./Input";
import { Slider } from "./Slider";
import { Select } from "./Select";
import { Switch } from "./Switch";
import { NumberField } from "./NumberField";
import { SliderWithNumberField } from "./SliderWithNumberField";
import { Checkbox } from "./Checkbox";

const meta: Meta<typeof Field> = {
  title: "UI/Field",
  component: Field,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    description: { control: "text" },
    error: { control: "text" },
    tooltip: { control: "text" },
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
          Field Groups
        </Heading>
        <div className="pb:border pb:rounded-lg pb:p-6 pb:bg-gray-50/50">
          <Heading level={5} className="pb:font-bold pb:mb-4">
            Settings Group
          </Heading>
          <div className="pb:flex pb:flex-col pb:gap-4">
            <Field
              label="Break up long sentences"
              labelPlacement="right"
              labelWeight="normal"
              description="Ensures buttons don't have too much text"
            >
              <Checkbox id="group-opt-1" />
            </Field>
            <Field
              label="Detect emotions"
              labelPlacement="right"
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
