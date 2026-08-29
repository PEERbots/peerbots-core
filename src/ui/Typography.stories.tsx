import type { Meta, StoryObj } from "@storybook/react";
import { Heading, Text } from "./Typography";
import React from "react";

const meta: Meta = {
  title: "Foundations/Typography",
  tags: ["autodocs"],
};

export default meta;

export const Variations: StoryObj = {
  render: () => (
    <div className="pb:flex pb:flex-col pb:gap-8 pb:p-6 pb:bg-white pb:max-w-4xl">
      <div>
        <span className="pb:text-xs pb:font-bold pb:text-gray-400 pb:uppercase pb:tracking-wider pb:block pb:mb-3">
          Heading Scale & Semantic Tags
        </span>
        <div className="pb:space-y-3">
          <Heading level={1}>Heading 1 (Hero Title)</Heading>
          <Heading level={2}>Heading 2 (Section Title)</Heading>
          <Heading level={3}>Heading 3 (Card Title)</Heading>
          <Heading level={4}>Heading 4 (Panel Title)</Heading>
          <Heading level={5}>Heading 5 (Subsection)</Heading>
          <Heading level={6}>Heading 6 (Micro Title)</Heading>
        </div>
      </div>

      <div>
        <span className="pb:text-xs pb:font-bold pb:text-gray-400 pb:uppercase pb:tracking-wider pb:block pb:mb-3">
          Heading Brand Colors & Gradient
        </span>
        <div className="pb:space-y-3">
          <Heading level={2} color="teal">Teal Brand Heading</Heading>
          <Heading level={2} color="pink">Pink Brand Heading</Heading>
          <Heading level={2} color="darkblue">Dark Blue Primary Heading</Heading>
          <Heading level={2} color="gradient">Peerbots Hero Gradient Heading</Heading>
        </div>
      </div>

      <div>
        <span className="pb:text-xs pb:font-bold pb:text-gray-400 pb:uppercase pb:tracking-wider pb:block pb:mb-3">
          Text Scale & Composable Colors
        </span>
        <div className="pb:space-y-3">
          <Text size="lead">Lead paragraph text for introductory overview sections.</Text>
          <Text size="md">Body regular text (md scale, dark slate color for high readability).</Text>
          <Text size="sm" color="muted">Muted caption text (sm scale, subtle gray color).</Text>
          <Text size="xs" color="muted">Extra small microcopy / metadata.</Text>
          <Text size="md" color="teal" weight="bold">Teal bold callout message.</Text>
          <Text size="md" color="pink" weight="semibold">Pink accent notice message.</Text>
          <Text size="sm" color="error">Error validation message.</Text>
          <Text size="sm" color="success">Success confirmation message.</Text>
        </div>
      </div>
    </div>
  ),
};
