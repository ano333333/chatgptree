import AIPromptDetailWindow from "@/components/ai-prompt-detail-window";
import AIPromptNode from "@/components/ai-prompt-node";
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

const meta: Meta<typeof AIPromptNode> = {
  title: "Components/AIPromptNode/Test",
  component: AIPromptNode,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const AIPromptDetailWindowOpensOnAIPromptNodeDoubleClick: Story = {
  render: () => {
    const nodeTypes = {
      AIPromptNode: AIPromptNode,
    };
    const windowRef = useRef<WindowElement>(null);
    const nodesState = useNodesState([
      {
        id: "1",
        type: "AIPromptNode",
        data: {
          nodeId: "1",
          content: "AIPromptNode",
          recalculating: false,
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
          <AIPromptDetailWindow
            nodeId="1"
            content="AIPromptDetailWindow"
            recalculating={false}
            onConfirmButtonClick={action("onConfirmButtonClick")}
            onRecalculateButtonClick={action("onRecalculateButtonClick")}
            onRecalculateCancelButtonClick={action(
              "onRecalculateCancelButtonClick",
            )}
            ref={windowRef}
          />
        </WindowContext>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    // AIプロンプトノードをダブルクリックすると、AIPromptDetailWindowが開く。
    // Arrange
    const canvas = within(canvasElement);

    // Act
    const node = canvas.getByText("AIPromptNode");
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
    const window = canvas.getByText("AIPromptDetailWindow");
    expect(window).toBeInTheDocument();
  },
};

export const AIPromptNodeContextMenuOpensOnAIPromptNodeRightClick: Story = {
  render: () => {
    const nodeTypes = {
      AIPromptNode: AIPromptNode,
    };
    const windowRef = useRef<WindowElement>(null);
    const nodesState = useNodesState([
      {
        id: "1",
        type: "AIPromptNode",
        data: {
          nodeId: "1",
          content: "AIPromptNode",
          recalculating: false,
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
          <AIPromptDetailWindow
            nodeId="1"
            content="AIPromptDetailWindow"
            recalculating={false}
            onConfirmButtonClick={action("onConfirmButtonClick")}
            onRecalculateButtonClick={action("onRecalculateButtonClick")}
            onRecalculateCancelButtonClick={action(
              "onRecalculateCancelButtonClick",
            )}
            ref={windowRef}
          />
        </WindowContext>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    // AIプロンプトノードを右クリックすると、AIPromptDetailWindowが開く。
    // Arrange
    const canvas = within(canvasElement);

    // Act
    const node = canvas.getByText("AIPromptNode");
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

const AIPromptNodeContextMenuCopyItemInvokeHandlerDatas = {
  handler: fn(),
};

export const AIPromptNodeContextMenuCopyItemInvokeHandler: Story = {
  render: () => {
    const datas = AIPromptNodeContextMenuCopyItemInvokeHandlerDatas;
    const nodeTypes = {
      AIPromptNode: AIPromptNode,
    };
    const windowRef = useRef<WindowElement>(null);
    const nodesState = useNodesState([
      {
        id: "1",
        type: "AIPromptNode",
        data: {
          nodeId: "1",
          content: "AIPromptNode",
          recalculating: false,
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
          <AIPromptDetailWindow
            nodeId="1"
            content="AIPromptDetailWindow"
            recalculating={false}
            onConfirmButtonClick={action("onConfirmButtonClick")}
            onRecalculateButtonClick={action("onRecalculateButtonClick")}
            onRecalculateCancelButtonClick={action(
              "onRecalculateCancelButtonClick",
            )}
            ref={windowRef}
          />
        </WindowContext>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    // AIプロンプトノードのコンテキストメニューのコピー項目をクリックすると、ハンドラーが呼ばれる。
    // Arrange
    const canvas = within(canvasElement);
    const datas = AIPromptNodeContextMenuCopyItemInvokeHandlerDatas;
    datas.handler.mockClear();
    const node = canvas.getByText("AIPromptNode");
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

const AIPromptNodeContextMenuDeleteItemInvokeHandlerDatas = {
  handler: fn(),
};

export const AIPromptNodeContextMenuDeleteItemInvokeHandler: Story = {
  render: () => {
    const datas = AIPromptNodeContextMenuDeleteItemInvokeHandlerDatas;
    const nodeTypes = {
      AIPromptNode: AIPromptNode,
    };
    const windowRef = useRef<WindowElement>(null);
    const nodesState = useNodesState([
      {
        id: "1",
        type: "AIPromptNode",
        data: {
          nodeId: "1",
          content: "AIPromptNode",
          recalculating: false,
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
          <AIPromptDetailWindow
            nodeId="1"
            content="AIPromptDetailWindow"
            recalculating={false}
            onConfirmButtonClick={action("onConfirmButtonClick")}
            onRecalculateButtonClick={action("onRecalculateButtonClick")}
            onRecalculateCancelButtonClick={action(
              "onRecalculateCancelButtonClick",
            )}
            ref={windowRef}
          />
        </WindowContext>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    // AIプロンプトノードのコンテキストメニューの削除項目をクリックすると、ハンドラーが呼ばれる。
    // Arrange
    const canvas = within(canvasElement);
    const datas = AIPromptNodeContextMenuDeleteItemInvokeHandlerDatas;
    datas.handler.mockClear();
    const node = canvas.getByText("AIPromptNode");
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

export const AIPromptNodeContextMenuEditItemOpensDetailWindow: Story = {
  render: () => {
    const nodeTypes = {
      AIPromptNode: AIPromptNode,
    };
    const windowRef = useRef<WindowElement>(null);
    const nodesState = useNodesState([
      {
        id: "1",
        type: "AIPromptNode",
        data: {
          nodeId: "1",
          content: "AIPromptNode",
          recalculating: false,
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
          <AIPromptDetailWindow
            nodeId="1"
            content="AIPromptDetailWindow"
            recalculating={false}
            onConfirmButtonClick={action("onConfirmButtonClick")}
            onRecalculateButtonClick={action("onRecalculateButtonClick")}
            onRecalculateCancelButtonClick={action(
              "onRecalculateCancelButtonClick",
            )}
            ref={windowRef}
          />
        </WindowContext>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    // AIプロンプトノードのコンテキストメニューの編集項目をクリックすると、詳細ウィンドウが開く。
    // Arrange
    const canvas = within(canvasElement);
    const node = canvas.getByText("AIPromptNode");
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
    const window = canvas.getByText("AIPromptDetailWindow");
    expect(window).toBeInTheDocument();
  },
};

const AIPromptNodeRecalculatingChangesToTrueDatas = {
  setIsRecalculating: (() => {
    return;
  }) as (isRecalculating: boolean) => void,
};

export const AIPromptNodeShowsRecalculatingBackgroundWhenRecalculatingChangesToTrue: Story =
  {
    render: () => {
      const datas = AIPromptNodeRecalculatingChangesToTrueDatas;
      const nodeTypes = {
        AIPromptNode: AIPromptNode,
      };
      const windowRef = useRef<WindowElement>(null);
      const calcNodeState = (recalculating: boolean) => {
        return [
          {
            id: "1",
            type: "AIPromptNode",
            data: {
              nodeId: "1",
              content: "AIPromptNode",
              recalculating: recalculating,
              onContextMenuCopyItemClick: action("onContextMenuCopyItemClick"),
              onContextMenuDeleteItemClick: action(
                "onContextMenuDeleteItemClick",
              ),
              windowElementRef: windowRef,
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
              onNodesChange={onNodesChange}
            />
          </ReactFlowProvider>
          <WindowContext>
            <AIPromptDetailWindow
              nodeId="1"
              content="AIPromptDetailWindow"
              recalculating={false}
              onConfirmButtonClick={action("onConfirmButtonClick")}
              onRecalculateButtonClick={action("onRecalculateButtonClick")}
              onRecalculateCancelButtonClick={action(
                "onRecalculateCancelButtonClick",
              )}
              ref={windowRef}
            />
          </WindowContext>
        </div>
      );
    },
    play: async ({ canvasElement }) => {
      // AIプロンプトノードのpropsのrecalculatingがfalseからtrueに更新されると、ノードに更新中背景(svg要素)が表示される。
      // Arrange
      const datas = AIPromptNodeRecalculatingChangesToTrueDatas;
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

const AIPromptDetailWindowRecalculateButtonInvokeHandlerDatas = {
  handler: fn(),
};

export const AIPromptDetailWindowRecalculateButtonInvokeHandler: Story = {
  render: () => {
    const datas = AIPromptDetailWindowRecalculateButtonInvokeHandlerDatas;
    const nodeTypes = {
      AIPromptNode: AIPromptNode,
    };
    const windowRef = useRef<WindowElement>(null);
    const nodesState = useNodesState([
      {
        id: "1",
        type: "AIPromptNode",
        data: {
          nodeId: "1",
          content: "AIPromptNode",
          recalculating: false,
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
          <AIPromptDetailWindow
            nodeId="1"
            content="AIPromptDetailWindow"
            recalculating={false}
            onConfirmButtonClick={action("onConfirmButtonClick")}
            onRecalculateButtonClick={datas.handler}
            onRecalculateCancelButtonClick={action(
              "onRecalculateCancelButtonClick",
            )}
            ref={windowRef}
          />
        </WindowContext>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    // AIプロンプト詳細ウィンドウの再計算ボタンを押すと対応するハンドラが呼び出される。ウィンドウは閉じない。
    // Arrange
    const canvas = within(canvasElement);
    const datas = AIPromptDetailWindowRecalculateButtonInvokeHandlerDatas;
    datas.handler.mockClear();
    const node = canvas.getByText("AIPromptNode");
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
    const window = canvas.getByText("AIPromptDetailWindow");
    expect(window).toBeInTheDocument();
  },
};

export const AIPromptDetailWindowTextareaDisabledWhenRecalculatingIsTrue: Story =
  {
    render: () => {
      const nodeTypes = {
        AIPromptNode: AIPromptNode,
      };
      const windowRef = useRef<WindowElement>(null);
      const nodesState = useNodesState([
        {
          id: "1",
          type: "AIPromptNode",
          data: {
            nodeId: "1",
            content: "AIPromptNode",
            recalculating: false,
            onContextMenuCopyItemClick: action("onContextMenuCopyItemClick"),
            onContextMenuDeleteItemClick: action(
              "onContextMenuDeleteItemClick",
            ),
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
            <AIPromptDetailWindow
              nodeId="1"
              content="AIPromptDetailWindow"
              recalculating={true}
              onConfirmButtonClick={action("onConfirmButtonClick")}
              onRecalculateButtonClick={action("onRecalculateButtonClick")}
              onRecalculateCancelButtonClick={action(
                "onRecalculateCancelButtonClick",
              )}
              ref={windowRef}
            />
          </WindowContext>
        </div>
      );
    },
    play: async ({ canvasElement }) => {
      // AIプロンプト詳細ウィンドウのrecalculatingがtrueの場合、ウィンドウに1つだけ存在するtextareaがdisabledになる。
      // Arrange
      const canvas = within(canvasElement);
      const node = canvas.getByText("AIPromptNode");
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

const AIPromptDetailWindowCancelButtonInvokeHandlerDatas = {
  handler: fn(),
};

export const AIPromptDetailWindowCancelButtonInvokeHandler: Story = {
  render: () => {
    const datas = AIPromptDetailWindowCancelButtonInvokeHandlerDatas;
    const nodeTypes = {
      AIPromptNode: AIPromptNode,
    };
    const windowRef = useRef<WindowElement>(null);
    const nodesState = useNodesState([
      {
        id: "1",
        type: "AIPromptNode",
        data: {
          nodeId: "1",
          content: "AIPromptNode",
          recalculating: false,
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
          <AIPromptDetailWindow
            nodeId="1"
            content="AIPromptDetailWindow"
            recalculating={true}
            onConfirmButtonClick={action("onConfirmButtonClick")}
            onRecalculateButtonClick={action("onRecalculateButtonClick")}
            onRecalculateCancelButtonClick={datas.handler}
            ref={windowRef}
          />
        </WindowContext>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    // AIプロンプト詳細ウィンドウのrecalculatingがtrueの場合、再計算ボタンはなくキャンセルボタンが配置される。キャンセルボタンを押すと対応するハンドラが呼び出され、ウィンドウは閉じない。
    // Arrange
    const canvas = within(canvasElement);
    const datas = AIPromptDetailWindowCancelButtonInvokeHandlerDatas;
    datas.handler.mockClear();
    const node = canvas.getByText("AIPromptNode");
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
    const window = canvas.getByText("AIPromptDetailWindow");
    expect(window).toBeInTheDocument();
  },
};
