import { useState } from "react";

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

function formatTooltipLines(datum: DistributionBarData): string[] {
  if (!datum.items || datum.items.length === 0) {
    return [`${datum.label}: ${datum.count}`];
  }
  const displayItems = datum.items.slice(0, 5);
  const lines = [`${datum.label} (${datum.count})`, ...displayItems];
  if (datum.items.length > 5) {
    lines.push(`...and ${datum.items.length - 5} more`);
  }
  return lines;
}

export function DistributionBarChart({
  data,
  alt,
  average,
  referenceLineValue,
  referenceLineLabel = "Reference",
  label,
}: DistributionBarChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (data.length === 0) return null;

  const rawMax = Math.max(
    ...data.map((d) => d.count),
    average ?? 0,
    referenceLineValue ?? 0,
    5,
  );
  const ticks = buildNiceTicks(rawMax, 4);
  const axisMax = ticks[ticks.length - 1];
  const totalCount = data.reduce((sum, d) => sum + d.count, 0);

  const averagePct =
    average !== undefined
      ? Math.min(100, Math.max(0, (average / axisMax) * 100))
      : undefined;
  const referencePct =
    referenceLineValue !== undefined
      ? Math.min(100, Math.max(0, (referenceLineValue / axisMax) * 100))
      : undefined;

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
        <div className="pb:flex pb:flex-wrap pb:items-center pb:gap-1.5 pb:text-[11px]">
          {average !== undefined && (
            <span className="pb:inline-flex pb:items-center pb:gap-1 pb:rounded-full pb:bg-slate-100 pb:px-2 pb:py-0.5 pb:font-medium pb:tabular-nums pb:text-slate-600">
              <span
                className="pb:h-1.5 pb:w-1.5 pb:rounded-full pb:bg-slate-400"
                aria-hidden="true"
              />
              Avg {Math.round(average * 10) / 10}
            </span>
          )}
          {referenceLineValue !== undefined && (
            <span className="pb:inline-flex pb:items-center pb:gap-1 pb:rounded-full pb:bg-pink-50 pb:px-2 pb:py-0.5 pb:font-medium pb:tabular-nums pb:text-pink-700">
              <span
                className="pb:h-1.5 pb:w-1.5 pb:rounded-full pb:bg-[#e86e8a]"
                aria-hidden="true"
              />
              {referenceLineLabel} {referenceLineValue}
            </span>
          )}
          <span className="pb:tabular-nums pb:text-slate-500">
            {totalCount} total
          </span>
        </div>
      </div>

      {/* Plot container: label column + gridded bar track column + count column */}
      <div className="pb:relative">
        <div className="pb:space-y-1">
          {data.map((datum, idx) => {
            const pct = Math.min(100, Math.max(0, (datum.count / axisMax) * 100));
            const isWhiteFill = datum.fill === "White";
            const barFill = datum.fill
              ? isWhiteFill
                ? "#e2e8f0"
                : datum.fill
              : "#46d9d9";
            const barBorder = datum.stroke
              ? `1px solid ${datum.stroke}`
              : isWhiteFill
                ? "1px solid #cbd5e1"
                : undefined;
            const isHovered = hoveredIndex === idx;
            const tooltipLines = formatTooltipLines(datum);

            return (
              <div
                key={`${datum.label}-${idx}`}
                className="pb:group pb:relative pb:flex pb:items-center pb:gap-2.5 pb:py-1"
                role={datum.count > 0 ? "group" : undefined}
                tabIndex={datum.count > 0 ? 0 : undefined}
                aria-label={
                  datum.count > 0 ? `${datum.label}: ${datum.count}` : undefined
                }
                onMouseEnter={() => datum.count > 0 && setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                onFocus={() => datum.count > 0 && setHoveredIndex(idx)}
                onBlur={() => setHoveredIndex(null)}
              >
                <span className="pb:w-20 pb:shrink-0 pb:truncate pb:text-right pb:text-xs pb:font-medium pb:text-slate-600 pb:transition-colors pb:group-hover:text-slate-900">
                  {datum.label}
                </span>

                <div className="pb:relative pb:flex-1 pb:h-5 pb:rounded-full pb:bg-slate-100/80">
                  {/* Subtle vertical X-axis gridlines */}
                  {ticks.map((tick) => {
                    const leftPct = (tick / axisMax) * 100;
                    if (leftPct <= 0 || leftPct >= 100) return null;
                    return (
                      <span
                        key={tick}
                        aria-hidden="true"
                        className="pb:pointer-events-none pb:absolute pb:-top-1 pb:-bottom-1 pb:border-l pb:border-dashed pb:border-slate-200/90"
                        style={{ left: `${leftPct}%` }}
                      />
                    );
                  })}

                  {/* Reference vertical lines */}
                  {averagePct !== undefined && (
                    <span
                      aria-hidden="true"
                      className="pb:pointer-events-none pb:absolute pb:-top-1 pb:-bottom-1 pb:z-10 pb:border-l pb:border-dashed pb:border-slate-400/80"
                      style={{ left: `${averagePct}%` }}
                    />
                  )}
                  {referencePct !== undefined && (
                    <span
                      aria-hidden="true"
                      className="pb:pointer-events-none pb:absolute pb:-top-1 pb:-bottom-1 pb:z-10 pb:border-l pb:border-dashed pb:border-[#e86e8a]/85"
                      style={{ left: `${referencePct}%` }}
                    />
                  )}

                  {/* Pill bar fill */}
                  <div className="pb:relative pb:z-[1] pb:h-full pb:w-full pb:overflow-hidden pb:rounded-full">
                    {datum.count > 0 && (
                      <div
                        className="pb:h-full pb:rounded-r-full pb:transition-all pb:duration-200 pb:group-hover:brightness-95"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: barFill,
                          border: barBorder,
                        }}
                      />
                    )}
                  </div>

                  {/* Floating tooltip */}
                  {isHovered && datum.count > 0 && (
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

                <span className="pb:w-7 pb:shrink-0 pb:text-right pb:text-xs pb:font-semibold pb:tabular-nums pb:text-slate-700">
                  {datum.count}
                </span>
              </div>
            );
          })}
        </div>

        {/* Subtle X-axis scale ticks aligned with bar track */}
        <div className="pb:mt-2 pb:flex pb:items-center pb:gap-2.5">
          <span className="pb:w-20 pb:shrink-0" aria-hidden="true" />
          <div className="pb:relative pb:h-4 pb:flex-1 pb:border-t pb:border-slate-200/80">
            {ticks.map((tick, idx) => {
              const leftPct = (tick / axisMax) * 100;
              const alignClass =
                idx === 0
                  ? "pb:translate-x-0"
                  : idx === ticks.length - 1
                    ? "pb:-translate-x-full"
                    : "pb:-translate-x-1/2";
              return (
                <span
                  key={tick}
                  className={`pb:absolute pb:top-1 pb:text-[10.5px] pb:tabular-nums pb:text-slate-400 ${alignClass}`}
                  style={{ left: `${leftPct}%` }}
                >
                  {tick}
                </span>
              );
            })}
          </div>
          <span className="pb:w-7 pb:shrink-0" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
