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
import AIMessageDetailWindow from "@/components/ai-message-detail-window";
import AIMessageNode from "@/components/ai-message-node";
import AIPromptNodeContextMenu from "@/components/ai-message-node-context-menu";
import {
  ContextMenuContext,
  type ContextMenuElement,
} from "@/components/context-menu";
import { WindowContext, type WindowElement } from "@/components/window";
import { wait } from "../utils/wait";

const meta: Meta<typeof AIMessageNode> = {
  title: "Components/AIMessageNode/Test",
  component: AIMessageNode,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const AIMessageDetailWindowOpensOnAIMessageNodeDoubleClick: Story = {
  render: () => {
    const nodeTypes = {
      AIMessageNode: AIMessageNode,
    };
    const windowRef = useRef<WindowElement>(null);
    const contextMenuRef = useRef<ContextMenuElement>(null);
    const nodesState = useNodesState([
      {
        id: "1",
        type: "AIMessageNode",
        data: {
          nodeId: "1",
          content: "AIMessageNode",
          recalculating: false,
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
          <AIMessageDetailWindow
            nodeId="1"
            content="AIMessageDetailWindow"
            recalculating={false}
            onConfirmButtonClick={action("onConfirmButtonClick")}
            onRecalculateButtonClick={action("onRecalculateButtonClick")}
            onRecalculateCancelButtonClick={action(
              "onRecalculateCancelButtonClick",
            )}
            ref={windowRef}
          />
        </WindowContext>
        <ContextMenuContext>
          <AIPromptNodeContextMenu
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
    // AIプロンプトノードをダブルクリックすると、AIPromptDetailWindowが開く。
    // Arrange
    const canvas = within(canvasElement);

    // Act
    const node = canvas.getByText("AIMessageNode");
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
    const window = canvas.getByText("AIMessageDetailWindow");
    expect(window).toBeInTheDocument();
  },
};

export const AIMessageNodeContextMenuOpensOnAIMessageNodeRightClick: Story = {
  render: () => {
    const nodeTypes = {
      AIMessageNode: AIMessageNode,
    };
    const windowRef = useRef<WindowElement>(null);
    const contextMenuRef = useRef<ContextMenuElement>(null);
    const nodesState = useNodesState([
      {
        id: "1",
        type: "AIMessageNode",
        data: {
          nodeId: "1",
          content: "AIMessageNode",
          recalculating: false,
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
          <AIMessageDetailWindow
            nodeId="1"
            content="AIMessageDetailWindow"
            recalculating={false}
            onConfirmButtonClick={action("onConfirmButtonClick")}
            onRecalculateButtonClick={action("onRecalculateButtonClick")}
            onRecalculateCancelButtonClick={action(
              "onRecalculateCancelButtonClick",
            )}
            ref={windowRef}
          />
        </WindowContext>
        <ContextMenuContext>
          <AIPromptNodeContextMenu
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
    // AIプロンプトノードを右クリックすると、AIPromptDetailWindowが開く。
    // Arrange
    const canvas = within(canvasElement);

    // Act
    const node = canvas.getByText("AIMessageNode");
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

const AIMessageNodeContextMenuCopyItemInvokeHandlerDatas = {
  handler: fn(),
};

export const AIMessageNodeContextMenuCopyItemInvokeHandler: Story = {
  render: () => {
    const datas = AIMessageNodeContextMenuCopyItemInvokeHandlerDatas;
    const nodeTypes = {
      AIMessageNode: AIMessageNode,
    };
    const windowRef = useRef<WindowElement>(null);
    const contextMenuRef = useRef<ContextMenuElement>(null);
    const nodesState = useNodesState([
      {
        id: "1",
        type: "AIMessageNode",
        data: {
          nodeId: "1",
          content: "AIMessageNode",
          recalculating: false,
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
          <AIMessageDetailWindow
            nodeId="1"
            content="AIMessageDetailWindow"
            recalculating={false}
            onConfirmButtonClick={action("onConfirmButtonClick")}
            onRecalculateButtonClick={action("onRecalculateButtonClick")}
            onRecalculateCancelButtonClick={action(
              "onRecalculateCancelButtonClick",
            )}
            ref={windowRef}
          />
        </WindowContext>
        <ContextMenuContext>
          <AIPromptNodeContextMenu
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
    // AIプロンプトノードのコンテキストメニューのコピー項目をクリックすると、ハンドラーが呼ばれる。
    // Arrange
    const canvas = within(canvasElement);
    const datas = AIMessageNodeContextMenuCopyItemInvokeHandlerDatas;
    datas.handler.mockClear();
    const node = canvas.getByText("AIMessageNode");
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

const AIMessageNodeContextMenuDeleteItemInvokeHandlerDatas = {
  handler: fn(),
};

export const AIMessageNodeContextMenuDeleteItemInvokeHandler: Story = {
  render: () => {
    const datas = AIMessageNodeContextMenuDeleteItemInvokeHandlerDatas;
    const nodeTypes = {
      AIMessageNode: AIMessageNode,
    };
    const windowRef = useRef<WindowElement>(null);
    const contextMenuRef = useRef<ContextMenuElement>(null);
    const nodesState = useNodesState([
      {
        id: "1",
        type: "AIMessageNode",
        data: {
          nodeId: "1",
          content: "AIMessageNode",
          recalculating: false,
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
          <AIMessageDetailWindow
            nodeId="1"
            content="AIMessageDetailWindow"
            recalculating={false}
            onConfirmButtonClick={action("onConfirmButtonClick")}
            onRecalculateButtonClick={action("onRecalculateButtonClick")}
            onRecalculateCancelButtonClick={action(
              "onRecalculateCancelButtonClick",
            )}
            ref={windowRef}
          />
        </WindowContext>
        <ContextMenuContext>
          <AIPromptNodeContextMenu
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
    // AIプロンプトノードのコンテキストメニューの削除項目をクリックすると、ハンドラーが呼ばれる。
    // Arrange
    const canvas = within(canvasElement);
    const datas = AIMessageNodeContextMenuDeleteItemInvokeHandlerDatas;
    datas.handler.mockClear();
    const node = canvas.getByText("AIMessageNode");
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

export const AIMessageNodeContextMenuEditItemOpensDetailWindow: Story = {
  render: () => {
    const nodeTypes = {
      AIMessageNode: AIMessageNode,
    };
    const windowRef = useRef<WindowElement>(null);
    const contextMenuRef = useRef<ContextMenuElement>(null);
    const nodesState = useNodesState([
      {
        id: "1",
        type: "AIMessageNode",
        data: {
          nodeId: "1",
          content: "AIMessageNode",
          recalculating: false,
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
          <AIMessageDetailWindow
            nodeId="1"
            content="AIMessageDetailWindow"
            recalculating={false}
            onConfirmButtonClick={action("onConfirmButtonClick")}
            onRecalculateButtonClick={action("onRecalculateButtonClick")}
            onRecalculateCancelButtonClick={action(
              "onRecalculateCancelButtonClick",
            )}
            ref={windowRef}
          />
        </WindowContext>
        <ContextMenuContext>
          <AIPromptNodeContextMenu
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
    // AIプロンプトノードのコンテキストメニューの編集項目をクリックすると、詳細ウィンドウが開く。
    // Arrange
    const canvas = within(canvasElement);
    const node = canvas.getByText("AIMessageNode");
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
    const window = canvas.getByText("AIMessageDetailWindow");
    expect(window).toBeInTheDocument();
  },
};

const AIMessageNodeRecalculatingChangesToTrueDatas = {
  setIsRecalculating: (() => {
    return;
  }) as (isRecalculating: boolean) => void,
};

export const AIMessageNodeShowsRecalculatingBackgroundWhenRecalculatingChangesToTrue: Story =
  {
    render: () => {
      const datas = AIMessageNodeRecalculatingChangesToTrueDatas;
      const nodeTypes = {
        AIMessageNode: AIMessageNode,
      };
      const windowRef = useRef<WindowElement>(null);
      const contextMenuRef = useRef<ContextMenuElement>(null);
      const calcNodeState = (recalculating: boolean) => {
        return [
          {
            id: "1",
            type: "AIMessageNode",
            data: {
              nodeId: "1",
              content: "AIMessageNode",
              recalculating: recalculating,
              windowElementRef: windowRef,
              contextMenuRef: contextMenuRef,
            },
            position: { x: 100, y: 100 },
          },
        ];
      };
      const nodesState = useNodesState(calcNodeState(false));
      const nodes = nodesState[0];
      const setNodes = nodesState[1];
      const onNodesChange = nodesState[2];
      datas.setIsRecalculating = (isRecalculating: boolean) => {
        setNodes(calcNodeState(isRecalculating));
      };
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
            <AIMessageDetailWindow
              nodeId="1"
              content="AIMessageDetailWindow"
              recalculating={false}
              onConfirmButtonClick={action("onConfirmButtonClick")}
              onRecalculateButtonClick={action("onRecalculateButtonClick")}
              onRecalculateCancelButtonClick={action(
                "onRecalculateCancelButtonClick",
              )}
              ref={windowRef}
            />
          </WindowContext>
          <ContextMenuContext>
            <AIPromptNodeContextMenu
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
      // AIプロンプトノードのpropsのrecalculatingがfalseからtrueに更新されると、ノードに更新中背景(svg要素)が表示される。
      // Arrange
      const datas = AIMessageNodeRecalculatingChangesToTrueDatas;
      // classNameに"lucide-hourglass"を含む、canvasElementの子孫のsvg要素を取得する
      const findLucideHourglassSVGElement = () => {
        const svgElements = canvasElement.querySelectorAll("svg");
        return (
          Array.from(svgElements).find((svgElement) =>
            svgElement.classList.contains("lucide-hourglass"),
          ) ?? null
        );
      };
      const svgElementBeforeUpdate = findLucideHourglassSVGElement();
      expect(svgElementBeforeUpdate).not.toBeInTheDocument();

      // Act
      datas.setIsRecalculating(true);
      await wait();

      // Assert
      const svgElement = findLucideHourglassSVGElement();
      expect(svgElement).toBeInTheDocument();
    },
  };

const AIMessageDetailWindowRecalculateButtonInvokeHandlerDatas = {
  handler: fn(),
};

export const AIMessageDetailWindowRecalculateButtonInvokeHandler: Story = {
  render: () => {
    const datas = AIMessageDetailWindowRecalculateButtonInvokeHandlerDatas;
    const nodeTypes = {
      AIMessageNode: AIMessageNode,
    };
    const windowRef = useRef<WindowElement>(null);
    const contextMenuRef = useRef<ContextMenuElement>(null);
    const nodesState = useNodesState([
      {
        id: "1",
        type: "AIMessageNode",
        data: {
          nodeId: "1",
          content: "AIMessageNode",
          recalculating: false,
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
          <AIMessageDetailWindow
            nodeId="1"
            content="AIMessageDetailWindow"
            recalculating={false}
            onConfirmButtonClick={action("onConfirmButtonClick")}
            onRecalculateButtonClick={datas.handler}
            onRecalculateCancelButtonClick={action(
              "onRecalculateCancelButtonClick",
            )}
            ref={windowRef}
          />
        </WindowContext>
        <ContextMenuContext>
          <AIPromptNodeContextMenu
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
    // AIプロンプト詳細ウィンドウの再計算ボタンを押すと対応するハンドラが呼び出される。ウィンドウは閉じない。
    // Arrange
    const canvas = within(canvasElement);
    const datas = AIMessageDetailWindowRecalculateButtonInvokeHandlerDatas;
    datas.handler.mockClear();
    const node = canvas.getByText("AIMessageNode");
    node.dispatchEvent(
      new MouseEvent("dblclick", {
        bubbles: true,
        cancelable: true,
      }),
    );
    await wait();

    // Act
    const recalculateButton = canvas.getByText("再計算");
    recalculateButton.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      }),
    );

    // Assert
    expect(datas.handler).toHaveBeenCalledTimes(1);
    const window = canvas.getByText("AIMessageDetailWindow");
    expect(window).toBeInTheDocument();
  },
};

export const AIMessageDetailWindowTextareaDisabledWhenRecalculatingIsTrue: Story =
  {
    render: () => {
      const nodeTypes = {
        AIMessageNode: AIMessageNode,
      };
      const windowRef = useRef<WindowElement>(null);
      const contextMenuRef = useRef<ContextMenuElement>(null);
      const nodesState = useNodesState([
        {
          id: "1",
          type: "AIMessageNode",
          data: {
            nodeId: "1",
            content: "AIMessageNode",
            recalculating: false,
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
            <AIMessageDetailWindow
              nodeId="1"
              content="AIMessageDetailWindow"
              recalculating={true}
              onConfirmButtonClick={action("onConfirmButtonClick")}
              onRecalculateButtonClick={action("onRecalculateButtonClick")}
              onRecalculateCancelButtonClick={action(
                "onRecalculateCancelButtonClick",
              )}
              ref={windowRef}
            />
          </WindowContext>
          <ContextMenuContext>
            <AIPromptNodeContextMenu
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
      // AIプロンプト詳細ウィンドウのrecalculatingがtrueの場合、ウィンドウに1つだけ存在するtextareaがdisabledになる。
      // Arrange
      const canvas = within(canvasElement);
      const node = canvas.getByText("AIMessageNode");
      node.dispatchEvent(
        new MouseEvent("dblclick", {
          bubbles: true,
          cancelable: true,
        }),
      );
      await wait();

      // Assert
      const textarea = canvas.getByRole("textbox");
      expect(textarea).toHaveAttribute("readonly");
    },
  };

const AIMessageDetailWindowCancelButtonInvokeHandlerDatas = {
  handler: fn(),
};

export const AIMessageDetailWindowCancelButtonInvokeHandler: Story = {
  render: () => {
    const datas = AIMessageDetailWindowCancelButtonInvokeHandlerDatas;
    const nodeTypes = {
      AIMessageNode: AIMessageNode,
    };
    const windowRef = useRef<WindowElement>(null);
    const contextMenuRef = useRef<ContextMenuElement>(null);
    const nodesState = useNodesState([
      {
        id: "1",
        type: "AIMessageNode",
        data: {
          nodeId: "1",
          content: "AIMessageNode",
          recalculating: false,
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
          <AIMessageDetailWindow
            nodeId="1"
            content="AIMessageDetailWindow"
            recalculating={true}
            onConfirmButtonClick={action("onConfirmButtonClick")}
            onRecalculateButtonClick={action("onRecalculateButtonClick")}
            onRecalculateCancelButtonClick={datas.handler}
            ref={windowRef}
          />
        </WindowContext>
        <ContextMenuContext>
          <AIPromptNodeContextMenu
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
    // AIプロンプト詳細ウィンドウのrecalculatingがtrueの場合、再計算ボタンはなくキャンセルボタンが配置される。キャンセルボタンを押すと対応するハンドラが呼び出され、ウィンドウは閉じない。
    // Arrange
    const canvas = within(canvasElement);
    const datas = AIMessageDetailWindowCancelButtonInvokeHandlerDatas;
    datas.handler.mockClear();
    const node = canvas.getByText("AIMessageNode");
    node.dispatchEvent(
      new MouseEvent("dblclick", {
        bubbles: true,
        cancelable: true,
      }),
    );
    await wait();

    // Assert - 再計算ボタンが存在せずキャンセルボタンが配置されていることを確認
    const recalculateButton = canvas.queryByText("再計算");
    expect(recalculateButton).not.toBeInTheDocument();
    const cancelButton = canvas.getByText("キャンセル");
    expect(cancelButton).toBeInTheDocument();

    // Act
    cancelButton.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      }),
    );

    // Assert
    expect(datas.handler).toHaveBeenCalledTimes(1);
    const window = canvas.getByText("AIMessageDetailWindow");
    expect(window).toBeInTheDocument();
  },
};
