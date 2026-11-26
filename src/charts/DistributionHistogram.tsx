import { useState } from "react";

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

interface HistogramBin {
  x0: number;
  x1: number;
  items: string[];
}

function buildNiceTicks(maxVal: number, targetTickCount = 4): number[] {
  const safeMax = Math.max(Math.ceil(maxVal), 1);
  const rawStep = safeMax / targetTickCount;
  const step = Math.max(1, Math.ceil(rawStep));
  const ticks: number[] = [];
  for (let v = 0; v <= safeMax; v += step) {
    ticks.push(v);
  }
  if (ticks[ticks.length - 1] < safeMax) {
    ticks.push(ticks[ticks.length - 1] + step);
  }
  return ticks;
}

function formatBinTooltipLines(bin: HistogramBin): string[] {
  const header = `${bin.x0}–${bin.x1} (${bin.items.length})`;
  const displayItems = bin.items.slice(0, 5);
  const lines = [header, ...displayItems];
  if (bin.items.length > 5) {
    lines.push(`...and ${bin.items.length - 5} more`);
  }
  return lines;
}

export function DistributionHistogram({
  data,
  alt,
  label,
  average,
  referenceLineValue,
  referenceLineLabel = "Reference",
  chartHeight,
}: DistributionHistogramProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (data.length === 0) return null;

  const binSize = 10;
  const maxLength = Math.max(
    ...data.map((r) => r.x),
    referenceLineValue ?? 0,
    binSize,
  );
  const maxX = Math.ceil(maxLength / binSize) * binSize + binSize;

  const bins: HistogramBin[] = [];
  for (let start = 0; start < maxX; start += binSize) {
    bins.push({ x0: start, x1: start + binSize, items: [] });
  }

  for (const point of data) {
    const idx = Math.min(
      bins.length - 1,
      Math.max(0, Math.floor(point.x / binSize)),
    );
    bins[idx].items.push(point.text);
  }

  const maxBinCount = Math.max(...bins.map((b) => b.items.length), 1);
  const yTicks = buildNiceTicks(maxBinCount, 4);
  const yAxisMax = yTicks[yTicks.length - 1];

  const averagePct =
    average !== undefined
      ? Math.min(100, Math.max(0, (average / maxX) * 100))
      : undefined;
  const referencePct =
    referenceLineValue !== undefined
      ? Math.min(100, Math.max(0, (referenceLineValue / maxX) * 100))
      : undefined;
  const labelsClose =
    averagePct !== undefined &&
    referencePct !== undefined &&
    Math.abs(averagePct - referencePct) < 22;
  const hasLineLabels = averagePct !== undefined || referencePct !== undefined;

  const getPillAlignClass = (pct: number) =>
    pct < 12
      ? "pb:translate-x-0"
      : pct > 88
        ? "pb:-translate-x-full"
        : "pb:-translate-x-1/2";

  const plotHeightPx = chartHeight
    ? Math.max(120, Math.min(260, Math.round(chartHeight * 0.45)))
    : 160;

  return (
    <div
      className="pb:mb-6 pb:rounded-xl pb:border pb:border-slate-200/90 pb:bg-white pb:p-4 pb:shadow-xs"
      role="region"
      aria-label={alt}
    >
      <div className="pb:mb-3 pb:flex pb:flex-wrap pb:items-center pb:justify-between pb:gap-2">
        {label ? (
          <span className="pb:text-xs pb:font-bold pb:uppercase pb:tracking-wider pb:text-slate-600">
            {label}
          </span>
        ) : (
          <span />
        )}
        <span className="pb:text-[11px] pb:tabular-nums pb:text-slate-500">
          {data.length} total
        </span>
      </div>

      {/* Line-anchored Average & Reference labels aligned with plot canvas */}
      {hasLineLabels && (
        <div className="pb:mb-1.5 pb:flex pb:items-center pb:gap-2">
          <span className="pb:w-3.5 pb:shrink-0" aria-hidden="true" />
          <span className="pb:w-5 pb:shrink-0" aria-hidden="true" />
          <div
            className={`pb:relative pb:min-w-0 pb:flex-1 ${labelsClose ? "pb:h-11" : "pb:h-5"}`}
          >
            {averagePct !== undefined && average !== undefined && (
              <span
                className={`pb:absolute pb:top-0 pb:inline-flex pb:items-center pb:gap-1 pb:whitespace-nowrap pb:rounded-full pb:border pb:border-slate-200 pb:bg-slate-100 pb:px-2 pb:py-0.5 pb:text-[10.5px] pb:font-medium pb:tabular-nums pb:text-slate-600 ${getPillAlignClass(averagePct)}`}
                style={{ left: `${averagePct}%` }}
              >
                <span
                  className="pb:h-1.5 pb:w-1.5 pb:rounded-full pb:bg-slate-400"
                  aria-hidden="true"
                />
                Avg {Math.round(average * 10) / 10}
              </span>
            )}
            {referencePct !== undefined &&
              referenceLineValue !== undefined && (
                <span
                  className={`pb:absolute ${labelsClose ? "pb:top-6" : "pb:top-0"} pb:inline-flex pb:items-center pb:gap-1 pb:whitespace-nowrap pb:rounded-full pb:border pb:border-pink-200 pb:bg-pink-50 pb:px-2 pb:py-0.5 pb:text-[10.5px] pb:font-medium pb:tabular-nums pb:text-pink-700 ${getPillAlignClass(referencePct)}`}
                  style={{ left: `${referencePct}%` }}
                >
                  <span
                    className="pb:h-1.5 pb:w-1.5 pb:rounded-full pb:bg-[#e86e8a]"
                    aria-hidden="true"
                  />
                  {referenceLineLabel} ≥{referenceLineValue}
                </span>
              )}
          </div>
        </div>
      )}

      {/* Plot area: Y-axis title + tick column + horizontal gridlines & rounded columns */}
      <div className="pb:flex pb:items-stretch pb:gap-2">
        {/* Rotated Y-axis title */}
        <div
          className="pb:flex pb:w-3.5 pb:shrink-0 pb:items-center pb:justify-center pb:select-none"
          style={{ height: `${plotHeightPx}px` }}
          aria-hidden="true"
        >
          <span className="pb:-rotate-90 pb:whitespace-nowrap pb:text-[10px] pb:font-medium pb:uppercase pb:tracking-wider pb:text-slate-400">
            Count
          </span>
        </div>

        {/* Y-axis numeric labels */}
        <div
          className="pb:relative pb:w-5 pb:shrink-0 pb:select-none"
          style={{ height: `${plotHeightPx}px` }}
          aria-hidden="true"
        >
          {yTicks.map((tick) => {
            const bottomPct = (tick / yAxisMax) * 100;
            return (
              <span
                key={tick}
                className="pb:absolute pb:right-0 pb:translate-y-1/2 pb:text-[10.5px] pb:tabular-nums pb:text-slate-400"
                style={{ bottom: `${bottomPct}%` }}
              >
                {tick}
              </span>
            );
          })}
        </div>

        {/* Gridded column canvas */}
        <div className="pb:min-w-0 pb:flex-1">
          <div
            className="pb:relative pb:w-full pb:border-b pb:border-slate-200"
            style={{ height: `${plotHeightPx}px` }}
          >
            {/* Subtle horizontal Y-axis gridlines */}
            {yTicks.map((tick) => {
              const bottomPct = (tick / yAxisMax) * 100;
              if (tick === 0) return null;
              return (
                <span
                  key={tick}
                  aria-hidden="true"
                  className="pb:pointer-events-none pb:absolute pb:left-0 pb:right-0 pb:border-t pb:border-dashed pb:border-slate-200/85"
                  style={{ bottom: `${bottomPct}%` }}
                />
              );
            })}

            {/* Vertical reference lines */}
            {averagePct !== undefined && (
              <span
                aria-hidden="true"
                className="pb:pointer-events-none pb:absolute pb:top-0 pb:bottom-0 pb:z-10 pb:border-l pb:border-dashed pb:border-slate-400/75"
                style={{ left: `${averagePct}%` }}
              />
            )}
            {referencePct !== undefined && (
              <span
                aria-hidden="true"
                className="pb:pointer-events-none pb:absolute pb:top-0 pb:bottom-0 pb:z-10 pb:border-l pb:border-dashed pb:border-[#e86e8a]/85"
                style={{ left: `${referencePct}%` }}
              />
            )}

            {/* Rounded columns */}
            <div className="pb:relative pb:z-[2] pb:flex pb:h-full pb:items-end pb:justify-between pb:gap-1 pb:px-0.5">
              {bins.map((bin, idx) => {
                const count = bin.items.length;
                const heightPct = count > 0 ? (count / yAxisMax) * 100 : 0;
                const isOverThreshold =
                  referenceLineValue !== undefined &&
                  bin.x0 >= referenceLineValue;
                const barColor = isOverThreshold ? "#e86e8a" : "#46d9d9";
                const isHovered = hoveredIdx === idx;
                const tooltipLines = formatBinTooltipLines(bin);

                return (
                  <div
                    key={bin.x0}
                    className="pb:group pb:relative pb:flex pb:h-full pb:flex-1 pb:flex-col pb:items-center pb:justify-end"
                    role={count > 0 ? "group" : undefined}
                    tabIndex={count > 0 ? 0 : undefined}
                    aria-label={
                      count > 0 ? `${bin.x0}–${bin.x1}: ${count}` : undefined
                    }
                    onMouseEnter={() => count > 0 && setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    onFocus={() => count > 0 && setHoveredIdx(idx)}
                    onBlur={() => setHoveredIdx(null)}
                  >
                    {count > 0 && (
                      <span
                        className={`pb:mb-1 pb:text-[10.5px] pb:font-semibold pb:tabular-nums pb:transition-colors ${
                          isOverThreshold
                            ? "pb:text-pink-600"
                            : "pb:text-slate-600 pb:group-hover:text-slate-900"
                        }`}
                      >
                        {count}
                      </span>
                    )}
                    <div
                      className="pb:w-full pb:max-w-[28px] pb:rounded-t-lg pb:transition-all pb:duration-200 pb:group-hover:brightness-95"
                      style={{
                        height: count > 0 ? `${Math.max(heightPct, 4)}%` : "0%",
                        backgroundColor: barColor,
                        cursor: count > 0 ? "pointer" : "default",
                      }}
                    />

                    {/* Floating tooltip */}
                    {isHovered && count > 0 && (
                      <div
                        role="tooltip"
                        className="pb:pointer-events-none pb:absolute pb:bottom-full pb:left-1/2 pb:z-30 pb:mb-2 pb:-translate-x-1/2 pb:max-w-xs pb:rounded-lg pb:border pb:border-slate-700/80 pb:bg-slate-900 pb:px-2.5 pb:py-1.5 pb:text-xs pb:leading-snug pb:text-white pb:shadow-lg"
                      >
                        {tooltipLines.map((line, lineIdx) => (
                          <div
                            key={lineIdx}
                            className={
                              lineIdx === 0
                                ? "pb:font-semibold pb:mb-0.5 pb:whitespace-nowrap"
                                : "pb:text-slate-200 pb:truncate"
                            }
                          >
                            {line}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Clean horizontal X-axis bin labels */}
          <div className="pb:mt-1.5 pb:flex pb:items-center pb:justify-between pb:gap-1 pb:px-0.5">
            {bins.map((bin, idx) => {
              const showLabel =
                bins.length <= 8 || idx % 2 === 0 || idx === bins.length - 1;
              return (
                <span
                  key={bin.x0}
                  className="pb:flex-1 pb:text-center pb:text-[10.5px] pb:tabular-nums pb:text-slate-500"
                >
                  {showLabel ? `${bin.x0}` : ""}
                </span>
              );
            })}
          </div>
          <div className="pb:mt-1 pb:text-center pb:text-[10px] pb:font-medium pb:uppercase pb:tracking-wider pb:text-slate-400">
            Length
          </div>
        </div>
      </div>
    </div>
  );
}
