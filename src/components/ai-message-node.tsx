import { useState, type MouseEvent, type RefObject } from "react";
import type { WindowElement } from "./window";
import { Hourglass } from "lucide-react";
import { Handle, Position } from "@xyflow/react";
import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuSeparator,
} from "./context-menu";

interface AIMessageNodeProps {
  data: {
    nodeId: string;
    content: string;
    recalculating: boolean;
    onContextMenuCopyItemClick: (nodeId: string) => void;
    onContextMenuDeleteItemClick: (nodeId: string) => void;
    windowElementRef: RefObject<WindowElement | null>;
  };
}

export default function AIMessageNode({ data }: AIMessageNodeProps) {
  const [contextMenuPosition, setContextMenuPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const onNodeDoubleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    data.windowElementRef.current?.setWindowState({ open: true });
  };
  const onNodeRightClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    // FIXME: 現状のContextMenuの位置指定基準(親要素)に合わせる
    // FIXME: ContextMenuをビューポート基準で設定可能になったら、e.clientX, e.clientYをそのまま使う
    const targetPos = (e.target as HTMLElement).getBoundingClientRect();
    setContextMenuPosition({
      x: e.clientX - targetPos.left,
      y: e.clientY - targetPos.top,
    });
  };
  const onContextMenuCopyItemClick = () => {
    data.onContextMenuCopyItemClick(data.nodeId);
    setContextMenuPosition(null);
  };
  const onContextMenuDeleteItemClick = () => {
    data.onContextMenuDeleteItemClick(data.nodeId);
    setContextMenuPosition(null);
  };
  const onContextMenuEditItemClick = () => {
    // TODO: ノードの位置を取得して、ビューポート基準でポップアップウィンドウを開く
    data.windowElementRef.current?.setWindowState({ open: true });
    setContextMenuPosition(null);
  };

  return (
    <>
      <div
        className={
          "px-4 py-3 rounded-lg border-2 min-w-[300px] max-w-[500px] relative shadow-lg"
        }
        style={{
          borderColor: "#6b7280",
          backgroundColor: "#f3f4f6",
        }}
        onDoubleClick={onNodeDoubleClick}
        onContextMenu={onNodeRightClick}
      >
        <Handle type="target" position={Position.Top} />
        {/* 再計算中のオーバーレイ */}
        {data.recalculating && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-30 rounded-lg">
            <Hourglass
              size={32}
              className="text-gray-400 opacity-50 animate-pulse"
            />
          </div>
        )}
        <div
          className={`text-sm text-gray-800 ${data.recalculating ? "opacity-30" : ""}`}
        >
          {data.content}
        </div>
        <Handle type="source" position={Position.Bottom} />
        {contextMenuPosition && (
          <AIPromptNodeContextMenu
            nodeId={data.nodeId}
            screenPosition={contextMenuPosition}
            onContextMenuCopyItemClick={onContextMenuCopyItemClick}
            onContextMenuDeleteItemClick={onContextMenuDeleteItemClick}
            onContextMenuEditItemClick={onContextMenuEditItemClick}
          />
        )}
      </div>
    </>
  );
}

interface AIPromptNodeContextMenuProps {
  nodeId: string;
  screenPosition: { x: number; y: number };
  onContextMenuCopyItemClick: () => void;
  onContextMenuDeleteItemClick: () => void;
  onContextMenuEditItemClick: () => void;
}

function AIPromptNodeContextMenu({
  nodeId,
  screenPosition,
  onContextMenuCopyItemClick,
  onContextMenuDeleteItemClick,
  onContextMenuEditItemClick,
}: AIPromptNodeContextMenuProps) {
  return (
    <ContextMenu screenPosition={screenPosition}>
      <ContextMenuItem
        key={`${nodeId}-contextmenu-copy`}
        onClick={onContextMenuCopyItemClick}
      >
        コピー
      </ContextMenuItem>
      <ContextMenuItem
        key={`${nodeId}-contextmenu-delete`}
        onClick={onContextMenuDeleteItemClick}
      >
        削除
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem
        key={`${nodeId}-contextmenu-edit`}
        onClick={onContextMenuEditItemClick}
      >
        編集
      </ContextMenuItem>
    </ContextMenu>
  );
}
