import AIMessageDetailWindow from "@/components/ai-message-detail-window";
import AIMessageNode from "@/components/ai-message-node";
import AIPromptNodeContextMenu from "@/components/ai-message-node-context-menu";
import {
  ContextMenuContext,
  type ContextMenuElement,
} from "@/components/context-menu";
import { WindowContext, type WindowElement } from "@/components/window";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Background,
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  type NodeTypes,
} from "@xyflow/react";
import { useRef, type RefObject } from "react";
import { action } from "storybook/actions";

const meta: Meta<typeof AIMessageNode> = {
  title: "Components/AIPromptNode",
  component: AIMessageNode,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const nodeTypes: NodeTypes = {
      AIMessageNode: AIMessageNode,
    };
    const onContextMenuCopyItemClick = (id: string) =>
      action(`onContextMenuCopyItemClick(${id})`);
    const onContextMenuDeleteItemClick = (id: string) =>
      action(`onContextMenuDeleteItemClick(${id})`);
    const windowRefs = useRef<Record<string, RefObject<WindowElement | null>>>({
      "1": useRef(null),
      "2": useRef(null),
    });
    const contextMenuRefs = useRef<
      Record<string, RefObject<ContextMenuElement | null>>
    >({
      "1": useRef(null),
      "2": useRef(null),
    });
    const nodeState = useNodesState([
      {
        id: "1",
        type: "AIMessageNode",
        data: {
          nodeId: "1",
          content: "Hello, world!1",
          recalculating: false,
          windowElementRef: windowRefs.current["1"],
          contextMenuRef: contextMenuRefs.current["1"],
        },
        position: { x: 100, y: 100 },
      },
      {
        id: "2",
        type: "AIMessageNode",
        data: {
          nodeId: "2",
          content: "Hello, world!2",
          recalculating: true,
          windowElementRef: windowRefs.current["2"],
          contextMenuRef: contextMenuRefs.current["2"],
        },
        position: { x: 100, y: 200 },
      },
    ]);
    const nodes = nodeState[0];
    const onNodesChange = nodeState[2];
    const onConfirmButtonClick = (nodeId: string) =>
      action(`onConfirmButtonClick(${nodeId})`);
    const onRecalculateButtonClick = (nodeId: string) =>
      action(`onRecalculateButtonClick(${nodeId})`);
    const onRecalculateCancelButtonClick = (nodeId: string) =>
      action(`onRecalculateCancelButtonClick(${nodeId})`);
    return (
      <div className="w-screen h-screen">
        <ReactFlowProvider>
          <Background gap={20} size={1} />
          <ReactFlow
            nodes={nodes}
            edges={[]}
            nodeTypes={nodeTypes}
            onPaneContextMenu={(e) => {
              e.preventDefault();
            }}
            onNodesChange={onNodesChange}
          />
        </ReactFlowProvider>
        <WindowContext>
          <AIMessageDetailWindow
            nodeId="1"
            content="Hello, world!1"
            recalculating={false}
            onConfirmButtonClick={onConfirmButtonClick("1")}
            onRecalculateButtonClick={onRecalculateButtonClick("1")}
            onRecalculateCancelButtonClick={onRecalculateCancelButtonClick("1")}
            ref={windowRefs.current["1"]}
          />
          <AIMessageDetailWindow
            nodeId="2"
            content="Hello, world!2"
            recalculating={true}
            onConfirmButtonClick={onConfirmButtonClick("2")}
            onRecalculateButtonClick={onRecalculateButtonClick("2")}
            onRecalculateCancelButtonClick={onRecalculateCancelButtonClick("2")}
            ref={windowRefs.current["2"]}
          />
        </WindowContext>
        <ContextMenuContext>
          <AIPromptNodeContextMenu
            nodeId="1"
            onCopyItemClick={onContextMenuCopyItemClick("1")}
            onDeleteItemClick={onContextMenuDeleteItemClick("1")}
            windowElementRef={windowRefs.current["1"]}
            ref={contextMenuRefs.current["1"]}
          />
          <AIPromptNodeContextMenu
            nodeId="2"
            onCopyItemClick={onContextMenuCopyItemClick("2")}
            onDeleteItemClick={onContextMenuDeleteItemClick("2")}
            windowElementRef={windowRefs.current["2"]}
            ref={contextMenuRefs.current["2"]}
          />
        </ContextMenuContext>
      </div>
    );
  },
};
