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
import { useState } from "react";

interface BodyProps {
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
  onClickCreateUserPrompt,
  onClickCreateSystemPrompt,
  onClickUndo,
  onClickRedo,
  onClickPaste,
}: BodyProps) {
  const [contextMenuState, setContextMenuState] = useState<ContextMenuState>({
    status: "close",
  });

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
}

function BodyContextMenu({
  screenPosition,
  onClickCreateUserPrompt,
  onClickCreateSystemPrompt,
  onClickUndo,
  onClickRedo,
  onClickPaste,
}: BodyContextMenuProps) {
  return (
    <ContextMenu screenPosition={screenPosition}>
      <ContextMenuSubMenuRoot>
        <ContextMenuSubMenuTrigger>作成</ContextMenuSubMenuTrigger>
        <ContextMenuSubMenu>
          <ContextMenuItem onClick={onClickCreateUserPrompt}>
            ユーザープロンプト
          </ContextMenuItem>
          <ContextMenuItem onClick={onClickCreateSystemPrompt}>
            システムプロンプト
          </ContextMenuItem>
        </ContextMenuSubMenu>
      </ContextMenuSubMenuRoot>
      <ContextMenuSeparator />
      <ContextMenuItem onClick={onClickUndo}>Undo</ContextMenuItem>
      <ContextMenuItem onClick={onClickRedo}>Redo</ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem onClick={onClickPaste}>ペースト</ContextMenuItem>
    </ContextMenu>
  );
}
