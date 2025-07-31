import {
  ContextMenu,
  ContextMenuContext,
  type ContextMenuElement,
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
import { useRef, useState, type MouseEvent } from "react";

/**
 * ボディ
 * @param props.onClickCreateUserPrompt - ボディコンテキストメニューのユーザープロンプト作成ボタンのハンドラー
 * @param props.onClickCreateSystemPrompt - ボディコンテキストメニューのシステムプロンプト作成ボタンのハンドラー
 * @param props.onClickUndo - ボディコンテキストメニューのUndoボタンのハンドラー
 * @param props.onClickRedo - ボディコンテキストメニューのRedoボタンのハンドラー
 * @param props.onClickPaste - ボディコンテキストメニューのペーストボタンのハンドラー
 */
interface BodyProps {
  onClickCreateUserPrompt?: () => void;
  onClickCreateSystemPrompt?: () => void;
  onClickUndo?: () => void;
  onClickRedo?: () => void;
  onClickPaste?: () => void;
}

export default function Body({
  onClickCreateUserPrompt,
  onClickCreateSystemPrompt,
  onClickUndo,
  onClickRedo,
  onClickPaste,
}: BodyProps) {
  const [contextMenuPosition, setContextMenuPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const onPaneContextMenu = ({
    clientX,
    clientY,
  }: {
    clientX: number;
    clientY: number;
  }) => {
    setContextMenuPosition({ x: clientX, y: clientY });
  };
  const onPaneClick = () => {
    setContextMenuPosition(null);
  };

  return (
    <>
      <ReactFlowProvider>
        <Background gap={20} size={1} />
        <ReactFlow
          nodes={[]}
          edges={[]}
          onPaneContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onPaneContextMenu({
              clientX: e.clientX,
              clientY: e.clientY,
            });
          }}
          onPaneClick={onPaneClick}
        />
        <Controls className="bg-white border border-gray-200 rounded-lg shadow-sm" />
      </ReactFlowProvider>
      <ContextMenuContext>
        <BodyContextMenu
          position={contextMenuPosition}
          onClickCreateUserPrompt={onClickCreateUserPrompt}
          onClickCreateSystemPrompt={onClickCreateSystemPrompt}
          onClickUndo={onClickUndo}
          onClickRedo={onClickRedo}
          onClickPaste={onClickPaste}
        />
      </ContextMenuContext>
    </>
  );
}

interface BodyContextMenuProps {
  position: { x: number; y: number } | null;
  onClickCreateUserPrompt?: () => void;
  onClickCreateSystemPrompt?: () => void;
  onClickUndo?: () => void;
  onClickRedo?: () => void;
  onClickPaste?: () => void;
}

function BodyContextMenu({
  position,
  onClickCreateUserPrompt,
  onClickCreateSystemPrompt,
  onClickUndo,
  onClickRedo,
  onClickPaste,
}: BodyContextMenuProps) {
  const contextMenuRef = useRef<ContextMenuElement>(null);
  const prevPosition = useRef<{ x: number; y: number } | null>(null);
  if (prevPosition.current !== position) {
    if (position !== null) {
      contextMenuRef.current?.setContextMenuState({
        status: "open",
        position,
      });
    } else {
      contextMenuRef.current?.setContextMenuState({
        status: "close",
      });
    }
    prevPosition.current = position;
  }

  const stopPropagationAndInvoke = (handler?: () => void) => {
    return (e: MouseEvent) => {
      e.stopPropagation();
      handler?.();
      contextMenuRef.current?.setContextMenuState({
        status: "close",
      });
    };
  };

  return (
    <ContextMenu ref={contextMenuRef}>
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
