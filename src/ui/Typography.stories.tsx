import type { Meta, StoryObj } from "@storybook/react";
import { Heading, Text } from "./Typography";

const meta: Meta = {
  title: "UI/Typography",
  tags: ["autodocs"],
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <div className="space-y-4 max-w-lg">
      <Heading level={2}>Core Typography</Heading>
      <Text>
        The quick brown fox jumps over the lazy dog. This is our standard body
        text used across the application.
      </Text>
    </div>
  ),
};

export const Variations: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-12 p-4">
      <div className="space-y-4">
        <Heading
          level={4}
          className="text-sm font-medium text-black uppercase tracking-wider border-b pb-1"
        >
          Headings
        </Heading>
        <div className="space-y-4">
          <Heading level={1}>Heading 1</Heading>
          <Heading level={2}>Heading 2</Heading>
          <Heading level={3}>Heading 3</Heading>
          <Heading level={4}>Heading 4</Heading>
          <Heading level={5}>Heading 5</Heading>
          <Heading level={6}>Heading 6</Heading>
        </div>
      </div>

      <div className="space-y-4">
        <Heading
          level={4}
          className="text-sm font-medium text-black uppercase tracking-wider border-b pb-1"
        >
          Text Variants
        </Heading>
        <div className="space-y-4">
          <div className="space-y-1">
            <Text variant="small" className="italic font-bold">
              Default
            </Text>
            <Text variant="default">
              The quick brown fox jumps over the lazy dog.
            </Text>
          </div>
          <div className="space-y-1">
            <Text variant="small" className="italic font-bold">
              Small
            </Text>
            <Text variant="small">
              The quick brown fox jumps over the lazy dog.
            </Text>
          </div>
          <div className="space-y-1">
            <Text variant="small" className="italic font-bold">
              Muted
            </Text>
            <Text variant="muted">
              The quick brown fox jumps over the lazy dog.
            </Text>
          </div>
          <div className="space-y-1">
            <Text variant="small" className="italic font-bold">
              Error
            </Text>
            <Text variant="error">
              The quick brown fox jumps over the lazy dog.
            </Text>
          </div>
        </div>
      </div>
    </div>
  ),
};
