import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Background,
  ConnectionLineType,
  Controls,
  Handle,
  MarkerType,
  MiniMap,
  NodeToolbar,
  Panel,
  Position,
  ReactFlow,
  SelectionMode,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type IsValidConnection,
  type Node,
  type NodeProps,
  type OnSelectionChangeParams,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  DEFAULT_CONTROL_LABELS,
  usePeerbotsI18n,
  type ControlLabels,
} from "../i18n";
import type {
  PeerbotsColor,
  PeerbotsEmotion,
  RobotControlButton,
  Template,
  TemplateHierarchy,
} from "../templates/types";
import { Button } from "../ui/forms/Button";
import { PEERBOTS_COLOR_MAP } from "../ui/forms/PeerbotsColorSelector";
import { TabRadio } from "../ui/forms/TabRadio";
import type { IconName } from "../ui/foundations/Icon";
import { PeerbotsButton } from "../ui/patterns/PeerbotsButton";
import {
  BatchButtonEditPanel,
  SingleButtonEditPanel,
} from "../ui/patterns/control-views/ButtonEditPopoverContent";
import { applyControlActionToTemplate } from "../ui/patterns/control-views/applyControlAction";
import { createSaveAction } from "../ui/patterns/control-views/types";
import { cn } from "../ui/utils";
import {
  addHierarchyConnection,
  computeNextButtonPosition,
  createDefaultButton,
  generateUniqueButtonId,
  removeHierarchyConnection,
  reorderHierarchySiblingsFromPositions,
  templateToFlowElements,
  toggleRootButtonInHierarchy,
} from "./flowHelpers";
import type {
  FlowDirection,
  FlowDragBehavior,
  FlowViewProps,
  PeerbotsFlowNodeData,
} from "./types";

export type { FlowViewProps };

interface FlowNodeContextValue {
  selectedButtonId: string | null;
  selectedNodeIds: ReadonlyArray<string>;
  editingNodeId: string | null;
  disabled: boolean;
  logIcon: IconName;
  emotionIcons?: Partial<Record<PeerbotsEmotion, string | React.ReactNode>>;
  emotionLabels?: Partial<Record<PeerbotsEmotion, string>>;
  colorLabels?: Partial<Record<PeerbotsColor, string>>;
  onOpenEdit: (buttonId: string) => void;
  onCloseEdit: () => void;
  onSaveNode: (buttonId: string, nextButton: RobotControlButton) => void;
  onToggleRoot: (buttonId: string) => void;
  onAddChild: (parentId: string, type: "Message" | "Log") => void;
  onDuplicateNode: (buttonId: string) => void;
  onDeleteNode: (buttonId: string) => void;
}

const FlowNodeContext = createContext<FlowNodeContextValue>({
  selectedButtonId: null,
  selectedNodeIds: [],
  editingNodeId: null,
  disabled: false,
  logIcon: "zap",
  onOpenEdit: () => undefined,
  onCloseEdit: () => undefined,
  onSaveNode: () => undefined,
  onToggleRoot: () => undefined,
  onAddChild: () => undefined,
  onDuplicateNode: () => undefined,
  onDeleteNode: () => undefined,
});

function PeerbotsButtonNode({
  data,
  selected,
}: NodeProps<Node<PeerbotsFlowNodeData, "peerbotsButton">>) {
  const { button, buttonId, direction = "TB", isRoot, isUnlinked } = data;
  const {
    selectedButtonId,
    selectedNodeIds,
    editingNodeId,
    disabled,
    logIcon,
    emotionIcons,
    emotionLabels,
    colorLabels,
    onOpenEdit,
    onCloseEdit,
    onSaveNode,
    onToggleRoot,
    onAddChild,
    onDuplicateNode,
    onDeleteNode,
  } = useContext(FlowNodeContext);

  const sourcePos = direction === "TB" ? Position.Bottom : Position.Right;
  const targetPos = direction === "TB" ? Position.Top : Position.Left;
  const isSelected = Boolean(selected) || buttonId === selectedButtonId;
  const isSingleSelected =
    !disabled &&
    isSelected &&
    selectedNodeIds.length <= 1 &&
    editingNodeId !== buttonId;
  const isEditing = !disabled && editingNodeId === buttonId;

  return (
    <div className="pb:relative">
      <NodeToolbar
        isVisible={isSingleSelected}
        position={Position.Top}
        offset={10}
      >
        <div
          className="nodrag nopan pb:inline-flex pb:items-center pb:gap-1 pb:rounded-lg pb:bg-white pb:border pb:border-gray-200 pb:shadow-md pb:px-1.5 pb:py-1"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => onOpenEdit(buttonId)}
            className="pb:px-2 pb:py-0.5 pb:text-[11px] pb:font-semibold pb:rounded pb:bg-gray-900 pb:text-white hover:pb:bg-gray-800 pb:cursor-pointer"
          >
            ✎ Edit
          </button>
          <button
            type="button"
            onClick={() => onAddChild(buttonId, "Message")}
            className="pb:px-1.5 pb:py-0.5 pb:text-[11px] pb:font-semibold pb:rounded pb:bg-gray-100 pb:text-gray-800 hover:pb:bg-gray-200 pb:cursor-pointer"
          >
            + Msg
          </button>
          <button
            type="button"
            onClick={() => onAddChild(buttonId, "Log")}
            className="pb:px-1.5 pb:py-0.5 pb:text-[11px] pb:font-semibold pb:rounded pb:bg-gray-100 pb:text-gray-800 hover:pb:bg-gray-200 pb:cursor-pointer"
          >
            + Log
          </button>
          <button
            type="button"
            onClick={() => onDeleteNode(buttonId)}
            aria-label={`Delete ${button.details.title}`}
            className="pb:px-1.5 pb:py-0.5 pb:text-[11px] pb:font-semibold pb:rounded pb:text-red-700 hover:pb:bg-red-50 pb:cursor-pointer"
          >
            Delete
          </button>
        </div>
      </NodeToolbar>

      <NodeToolbar isVisible={isEditing} position={Position.Bottom} offset={12}>
        <div
          className="nodrag nopan pb:rounded-xl pb:bg-white pb:border pb:border-gray-200 pb:shadow-xl pb:p-3"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.stopPropagation();
              onCloseEdit();
            }
          }}
        >
          <SingleButtonEditPanel
            button={button}
            isRoot={isRoot}
            emotionIcons={emotionIcons}
            emotionLabels={emotionLabels}
            colorLabels={colorLabels}
            onSave={(nextButton) => onSaveNode(buttonId, nextButton)}
            onToggleRoot={() => onToggleRoot(buttonId)}
            onAddChild={(type) => onAddChild(buttonId, type)}
            onDuplicate={() => onDuplicateNode(buttonId)}
            onDelete={() => onDeleteNode(buttonId)}
            onClose={onCloseEdit}
          />
        </div>
      </NodeToolbar>

      {isUnlinked && (
        <span className="pb:pointer-events-none pb:absolute pb:-bottom-2.5 pb:start-1/2 pb:-translate-x-1/2 pb:z-20 pb:rounded-full pb:bg-amber-100 pb:border pb:border-amber-300 pb:px-2 pb:py-0 pb:text-[9px] pb:font-bold pb:uppercase pb:tracking-wider pb:text-amber-800">
          Unlinked
        </span>
      )}

      <Handle type="target" position={targetPos} />
      <PeerbotsButton
        button={button}
        selected={isSelected}
        disabled={disabled}
        logIcon={logIcon}
        emotionIcons={emotionIcons}
        emotionLabels={emotionLabels}
        onClick={() => {
          /* Handled via FlowView's onNodeClick */
        }}
        onDoubleClick={(e) => {
          if (disabled) return;
          e.stopPropagation();
          onOpenEdit(buttonId);
        }}
      />
      <Handle type="source" position={sourcePos} />
    </div>
  );
}

const nodeTypes = { peerbotsButton: PeerbotsButtonNode };

/**
 * Interactive modeless node-graph editor and viewer for Peerbots templates powered by
 * `@xyflow/react` and `@dagrejs/dagre` (imported from `@peerbots/core/flow`).
 *
 * Supports simultaneous two-finger scroll panning, pinch/Ctrl+scroll zoom, `Space`+drag panning,
 * `Shift`/marquee multi-select, batch color/emotion editing, inline single-node edit popovers,
 * sticky manual coordinates, sibling drag-reordering, and edge reconnection.
 */
export function FlowView({
  template,
  selectedButtonId = null,
  onButtonAction,
  onTemplateChange,
  onHierarchyChange,
  onAddConnection,
  onRemoveConnection,
  onBatchSave,
  disabled = false,
  direction: controlledDirection,
  defaultDirection = "TB",
  onDirectionChange,
  defaultDragBehavior = "select",
  showMiniMap = false,
  logIcon = "zap",
  emotionIcons,
  emotionLabels,
  colorLabels,
  labels,
  className,
}: FlowViewProps) {
  const { labels: contextLabels } = usePeerbotsI18n();
  const [uncontrolledDirection, setUncontrolledDirection] =
    useState<FlowDirection>(defaultDirection);
  const [dragBehavior, setDragBehavior] = useState<FlowDragBehavior>(
    disabled ? "pan" : defaultDragBehavior,
  );
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);

  // Preserve manual drag positions across template edits until Auto-Layout or direction change
  const manualPositionsRef = useRef<Map<string, { x: number; y: number }>>(
    new Map(),
  );
  const [layoutEpoch, setLayoutEpoch] = useState(0);
  const lastDirectionRef = useRef<FlowDirection | null>(null);

  const isDirectionControlled = controlledDirection !== undefined;
  const activeDirection = isDirectionControlled
    ? controlledDirection
    : uncontrolledDirection;

  const handleDirectionChange = useCallback(
    (nextDirection: FlowDirection | undefined) => {
      if (!nextDirection) return;
      manualPositionsRef.current.clear();
      setLayoutEpoch((prev) => prev + 1);
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
    return templateToFlowElements(template, activeDirection);
  }, [template, activeDirection]);

  const [nodes, setNodes, onNodesChange] = useNodesState<
    Node<PeerbotsFlowNodeData>
  >(computedElements.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    computedElements.edges,
  );

  // Sync template updates into ReactFlow while preserving dragged positions
  useEffect(() => {
    const directionChanged =
      lastDirectionRef.current !== null &&
      lastDirectionRef.current !== activeDirection;
    lastDirectionRef.current = activeDirection;

    if (directionChanged) {
      manualPositionsRef.current.clear();
    }

    const validIds = new Set(computedElements.nodes.map((n) => n.id));
    for (const key of manualPositionsRef.current.keys()) {
      if (!validIds.has(key)) {
        manualPositionsRef.current.delete(key);
      }
    }

    setNodes((prevNodes) => {
      const selectedSet = new Set(
        prevNodes.filter((n) => n.selected).map((n) => n.id),
      );
      return computedElements.nodes.map((node) => {
        const manualPos = manualPositionsRef.current.get(node.id);
        return {
          ...node,
          position: manualPos ?? node.position,
          selected: selectedSet.has(node.id),
        };
      });
    });
    setEdges(computedElements.edges);
  }, [computedElements, activeDirection, layoutEpoch, setNodes, setEdges]);

  const emitHierarchyUpdate = useCallback(
    (nextHierarchy: TemplateHierarchy) => {
      onHierarchyChange?.(nextHierarchy);
      if (onTemplateChange) {
        onTemplateChange({
          ...template,
          hierarchy: nextHierarchy,
        });
      }
    },
    [onHierarchyChange, onTemplateChange, template],
  );

  const handleAutoLayout = useCallback(() => {
    manualPositionsRef.current.clear();
    setLayoutEpoch((prev) => prev + 1);
  }, []);

  const isValidConnection: IsValidConnection = useCallback(
    (connection) => {
      if (disabled) return false;
      const source = connection.source;
      const target = connection.target;
      if (!source || !target || source === target) return false;
      const existingChildren = template.hierarchy?.[source] ?? [];
      return !existingChildren.includes(target);
    },
    [disabled, template.hierarchy],
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      if (disabled || !connection.source || !connection.target) return;
      if (connection.source === connection.target) return;
      onAddConnection?.(connection.source, connection.target);
      if (onHierarchyChange || onTemplateChange) {
        emitHierarchyUpdate(
          addHierarchyConnection(
            template.hierarchy,
            connection.source,
            connection.target,
          ),
        );
      }
    },
    [
      disabled,
      emitHierarchyUpdate,
      onAddConnection,
      onHierarchyChange,
      onTemplateChange,
      template.hierarchy,
    ],
  );

  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      if (disabled || !newConnection.source || !newConnection.target) return;
      if (newConnection.source === newConnection.target) return;
      onRemoveConnection?.(oldEdge.source, oldEdge.target);
      onAddConnection?.(newConnection.source, newConnection.target);
      if (onHierarchyChange || onTemplateChange) {
        const removed = removeHierarchyConnection(
          template.hierarchy,
          oldEdge.source,
          oldEdge.target,
        );
        emitHierarchyUpdate(
          addHierarchyConnection(
            removed,
            newConnection.source,
            newConnection.target,
          ),
        );
      }
    },
    [
      disabled,
      emitHierarchyUpdate,
      onAddConnection,
      onHierarchyChange,
      onRemoveConnection,
      onTemplateChange,
      template.hierarchy,
    ],
  );

  const onEdgesDelete = useCallback(
    (deletedEdges: Edge[]) => {
      if (disabled) return;
      let nextHierarchy = template.hierarchy;
      for (const edge of deletedEdges) {
        onRemoveConnection?.(edge.source, edge.target);
        nextHierarchy = removeHierarchyConnection(
          nextHierarchy,
          edge.source,
          edge.target,
        );
      }
      if (onHierarchyChange || onTemplateChange) {
        emitHierarchyUpdate(nextHierarchy);
      }
    },
    [
      disabled,
      emitHierarchyUpdate,
      onHierarchyChange,
      onRemoveConnection,
      onTemplateChange,
      template.hierarchy,
    ],
  );

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      if (disabled) return;
      const { button, buttonId } = node.data as PeerbotsFlowNodeData;
      if (editingNodeId && editingNodeId !== buttonId) {
        setEditingNodeId(null);
      }
      // Shift/Meta/Ctrl click is reserved for toggling multi-selection without firing CLICK
      if (event.shiftKey || event.metaKey || event.ctrlKey) {
        return;
      }
      onButtonAction(button, buttonId, { type: "SELECT" });
      onButtonAction(button, buttonId, { type: "CLICK" });
    },
    [disabled, editingNodeId, onButtonAction],
  );

  const onNodeDragStop = useCallback(
    (
      _event: React.MouseEvent,
      draggedNode: Node,
      draggedNodes: Node[],
    ) => {
      const movedList = draggedNodes.length > 0 ? draggedNodes : [draggedNode];
      for (const item of movedList) {
        manualPositionsRef.current.set(item.id, item.position);
      }

      if (disabled || (!onHierarchyChange && !onTemplateChange)) return;
      const posMap = new Map<string, { x: number; y: number }>();
      for (const n of nodes) {
        posMap.set(n.id, n.position);
      }
      for (const item of movedList) {
        posMap.set(item.id, item.position);
      }

      const reordered = reorderHierarchySiblingsFromPositions(
        template.hierarchy,
        movedList.map((n) => n.id),
        posMap,
        activeDirection,
      );
      if (reordered) {
        emitHierarchyUpdate(reordered);
      }
    },
    [
      activeDirection,
      disabled,
      emitHierarchyUpdate,
      nodes,
      onHierarchyChange,
      onTemplateChange,
      template.hierarchy,
    ],
  );

  const onSelectionChange = useCallback(
    ({ nodes: nextSelectedNodes }: OnSelectionChangeParams) => {
      const ids = nextSelectedNodes.map((n) => n.id);
      setSelectedNodeIds(ids);
      if (ids.length > 1) {
        setEditingNodeId(null);
      }
    },
    [],
  );

  const handleSaveNode = useCallback(
    (buttonId: string, nextButton: RobotControlButton) => {
      const existing = template.buttons[buttonId];
      if (!existing) return;
      const action = createSaveAction(nextButton);
      onButtonAction(existing, buttonId, action);
      if (onTemplateChange) {
        onTemplateChange(applyControlActionToTemplate(template, buttonId, action));
      }
    },
    [onButtonAction, onTemplateChange, template],
  );

  const handleToggleRoot = useCallback(
    (buttonId: string) => {
      emitHierarchyUpdate(
        toggleRootButtonInHierarchy(template.hierarchy, buttonId),
      );
    },
    [emitHierarchyUpdate, template.hierarchy],
  );

  const handleCreateNode = useCallback(
    (type: "Message" | "Log", parentId?: string | null) => {
      const newId = generateUniqueButtonId(
        template,
        type === "Log" ? "log" : "msg",
      );
      const newButton = createDefaultButton(type);
      const nextPos = computeNextButtonPosition(nodes, parentId, activeDirection);
      manualPositionsRef.current.set(newId, nextPos);

      const nextHierarchy = parentId
        ? addHierarchyConnection(template.hierarchy, parentId, newId)
        : {
            ...template.hierarchy,
            root: [...(template.hierarchy.root ?? []), newId],
          };

      if (onTemplateChange) {
        onTemplateChange({
          ...template,
          buttons: {
            ...template.buttons,
            [newId]: newButton,
          },
          hierarchy: nextHierarchy,
        });
      } else {
        onButtonAction(newButton, newId, createSaveAction(newButton));
        if (parentId) {
          onAddConnection?.(parentId, newId);
        } else {
          emitHierarchyUpdate(nextHierarchy);
        }
      }
      setEditingNodeId(newId);
    },
    [
      activeDirection,
      emitHierarchyUpdate,
      nodes,
      onAddConnection,
      onButtonAction,
      onTemplateChange,
      template,
    ],
  );

  const handleDuplicateNode = useCallback(
    (buttonId: string) => {
      const source = template.buttons[buttonId];
      if (!source) return;
      const newId = generateUniqueButtonId(template, `${buttonId}-copy`);
      const cloned: RobotControlButton =
        source.type === "Message"
          ? {
              ...source,
              details: {
                ...source.details,
                title: `${source.details.title} (Copy)`,
              },
            }
          : {
              ...source,
              details: {
                ...source.details,
                title: `${source.details.title} (Copy)`,
              },
            };

      const sourceNode = nodes.find((n) => n.id === buttonId);
      if (sourceNode) {
        manualPositionsRef.current.set(newId, {
          x: sourceNode.position.x + 32,
          y: sourceNode.position.y + 72,
        });
      }

      const isInRoot =
        Array.isArray(template.hierarchy?.root) &&
        template.hierarchy.root.includes(buttonId);
      const nextHierarchy: TemplateHierarchy = {
        ...template.hierarchy,
        root: isInRoot
          ? [...(template.hierarchy.root ?? []), newId]
          : [...(template.hierarchy.root ?? [])],
      };

      for (const [parentKey, children] of Object.entries(
        template.hierarchy ?? {},
      )) {
        if (
          parentKey !== "root" &&
          Array.isArray(children) &&
          children.includes(buttonId)
        ) {
          nextHierarchy[parentKey] = [...children, newId];
        }
      }

      if (onTemplateChange) {
        onTemplateChange({
          ...template,
          buttons: {
            ...template.buttons,
            [newId]: cloned,
          },
          hierarchy: nextHierarchy,
        });
      } else {
        onButtonAction(cloned, newId, createSaveAction(cloned));
      }
      setEditingNodeId(newId);
    },
    [nodes, onButtonAction, onTemplateChange, template],
  );

  const handleDeleteNode = useCallback(
    (buttonId: string) => {
      const existing = template.buttons[buttonId];
      if (!existing) return;
      if (editingNodeId === buttonId) {
        setEditingNodeId(null);
      }
      onButtonAction(existing, buttonId, { type: "DELETE" });
      if (onTemplateChange) {
        onTemplateChange(
          applyControlActionToTemplate(template, buttonId, { type: "DELETE" }),
        );
      }
    },
    [editingNodeId, onButtonAction, onTemplateChange, template],
  );

  const selectedEntries = useMemo(() => {
    return selectedNodeIds
      .map((id) => ({ buttonId: id, button: template.buttons[id] }))
      .filter((entry): entry is { buttonId: string; button: RobotControlButton } =>
        Boolean(entry.button),
      );
  }, [selectedNodeIds, template.buttons]);

  const applyBatchUpdate = useCallback(
    (
      transform: (
        button: RobotControlButton,
      ) => RobotControlButton | null,
    ) => {
      const entries: Array<{
        buttonId: string;
        previousButton: RobotControlButton;
        nextButton: RobotControlButton;
      }> = [];
      let nextTemplate = template;

      for (const { buttonId, button } of selectedEntries) {
        const nextButton = transform(button);
        if (!nextButton) continue;
        entries.push({ buttonId, previousButton: button, nextButton });
        nextTemplate = applyControlActionToTemplate(
          nextTemplate,
          buttonId,
          createSaveAction(nextButton),
        );
      }

      if (entries.length === 0) return;

      if (onBatchSave) {
        onBatchSave(
          entries.map((entry) => ({
            buttonId: entry.buttonId,
            button: entry.nextButton,
          })),
        );
      } else if (onTemplateChange) {
        onTemplateChange(nextTemplate);
      } else {
        for (const entry of entries) {
          onButtonAction(
            entry.previousButton,
            entry.buttonId,
            createSaveAction(entry.nextButton),
          );
        }
      }
    },
    [onBatchSave, onButtonAction, onTemplateChange, selectedEntries, template],
  );

  const clearSelection = useCallback(() => {
    setSelectedNodeIds([]);
    setNodes((prev) =>
      prev.map((n) => (n.selected ? { ...n, selected: false } : n)),
    );
  }, [setNodes]);

  const handleDeleteSelected = useCallback(() => {
    let nextTemplate = template;
    for (const { buttonId, button } of selectedEntries) {
      if (!onTemplateChange) {
        onButtonAction(button, buttonId, { type: "DELETE" });
      }
      nextTemplate = applyControlActionToTemplate(nextTemplate, buttonId, {
        type: "DELETE",
      });
    }
    if (onTemplateChange) {
      onTemplateChange(nextTemplate);
    }
    setSelectedNodeIds([]);
    setEditingNodeId(null);
  }, [onButtonAction, onTemplateChange, selectedEntries, template]);

  const nodeContextValue = useMemo<FlowNodeContextValue>(
    () => ({
      selectedButtonId,
      selectedNodeIds,
      editingNodeId,
      disabled,
      logIcon,
      emotionIcons,
      emotionLabels,
      colorLabels,
      onOpenEdit: (id) => setEditingNodeId(id),
      onCloseEdit: () => setEditingNodeId(null),
      onSaveNode: handleSaveNode,
      onToggleRoot: handleToggleRoot,
      onAddChild: (parentId, type) => handleCreateNode(type, parentId),
      onDuplicateNode: handleDuplicateNode,
      onDeleteNode: handleDeleteNode,
    }),
    [
      colorLabels,
      disabled,
      editingNodeId,
      emotionIcons,
      emotionLabels,
      handleCreateNode,
      handleDeleteNode,
      handleDuplicateNode,
      handleSaveNode,
      handleToggleRoot,
      logIcon,
      selectedButtonId,
      selectedNodeIds,
    ],
  );

  const effectivePanOnDrag =
    disabled || dragBehavior === "pan" ? true : [1, 2];
  const effectiveSelectionOnDrag = !disabled && dragBehavior === "select";

  return (
    <FlowNodeContext.Provider value={nodeContextValue}>
      <div className={cn("pb:w-full pb:h-full pb:min-h-[400px]", className)}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onReconnect={onReconnect}
          isValidConnection={isValidConnection}
          onEdgesDelete={onEdgesDelete}
          onNodeClick={onNodeClick}
          onNodeDragStop={onNodeDragStop}
          onSelectionChange={onSelectionChange}
          onPaneClick={() => setEditingNodeId(null)}
          nodeTypes={nodeTypes}
          nodesDraggable={!disabled}
          nodesConnectable={!disabled}
          edgesReconnectable={!disabled}
          elementsSelectable={!disabled}
          panOnScroll={true}
          zoomOnPinch={true}
          panActivationKeyCode="Space"
          zoomActivationKeyCode={["Meta", "Control"]}
          multiSelectionKeyCode={["Shift", "Meta", "Control"]}
          selectionOnDrag={effectiveSelectionOnDrag}
          panOnDrag={effectivePanOnDrag}
          selectionMode={SelectionMode.Partial}
          defaultEdgeOptions={{
            type: "smoothstep",
            markerEnd: { type: MarkerType.ArrowClosed },
          }}
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView
          proOptions={{ hideAttribution: true }}
        >
          <Background />
          <Controls />
          {showMiniMap && (
            <MiniMap
              pannable
              zoomable
              nodeColor={(node) => {
                const data = node.data as PeerbotsFlowNodeData | undefined;
                if (!data?.button) return "#CBD5E1";
                return PEERBOTS_COLOR_MAP[data.button.labelColor] ?? "#CBD5E1";
              }}
            />
          )}

          {!disabled && (
            <Panel position="top-left">
              <div className="pb:flex pb:flex-wrap pb:items-center pb:gap-1.5 pb:rounded-lg pb:bg-white/95 pb:backdrop-blur-xs pb:border pb:border-gray-200 pb:shadow-sm pb:p-1">
                <div
                  role="group"
                  aria-label="Canvas drag mode"
                  className="pb:inline-flex pb:rounded-md pb:bg-gray-100 pb:p-0.5"
                >
                  <button
                    type="button"
                    aria-pressed={dragBehavior === "select"}
                    title="Box-select on drag (hold Space or two-finger scroll to pan)"
                    onClick={() => setDragBehavior("select")}
                    className={cn(
                      "pb:px-2 pb:py-1 pb:text-xs pb:font-semibold pb:rounded pb:cursor-pointer pb:transition-colors",
                      dragBehavior === "select"
                        ? "pb:bg-gray-900 pb:text-white"
                        : "pb:text-gray-600 hover:pb:text-gray-900",
                    )}
                  >
                    ↖ Select
                  </button>
                  <button
                    type="button"
                    aria-pressed={dragBehavior === "pan"}
                    title="Pan on drag (hold Shift + click/drag to multi-select)"
                    onClick={() => setDragBehavior("pan")}
                    className={cn(
                      "pb:px-2 pb:py-1 pb:text-xs pb:font-semibold pb:rounded pb:cursor-pointer pb:transition-colors",
                      dragBehavior === "pan"
                        ? "pb:bg-gray-900 pb:text-white"
                        : "pb:text-gray-600 hover:pb:text-gray-900",
                    )}
                  >
                    ✋ Pan
                  </button>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="pb:h-7 pb:px-2 pb:text-xs"
                  onClick={() => handleCreateNode("Message", null)}
                >
                  + Message
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="pb:h-7 pb:px-2 pb:text-xs"
                  onClick={() => handleCreateNode("Log", null)}
                >
                  + Log
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="pb:h-7 pb:px-2 pb:text-xs"
                  onClick={handleAutoLayout}
                >
                  Auto-Layout
                </Button>
              </div>
            </Panel>
          )}

          <Panel position="top-right">
            <div className="pb:flex pb:flex-col pb:items-end pb:gap-2">
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

              {!disabled && selectedEntries.length >= 2 && (
                <BatchButtonEditPanel
                  selectedButtons={selectedEntries}
                  emotionIcons={emotionIcons}
                  emotionLabels={emotionLabels}
                  colorLabels={colorLabels}
                  onApplyLabelColor={(labelColor) =>
                    applyBatchUpdate((btn) => ({ ...btn, labelColor }))
                  }
                  onApplyFaceColor={(color) =>
                    applyBatchUpdate((btn) =>
                      btn.type === "Message"
                        ? { ...btn, details: { ...btn.details, color } }
                        : null,
                    )
                  }
                  onApplyEmotion={(emotion) =>
                    applyBatchUpdate((btn) =>
                      btn.type === "Message"
                        ? { ...btn, details: { ...btn.details, emotion } }
                        : null,
                    )
                  }
                  onClearSelection={clearSelection}
                  onDeleteSelected={handleDeleteSelected}
                />
              )}
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </FlowNodeContext.Provider>
  );
}

export const PeerbotsFlowView = FlowView;
