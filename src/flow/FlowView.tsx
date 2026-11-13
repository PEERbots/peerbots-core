import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Background,
  ConnectionLineType,
  Controls,
  Handle,
  MarkerType,
  Panel,
  Position,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  DEFAULT_CONTROL_LABELS,
  usePeerbotsI18n,
  type ControlLabels,
} from "../i18n";
import type { PeerbotsEmotion, Template } from "../templates/types";
import { TabRadio } from "../ui/forms/TabRadio";
import { PeerbotsButton } from "../ui/patterns/PeerbotsButton";
import { cn } from "../ui/utils";
import { templateToFlowElements } from "./flowHelpers";
import type {
  FlowDirection,
  FlowViewProps,
  PeerbotsFlowNodeData,
} from "./types";

export type { FlowViewProps };

interface FlowNodeContextValue {
  selectedButtonId: string | null;
  disabled: boolean;
  emotionIcons?: Partial<Record<PeerbotsEmotion, string | React.ReactNode>>;
  emotionLabels?: Partial<Record<PeerbotsEmotion, string>>;
}

const FlowNodeContext = createContext<FlowNodeContextValue>({
  selectedButtonId: null,
  disabled: false,
});

function PeerbotsButtonNode({
  data,
}: NodeProps<Node<PeerbotsFlowNodeData, "peerbotsButton">>) {
  const { button, buttonId, direction = "TB" } = data;
  const { selectedButtonId, disabled, emotionIcons, emotionLabels } =
    useContext(FlowNodeContext);

  const sourcePos = direction === "TB" ? Position.Bottom : Position.Right;
  const targetPos = direction === "TB" ? Position.Top : Position.Left;

  return (
    <div className="pb:relative">
      <Handle type="target" position={targetPos} />
      <PeerbotsButton
        button={button}
        selected={buttonId === selectedButtonId}
        disabled={disabled}
        emotionIcons={emotionIcons}
        emotionLabels={emotionLabels}
        onClick={() => {
          /* Handled via FlowView's onNodeClick */
        }}
      />
      <Handle type="source" position={sourcePos} />
    </div>
  );
}

const nodeTypes = { peerbotsButton: PeerbotsButtonNode };

/**
 * Interactive node-graph editor and viewer for Peerbots templates powered by
 * `@xyflow/react` and `@dagrejs/dagre`, decoupled from application state stores.
 */
export function FlowView({
  template,
  selectedButtonId = null,
  onButtonAction,
  onAddConnection,
  onRemoveConnection,
  disabled = false,
  direction: controlledDirection,
  defaultDirection = "TB",
  onDirectionChange,
  emotionIcons,
  emotionLabels,
  labels,
  className,
}: FlowViewProps) {
  const { labels: contextLabels } = usePeerbotsI18n();
  const [uncontrolledDirection, setUncontrolledDirection] =
    useState<FlowDirection>(defaultDirection);

  const isDirectionControlled = controlledDirection !== undefined;
  const activeDirection = isDirectionControlled
    ? controlledDirection
    : uncontrolledDirection;

  const handleDirectionChange = useCallback(
    (nextDirection: FlowDirection | undefined) => {
      if (!nextDirection) return;
      if (!isDirectionControlled) {
        setUncontrolledDirection(nextDirection);
      }
      onDirectionChange?.(nextDirection);
    },
    [isDirectionControlled, onDirectionChange],
  );

  const resolvedLabels: ControlLabels = {
    ...DEFAULT_CONTROL_LABELS,
    ...contextLabels?.control,
    ...labels,
  };

  const computedElements = useMemo(() => {
    const elements = templateToFlowElements(template, activeDirection);
    return {
      nodes: elements.nodes.map((node) => ({
        ...node,
        data: { ...node.data, direction: activeDirection },
      })),
      edges: elements.edges,
    };
  }, [template, activeDirection]);

  const [nodes, setNodes, onNodesChange] = useNodesState(
    computedElements.nodes,
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    computedElements.edges,
  );

  useEffect(() => {
    setNodes(computedElements.nodes);
    setEdges(computedElements.edges);
  }, [computedElements, setNodes, setEdges]);

  const onConnect = useCallback(
    (connection: Connection) => {
      if (disabled || !connection.source || !connection.target) return;
      onAddConnection?.(connection.source, connection.target);
    },
    [disabled, onAddConnection],
  );

  const onEdgesDelete = useCallback(
    (deletedEdges: Edge[]) => {
      if (disabled) return;
      for (const edge of deletedEdges) {
        onRemoveConnection?.(edge.source, edge.target);
      }
    },
    [disabled, onRemoveConnection],
  );

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      if (disabled) return;
      const { button, buttonId } = node.data as PeerbotsFlowNodeData;
      onButtonAction(button, buttonId, { type: "SELECT" });
      onButtonAction(button, buttonId, { type: "CLICK" });
    },
    [disabled, onButtonAction],
  );

  const nodeContextValue = useMemo<FlowNodeContextValue>(
    () => ({
      selectedButtonId,
      disabled,
      emotionIcons,
      emotionLabels,
    }),
    [selectedButtonId, disabled, emotionIcons, emotionLabels],
  );

  return (
    <FlowNodeContext.Provider value={nodeContextValue}>
      <div className={cn("pb:w-full pb:h-full pb:min-h-[400px]", className)}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgesDelete={onEdgesDelete}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          nodesDraggable={!disabled}
          nodesConnectable={!disabled}
          elementsSelectable={!disabled}
          defaultEdgeOptions={{
            type: "straight",
            markerEnd: { type: MarkerType.ArrowClosed },
          }}
          connectionLineType={ConnectionLineType.Straight}
          fitView
          proOptions={{ hideAttribution: true }}
        >
          <Background />
          <Controls />
          <Panel position="top-right">
            <div className="pb:bg-white pb:rounded-md pb:shadow-sm pb:p-1.5 pb:border pb:border-gray-200">
              <span className="pb:text-xs pb:font-medium pb:text-gray-700 pb:block pb:text-center pb:mb-1">
                {resolvedLabels.flowLayout}
              </span>
              <TabRadio<FlowDirection>
                aria-label={resolvedLabels.flowLayout}
                options={[
                  { value: "TB", label: resolvedLabels.topBottom },
                  { value: "LR", label: resolvedLabels.leftRight },
                ]}
                value={activeDirection}
                onChange={handleDirectionChange}
              />
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </FlowNodeContext.Provider>
  );
}

export const PeerbotsFlowView = FlowView;
