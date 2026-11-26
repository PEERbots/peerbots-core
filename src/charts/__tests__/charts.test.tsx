import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import axe from "axe-core";
import { DistributionBarChart } from "../DistributionBarChart";
import { DistributionHistogram } from "../DistributionHistogram";

describe("Charts (@peerbots/core/charts)", () => {
  it("renders DistributionBarChart with X-axis grid, badges, hover tooltip, and zero axe violations", async () => {
    const { container } = render(
      <DistributionBarChart
        label="Emotion"
        alt="Emotion distribution chart"
        average={5.5}
        referenceLineValue={8}
        referenceLineLabel="Target"
        data={[
          {
            label: "Happy",
            count: 9,
            fill: "#46d9d9",
            items: ["Hello!", "Great job!"],
          },
          {
            label: "Neutral",
            count: 2,
            fill: "White",
            items: ["Okay.", "Ready."],
          },
        ]}
      />,
    );

    expect(
      screen.getByRole("region", { name: "Emotion distribution chart" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Emotion")).toBeInTheDocument();
    expect(screen.getByText("Avg 5.5")).toBeInTheDocument();
    expect(screen.getByText("Target 8")).toBeInTheDocument();
    expect(screen.getByText("11 total")).toBeInTheDocument();

    const happyBar = screen.getByLabelText("Happy: 9");
    fireEvent.mouseEnter(happyBar);
    expect(screen.getByRole("tooltip")).toHaveTextContent("Hello!");

    fireEvent.mouseLeave(happyBar);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    const axeResults = await axe.run(container);
    expect(axeResults.violations).toEqual([]);
  });

  it("renders DistributionHistogram with Y-axis grid, threshold highlighting, hover tooltip, and zero axe violations", async () => {
    const { container } = render(
      <DistributionHistogram
        label="Speech Length"
        alt="Speech length histogram"
        average={28}
        referenceLineValue={60}
        referenceLineLabel="Too Long"
        data={[
          { x: 5, text: "Hi!" },
          { x: 25, text: "How are you doing today?" },
          { x: 65, text: "This is a much longer sentence exceeding sixty characters." },
        ]}
      />,
    );

    expect(
      screen.getByRole("region", { name: "Speech length histogram" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Speech Length")).toBeInTheDocument();
    expect(screen.getByText("Avg 28")).toBeInTheDocument();
    expect(screen.getByText("Too Long ≥60")).toBeInTheDocument();
    expect(screen.getByText("3 total")).toBeInTheDocument();

    const firstBin = screen.getByLabelText("0–10: 1");
    fireEvent.mouseEnter(firstBin);
    expect(screen.getByRole("tooltip")).toHaveTextContent("Hi!");

    const axeResults = await axe.run(container);
    expect(axeResults.violations).toEqual([]);
  });

  it("returns null for empty data arrays", () => {
    const { container: c1 } = render(
      <DistributionBarChart data={[]} alt="Empty bar" />,
    );
    expect(c1.firstChild).toBeNull();

    const { container: c2 } = render(
      <DistributionHistogram data={[]} alt="Empty hist" label="Empty" />,
    );
    expect(c2.firstChild).toBeNull();
  });
});
