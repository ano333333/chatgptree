import UserMessageDetailWindow from "@/components/user-message-detail-window";
import UserMessageNode from "@/components/user-message-node";
import UserMessageNodeContextMenu from "@/components/user-message-node-context-menu";
import {
  ContextMenuContext,
  type ContextMenuElement,
} from "@/components/context-menu";
import { WindowContext, type WindowElement } from "@/components/window";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "@storybook/test";
import {
  Background,
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
} from "@xyflow/react";
import { useRef } from "react";
import { action } from "storybook/actions";
import { wait } from "../utils/wait";

const meta: Meta<typeof UserMessageNode> = {
  title: "Components/UserMessageNode/Test",
  component: UserMessageNode,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const UserMessageDetailWindowOpensOnUserMessageNodeDoubleClick: Story = {
  render: () => {
    const nodeTypes = {
      UserMessageNode: UserMessageNode,
    };
    const windowRef = useRef<WindowElement>(null);
    const contextMenuRef = useRef<ContextMenuElement>(null);
    const nodesState = useNodesState([
      {
        id: "1",
        type: "UserMessageNode",
        data: {
          nodeId: "1",
          content: "UserMessageNode",
          windowElementRef: windowRef,
          contextMenuRef: contextMenuRef,
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
          <UserMessageDetailWindow
            nodeId="1"
            content="UserMessageDetailWindow"
            onConfirmButtonClick={action("onConfirmButtonClick")}
            ref={windowRef}
          />
        </WindowContext>
        <ContextMenuContext>
          <UserMessageNodeContextMenu
            nodeId="1"
            onCopyItemClick={action("onCopyItemClick")}
            onDeleteItemClick={action("onDeleteItemClick")}
            windowElementRef={windowRef}
            ref={contextMenuRef}
          />
        </ContextMenuContext>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    // ユーザプロンプトノードをダブルクリックすると、UserPromptDetailWindowが開く。
    // Arrange
    const canvas = within(canvasElement);

    // Act
    const node = canvas.getByText("UserMessageNode");
    // NOTE: userEvent.dblClick(node)では、documentがnullなのにアクセスしようとしてエラーが生じる
    // NOTE: dispatchEventだとこのエラーが生じない。他のイベントも同様
    node.dispatchEvent(
      new MouseEvent("dblclick", {
        bubbles: true,
        cancelable: true,
      }),
    );
    await wait();

    // Assert
    const window = canvas.getByText("UserMessageDetailWindow");
    expect(window).toBeInTheDocument();
  },
};

export const UserMessageNodeContextMenuOpensOnUserMessageNodeRightClick: Story =
  {
    render: () => {
      const nodeTypes = {
        UserMessageNode: UserMessageNode,
      };
      const windowRef = useRef<WindowElement>(null);
      const contextMenuRef = useRef<ContextMenuElement>(null);
      const nodesState = useNodesState([
        {
          id: "1",
          type: "UserMessageNode",
          data: {
            nodeId: "1",
            content: "UserMessageNode",
            windowElementRef: windowRef,
            contextMenuRef: contextMenuRef,
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
            <UserMessageDetailWindow
              nodeId="1"
              content="UserMessageDetailWindow"
              onConfirmButtonClick={action("onConfirmButtonClick")}
              ref={windowRef}
            />
          </WindowContext>
          <ContextMenuContext>
            <UserMessageNodeContextMenu
              nodeId="1"
              onCopyItemClick={action("onCopyItemClick")}
              onDeleteItemClick={action("onDeleteItemClick")}
              windowElementRef={windowRef}
              ref={contextMenuRef}
            />
          </ContextMenuContext>
        </div>
      );
    },
    play: async ({ canvasElement }) => {
      // ユーザプロンプトノードを右クリックすると、コピー、削除、編集の3つのアイテムのコンテキストメニューが表示される。
      // Arrange
      const canvas = within(canvasElement);

      // Act
      const node = canvas.getByText("UserMessageNode");
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

const UserMessageNodeContextMenuCopyItemInvokeHandlerDatas = {
  handler: fn(),
};

export const UserMessageNodeContextMenuCopyItemInvokeHandler: Story = {
  render: () => {
    const datas = UserMessageNodeContextMenuCopyItemInvokeHandlerDatas;
    const nodeTypes = {
      UserMessageNode: UserMessageNode,
    };
    const windowRef = useRef<WindowElement>(null);
    const contextMenuRef = useRef<ContextMenuElement>(null);
    const nodesState = useNodesState([
      {
        id: "1",
        type: "UserMessageNode",
        data: {
          nodeId: "1",
          content: "UserMessageNode",
          windowElementRef: windowRef,
          contextMenuRef: contextMenuRef,
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
          <UserMessageDetailWindow
            nodeId="1"
            content="UserMessageDetailWindow"
            onConfirmButtonClick={action("onConfirmButtonClick")}
            ref={windowRef}
          />
        </WindowContext>
        <ContextMenuContext>
          <UserMessageNodeContextMenu
            nodeId="1"
            onCopyItemClick={datas.handler}
            onDeleteItemClick={action("onDeleteItemClick")}
            windowElementRef={windowRef}
            ref={contextMenuRef}
          />
        </ContextMenuContext>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    // ユーザプロンプトノードのコンテキストメニューのコピー項目をクリックすると、ハンドラーが呼ばれる。
    // Arrange
    const canvas = within(canvasElement);
    const datas = UserMessageNodeContextMenuCopyItemInvokeHandlerDatas;
    datas.handler.mockClear();
    const node = canvas.getByText("UserMessageNode");
    node.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: true,
      }),
    );
    await wait();

    // Act
    const copyItemElement = canvas.getByText("コピー");
    copyItemElement.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      }),
    );
    await wait();

    // Assert
    expect(datas.handler).toHaveBeenCalledWith("1");
    expect(datas.handler).toHaveBeenCalledTimes(1);
    const copyItemElementAfterClick = canvas.queryByText("コピー");
    expect(copyItemElementAfterClick).toBeNull();
  },
};

const UserMessageNodeContextMenuDeleteItemInvokeHandlerDatas = {
  handler: fn(),
};

export const UserMessageNodeContextMenuDeleteItemInvokeHandler: Story = {
  render: () => {
    const datas = UserMessageNodeContextMenuDeleteItemInvokeHandlerDatas;
    const nodeTypes = {
      UserMessageNode: UserMessageNode,
    };
    const windowRef = useRef<WindowElement>(null);
    const contextMenuRef = useRef<ContextMenuElement>(null);
    const nodesState = useNodesState([
      {
        id: "1",
        type: "UserMessageNode",
        data: {
          nodeId: "1",
          content: "UserMessageNode",
          windowElementRef: windowRef,
          contextMenuRef: contextMenuRef,
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
          <UserMessageDetailWindow
            nodeId="1"
            content="UserMessageDetailWindow"
            onConfirmButtonClick={action("onConfirmButtonClick")}
            ref={windowRef}
          />
        </WindowContext>
        <ContextMenuContext>
          <UserMessageNodeContextMenu
            nodeId="1"
            onCopyItemClick={action("onCopyItemClick")}
            onDeleteItemClick={datas.handler}
            windowElementRef={windowRef}
            ref={contextMenuRef}
          />
        </ContextMenuContext>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    // ユーザプロンプトノードのコンテキストメニューの削除項目をクリックすると、ハンドラーが呼ばれる。
    // Arrange
    const canvas = within(canvasElement);
    const datas = UserMessageNodeContextMenuDeleteItemInvokeHandlerDatas;
    datas.handler.mockClear();
    const node = canvas.getByText("UserMessageNode");
    node.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: true,
      }),
    );
    await wait();

    // Act
    const deleteItemElement = canvas.getByText("削除");
    deleteItemElement.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      }),
    );
    await wait();

    // Assert
    expect(datas.handler).toHaveBeenCalledWith("1");
    expect(datas.handler).toHaveBeenCalledTimes(1);
    const deleteItemElementAfterClick = canvas.queryByText("削除");
    expect(deleteItemElementAfterClick).toBeNull();
  },
};

export const UserMessageNodeContextMenuEditItemOpensDetailWindow: Story = {
  render: () => {
    const nodeTypes = {
      UserMessageNode: UserMessageNode,
    };
    const windowRef = useRef<WindowElement>(null);
    const contextMenuRef = useRef<ContextMenuElement>(null);
    const nodesState = useNodesState([
      {
        id: "1",
        type: "UserMessageNode",
        data: {
          nodeId: "1",
          content: "UserMessageNode",
          windowElementRef: windowRef,
          contextMenuRef: contextMenuRef,
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
          <UserMessageDetailWindow
            nodeId="1"
            content="UserMessageDetailWindow"
            onConfirmButtonClick={action("onConfirmButtonClick")}
            ref={windowRef}
          />
        </WindowContext>
        <ContextMenuContext>
          <UserMessageNodeContextMenu
            nodeId="1"
            onCopyItemClick={action("onCopyItemClick")}
            onDeleteItemClick={action("onDeleteItemClick")}
            windowElementRef={windowRef}
            ref={contextMenuRef}
          />
        </ContextMenuContext>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    // ユーザプロンプトノードのコンテキストメニューの編集項目をクリックすると、詳細ウィンドウが開く。
    // Arrange
    const canvas = within(canvasElement);
    const node = canvas.getByText("UserMessageNode");
    node.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: true,
      }),
    );
    await wait();

    // Act
    const editItemElement = canvas.getByText("編集");
    editItemElement.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      }),
    );
    await wait();

    // Assert
    const window = canvas.getByText("UserMessageDetailWindow");
    expect(window).toBeInTheDocument();
  },
};

const UserMessageDetailWindowConfirmButtonInvokeHandlerDatas = {
  handler: fn(),
};

export const UserMessageDetailWindowConfirmButtonInvokeHandler: Story = {
  render: () => {
    const datas = UserMessageDetailWindowConfirmButtonInvokeHandlerDatas;
    const nodeTypes = {
      UserMessageNode: UserMessageNode,
    };
    const windowRef = useRef<WindowElement>(null);
    const contextMenuRef = useRef<ContextMenuElement>(null);
    const nodesState = useNodesState([
      {
        id: "1",
        type: "UserMessageNode",
        data: {
          nodeId: "1",
          content: "UserMessageNode",
          windowElementRef: windowRef,
          contextMenuRef: contextMenuRef,
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
          <UserMessageDetailWindow
            nodeId="1"
            content="UserMessageDetailWindow"
            onConfirmButtonClick={datas.handler}
            ref={windowRef}
          />
        </WindowContext>
        <ContextMenuContext>
          <UserMessageNodeContextMenu
            nodeId="1"
            onCopyItemClick={action("onCopyItemClick")}
            onDeleteItemClick={action("onDeleteItemClick")}
            windowElementRef={windowRef}
            ref={contextMenuRef}
          />
        </ContextMenuContext>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    // ユーザプロンプト詳細ウィンドウのtextareaを編集後ユーザプロンプト詳細ウィンドウの確定ボタンを押すと、入力したテキストで対応するハンドラが呼び出される。
    // Arrange
    const canvas = within(canvasElement);
    const datas = UserMessageDetailWindowConfirmButtonInvokeHandlerDatas;
    datas.handler.mockClear();
    const node = canvas.getByText("UserMessageNode");
    node.dispatchEvent(
      new MouseEvent("dblclick", {
        bubbles: true,
        cancelable: true,
      }),
    );
    await wait();

    // Act
    const textarea = canvasElement.querySelector("textarea");
    if (!textarea) {
      throw new Error("textarea not found");
    }
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      "value",
    )?.set;
    if (!nativeInputValueSetter) {
      throw new Error("nativeInputValueSetter not found");
    }
    // NOTE: ReactでtextareaのonChangeイベントを発火するには、nativeのセッターでvalueを設定しdispatchEventする必要がある
    // NOTE: [ref](https://stackoverflow.com/questions/23892547/what-is-the-best-way-to-trigger-change-or-input-event-in-react-js)
    nativeInputValueSetter.call(textarea, "新しいテキスト");
    const inputEvent = new Event("input", { bubbles: true });
    textarea.dispatchEvent(inputEvent);
    await wait();

    const confirmButton = canvas.getByText("確定");
    confirmButton.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      }),
    );
    await wait();

    // Assert
    expect(datas.handler).toHaveBeenCalledWith("1", "新しいテキスト");
    expect(datas.handler).toHaveBeenCalledTimes(1);
  },
};
