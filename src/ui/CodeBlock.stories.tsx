import type { Meta, StoryObj } from "@storybook/react";
import { CodeBlock } from "./CodeBlock";
import React from "react";

const meta: Meta<typeof CodeBlock> = {
  title: "UI/CodeBlock",
  component: CodeBlock,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof CodeBlock>;

export const Default: Story = {
  args: {
    code: "npm install @peerbots/core",
    language: "bash",
    fileName: "terminal",
    showLineNumbers: false,
  },
};

export const MultiLineWithNumbers: Story = {
  args: {
    code: `import { Button, Card, Heading } from "@peerbots/core";

export function WelcomeCard() {
  return (
    <Card variant="elevated" padding="lg">
      <Heading level={2} variant="marketing-teal">Welcome to Peerbots</Heading>
      <Button variant="marketing-teal">Get Started</Button>
    </Card>
  );
}`,
    language: "tsx",
    fileName: "WelcomeCard.tsx",
    showLineNumbers: true,
  },
};
