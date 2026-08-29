import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { Heading, Text } from "./Typography";
import React from "react";

const meta: Meta<typeof Button> = {
  title: "Forms/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["solid", "soft", "outline", "ghost", "link"],
      description: "Visual fill style / treatment",
    },
    color: {
      control: "select",
      options: ["primary", "neutral", "teal", "pink", "darkblue", "danger", "success", "warning"],
      description: "Color palette or semantic intent",
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
      description: "Button scale / padding",
    },
    radius: {
      control: "select",
      options: ["none", "sm", "md", "lg", "pill"],
      description: "Border radius geometry",
    },
    disabled: { control: "boolean" },
    isLoading: { control: "boolean" },
    onClick: { action: "clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "Button",
    variant: "solid",
    color: "primary",
    size: "md",
    radius: "md",
  },
};

export const Recipes: Story = {
  render: () => (
    <div className="pb:flex pb:flex-col pb:gap-8 pb:max-w-3xl">
      <div>
        <Heading level={4} className="pb:text-sm pb:font-bold pb:text-gray-900 pb:mb-1">
          Standard Form Actions Pair
        </Heading>
        <Text size="sm" color="muted" className="pb:mb-3">
          Pair one high-emphasis primary action with one neutral secondary action.
        </Text>
        <div className="pb:flex pb:items-center pb:gap-3">
          <Button color="primary">Save Changes</Button>
          <Button color="neutral">Cancel</Button>
        </div>
      </div>

      <div>
        <Heading level={4} className="pb:text-sm pb:font-bold pb:text-gray-900 pb:mb-1">
          Brand CTAs (Teal & Pink Pill)
        </Heading>
        <Text size="sm" color="muted" className="pb:mb-3">
          Use explicit brand colors with pill radius for hero and marketing CTAs.
        </Text>
        <div className="pb:flex pb:items-center pb:gap-3">
          <Button color="teal" radius="pill" size="lg" rightIcon={<Icon name="chevronRight" />}>
            Get Started
          </Button>
          <Button color="pink" radius="pill" size="lg">
            Join Competition
          </Button>
        </div>
      </div>

      <div>
        <Heading level={4} className="pb:text-sm pb:font-bold pb:text-gray-900 pb:mb-1">
          Destructive Action Styles
        </Heading>
        <Text size="sm" color="muted" className="pb:mb-3">
          Solid for final confirmation dialogs; ghost for table row inline actions.
        </Text>
        <div className="pb:flex pb:items-center pb:gap-3">
          <Button color="danger">Delete Robot</Button>
          <Button color="danger" variant="outline">Delete Face</Button>
          <Button color="danger" variant="ghost">Remove</Button>
        </div>
      </div>
    </div>
  ),
};

export const FillVariantsMatrix: Story = {
  render: () => (
    <div className="pb:flex pb:flex-col pb:gap-6 pb:p-6 pb:bg-gray-50 pb:rounded-2xl pb:max-w-4xl">
      <div>
        <span className="pb:text-xs pb:font-bold pb:text-gray-500 pb:uppercase pb:block pb:mb-2">Solid</span>
        <div className="pb:flex pb:flex-wrap pb:gap-3">
          <Button variant="solid" color="primary">Primary</Button>
          <Button variant="solid" color="neutral">Neutral</Button>
          <Button variant="solid" color="teal">Teal</Button>
          <Button variant="solid" color="pink">Pink</Button>
          <Button variant="solid" color="darkblue">Dark Blue</Button>
          <Button variant="solid" color="danger">Danger</Button>
          <Button variant="solid" color="success">Success</Button>
        </div>
      </div>

      <div>
        <span className="pb:text-xs pb:font-bold pb:text-gray-500 pb:uppercase pb:block pb:mb-2">Soft / Subtle</span>
        <div className="pb:flex pb:flex-wrap pb:gap-3">
          <Button variant="soft" color="primary">Primary</Button>
          <Button variant="soft" color="teal">Teal</Button>
          <Button variant="soft" color="pink">Pink</Button>
          <Button variant="soft" color="darkblue">Dark Blue</Button>
          <Button variant="soft" color="danger">Danger</Button>
          <Button variant="soft" color="success">Success</Button>
        </div>
      </div>

      <div>
        <span className="pb:text-xs pb:font-bold pb:text-gray-500 pb:uppercase pb:block pb:mb-2">Outline</span>
        <div className="pb:flex pb:flex-wrap pb:gap-3">
          <Button variant="outline" color="neutral">Neutral</Button>
          <Button variant="outline" color="teal">Teal</Button>
          <Button variant="outline" color="pink">Pink</Button>
          <Button variant="outline" color="danger">Danger</Button>
        </div>
      </div>

      <div>
        <span className="pb:text-xs pb:font-bold pb:text-gray-500 pb:uppercase pb:block pb:mb-2">Ghost</span>
        <div className="pb:flex pb:flex-wrap pb:gap-3">
          <Button variant="ghost" color="neutral">Neutral</Button>
          <Button variant="ghost" color="teal">Teal</Button>
          <Button variant="ghost" color="pink">Pink</Button>
          <Button variant="ghost" color="danger">Danger</Button>
        </div>
      </div>
    </div>
  ),
};

export const SizesAndShapes: Story = {
  render: () => (
    <div className="pb:flex pb:flex-col pb:gap-6 pb:p-6 pb:bg-white pb:rounded-2xl pb:max-w-4xl">
      <div>
        <span className="pb:text-xs pb:font-bold pb:text-gray-500 pb:uppercase pb:block pb:mb-2">Sizes</span>
        <div className="pb:flex pb:flex-wrap pb:items-end pb:gap-3">
          <Button size="xs" color="teal">Extra Small</Button>
          <Button size="sm" color="teal">Small</Button>
          <Button size="md" color="teal">Medium (Default)</Button>
          <Button size="lg" color="teal">Large</Button>
          <Button size="xl" color="teal">Extra Large</Button>
        </div>
      </div>

      <div>
        <span className="pb:text-xs pb:font-bold pb:text-gray-500 pb:uppercase pb:block pb:mb-2">Border Radii (Shapes)</span>
        <div className="pb:flex pb:flex-wrap pb:items-center pb:gap-3">
          <Button radius="none" color="pink">None (0px)</Button>
          <Button radius="sm" color="pink">Small</Button>
          <Button radius="md" color="pink">Medium (Default)</Button>
          <Button radius="lg" color="pink">Large</Button>
          <Button radius="pill" color="pink">Pill (Full)</Button>
        </div>
      </div>
    </div>
  ),
};
