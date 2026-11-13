import React, {
  createContext,
  memo,
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
  ReactFlowProvider,
  SelectionMode,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Connection,
  type Edge,
  type IsValidConnection,
  type Node,
  type NodeProps,
  type OnConnectEnd,
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
  getTemplateTopologyKey,
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
  labels?: Partial<ControlLabels>;
  onOpenEdit: (buttonId: string) => void;
  onCloseEdit: () => void;
  onSaveNode: (buttonId: string, nextButton: RobotControlButton) => void;
  onToggleRoot: (buttonId: string) => void;
  onAddChild: (parentId: string) => void;
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

const PeerbotsButtonNode = memo(function PeerbotsButtonNode({
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
    labels,
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
            onClick={() => onAddChild(buttonId)}
            className="pb:px-2 pb:py-0.5 pb:text-[11px] pb:font-semibold pb:rounded pb:bg-gray-100 pb:text-gray-800 hover:pb:bg-gray-200 pb:cursor-pointer"
          >
            + Add
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
          className="nodrag nopan"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.stopPropagation();
              onCloseEdit();
            }
          }}
        >
          <SingleButtonEditPanel
            buttonId={buttonId}
            button={button}
            isRoot={isRoot}
            emotionIcons={emotionIcons}
            emotionLabels={emotionLabels}
            colorLabels={colorLabels}
            labels={labels}
            onSave={(nextButton) => onSaveNode(buttonId, nextButton)}
            onToggleRoot={() => onToggleRoot(buttonId)}
            onAddChild={() => onAddChild(buttonId)}
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

      <Handle
        type="target"
        position={targetPos}
        className={handleHitClassName}
      />
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
      <Handle
        type="source"
        position={sourcePos}
        className={handleHitClassName}
      />
    </div>
  );
});

const handleHitClassName =
  "pb:!w-3 pb:!h-3 pb:!bg-white pb:!border-2 pb:!border-slate-400 hover:pb:!border-teal-600 hover:pb:!bg-teal-50 hover:pb:!scale-125 pb:transition-transform after:pb:content-[''] after:pb:absolute after:pb:-inset-2.5 after:pb:rounded-full after:pb:cursor-crosshair";

const nodeTypes = { peerbotsButton: PeerbotsButtonNode };

function FlowViewInner({
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
  const { screenToFlowPosition, fitView, setCenter, getZoom } = useReactFlow();
  const [uncontrolledDirection, setUncontrolledDirection] =
    useState<FlowDirection>(defaultDirection);
  const [dragBehavior, setDragBehavior] = useState<FlowDragBehavior>(
    disabled ? "pan" : defaultDragBehavior,
  );
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const [isLayoutTransitioning, setIsLayoutTransitioning] = useState(false);

  // Preserve manual drag positions across template edits until Auto-Layout or direction change
  const manualPositionsRef = useRef<Map<string, { x: number; y: number }>>(
    new Map(),
  );
  const [layoutEpoch, setLayoutEpoch] = useState(0);
  const lastDirectionRef = useRef<FlowDirection | null>(null);
  const layoutTransitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  // Refs keep FlowNodeContext callbacks stable across keystrokes so typing never re-renders the entire graph
  const templateRef = useRef(template);
  templateRef.current = template;
  const onButtonActionRef = useRef(onButtonAction);
  onButtonActionRef.current = onButtonAction;
  const onTemplateChangeRef = useRef(onTemplateChange);
  onTemplateChangeRef.current = onTemplateChange;
  const onHierarchyChangeRef = useRef(onHierarchyChange);
  onHierarchyChangeRef.current = onHierarchyChange;
  const onAddConnectionRef = useRef(onAddConnection);
  onAddConnectionRef.current = onAddConnection;
  const editingNodeIdRef = useRef(editingNodeId);
  editingNodeIdRef.current = editingNodeId;

  const isDirectionControlled = controlledDirection !== undefined;
  const activeDirection = isDirectionControlled
    ? controlledDirection
    : uncontrolledDirection;

  const triggerSmoothLayoutTransition = useCallback(() => {
    setIsLayoutTransitioning(true);
    if (layoutTransitionTimerRef.current) {
      clearTimeout(layoutTransitionTimerRef.current);
    }
    layoutTransitionTimerRef.current = setTimeout(() => {
      setIsLayoutTransitioning(false);
    }, 320);
    if (typeof requestAnimationFrame === "function") {
      requestAnimationFrame(() => {
        fitView({ duration: 280, padding: 0.2 });
      });
    }
  }, [fitView]);

  useEffect(() => {
    return () => {
      if (layoutTransitionTimerRef.current) {
        clearTimeout(layoutTransitionTimerRef.current);
      }
    };
  }, []);

  const handleDirectionChange = useCallback(
    (nextDirection: FlowDirection | undefined) => {
      if (!nextDirection) return;
      manualPositionsRef.current.clear();
      setLayoutEpoch((prev) => prev + 1);
      triggerSmoothLayoutTransition();
      if (!isDirectionControlled) {
        setUncontrolledDirection(nextDirection);
      }
      onDirectionChange?.(nextDirection);
    },
    [isDirectionControlled, onDirectionChange, triggerSmoothLayoutTransition],
  );

  const resolvedLabels: ControlLabels = {
    ...DEFAULT_CONTROL_LABELS,
    ...contextLabels?.control,
    ...labels,
  };

  // Only recompute Dagre positions when structural topology or layoutEpoch changes — NEVER on keystrokes
  const topologyKey = useMemo(
    () => getTemplateTopologyKey(template, activeDirection),
    [template, activeDirection],
  );

  const computedElements = useMemo(() => {
    void layoutEpoch;
    return templateToFlowElements(templateRef.current, activeDirection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topologyKey, activeDirection, layoutEpoch]);

  const [nodes, setNodes, onNodesChange] = useNodesState<
    Node<PeerbotsFlowNodeData>
  >(computedElements.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    computedElements.edges,
  );

  const nodesRef = useRef(nodes);
  nodesRef.current = nodes;

  // Sync structural topology changes into ReactFlow while preserving dragged positions
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

  // Lightweight button-data sync: updates only edited node(s) without touching Dagre layout or edges
  useEffect(() => {
    setNodes((prevNodes) => {
      let anyChanged = false;
      const nextNodes = prevNodes.map((node) => {
        const latestButton = template.buttons[node.id];
        if (!latestButton || node.data.button === latestButton) {
          return node;
        }
        anyChanged = true;
        return {
          ...node,
          data: {
            ...node.data,
            button: latestButton,
          },
        };
      });
      return anyChanged ? nextNodes : prevNodes;
    });
  }, [template.buttons, setNodes]);

  const emitHierarchyUpdate = useCallback((nextHierarchy: TemplateHierarchy) => {
    onHierarchyChangeRef.current?.(nextHierarchy);
    if (onTemplateChangeRef.current) {
      onTemplateChangeRef.current({
        ...templateRef.current,
        hierarchy: nextHierarchy,
      });
    }
  }, []);

  const handleAutoLayout = useCallback(() => {
    manualPositionsRef.current.clear();
    setLayoutEpoch((prev) => prev + 1);
    triggerSmoothLayoutTransition();
  }, [triggerSmoothLayoutTransition]);

  const isValidConnection: IsValidConnection = useCallback(
    (connection) => {
      if (disabled) return false;
      const source = connection.source;
      const target = connection.target;
      if (!source || !target || source === target) return false;
      const existingChildren = templateRef.current.hierarchy?.[source] ?? [];
      return !existingChildren.includes(target);
    },
    [disabled],
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      if (disabled || !connection.source || !connection.target) return;
      if (connection.source === connection.target) return;
      onAddConnectionRef.current?.(connection.source, connection.target);
      if (onHierarchyChangeRef.current || onTemplateChangeRef.current) {
        emitHierarchyUpdate(
          addHierarchyConnection(
            templateRef.current.hierarchy,
            connection.source,
            connection.target,
          ),
        );
      }
    },
    [disabled, emitHierarchyUpdate],
  );

  const panToNewNode = useCallback(
    (position: { x: number; y: number }) => {
      if (typeof requestAnimationFrame !== "function") return;
      requestAnimationFrame(() => {
        // Offset slightly downward so the Edit Popover below the new node stays in view
        setCenter(position.x + 105, position.y + 90, {
          zoom: Math.max(getZoom(), 0.85),
          duration: 280,
        });
      });
    },
    [getZoom, setCenter],
  );

  const createConnectedButtonAt = useCallback(
    (
      parentId: string | null,
      position: { x: number; y: number },
      childIdToConnect?: string | null,
    ) => {
      const currentTemplate = templateRef.current;
      const newId = generateUniqueButtonId(currentTemplate, "btn");
      const newButton = createDefaultButton("Message");
      manualPositionsRef.current.set(newId, position);

      let nextHierarchy: TemplateHierarchy = { ...currentTemplate.hierarchy };
      if (parentId) {
        nextHierarchy = addHierarchyConnection(nextHierarchy, parentId, newId);
      } else {
        nextHierarchy = {
          ...nextHierarchy,
          root: [...(nextHierarchy.root ?? []), newId],
        };
      }

      if (childIdToConnect) {
        nextHierarchy = addHierarchyConnection(
          nextHierarchy,
          newId,
          childIdToConnect,
        );
      }

      if (onTemplateChangeRef.current) {
        onTemplateChangeRef.current({
          ...currentTemplate,
          buttons: {
            ...currentTemplate.buttons,
            [newId]: newButton,
          },
          hierarchy: nextHierarchy,
        });
      } else {
        onButtonActionRef.current(
          newButton,
          newId,
          createSaveAction(newButton),
        );
        if (parentId) {
          onAddConnectionRef.current?.(parentId, newId);
        } else if (childIdToConnect) {
          onAddConnectionRef.current?.(newId, childIdToConnect);
        } else {
          emitHierarchyUpdate(nextHierarchy);
        }
      }

      setEditingNodeId(newId);
      panToNewNode(position);
    },
    [emitHierarchyUpdate, panToNewNode],
  );

  // Connecting from a handle into empty canvas creates a new connected button at the drop point
  const onConnectEnd: OnConnectEnd = useCallback(
    (event, connectionState) => {
      if (disabled || connectionState.isValid || connectionState.toNode) return;
      const fromNodeId = connectionState.fromNode?.id;
      if (!fromNodeId) return;

      const pointer =
        "changedTouches" in event && event.changedTouches.length > 0
          ? event.changedTouches[0]
          : (event as MouseEvent);
      const clientX = pointer?.clientX ?? 0;
      const clientY = pointer?.clientY ?? 0;
      const dropPosition =
        clientX !== 0 || clientY !== 0
          ? screenToFlowPosition({ x: clientX, y: clientY })
          : computeNextButtonPosition(
              nodesRef.current,
              fromNodeId,
              activeDirection,
            );

      const draggedFromTarget = connectionState.fromHandle?.type === "target";
      if (draggedFromTarget) {
        createConnectedButtonAt(null, dropPosition, fromNodeId);
      } else {
        createConnectedButtonAt(fromNodeId, dropPosition);
      }
    },
    [
      activeDirection,
      createConnectedButtonAt,
      disabled,
      screenToFlowPosition,
    ],
  );

  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      if (disabled || !newConnection.source || !newConnection.target) return;
      if (newConnection.source === newConnection.target) return;
      onRemoveConnection?.(oldEdge.source, oldEdge.target);
      onAddConnectionRef.current?.(newConnection.source, newConnection.target);
      if (onHierarchyChangeRef.current || onTemplateChangeRef.current) {
        const removed = removeHierarchyConnection(
          templateRef.current.hierarchy,
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
    [disabled, emitHierarchyUpdate, onRemoveConnection],
  );

  const onEdgesDelete = useCallback(
    (deletedEdges: Edge[]) => {
      if (disabled) return;
      let nextHierarchy = templateRef.current.hierarchy;
      for (const edge of deletedEdges) {
        onRemoveConnection?.(edge.source, edge.target);
        nextHierarchy = removeHierarchyConnection(
          nextHierarchy,
          edge.source,
          edge.target,
        );
      }
      if (
        deletedEdges.length > 0 &&
        (onHierarchyChangeRef.current || onTemplateChangeRef.current)
      ) {
        emitHierarchyUpdate(nextHierarchy);
      }
    },
    [disabled, emitHierarchyUpdate, onRemoveConnection],
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node<PeerbotsFlowNodeData>) => {
      const btn = templateRef.current.buttons[node.id] ?? node.data.button;
      onButtonActionRef.current(btn, node.id, { type: "SELECT" });
      onButtonActionRef.current(btn, node.id, { type: "CLICK" });
    },
    [],
  );

  const onNodeDragStop = useCallback(
    (
      _: React.MouseEvent | MouseEvent | TouchEvent,
      draggedNode: Node<PeerbotsFlowNodeData>,
      draggedNodes: Node[],
    ) => {
      const movedList = draggedNodes.length > 0 ? draggedNodes : [draggedNode];
      for (const item of movedList) {
        manualPositionsRef.current.set(item.id, item.position);
      }

      if (
        disabled ||
        (!onHierarchyChangeRef.current && !onTemplateChangeRef.current)
      ) {
        return;
      }
      const posMap = new Map<string, { x: number; y: number }>();
      for (const n of nodesRef.current) {
        posMap.set(n.id, n.position);
      }
      for (const item of movedList) {
        posMap.set(item.id, item.position);
      }

      const reordered = reorderHierarchySiblingsFromPositions(
        templateRef.current.hierarchy,
        movedList.map((n) => n.id),
        posMap,
        activeDirection,
      );
      if (reordered) {
        emitHierarchyUpdate(reordered);
      }
    },
    [activeDirection, disabled, emitHierarchyUpdate],
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
      const currentTemplate = templateRef.current;
      const existing = currentTemplate.buttons[buttonId];
      if (!existing) return;
      const action = createSaveAction(nextButton);
      onButtonActionRef.current(existing, buttonId, action);
      if (onTemplateChangeRef.current) {
        onTemplateChangeRef.current(
          applyControlActionToTemplate(currentTemplate, buttonId, action),
        );
      }
    },
    [],
  );

  const handleToggleRoot = useCallback(
    (buttonId: string) => {
      emitHierarchyUpdate(
        toggleRootButtonInHierarchy(templateRef.current.hierarchy, buttonId),
      );
    },
    [emitHierarchyUpdate],
  );

  const handleCreateNode = useCallback(
    (parentId?: string | null) => {
      const nextPos = computeNextButtonPosition(
        nodesRef.current,
        parentId,
        activeDirection,
      );
      createConnectedButtonAt(parentId ?? null, nextPos);
    },
    [activeDirection, createConnectedButtonAt],
  );

  const handleDuplicateNode = useCallback((buttonId: string) => {
    const currentTemplate = templateRef.current;
    const source = currentTemplate.buttons[buttonId];
    if (!source) return;
    const newId = generateUniqueButtonId(currentTemplate, `${buttonId}-copy`);
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

    const sourceNode = nodesRef.current.find((n) => n.id === buttonId);
    const dupPos = sourceNode
      ? {
          x: sourceNode.position.x + 32,
          y: sourceNode.position.y + 72,
        }
      : null;
    if (dupPos) {
      manualPositionsRef.current.set(newId, dupPos);
    }

    const isInRoot =
      Array.isArray(currentTemplate.hierarchy?.root) &&
      currentTemplate.hierarchy.root.includes(buttonId);
    const nextHierarchy: TemplateHierarchy = {
      ...currentTemplate.hierarchy,
      root: isInRoot
        ? [...(currentTemplate.hierarchy.root ?? []), newId]
        : [...(currentTemplate.hierarchy.root ?? [])],
    };

    for (const [parentKey, children] of Object.entries(
      currentTemplate.hierarchy ?? {},
    )) {
      if (
        parentKey !== "root" &&
        Array.isArray(children) &&
        children.includes(buttonId)
      ) {
        nextHierarchy[parentKey] = [...children, newId];
      }
    }

    if (onTemplateChangeRef.current) {
      onTemplateChangeRef.current({
        ...currentTemplate,
        buttons: {
          ...currentTemplate.buttons,
          [newId]: cloned,
        },
        hierarchy: nextHierarchy,
      });
    } else {
      onButtonActionRef.current(cloned, newId, createSaveAction(cloned));
    }
    setEditingNodeId(newId);
    if (dupPos) {
      panToNewNode(dupPos);
    }
  }, [panToNewNode]);

  const handleDeleteNode = useCallback((buttonId: string) => {
    const currentTemplate = templateRef.current;
    const existing = currentTemplate.buttons[buttonId];
    if (!existing) return;
    if (editingNodeIdRef.current === buttonId) {
      setEditingNodeId(null);
    }
    onButtonActionRef.current(existing, buttonId, { type: "DELETE" });
    if (onTemplateChangeRef.current) {
      onTemplateChangeRef.current(
        applyControlActionToTemplate(currentTemplate, buttonId, {
          type: "DELETE",
        }),
      );
    }
  }, []);

  const selectedEntries = useMemo(() => {
    return selectedNodeIds
      .map((id) => ({ buttonId: id, button: template.buttons[id] }))
      .filter(
        (entry): entry is { buttonId: string; button: RobotControlButton } =>
          Boolean(entry.button),
      );
  }, [selectedNodeIds, template.buttons]);

  const applyBatchUpdate = useCallback(
    (
      transform: (button: RobotControlButton) => RobotControlButton | null,
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

  const handleDeleteSelected = useCallback(() => {
    if (selectedEntries.length === 0) return;
    let nextTemplate = template;
    for (const { buttonId, button } of selectedEntries) {
      if (onTemplateChange) {
        nextTemplate = applyControlActionToTemplate(nextTemplate, buttonId, {
          type: "DELETE",
        });
      }
      onButtonAction(button, buttonId, { type: "DELETE" });
    }
    if (onTemplateChange) {
      onTemplateChange(nextTemplate);
    }
    setSelectedNodeIds([]);
  }, [onButtonAction, onTemplateChange, selectedEntries, template]);

  const clearSelection = useCallback(() => {
    setNodes((prev) => prev.map((n) => (n.selected ? { ...n, selected: false } : n)));
    setSelectedNodeIds([]);
  }, [setNodes]);

  const handleOpenEdit = useCallback((id: string) => setEditingNodeId(id), []);
  const handleCloseEdit = useCallback(() => setEditingNodeId(null), []);

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
      labels,
      onOpenEdit: handleOpenEdit,
      onCloseEdit: handleCloseEdit,
      onSaveNode: handleSaveNode,
      onToggleRoot: handleToggleRoot,
      onAddChild: handleCreateNode,
      onDuplicateNode: handleDuplicateNode,
      onDeleteNode: handleDeleteNode,
    }),
    [
      colorLabels,
      disabled,
      editingNodeId,
      emotionIcons,
      emotionLabels,
      handleCloseEdit,
      handleCreateNode,
      handleDeleteNode,
      handleDuplicateNode,
      handleOpenEdit,
      handleSaveNode,
      handleToggleRoot,
      labels,
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
      <div
        className={cn(
          "pb:w-full pb:h-full pb:min-h-[400px]",
          isLayoutTransitioning &&
            "[&_.react-flow__node]:pb:transition-transform [&_.react-flow__node]:pb:duration-250 [&_.react-flow__node]:pb:ease-out",
          className,
        )}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onConnectEnd={onConnectEnd}
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
          connectionRadius={28}
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
                  onClick={() => handleCreateNode(null)}
                >
                  + Add
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
                  labels={labels}
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

/**
 * Interactive modeless node-graph editor and viewer for Peerbots templates powered by
 * `@xyflow/react` and `@dagrejs/dagre` (imported from `@peerbots/core/flow`).
 *
 * Supports simultaneous two-finger scroll panning, pinch/Ctrl+scroll zoom, `Space`+drag panning,
 * `Shift`/marquee multi-select, batch color/emotion editing, inline single-node edit popovers,
 * drag-from-handle-to-empty-space button creation, sticky manual coordinates, sibling drag-reordering,
 * and edge reconnection.
 */
export function FlowView(props: FlowViewProps) {
  return (
    <ReactFlowProvider>
      <FlowViewInner {...props} />
    </ReactFlowProvider>
  );
}

export const PeerbotsFlowView = FlowView;
