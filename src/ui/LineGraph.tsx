import React from "react";
import { cn } from "./utils";

export interface LineGraphPoint {
  x: number;
  y: number;
}

export interface LineGraphHighlightPoint extends LineGraphPoint {
  color?: string;
  label?: string;
}

export interface LineGraphProps {
  data: LineGraphPoint[];
  highlightPoints?: LineGraphHighlightPoint[];
  minX?: number;
  maxX?: number;
  minY?: number;
  maxY?: number;
  width?: number | string;
  height?: number;
  strokeColor?: string;
  strokeWidth?: number;
  fillColor?: string;
  showGrid?: boolean;
  showAxisLabels?: boolean;
  xUnit?: string;
  padding?: number;
  className?: string;
}

export function LineGraph({
  data = [],
  highlightPoints = [],
  minX,
  maxX,
  minY = 0,
  maxY,
  width = "100%",
  height = 200,
  strokeColor = "#3b82f6",
  strokeWidth = 2,
  fillColor,
  showGrid = true,
  showAxisLabels = true,
  xUnit = "ms",
  padding = 24,
  className,
}: LineGraphProps) {
  const svgWidth = typeof width === "number" ? width : 800;
  const svgHeight = height;

  const hasData = data && data.length > 0;

  const calculatedMinX =
    minX ?? (hasData ? Math.min(...data.map((d) => d.x)) : 0);
  const calculatedMaxX =
    maxX ?? (hasData ? Math.max(...data.map((d) => d.x)) : 1000);
  const xSpan = Math.max(calculatedMaxX - calculatedMinX, 1);

  const calculatedMinY =
    minY ?? (hasData ? Math.min(...data.map((d) => d.y)) : 0);
  const calculatedMaxY =
    maxY ?? (hasData ? Math.max(...data.map((d) => d.y)) : 1);
  const ySpan = Math.max(calculatedMaxY - calculatedMinY, 0.001);

  const getCanvasX = (x: number) =>
    ((x - calculatedMinX) / xSpan) * (svgWidth - 2 * padding) + padding;

  const getCanvasY = (y: number) =>
    svgHeight -
    padding -
    ((y - calculatedMinY) / ySpan) * (svgHeight - 2 * padding);

  const pathData = hasData
    ? data
        .map(
          (p, i) =>
            `${i === 0 ? "M" : "L"} ${getCanvasX(p.x)} ${getCanvasY(p.y)}`,
        )
        .join(" ")
    : `M ${padding} ${getCanvasY(calculatedMinY)} L ${
        svgWidth - padding
      } ${getCanvasY(calculatedMinY)}`;

  const fillPathData =
    hasData && fillColor
      ? `${pathData} L ${getCanvasX(
          data[data.length - 1].x,
        )} ${getCanvasY(calculatedMinY)} L ${getCanvasX(
          data[0].x,
        )} ${getCanvasY(calculatedMinY)} Z`
      : undefined;

  return (
    <div className={cn("pb:relative pb:w-full pb:overflow-x-auto", className)}>
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="pb:w-full pb:h-auto pb:bg-gray-50 pb:rounded pb:border pb:border-gray-200"
        style={{ minWidth: typeof width === "number" ? `${width}px` : "300px" }}
      >
        {/* Grid and Axes */}
        {showGrid && (
          <>
            {/* X-axis */}
            <line
              x1={padding}
              y1={svgHeight - padding}
              x2={svgWidth - padding}
              y2={svgHeight - padding}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
            {/* Y-axis */}
            <line
              x1={padding}
              y1={padding}
              x2={padding}
              y2={svgHeight - padding}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
            {/* Mid Y-grid */}
            <line
              x1={padding}
              y1={getCanvasY((calculatedMinY + calculatedMaxY) / 2)}
              x2={svgWidth - padding}
              y2={getCanvasY((calculatedMinY + calculatedMaxY) / 2)}
              stroke="#f3f4f6"
              strokeWidth="1"
              strokeDasharray="4"
            />
          </>
        )}

        {/* Fill Area */}
        {fillPathData && (
          <path d={fillPathData} fill={fillColor} opacity={0.3} />
        )}

        {/* Data Path */}
        <path
          d={pathData}
          fill="none"
          stroke={strokeColor}
          strokeWidth={hasData ? strokeWidth : 1}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Highlight Points */}
        {highlightPoints?.map((p, i) => (
          <circle
            key={i}
            cx={getCanvasX(p.x)}
            cy={getCanvasY(p.y)}
            r="3.5"
            fill={p.color ?? "#ef4444"}
            className="pb:transition-all pb:duration-150 pb:hover:r-5 pb:cursor-crosshair"
          >
            {p.label && <title>{p.label}</title>}
          </circle>
        ))}

        {/* Axis Labels */}
        {showAxisLabels && (
          <>
            {/* Bottom-left X min */}
            <text
              x={padding}
              y={svgHeight - 6}
              fontSize="10"
              fill="#9ca3af"
              textAnchor="start"
            >
              {calculatedMinX}
              {xUnit}
            </text>
            {/* Bottom-right X max */}
            <text
              x={svgWidth - padding}
              y={svgHeight - 6}
              fontSize="10"
              fill="#9ca3af"
              textAnchor="end"
            >
              {calculatedMaxX}
              {xUnit}
            </text>
            {/* Top-left Y max */}
            <text
              x={6}
              y={padding + 4}
              fontSize="10"
              fill="#9ca3af"
              textAnchor="start"
            >
              {calculatedMaxY.toFixed(1)}
            </text>
            {/* Bottom-left Y min */}
            <text
              x={6}
              y={svgHeight - padding}
              fontSize="10"
              fill="#9ca3af"
              textAnchor="start"
            >
              {calculatedMinY.toFixed(1)}
            </text>
          </>
        )}
      </svg>
    </div>
  );
}
