import type { Meta, StoryObj } from "@storybook/react";
import { CodeBlock } from "./CodeBlock";
import React from "react";

const meta: Meta<typeof CodeBlock> = {
  title: "Foundations/CodeBlock",
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
    variant: "default",
    showLineNumbers: false,
  },
};

export const WindowVariant: Story = {
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
    variant: "window",
    showLineNumbers: true,
  },
};

export const MultiLineWithNumbers: Story = {
  args: {
    code: `const config = {
  apiKey: process.env.PEERBOTS_API_KEY,
  endpoint: "https://api.peerbots.org/v1",
  timeout: 5000,
};

export default config;`,
    language: "typescript",
    variant: "default",
    showLineNumbers: true,
  },
};

export const Variations: Story = {
  render: () => (
    <div className="pb:w-[540px] pb:space-y-6">
      <div>
        <h4 className="pb:text-xs pb:font-bold pb:text-gray-500 pb:uppercase pb:mb-2">
          Standard Clean CodeBlock (Default)
        </h4>
        <CodeBlock
          code="git clone https://github.com/peerbots/peerbots-core.git"
          language="bash"
        />
      </div>

      <div>
        <h4 className="pb:text-xs pb:font-bold pb:text-gray-500 pb:uppercase pb:mb-2">
          Window / File Box Variant
        </h4>
        <CodeBlock
          code="echo 'Running robot face session...'"
          language="bash"
          fileName="start.sh"
          variant="window"
        />
      </div>
    </div>
  ),
};
