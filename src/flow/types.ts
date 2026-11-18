import type React from "react";
import type { ControlLabels } from "../i18n";
import type {
  PeerbotsColor,
  PeerbotsEmotion,
  RobotControlButton,
  Template,
  TemplateHierarchy,
} from "../templates/types";
import type { IconName } from "../ui/foundations/Icon";
import type { TableViewBatchSaveEntry } from "../ui/patterns/control-views/TableView";
import type { PeerbotsButtonActionHandler } from "../ui/patterns/control-views/types";

/**
 * Automatic Dagre graph layout axis for `<FlowView>`:
 * - `"TB"`: Top-to-Bottom hierarchy
 * - `"LR"`: Left-to-Right hierarchy
 */
export type FlowDirection = "TB" | "LR";

/**
 * Unmodified left-drag canvas preference for `<FlowView>`:
 * - `"select"`: Left-drag draws a marquee selection box (`Space` + drag or two-finger scroll pans).
 * - `"pan"`: Left-drag pans the viewport (`Shift` + drag or `Shift` + click multi-selects).
 */
export type FlowDragBehavior = "select" | "pan";

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
  /** Whether this button is currently listed in `template.hierarchy.root`. */
  isRoot?: boolean;
  /** Whether this button is unreachable from `hierarchy.root` (placed in the Unlinked staging zone). */
  isUnlinked?: boolean;
}

export interface FlowViewProps {
  /** Canonical template containing `buttons` dictionary and `hierarchy` */
  template: Template;
  /** Controlled active button ID highlighted in the graph */
  selectedButtonId?: string | null;
  /** Action handler invoked when clicking/selecting/editing/deleting a node */
  onButtonAction: PeerbotsButtonActionHandler;
  /** Optional full-template update callback enabling in-graph creation, duplication, batch edits, and sibling reordering */
  onTemplateChange?: (nextTemplate: Template) => void;
  /** Optional hierarchy-only update callback invoked on edge wiring, root toggles, and sibling drag-reordering */
  onHierarchyChange?: (nextHierarchy: TemplateHierarchy) => void;
  /** Optional callback fired when connecting two nodes (`source -> target`) */
  onAddConnection?: (sourceButtonId: string, targetButtonId: string) => void;
  /** Optional callback fired when deleting a connection edge */
  onRemoveConnection?: (sourceButtonId: string, targetButtonId: string) => void;
  /** Optional batch save callback for multi-selected edits */
  onBatchSave?: (entries: TableViewBatchSaveEntry[]) => void;
  /** Disables node clicks, dragging, edge edits, and edit popovers */
  disabled?: boolean;
  /** Controlled layout direction (`"TB"` top-to-bottom or `"LR"` left-to-right) */
  direction?: FlowDirection;
  /** Initial layout direction when uncontrolled (@default "TB") */
  defaultDirection?: FlowDirection;
  /** Callback invoked when layout direction changes */
  onDirectionChange?: (direction: FlowDirection) => void;
  /** Initial unmodified left-drag behavior (`"select"` marquee box or `"pan"` viewport) (@default "select") */
  defaultDragBehavior?: FlowDragBehavior;
  /** Shows the ReactFlow `<MiniMap>` in the bottom-right corner (@default false) */
  showMiniMap?: boolean;
  /** Optional icon name for `"Log"` buttons (@default "zap") */
  logIcon?: IconName;
  /** Optional custom emotion icon overrides */
  emotionIcons?: Partial<Record<PeerbotsEmotion, string | React.ReactNode>>;
  /** Optional localized emotion names */
  emotionLabels?: Partial<Record<PeerbotsEmotion, string>>;
  /** Optional localized color names */
  colorLabels?: Partial<Record<PeerbotsColor, string>>;
  /** Optional localized UI labels */
  labels?: Partial<ControlLabels>;
  className?: string;
}
