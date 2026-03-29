import type { Meta, StoryObj } from "@storybook/react";
import { DistributionBarChart } from "./DistributionBarChart";

const meta: Meta<typeof DistributionBarChart> = {
  title: "Charts/DistributionBarChart",
  component: DistributionBarChart,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    alt: "Default emotion distribution bar chart.",
    data: [
      { label: "Happy", count: 12, items: ["Hello!", "How are you?"] },
      { label: "Sad", count: 3, items: ["I am sad."] },
      { label: "Neutral", count: 20, items: ["Okay.", "Yes.", "No."] },
    ],
    average: 11,
    referenceLineValue: 15,
    referenceLineLabel: "Target",
    label: "Emotion",
  },
};

export const Variations: Story = {
  args: {
    alt: "Color variation bar chart.",
    data: [
      { label: "Red", count: 15, fill: "Red" },
      { label: "Blue", count: 8, fill: "Blue" },
      { label: "White", count: 5, fill: "White" },
      { label: "Custom", count: 10, fill: "#ff00ff", stroke: "#000" },
    ],
    label: "Color Variations",
  },
};
