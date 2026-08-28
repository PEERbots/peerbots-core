import type { Meta, StoryObj } from "@storybook/react-vite";
import { LineGraph } from "./LineGraph";

const meta: Meta<typeof LineGraph> = {
  title: "Components/LineGraph",
  component: LineGraph,
};

export default meta;
type Story = StoryObj<typeof LineGraph>;

const sampleWaveform = Array.from({ length: 40 }, (_, i) => ({
  x: i * 25,
  y: Math.max(0, Math.sin(i / 3) * 0.8 + Math.random() * 0.2),
}));

const sampleExtrema = [
  { x: 100, y: 0.85, color: "#ef4444", label: "Peak: 0.85 at 100ms" },
  { x: 400, y: 0.92, color: "#ef4444", label: "Peak: 0.92 at 400ms" },
  { x: 750, y: 0.78, color: "#10b981", label: "Dip: 0.78 at 750ms" },
];

export const Default: Story = {
  args: {
    data: sampleWaveform,
    highlightPoints: sampleExtrema,
    height: 180,
    strokeColor: "#3b82f6",
  },
};

export const Variations: Story = {
  render: () => (
    <div className="pb:flex pb:flex-col pb:gap-6 pb:p-4">
      <div>
        <span className="pb:text-xs pb:font-bold pb:text-gray-500 pb:block pb:mb-2">With Area Fill</span>
        <LineGraph
          data={sampleWaveform}
          fillColor="#60a5fa"
          strokeColor="#2563eb"
          height={160}
        />
      </div>
      <div>
        <span className="pb:text-xs pb:font-bold pb:text-gray-500 pb:block pb:mb-2">Teal Brand Theme</span>
        <LineGraph
          data={sampleWaveform}
          strokeColor="#0f766e"
          fillColor="#46d9d9"
          height={140}
          xUnit="s"
        />
      </div>
      <div>
        <span className="pb:text-xs pb:font-bold pb:text-gray-500 pb:block pb:mb-2">Empty State (No Data)</span>
        <LineGraph data={[]} height={120} />
      </div>
    </div>
  ),
};
