import UserPromptDetailWindow from "@/components/user-prompt-detail-window";
import UserPromptNode from "@/components/user-prompt-node";
import { WindowContext, type WindowElement } from "@/components/window";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "@storybook/test";
import {
  Background,
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
} from "@xyflow/react";
import { useRef } from "react";
import { action } from "storybook/actions";
import { wait } from "../utils/wait";

const meta: Meta<typeof UserPromptNode> = {
  title: "Components/UserPromptNode/Test",
  component: UserPromptNode,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const UserPromptDetailWindowOpensOnUserPromptNodeDoubleClick: Story = {
  render: () => {
    const nodeTypes = {
      UserPromptNode: UserPromptNode,
    };
    const windowRef = useRef<WindowElement>(null);
    const nodesState = useNodesState([
      {
        id: "1",
        type: "UserPromptNode",
        data: {
          nodeId: "1",
          content: "UserPromptNode",
          onContextMenuCopyItemClick: action("onContextMenuCopyItemClick"),
          onContextMenuDeleteItemClick: action("onContextMenuDeleteItemClick"),
          windowElementRef: windowRef,
        },
        position: { x: 100, y: 100 },
      },
    ]);
    const nodes = nodesState[0];
    const onNodesChange = nodesState[2];
    return (
      <div className="w-screen h-screen">
        <ReactFlowProvider>
          <Background gap={20} size={1} />
          <ReactFlow
            nodes={nodes}
            nodeTypes={nodeTypes}
            onPaneContextMenu={(e) => {
              e.preventDefault();
            }}
            onNodesChange={onNodesChange}
          />
        </ReactFlowProvider>
        <WindowContext>
          <UserPromptDetailWindow
            nodeId="1"
            content="UserPromptDetailWindow"
            onConfirmButtonClick={action("onConfirmButtonClick")}
            ref={windowRef}
          />
        </WindowContext>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    // ユーザプロンプトノードをダブルクリックすると、UserPromptDetailWindowが開く。
    // Arrange
    const canvas = within(canvasElement);

    // Act
    const node = canvas.getByText("UserPromptNode");
    await userEvent.dblClick(node);

    // Assert
    const window = canvas.getByText("UserPromptDetailWindow");
    expect(window).toBeInTheDocument();
  },
};

export const UserPromptNodeContextMenuOpensOnUserPromptNodeRightClick: Story = {
  render: () => {
    const nodeTypes = {
      UserPromptNode: UserPromptNode,
    };
    const windowRef = useRef<WindowElement>(null);
    const nodesState = useNodesState([
      {
        id: "1",
        type: "UserPromptNode",
        data: {
          nodeId: "1",
          content: "UserPromptNode",
          onContextMenuCopyItemClick: action("onContextMenuCopyItemClick"),
          onContextMenuDeleteItemClick: action("onContextMenuDeleteItemClick"),
          windowElementRef: windowRef,
        },
        position: { x: 100, y: 100 },
      },
    ]);
    const nodes = nodesState[0];
    const onNodesChange = nodesState[2];
    return (
      <div className="w-screen h-screen">
        <ReactFlowProvider>
          <Background gap={20} size={1} />
          <ReactFlow
            nodes={nodes}
            nodeTypes={nodeTypes}
            onPaneContextMenu={(e) => {
              e.preventDefault();
            }}
            onNodesChange={onNodesChange}
          />
        </ReactFlowProvider>
        <WindowContext>
          <UserPromptDetailWindow
            nodeId="1"
            content="UserPromptDetailWindow"
            onConfirmButtonClick={action("onConfirmButtonClick")}
            ref={windowRef}
          />
        </WindowContext>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    // ユーザプロンプトノードを右クリックすると、コピー、削除、編集の3つのアイテムのコンテキストメニューが表示される。
    // Arrange
    const canvas = within(canvasElement);

    // Act
    const node = canvas.getByText("UserPromptNode");
    node.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: true,
      }),
    );
    await wait();

    // Assert
    const copyItemElement = canvas.getByText("コピー");
    expect(copyItemElement).toBeInTheDocument();
    const deleteItemElement = canvas.getByText("削除");
    expect(deleteItemElement).toBeInTheDocument();
    const editItemElement = canvas.getByText("編集");
    expect(editItemElement).toBeInTheDocument();
  },
};

const UserPromptNodeContextMenuCopyItemInvokeHandlerDatas = {
  handler: fn(),
};

export const UserPromptNodeContextMenuCopyItemInvokeHandler: Story = {
  render: () => {
    const datas = UserPromptNodeContextMenuCopyItemInvokeHandlerDatas;
    const nodeTypes = {
      UserPromptNode: UserPromptNode,
    };
    const windowRef = useRef<WindowElement>(null);
    const nodesState = useNodesState([
      {
        id: "1",
        type: "UserPromptNode",
        data: {
          nodeId: "1",
          content: "UserPromptNode",
          onContextMenuCopyItemClick: datas.handler,
          onContextMenuDeleteItemClick: action("onContextMenuDeleteItemClick"),
          windowElementRef: windowRef,
        },
        position: { x: 100, y: 100 },
      },
    ]);
    const nodes = nodesState[0];
    const onNodesChange = nodesState[2];
    return (
      <div className="w-screen h-screen">
        <ReactFlowProvider>
          <Background gap={20} size={1} />
          <ReactFlow
            nodes={nodes}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
          />
        </ReactFlowProvider>
        <WindowContext>
          <UserPromptDetailWindow
            nodeId="1"
            content="UserPromptDetailWindow"
            onConfirmButtonClick={action("onConfirmButtonClick")}
            ref={windowRef}
          />
        </WindowContext>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    // ユーザプロンプトノードのコンテキストメニューのコピー項目をクリックすると、ハンドラーが呼ばれる。
    // Arrange
    const canvas = within(canvasElement);
    const datas = UserPromptNodeContextMenuCopyItemInvokeHandlerDatas;
    datas.handler.mockClear();
    const node = canvas.getByText("UserPromptNode");
    node.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: true,
      }),
    );
    await wait();

    // Act
    const copyItemElement = canvas.getByText("コピー");
    await userEvent.click(copyItemElement);
    await wait();

    // Assert
    expect(datas.handler).toHaveBeenCalledWith("1");
    expect(datas.handler).toHaveBeenCalledTimes(1);
    const copyItemElementAfterClick = canvas.queryByText("コピー");
    expect(copyItemElementAfterClick).toBeNull();
  },
};

const UserPromptNodeContextMenuDeleteItemInvokeHandlerDatas = {
  handler: fn(),
};

export const UserPromptNodeContextMenuDeleteItemInvokeHandler: Story = {
  render: () => {
    const datas = UserPromptNodeContextMenuDeleteItemInvokeHandlerDatas;
    const nodeTypes = {
      UserPromptNode: UserPromptNode,
    };
    const windowRef = useRef<WindowElement>(null);
    const nodesState = useNodesState([
      {
        id: "1",
        type: "UserPromptNode",
        data: {
          nodeId: "1",
          content: "UserPromptNode",
          onContextMenuCopyItemClick: action("onContextMenuCopyItemClick"),
          onContextMenuDeleteItemClick: datas.handler,
          windowElementRef: windowRef,
        },
        position: { x: 100, y: 100 },
      },
    ]);
    const nodes = nodesState[0];
    const onNodesChange = nodesState[2];
    return (
      <div className="w-screen h-screen">
        <ReactFlowProvider>
          <Background gap={20} size={1} />
          <ReactFlow
            nodes={nodes}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
          />
        </ReactFlowProvider>
        <WindowContext>
          <UserPromptDetailWindow
            nodeId="1"
            content="UserPromptDetailWindow"
            onConfirmButtonClick={action("onConfirmButtonClick")}
            ref={windowRef}
          />
        </WindowContext>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    // ユーザプロンプトノードのコンテキストメニューの削除項目をクリックすると、ハンドラーが呼ばれる。
    // Arrange
    const canvas = within(canvasElement);
    const datas = UserPromptNodeContextMenuDeleteItemInvokeHandlerDatas;
    datas.handler.mockClear();
    const node = canvas.getByText("UserPromptNode");
    node.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: true,
      }),
    );
    await wait();

    // Act
    const deleteItemElement = canvas.getByText("削除");
    await userEvent.click(deleteItemElement);
    await wait();

    // Assert
    expect(datas.handler).toHaveBeenCalledWith("1");
    expect(datas.handler).toHaveBeenCalledTimes(1);
    const deleteItemElementAfterClick = canvas.queryByText("削除");
    expect(deleteItemElementAfterClick).toBeNull();
  },
};

export const UserPromptNodeContextMenuEditItemOpensDetailWindow: Story = {
  render: () => {
    const nodeTypes = {
      UserPromptNode: UserPromptNode,
    };
    const windowRef = useRef<WindowElement>(null);
    const nodesState = useNodesState([
      {
        id: "1",
        type: "UserPromptNode",
        data: {
          nodeId: "1",
          content: "UserPromptNode",
          onContextMenuCopyItemClick: action("onContextMenuCopyItemClick"),
          onContextMenuDeleteItemClick: action("onContextMenuDeleteItemClick"),
          windowElementRef: windowRef,
        },
        position: { x: 100, y: 100 },
      },
    ]);
    const nodes = nodesState[0];
    const onNodesChange = nodesState[2];
    return (
      <div className="w-screen h-screen">
        <ReactFlowProvider>
          <Background gap={20} size={1} />
          <ReactFlow
            nodes={nodes}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
          />
        </ReactFlowProvider>
        <WindowContext>
          <UserPromptDetailWindow
            nodeId="1"
            content="UserPromptDetailWindow"
            onConfirmButtonClick={action("onConfirmButtonClick")}
            ref={windowRef}
          />
        </WindowContext>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    // ユーザプロンプトノードのコンテキストメニューの編集項目をクリックすると、詳細ウィンドウが開く。
    // Arrange
    const canvas = within(canvasElement);
    const node = canvas.getByText("UserPromptNode");
    node.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: true,
      }),
    );
    await wait();

    // Act
    const editItemElement = canvas.getByText("編集");
    await userEvent.click(editItemElement);
    await wait();

    // Assert
    const window = canvas.getByText("UserPromptDetailWindow");
    expect(window).toBeInTheDocument();
  },
};

const UserPromptDetailWindowConfirmButtonInvokeHandlerDatas = {
  handler: fn(),
};

export const UserPromptDetailWindowConfirmButtonInvokeHandler: Story = {
  render: () => {
    const datas = UserPromptDetailWindowConfirmButtonInvokeHandlerDatas;
    const nodeTypes = {
      UserPromptNode: UserPromptNode,
    };
    const windowRef = useRef<WindowElement>(null);
    const nodesState = useNodesState([
      {
        id: "1",
        type: "UserPromptNode",
        data: {
          nodeId: "1",
          content: "UserPromptNode",
          onContextMenuCopyItemClick: action("onContextMenuCopyItemClick"),
          onContextMenuDeleteItemClick: action("onContextMenuDeleteItemClick"),
          windowElementRef: windowRef,
        },
        position: { x: 100, y: 100 },
      },
    ]);
    const nodes = nodesState[0];
    const onNodesChange = nodesState[2];
    return (
      <div className="w-screen h-screen">
        <ReactFlowProvider>
          <Background gap={20} size={1} />
          <ReactFlow
            nodes={nodes}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
          />
        </ReactFlowProvider>
        <WindowContext>
          <UserPromptDetailWindow
            nodeId="1"
            content="UserPromptDetailWindow"
            onConfirmButtonClick={datas.handler}
            ref={windowRef}
          />
        </WindowContext>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    // ユーザプロンプト詳細ウィンドウのtextareaを編集後ユーザプロンプト詳細ウィンドウの確定ボタンを押すと、入力したテキストで対応するハンドラが呼び出される。
    // Arrange
    const canvas = within(canvasElement);
    const datas = UserPromptDetailWindowConfirmButtonInvokeHandlerDatas;
    datas.handler.mockClear();
    const node = canvas.getByText("UserPromptNode");
    await userEvent.dblClick(node);
    await wait();

    // Act
    const textarea = canvas.getByRole("textbox");
    await userEvent.clear(textarea);
    await userEvent.type(textarea, "新しいテキスト");
    const confirmButton = canvas.getByText("確定");
    await userEvent.click(confirmButton);

    // Assert
    expect(datas.handler).toHaveBeenCalledWith("新しいテキスト");
    expect(datas.handler).toHaveBeenCalledTimes(1);
  },
};
