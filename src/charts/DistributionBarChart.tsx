import {
  VictoryChart,
  VictoryBar,
  VictoryAxis,
  VictoryTooltip,
  VictoryVoronoiContainer,
  VictoryLine,
  VictoryLabel,
} from "victory";

export interface DistributionBarData {
  label: string;
  count: number;
  items?: string[];
  fill?: string;
  stroke?: string;
}

export interface DistributionBarChartProps {
  data: DistributionBarData[];
  alt: string;
  chartWidth?: number;
  chartHeight?: number;
  average?: number;
  referenceLineValue?: number;
  referenceLineLabel?: string;
  label?: string;
}

export function DistributionBarChart({
  data,
  alt,
  chartWidth = 600,
  chartHeight = 400,
  average,
  referenceLineValue,
  referenceLineLabel = "Reference",
  label,
}: DistributionBarChartProps) {
  const maxCount = Math.max(...data.map((d) => d.count), 5);
  const labels = data.map((d) => d.label);

  if (data.length === 0) return null;

  return (
    <div className="pb:mb-6" role="img" aria-label={alt}>
      {label && (
        <label className="pb:text-xs pb:uppercase pb:font-bold pb:text-gray-400 pb:block pb:mb-2 pb:px-1">
          {label}
        </label>
      )}
      <VictoryChart
        width={chartWidth}
        height={chartHeight}
        padding={{ left: 100, right: 50, top: 40, bottom: 60 }}
        containerComponent={<VictoryVoronoiContainer />}
      >
        <VictoryAxis
          horizontal
          tickValues={labels}
          style={{
            axis: { stroke: "#cbd5e1" },
            tickLabels: { fontSize: 18, padding: 5, fill: "#334155" },
          }}
        />
        <VictoryAxis
          dependentAxis
          domain={[0, maxCount]}
          tickFormat={(x: number | string) =>
            typeof x === "number" ? Math.round(x) : x
          }
          style={{
            axis: { stroke: "#cbd5e1" },
            tickLabels: { fontSize: 18, padding: 5, fill: "#334155" },
            grid: { stroke: "#f1f5f9" },
          }}
        />
        <VictoryBar
          horizontal
          domain={{ x: [0.5, labels.length + 0.5], y: [0, maxCount] }}
          data={data}
          x={"label"}
          y={"count"}
          labels={({ datum }: { datum?: DistributionBarData }) => {
            if (!datum || datum.count === 0) return "";
            if (!datum.items || datum.items.length === 0)
              return `${datum.count}`;
            const displayItems = datum.items.slice(0, 5);
            let labelText = displayItems.join("\n");
            if (datum.items.length > 5)
              labelText += `\n...and ${datum.items.length - 5} more`;
            return labelText;
          }}
          labelComponent={
            <VictoryTooltip
              style={{ fontSize: 18 }}
              flyoutStyle={{ fill: "white", stroke: "#cbd5e1" }}
              pointerLength={5}
              cornerRadius={2}
              constrainToVisibleArea
            />
          }
          style={{
            data: {
              fill: ({ datum }: { datum?: DistributionBarData }) =>
                datum?.fill
                  ? datum.fill === "White"
                    ? "#f3f4f6"
                    : datum.fill
                  : "#46d9d9",
              width: 14,
              stroke: ({ datum }: { datum?: DistributionBarData }) =>
                datum?.stroke
                  ? datum.stroke
                  : datum?.fill === "White"
                    ? "#d1d5db"
                    : "none",
              strokeWidth: ({ datum }: { datum?: DistributionBarData }) =>
                datum?.stroke || datum?.fill === "White" ? 0.5 : 0,
              cursor: "pointer",
            },
          }}
          cornerRadius={2}
        />
        {average !== undefined && (
          <VictoryLine
            y={() => average}
            style={{
              data: {
                stroke: "#9ca3af",
                strokeWidth: 2,
                strokeDasharray: "4, 4",
              },
            }}
            labels={["Average"]}
            labelComponent={
              <VictoryLabel
                y={45}
                style={{ fill: "#475569", fontSize: 18, fontWeight: "bold" }}
                backgroundStyle={{ fill: "white" }}
                backgroundPadding={12}
              />
            }
          />
        )}
        {referenceLineValue !== undefined && (
          <VictoryLine
            y={() => referenceLineValue}
            labels={[referenceLineLabel]}
            labelComponent={
              <VictoryLabel
                y={45}
                style={{ fill: "#ef4444", fontSize: 18, fontWeight: "bold" }}
                backgroundStyle={{ fill: "white" }}
                backgroundPadding={12}
              />
            }
            style={{
              data: {
                stroke: "#ef4444",
                strokeWidth: 2,
                strokeDasharray: "4, 4",
              },
            }}
          />
        )}
      </VictoryChart>
    </div>
  );
}
