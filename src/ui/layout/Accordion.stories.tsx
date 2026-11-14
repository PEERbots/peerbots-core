import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { Button } from "../forms/Button";
import { Input } from "../forms/Input";
import { Accordion } from "./Accordion";
import { Collapsible } from "./Collapsible";

const DISCLOSURE_COMPARISON_MD = `
Coordinated vertical disclosure group for **2 or more related sections** (such as FAQs, multi-section inspector sidebars, or grouped help guides) with optional single-open mutual exclusivity (\`allowMultiple={false}\`).

| Dimension | \`<Accordion>\` | \`<Collapsible>\` |
|---|---|---|
| **Item Count** | **2+ coordinated items** via \`items={[...]}\` | **1 standalone section** wrapping \`children\` |
| **Mutual Exclusivity** | Supports single-open (\`allowMultiple={false}\`) or multi-open (\`allowMultiple={true}\`) | Independent open/closed state (\`isOpen\` / \`defaultOpen\`) |
| **Sizing Scale** | Card-level padding (\`variant="default" \\| "bordered" \\| "flat"\`) | Compact-to-spacious scale (\`size="sm" \\| "md" \\| "lg"\`) |
| **Canonical Use Case** | FAQ lists, multi-category troubleshooting, grouped help panels | "Advanced Settings" drawer, debug inspector, \`SettingsPanel\` body |
`.trim();

const meta: Meta<typeof Accordion> = {
  title: "Layout/Disclosures/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: DISCLOSURE_COMPARISON_MD,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  args: {
    className: "pb:w-[480px]",
    items: [
      {
        question: "What is Peerbots?",
        answer:
          "Peerbots is an open-source platform designed to make social robotics accessible to educators, researchers, and therapists.",
        isOpenDefault: true,
      },
      {
        question: "How do I connect a controller to a robot face?",
        answer:
          "You can pair controller and face apps using the same network or Peerbots cloud relay.",
      },
      {
        question: "Is Peerbots open source?",
        answer:
          "Yes, Peerbots core packages and tools are open-source under GPL/MIT licenses.",
      },
    ],
    allowMultiple: false,
  },
};

export const AllowMultipleOpen: Story = {
  args: {
    className: "pb:w-[480px]",
    allowMultiple: true,
    items: [
      {
        question: "Audio & Speech Synthesis",
        answer:
          "Configure browser Web Speech API voices, speaking rate, and pitch.",
        isOpenDefault: true,
      },
      {
        question: "Face Animation Timing",
        answer:
          "Synchronize mouth movement and blink intervals during spoken utterances.",
        isOpenDefault: true,
      },
      {
        question: "Template Constraints",
        answer:
          "Restrict robot responses strictly to approved buttons in active templates.",
      },
    ],
  },
};

export const Variants: Story = {
  render: () => (
    <div className="pb:w-[540px] pb:space-y-6 pb:p-6 pb:bg-gray-50 pb:rounded-2xl">
      <div>
        <h4 className="pb:text-xs pb:font-bold pb:text-gray-600 pb:uppercase pb:mb-2">
          Default Card
        </h4>
        <Accordion
          items={[
            { question: "Item 1", answer: "Clean rounded card with shadow." },
            { question: "Item 2", answer: "Second coordinated item." },
          ]}
        />
      </div>
      <div>
        <h4 className="pb:text-xs pb:font-bold pb:text-gray-600 pb:uppercase pb:mb-2">
          Bordered 2px
        </h4>
        <Accordion
          variant="bordered"
          items={[
            { question: "Bordered Item 1", answer: "Clear 2px border styling." },
            { question: "Bordered Item 2", answer: "Second bordered item." },
          ]}
        />
      </div>
      <div>
        <h4 className="pb:text-xs pb:font-bold pb:text-gray-600 pb:uppercase pb:mb-2">
          Flat Background
        </h4>
        <Accordion
          variant="flat"
          items={[
            {
              question: "Flat Item 1",
              answer: "Subtle gray background without outer border.",
            },
            {
              question: "Flat Item 2",
              answer: "Second flat item.",
            },
          ]}
        />
      </div>
    </div>
  ),
};

export const ComparisonWithCollapsible: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Side-by-side comparison showing `<Accordion>` managing mutually exclusive FAQ items (`allowMultiple={false}`) on the left, versus `<Collapsible size=\"sm\">` wrapping a standalone advanced configuration form on the right.",
      },
    },
  },
  render: () => (
    <div className="pb:grid pb:grid-cols-1 md:pb:grid-cols-2 pb:gap-6 pb:w-full pb:max-w-4xl pb:p-4">
      <div className="pb:space-y-2">
        <div className="pb:text-xs pb:font-bold pb:uppercase pb:tracking-wider pb:text-peerbots-darkteal">
          Accordion (2+ Coordinated Items, Single-Open)
        </div>
        <Accordion
          allowMultiple={false}
          items={[
            {
              question: "1. Choose a Template",
              answer: "Upload or select a JSON/CSV template for the session.",
              isOpenDefault: true,
            },
            {
              question: "2. Pair Robot Face",
              answer: "Open the Peerbots Face display on a tablet or phone.",
            },
            {
              question: "3. Trigger Expressions",
              answer: "Tap any colored button to speak with synchronized emotion.",
            },
          ]}
        />
      </div>

      <div className="pb:space-y-2">
        <div className="pb:text-xs pb:font-bold pb:uppercase pb:tracking-wider pb:text-rose-800">
          Collapsible (Single Standalone Disclosure + Arbitrary Children)
        </div>
        <Collapsible title="Advanced Relay Configuration" size="sm" defaultOpen>
          <div className="pb:space-y-3">
            <Input
              aria-label="Custom WebSocket URL"
              placeholder="wss://relay.peerbots.org"
              size="sm"
            />
            <Button color="primary" size="sm">
              Save Relay Endpoint
            </Button>
          </div>
        </Collapsible>
      </div>
    </div>
  ),
};
