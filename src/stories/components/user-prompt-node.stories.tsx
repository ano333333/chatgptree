import {
  ContextMenuContext,
  type ContextMenuElement,
} from "@/components/context-menu";
import UserMessageDetailWindow from "@/components/user-message-detail-window";
import UserMessageNode from "@/components/user-message-node";
import UserMessageNodeContextMenu from "@/components/user-message-node-context-menu";
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

const meta: Meta<typeof UserMessageNode> = {
  title: "Components/UserMessageNode",
  component: UserMessageNode,
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
      UserMessageNode: UserMessageNode,
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
        type: "UserMessageNode",
        data: {
          nodeId: "1",
          content: "Hello, world!1",
          windowElementRef: windowRefs.current["1"],
          contextMenuRef: contextMenuRefs.current["1"],
        },
        position: { x: 100, y: 100 },
      },
      {
        id: "2",
        type: "UserMessageNode",
        data: {
          nodeId: "2",
          content: "Hello, world!2",
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
          <UserMessageDetailWindow
            nodeId="1"
            content="Hello, world!1"
            onConfirmButtonClick={onConfirmButtonClick("1")}
            ref={windowRefs.current["1"]}
          />
          <UserMessageDetailWindow
            nodeId="2"
            content="Hello, world!2"
            onConfirmButtonClick={onConfirmButtonClick("2")}
            ref={windowRefs.current["2"]}
          />
        </WindowContext>
        <ContextMenuContext>
          <UserMessageNodeContextMenu
            nodeId="1"
            onCopyItemClick={onContextMenuCopyItemClick("1")}
            onDeleteItemClick={onContextMenuDeleteItemClick("1")}
            windowElementRef={windowRefs.current["1"]}
            ref={contextMenuRefs.current["1"]}
          />
          <UserMessageNodeContextMenu
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
