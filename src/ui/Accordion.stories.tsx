import type { Meta, StoryObj } from "@storybook/react";
import { Accordion } from "./Accordion";
import { Button } from "./Button";
import { Input } from "./Input";
import React from "react";

const meta: Meta<typeof Accordion> = {
  title: "Layout/Accordion",
  component: Accordion,
  parameters: {
    layout: "centered",
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
        answer: "Peerbots is an open-source platform designed to make social robotics accessible to educators, researchers, and therapists.",
        isOpenDefault: true,
      },
      {
        question: "How do I connect a controller to a robot face?",
        answer: "You can pair controller and face apps using the same network or Peerbots cloud relay.",
      },
      {
        question: "Is Peerbots open source?",
        answer: "Yes, Peerbots core packages and tools are open-source under GPL/MIT licenses.",
      },
    ],
    allowMultiple: false,
  },
};

export const SingleDisclosure: Story = {
  render: () => (
    <div className="pb:w-[480px]">
      <Accordion title="Advanced Configuration" defaultOpen={true}>
        <div className="pb:space-y-3 pb:py-2">
          <Input placeholder="Custom WebSocket URL" />
          <Button variant="primary" size="sm">Save Config</Button>
        </div>
      </Accordion>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="pb:w-[540px] pb:space-y-6 pb:p-6 pb:bg-gray-50 pb:rounded-2xl">
      <div>
        <h4 className="pb:text-xs pb:font-bold pb:text-gray-500 pb:uppercase pb:mb-2">Default Card</h4>
        <Accordion
          items={[
            { question: "Item 1", answer: "Clean rounded card with shadow." },
            { question: "Item 2", answer: "Second item." },
          ]}
        />
      </div>
      <div>
        <h4 className="pb:text-xs pb:font-bold pb:text-gray-500 pb:uppercase pb:mb-2">Bordered 2px</h4>
        <Accordion
          variant="bordered"
          items={[
            { question: "Bordered Item 1", answer: "Clear border styling." },
          ]}
        />
      </div>
      <div>
        <h4 className="pb:text-xs pb:font-bold pb:text-gray-500 pb:uppercase pb:mb-2">Flat Background</h4>
        <Accordion
          variant="flat"
          items={[
            { question: "Flat Item 1", answer: "Gray background without border." },
          ]}
        />
      </div>
    </div>
  ),
};
