// src/index.ts
import "./styles/index.css"; // Ensure CSS is bundled

export * from "./ui";
export * from "./helpers";
export {
  LineGraph,
  type LineGraphProps,
  type LineGraphPoint,
} from "./charts/LineGraph";
export type {
  DistributionBarChartProps,
  DistributionBarData,
} from "./charts/DistributionBarChart";
export type {
  DistributionHistogramProps,
  DistributionHistogramData,
} from "./charts/DistributionHistogram";
export * from "./i18n";
export * from "./templates";
export { applyControlActionToTemplate } from "./ui/patterns/control-views/applyControlAction";
export type {
  PeerbotsControlAction,
  RobotControlButtonAction,
} from "./ui/patterns/control-views/types";
export type { FlowDirection, FlowViewProps } from "./flow/types";

export type { PeerbotsColor } from "./templates";
