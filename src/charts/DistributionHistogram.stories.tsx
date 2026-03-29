import type { Meta, StoryObj } from "@storybook/react";
import { DistributionHistogram } from "./DistributionHistogram";

const meta: Meta<typeof DistributionHistogram> = {
  title: "Charts/DistributionHistogram",
  component: DistributionHistogram,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const fakeData = Array.from({ length: 50 }).map((_, i) => ({
  x: Math.floor(Math.abs(Math.sin(i * 123.45)) * 100),
  text: `Fake message ${i}`,
}));

export const Default: Story = {
  args: {
    alt: "Default distribution histogram showing fake data.",
    data: fakeData,
    label: "Data",
    average: 45,
    referenceLineValue: 80,
    referenceLineLabel: "Reference",
  },
};

export const WithoutReferenceLine: Story = {
  args: {
    alt: "Distribution histogram without reference line.",
    data: fakeData,
    label: "Data With Average",
    average: 45,
  },
};

export const WithoutAverage: Story = {
  args: {
    alt: "Distribution histogram without average line.",
    data: fakeData,
    label: "Data With Reference Line",
    referenceLineValue: 80,
    referenceLineLabel: "Reference Label",
  },
};

export const WithoutAverageOrReferenceLine: Story = {
  args: {
    alt: "Distribution histogram without average or reference lines.",
    data: fakeData,
    label: "Data",
  },
};
