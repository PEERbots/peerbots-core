import type React from "react";
import type { ControlLabels } from "../i18n";
import type {
  PeerbotsEmotion,
  RobotControlButton,
  Template,
} from "../templates/types";
import type { PeerbotsButtonActionHandler } from "../ui/patterns/control-views/types";

/**
 * Automatic Dagre graph layout axis for `<FlowView>`:
 * - `"TB"`: Top-to-Bottom hierarchy
 * - `"LR"`: Left-to-Right hierarchy
 */
export type FlowDirection = "TB" | "LR";

/**
 * Custom `@xyflow/react` node payload representing a single `RobotControlButton` in `<FlowView>`.
 */
export interface PeerbotsFlowNodeData extends Record<string, unknown> {
  /** Resolved Peerbots button model (`"Message"` or `"Log"`). */
  button: RobotControlButton;
  /** Key of this button in `template.buttons`. */
  buttonId: string;
  /** Active Dagre layout direction controlling handle positions. */
  direction?: FlowDirection;
}

export interface FlowViewProps {
  /** Canonical template containing `buttons` dictionary and `hierarchy` */
  template: Template;
  /** Controlled active button ID highlighted in the graph */
  selectedButtonId?: string | null;
  /** Action handler invoked when clicking/selecting a node */
  onButtonAction: PeerbotsButtonActionHandler;
  /** Optional callback fired when connecting two nodes (`source -> target`) */
  onAddConnection?: (sourceButtonId: string, targetButtonId: string) => void;
  /** Optional callback fired when deleting a connection edge */
  onRemoveConnection?: (sourceButtonId: string, targetButtonId: string) => void;
  /** Disables node clicks and edge edits */
  disabled?: boolean;
  /** Controlled layout direction (`"TB"` top-to-bottom or `"LR"` left-to-right) */
  direction?: FlowDirection;
  /** Initial layout direction when uncontrolled (@default "TB") */
  defaultDirection?: FlowDirection;
  /** Callback invoked when layout direction changes */
  onDirectionChange?: (direction: FlowDirection) => void;
  /** Optional custom emotion icon overrides */
  emotionIcons?: Partial<Record<PeerbotsEmotion, string | React.ReactNode>>;
  /** Optional localized emotion names */
  emotionLabels?: Partial<Record<PeerbotsEmotion, string>>;
  /** Optional localized UI labels */
  labels?: Partial<ControlLabels>;
  className?: string;
}
