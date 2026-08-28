import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./Card";
import { Heading, Text } from "./Typography";
import { Button } from "./Button";
import React from "react";

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    variant: "default",
    padding: "md",
    hoverable: true,
    children: (
      <div className="pb:space-y-3 pb:w-80">
        <Heading level={3}>Card Title</Heading>
        <Text variant="muted">This is a standard card with elevation and rounded borders.</Text>
        <Button variant="primary" size="sm">Action</Button>
      </div>
    ),
  },
};

export const Variants: Story = {
  render: () => (
    <div className="pb:grid pb:grid-cols-2 pb:gap-6 pb:max-w-3xl pb:p-6 pb:bg-gray-100">
      <Card variant="default">
        <Heading level={4}>Default</Heading>
        <Text variant="muted">Default subtle shadow</Text>
      </Card>
      <Card variant="elevated">
        <Heading level={4}>Elevated</Heading>
        <Text variant="muted">Higher elevation shadow</Text>
      </Card>
      <Card variant="flat">
        <Heading level={4}>Flat</Heading>
        <Text variant="muted">Subtle background fill</Text>
      </Card>
      <Card variant="outline">
        <Heading level={4}>Outline</Heading>
        <Text variant="muted">Clean 2px border</Text>
      </Card>
      <Card variant="teal-tint">
        <Heading level={4} variant="marketing-teal">Teal Tint</Heading>
        <Text variant="muted">Brand teal tinted background</Text>
      </Card>
      <Card variant="pink-tint">
        <Heading level={4} variant="marketing-pink">Pink Tint</Heading>
        <Text variant="muted">Brand pink tinted background</Text>
      </Card>
    </div>
  ),
};
