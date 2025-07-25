import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSubMenu,
  ContextMenuSubMenuRoot,
  ContextMenuSubMenuTrigger,
} from "@/components/context-menu";
import {
  Background,
  Controls,
  ReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useState, type MouseEvent } from "react";

/**
 * ボディ
 * @param props.initialContextMenuState - ボディコンテキストメニューの初期状態(主にテスト時に使用)
 * @param props.onClickCreateUserPrompt - ボディコンテキストメニューのユーザープロンプト作成ボタンのハンドラー
 * @param props.onClickCreateSystemPrompt - ボディコンテキストメニューのシステムプロンプト作成ボタンのハンドラー
 * @param props.onClickUndo - ボディコンテキストメニューのUndoボタンのハンドラー
 * @param props.onClickRedo - ボディコンテキストメニューのRedoボタンのハンドラー
 * @param props.onClickPaste - ボディコンテキストメニューのペーストボタンのハンドラー
 */
interface BodyProps {
  // NOTE(#12): Storybook上での左クリックが`render()`した要素に届いていなかったので、
  // Storybookでは最初からボディコンテキストメニューを開いておく。
  initialContextMenuState?: ContextMenuState;
  onClickCreateUserPrompt?: () => void;
  onClickCreateSystemPrompt?: () => void;
  onClickUndo?: () => void;
  onClickRedo?: () => void;
  onClickPaste?: () => void;
}

type ContextMenuState =
  | {
      status: "open";
      position: { x: number; y: number };
    }
  | {
      status: "close";
    };

export default function Body({
  initialContextMenuState,
  onClickCreateUserPrompt,
  onClickCreateSystemPrompt,
  onClickUndo,
  onClickRedo,
  onClickPaste,
}: BodyProps) {
  const [contextMenuState, setContextMenuState] = useState<ContextMenuState>(
    initialContextMenuState ?? { status: "close" },
  );

  const onPaneContextMenu = ({
    clientX,
    clientY,
  }: {
    clientX: number;
    clientY: number;
  }) => {
    setContextMenuState({
      status: "open",
      position: { x: clientX, y: clientY },
    });
  };
  const onPaneClick = () => {
    setContextMenuState({ status: "close" });
  };

  return (
    <>
      {contextMenuState.status === "open" && (
        <BodyContextMenu
          screenPosition={contextMenuState.position}
          onClickCreateUserPrompt={onClickCreateUserPrompt}
          onClickCreateSystemPrompt={onClickCreateSystemPrompt}
          onClickUndo={onClickUndo}
          onClickRedo={onClickRedo}
          onClickPaste={onClickPaste}
          closeContextMenu={() => setContextMenuState({ status: "close" })}
        />
      )}
      <ReactFlowProvider>
        <ReactFlow
          nodes={[]}
          edges={[]}
          onPaneContextMenu={(e) => {
            e.preventDefault();
            onPaneContextMenu({
              clientX: e.clientX,
              clientY: e.clientY,
            });
          }}
          onPaneClick={onPaneClick}
        />
        <Background gap={20} size={1} />
        <Controls className="bg-white border border-gray-200 rounded-lg shadow-sm" />
      </ReactFlowProvider>
    </>
  );
}

interface BodyContextMenuProps {
  screenPosition: { x: number; y: number };
  onClickCreateUserPrompt?: () => void;
  onClickCreateSystemPrompt?: () => void;
  onClickUndo?: () => void;
  onClickRedo?: () => void;
  onClickPaste?: () => void;
  closeContextMenu: () => void;
}

function BodyContextMenu({
  screenPosition,
  onClickCreateUserPrompt,
  onClickCreateSystemPrompt,
  onClickUndo,
  onClickRedo,
  onClickPaste,
  closeContextMenu,
}: BodyContextMenuProps) {
  const stopPropagationAndInvoke = (handler?: () => void) => {
    return (e: MouseEvent) => {
      e.stopPropagation();
      handler?.();
      closeContextMenu();
    };
  };

  return (
    <ContextMenu screenPosition={screenPosition}>
      <ContextMenuSubMenuRoot>
        <ContextMenuSubMenuTrigger>作成</ContextMenuSubMenuTrigger>
        <ContextMenuSubMenu>
          <ContextMenuItem
            onClick={stopPropagationAndInvoke(onClickCreateUserPrompt)}
          >
            ユーザープロンプト
          </ContextMenuItem>
          <ContextMenuItem
            onClick={stopPropagationAndInvoke(onClickCreateSystemPrompt)}
          >
            システムプロンプト
          </ContextMenuItem>
        </ContextMenuSubMenu>
      </ContextMenuSubMenuRoot>
      <ContextMenuSeparator />
      <ContextMenuItem onClick={stopPropagationAndInvoke(onClickUndo)}>
        Undo
      </ContextMenuItem>
      <ContextMenuItem onClick={stopPropagationAndInvoke(onClickRedo)}>
        Redo
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem onClick={stopPropagationAndInvoke(onClickPaste)}>
        ペースト
      </ContextMenuItem>
    </ContextMenu>
  );
}
