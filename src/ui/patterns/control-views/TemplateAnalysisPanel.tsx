import { useMemo, useState } from "react";
import { DistributionBarChart } from "../../../charts/DistributionBarChart";
import { DistributionHistogram } from "../../../charts/DistributionHistogram";
import {
  DEFAULT_COMMON_LABELS,
  DEFAULT_CONTROL_LABELS,
  usePeerbotsI18n,
  type ControlLabels,
} from "../../../i18n";
import {
  PEERBOTS_COLORS,
  PEERBOTS_EMOTIONS,
  type PeerbotsColor,
  type PeerbotsEmotion,
  type Template,
} from "../../../templates/types";
import { Button } from "../../forms/Button";
import { Field } from "../../forms/Field";
import { PEERBOTS_COLOR_MAP } from "../../forms/PeerbotsColorSelector";
import { Slider } from "../../forms/Slider";
import { Text } from "../../foundations/Typography";
import { BasePanel } from "../../layout/BasePanel";

export interface TemplateAnalysisPanelProps {
  /** Template to analyze (renders an empty state when `null` or `undefined`). */
  template: Template | null | undefined;
  /** Optional callback to close the panel. */
  onClose?: () => void;
  /** Initial character-length threshold for highlighting "too long" titles/speech (@default 60). */
  defaultThreshold?: number;
  /** Width passed to Victory distribution charts (@default 600). */
  chartWidth?: number;
  /** Height passed to Victory distribution charts (@default 400). */
  chartHeight?: number;
  /** Optional localized control label overrides. */
  labels?: Partial<ControlLabels>;
  /** Additional classes for the outer panel container. */
  className?: string;
}

interface DistributionBucket {
  count: number;
  items: string[];
}

interface LengthDistributionStats {
  min: number;
  max: number;
  sum: number;
  tooLong: number;
  raw: Array<{ x: number; text: string }>;
  average: number;
}

function interpolateTemplate(
  template: string,
  values: Record<string, string | number>,
): string {
  return Object.entries(values).reduce(
    (acc, [key, val]) => acc.replace(`{${key}}`, String(val)),
    template,
  );
}

/**
 * Pure, store-agnostic template analytics panel displaying button type counts,
 * title/speech character-length distributions against an adjustable threshold,
 * and emotion/color distribution charts.
 */
export function TemplateAnalysisPanel({
  template,
  onClose,
  defaultThreshold = 60,
  chartWidth = 600,
  chartHeight = 400,
  labels,
  className,
}: TemplateAnalysisPanelProps) {
  const { labels: contextLabels } = usePeerbotsI18n();
  const resolvedLabels: ControlLabels = {
    ...DEFAULT_CONTROL_LABELS,
    ...contextLabels?.control,
    ...labels,
  };
  const closeLabel = contextLabels?.common?.close ?? DEFAULT_COMMON_LABELS.close;

  const [tooLongLimit, setTooLongLimit] = useState<number>(defaultThreshold);

  const analytics = useMemo(() => {
    const emotionDistribution = Object.fromEntries(
      PEERBOTS_EMOTIONS.map((e) => [e, { count: 0, items: [] as string[] }]),
    ) as Record<PeerbotsEmotion, DistributionBucket>;

    const colorDistribution = Object.fromEntries(
      PEERBOTS_COLORS.map((c) => [c, { count: 0, items: [] as string[] }]),
    ) as Record<PeerbotsColor, DistributionBucket>;

    const typeDistribution: Record<"Message" | "Log", number> = {
      Message: 0,
      Log: 0,
    };

    const titleRaw: Array<{ x: number; text: string }> = [];
    const speechRaw: Array<{ x: number; text: string }> = [];
    let titleSum = 0;
    let titleMin = Number.POSITIVE_INFINITY;
    let titleMax = 0;
    let titleTooLong = 0;

    let speechSum = 0;
    let speechMin = Number.POSITIVE_INFINITY;
    let speechMax = 0;
    let speechTooLong = 0;

    if (template?.buttons) {
      for (const btn of Object.values(template.buttons)) {
        if (btn.type === "Message") {
          typeDistribution.Message += 1;
          const emotionBucket = emotionDistribution[btn.details.emotion];
          if (emotionBucket) {
            emotionBucket.count += 1;
            emotionBucket.items.push(btn.details.title);
          }
          const colorBucket = colorDistribution[btn.details.color];
          if (colorBucket) {
            colorBucket.count += 1;
            colorBucket.items.push(btn.details.title);
          }

          const tLen = btn.details.title.length;
          titleSum += tLen;
          if (tLen > tooLongLimit) titleTooLong += 1;
          if (tLen > titleMax) titleMax = tLen;
          if (tLen < titleMin) titleMin = tLen;
          titleRaw.push({ x: tLen, text: btn.details.title });

          const sLen = btn.details.speech.length;
          speechSum += sLen;
          if (sLen > tooLongLimit) speechTooLong += 1;
          if (sLen > speechMax) speechMax = sLen;
          if (sLen < speechMin) speechMin = sLen;
          speechRaw.push({ x: sLen, text: btn.details.speech });
        } else if (btn.type === "Log") {
          typeDistribution.Log += 1;
        }
      }
    }

    const messageCount = typeDistribution.Message;
    const titleDistribution: LengthDistributionStats = {
      min: Number.isFinite(titleMin) ? titleMin : 0,
      max: titleMax,
      sum: titleSum,
      tooLong: titleTooLong,
      raw: titleRaw,
      average: messageCount > 0 ? Math.round(titleSum / messageCount) : 0,
    };

    const speechDistribution: LengthDistributionStats = {
      min: Number.isFinite(speechMin) ? speechMin : 0,
      max: speechMax,
      sum: speechSum,
      tooLong: speechTooLong,
      raw: speechRaw,
      average: messageCount > 0 ? Math.round(speechSum / messageCount) : 0,
    };

    return {
      emotionDistribution,
      colorDistribution,
      typeDistribution,
      titleDistribution,
      speechDistribution,
    };
  }, [template, tooLongLimit]);

  if (!template) {
    return (
      <div className="pb:p-4 pb:text-center">
        <Text>{resolvedLabels.noTemplateSelected ?? "No template selected."}</Text>
        {onClose && (
          <Button
            type="button"
            variant="secondary"
            className="pb:mt-4"
            onClick={onClose}
          >
            {closeLabel}
          </Button>
        )}
      </div>
    );
  }

  const totalButtons = template.buttons
    ? Object.keys(template.buttons).length
    : 0;

  const emotionData = PEERBOTS_EMOTIONS.map((emotion) => ({
    label: emotion,
    count: analytics.emotionDistribution[emotion].count,
    items: analytics.emotionDistribution[emotion].items,
  })).sort((a, b) => a.count - b.count);

  const colorData = PEERBOTS_COLORS.map((color) => ({
    label: color,
    count: analytics.colorDistribution[color].count,
    items: analytics.colorDistribution[color].items,
    fill: PEERBOTS_COLOR_MAP[color] ?? "#000000",
  })).sort((a, b) => a.count - b.count);

  return (
    <BasePanel
      title={resolvedLabels.analyzeTemplate ?? "Analyze Template"}
      onClose={onClose}
      className={className}
    >
      <div className="pb:mx-1 pb:my-0.5">
        <div className="pb:border-b pb:border-gray-300 pb:mb-1 pb:p-0.5">
          <Text variant="small" className="pb:font-bold">
            {resolvedLabels.titleAndSpeech ?? "Title & Speech"}
          </Text>
        </div>

        <div className="pb:p-1 pb:text-sm pb:border-b pb:border-gray-100 pb:pb-2 pb:mb-2">
          <div>
            {interpolateTemplate(
              resolvedLabels.buttonCount ?? "{count} buttons",
              { count: totalButtons },
            )}
          </div>
          <div className="pb:flex pb:gap-4 pb:mt-1">
            <span className="pb:font-semibold">
              {interpolateTemplate(
                resolvedLabels.messagesDistribution ?? "{count} Messages",
                { count: analytics.typeDistribution.Message },
              )}
            </span>
            <span className="pb:font-semibold">
              {interpolateTemplate(
                resolvedLabels.logsDistribution ?? "{count} Logs",
                { count: analytics.typeDistribution.Log },
              )}
            </span>
          </div>
        </div>

        <div className="pb:p-1 pb:border-b pb:border-gray-100 pb:pb-2 pb:mb-2">
          <Field
            label={resolvedLabels.tooLongThreshold ?? "Too long threshold (chars)"}
            labelPlacement="top"
          >
            <div className="pb:flex pb:items-center pb:gap-2">
              <Slider
                className="pb:flex-grow pb:min-w-[150px]"
                min={10}
                max={200}
                value={tooLongLimit}
                aria-label={
                  resolvedLabels.tooLongThreshold ?? "Too long threshold (chars)"
                }
                onChange={(val) => {
                  setTooLongLimit(Array.isArray(val) ? val[0] : val);
                }}
              />
              <span className="pb:text-sm pb:font-bold pb:w-12 pb:text-right">
                {tooLongLimit}
              </span>
            </div>
          </Field>
        </div>

        <div className="pb:grid pb:grid-cols-2 pb:gap-2 pb:p-1">
          <div className="pb:border pb:border-gray-100 pb:rounded pb:p-2 pb:bg-white pb:shadow-sm">
            <Text variant="small" className="pb:uppercase pb:font-bold">
              {resolvedLabels.titleLength ?? "Title Length"}
            </Text>
            <div className="pb:text-sm pb:font-bold pb:mt-1">
              {interpolateTemplate(resolvedLabels.average ?? "Avg: {val}", {
                val: analytics.titleDistribution.average,
              })}
            </div>
            <div className="pb:text-[10px] pb:text-red-600 pb:font-bold pb:mt-1">
              {interpolateTemplate(resolvedLabels.tooLong ?? "{val} too long", {
                val: analytics.titleDistribution.tooLong,
              })}
            </div>
          </div>
          <div className="pb:border pb:border-gray-100 pb:rounded pb:p-2 pb:bg-white pb:shadow-sm">
            <Text variant="small" className="pb:uppercase pb:font-bold">
              {resolvedLabels.speechLength ?? "Speech Length"}
            </Text>
            <div className="pb:text-sm pb:font-bold pb:mt-1">
              {interpolateTemplate(resolvedLabels.average ?? "Avg: {val}", {
                val: analytics.speechDistribution.average,
              })}
            </div>
            <div className="pb:text-[10px] pb:text-red-600 pb:font-bold pb:mt-1">
              {interpolateTemplate(resolvedLabels.tooLong ?? "{val} too long", {
                val: analytics.speechDistribution.tooLong,
              })}
            </div>
          </div>
        </div>

        <div className="pb:mt-2 pb:p-1">
          <DistributionHistogram
            data={analytics.titleDistribution.raw}
            alt={`Histogram showing title length distribution. Average: ${analytics.titleDistribution.average}, Threshold: ${tooLongLimit}.`}
            aria-label={`Histogram showing title length distribution. Average: ${analytics.titleDistribution.average}, Threshold: ${tooLongLimit}.`}
            label={resolvedLabels.titleLength ?? "Title Length"}
            average={analytics.titleDistribution.average}
            referenceLineValue={tooLongLimit}
            referenceLineLabel={resolvedLabels.tooLongLabel ?? "Too Long"}
            chartWidth={chartWidth}
            chartHeight={chartHeight}
          />
          <DistributionHistogram
            data={analytics.speechDistribution.raw}
            alt={`Histogram showing speech length distribution. Average: ${analytics.speechDistribution.average}, Threshold: ${tooLongLimit}.`}
            aria-label={`Histogram showing speech length distribution. Average: ${analytics.speechDistribution.average}, Threshold: ${tooLongLimit}.`}
            label={resolvedLabels.speechLength ?? "Speech Length"}
            average={analytics.speechDistribution.average}
            referenceLineValue={tooLongLimit}
            referenceLineLabel={resolvedLabels.tooLongLabel ?? "Too Long"}
            chartWidth={chartWidth}
            chartHeight={chartHeight}
          />
        </div>
      </div>

      <div className="pb:mx-1 pb:my-1.5 pb:p-1">
        <DistributionBarChart
          label={resolvedLabels.emotion}
          alt="Bar chart showing the distribution of emotions in the template buttons."
          aria-label="Bar chart showing the distribution of emotions in the template buttons."
          data={emotionData}
          chartWidth={chartWidth}
          chartHeight={chartHeight}
        />
      </div>

      <div className="pb:mx-1 pb:my-1.5 pb:p-1">
        <DistributionBarChart
          label={resolvedLabels.labelColor}
          alt="Bar chart showing the distribution of colors in the template buttons."
          aria-label="Bar chart showing the distribution of colors in the template buttons."
          data={colorData}
          chartWidth={chartWidth}
          chartHeight={chartHeight}
        />
      </div>
    </BasePanel>
  );
}
