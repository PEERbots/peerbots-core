import {
  VictoryChart,
  VictoryAxis,
  VictoryLabel,
  VictoryLine,
  VictoryHistogram,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from "victory";

export interface DistributionHistogramData {
  x: number;
  text: string;
}

export interface DistributionHistogramProps {
  data: DistributionHistogramData[];
  alt: string;
  label: string;
  average?: number;
  referenceLineValue?: number;
  referenceLineLabel?: string;
  chartWidth?: number;
  chartHeight?: number;
}

export function DistributionHistogram({
  data,
  alt,
  label,
  average,
  referenceLineValue,
  referenceLineLabel = "Reference",
  chartWidth = 600,
  chartHeight = 400,
}: DistributionHistogramProps) {
  if (data.length === 0) return null;

  const binSize = 10;
  const maxLength = Math.max(
    ...data.map((r) => r.x),
    referenceLineValue ?? 0,
    binSize,
  );
  const maxX = Math.ceil(maxLength / binSize) * binSize + binSize;

  const boundaries = [];
  for (let i = 0; i <= maxX; i += binSize) {
    boundaries.push(i);
  }

  const padding = { left: 60, right: 30, top: 20, bottom: 70 };

  return (
    <div className="pb:mb-6" role="img" aria-label={alt}>
      <label className="pb:text-xs pb:uppercase pb:font-bold pb:text-gray-400 pb:block pb:mb-2 pb:px-1">
        {label}
      </label>
      <VictoryChart
        width={chartWidth}
        height={chartHeight}
        padding={padding}
        containerComponent={<VictoryVoronoiContainer />}
      >
        <VictoryAxis
          label="Length"
          tickValues={boundaries}
          tickFormat={(x: number | string) =>
            typeof x === "number" ? Math.round(x) : x
          }
          style={{
            axis: { stroke: "#cbd5e1" },
            axisLabel: {
              fontSize: 18,
              padding: 45,
              fill: "#334155",
              fontWeight: "bold",
            },
            tickLabels: {
              fontSize: 18,
              padding: 5,
              fill: "#334155",
              angle: 45,
              textAnchor: "start",
            },
          }}
        />
        <VictoryAxis
          dependentAxis
          label="Count"
          tickFormat={(x: number | string) =>
            typeof x === "number" ? Math.round(x) : x
          }
          style={{
            axis: { stroke: "#cbd5e1" },
            axisLabel: {
              fontSize: 18,
              padding: 40,
              fill: "#334155",
              fontWeight: "bold",
            },
            tickLabels: {
              fontSize: 18,
              padding: 5,
              fill: "#334155",
            },
            grid: { stroke: "#f1f5f9" },
          }}
        />
        <VictoryHistogram
          data={data}
          bins={boundaries}
          x="x"
          labels={({
            datum,
          }: {
            datum?: {
              y: number;
              binnedData?: { text: string }[];
            };
          }) => {
            if (!datum || datum.y === 0 || !datum.binnedData) return "";
            const items = datum.binnedData.map((d: { text: string }) => d.text);
            const displayItems = items.slice(0, 5);
            let labelText = displayItems.join("\n");
            if (items.length > 5)
              labelText += `\n...and ${items.length - 5} more`;
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
              fill: "#46d9d9",
              stroke: "#fff",
              strokeWidth: 1,
              cursor: "pointer",
            },
          }}
        />
        {average !== undefined && (
          <VictoryLine
            x={() => average}
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
            x={() => referenceLineValue}
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
