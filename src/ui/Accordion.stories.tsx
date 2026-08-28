import type { Meta, StoryObj } from "@storybook/react";
import { Accordion } from "./Accordion";
import React from "react";

const meta: Meta<typeof Accordion> = {
  title: "UI/Accordion",
  component: Accordion,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  args: {
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
