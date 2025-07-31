import { type MouseEvent, type RefObject, useState } from "react";
import type { WindowElement } from "./window";
import { Handle, Position } from "@xyflow/react";
import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuSeparator,
} from "./context-menu";

interface UserMessageNodeProps {
  data: {
    nodeId: string;
    content: string;
    onContextMenuCopyItemClick: (nodeId: string) => void;
    onContextMenuDeleteItemClick: (nodeId: string) => void;
    windowElementRef: RefObject<WindowElement | null>;
  };
}

export default function UserMessageNode({ data }: UserMessageNodeProps) {
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
        className="px-4 py-3 rounded-lg border-2 min-w-[300px] max-w-[400px] relative shadow-lg"
        style={{
          borderColor: "#3b82f6",
          backgroundColor: "#dbeafe",
        }}
        onDoubleClick={onNodeDoubleClick}
        onContextMenu={onNodeRightClick}
      >
        <Handle type="target" position={Position.Top} />
        <div className="text-sm text-gray-800">
          <p>{data.content}</p>
        </div>
        <Handle type="source" position={Position.Bottom} />
      </div>
      {contextMenuPosition && (
        <div className="static">
          <UserMessageNodeContextMenu
            nodeId={data.nodeId}
            screenPosition={contextMenuPosition}
            onContextMenuCopyItemClick={onContextMenuCopyItemClick}
            onContextMenuDeleteItemClick={onContextMenuDeleteItemClick}
            onContextMenuEditItemClick={onContextMenuEditItemClick}
          />
        </div>
      )}
    </>
  );
}

interface UserMessageNodeContextMenuProps {
  nodeId: string;
  screenPosition: { x: number; y: number };
  onContextMenuCopyItemClick: () => void;
  onContextMenuDeleteItemClick: () => void;
  onContextMenuEditItemClick: () => void;
}

function UserMessageNodeContextMenu({
  nodeId,
  screenPosition,
  onContextMenuCopyItemClick,
  onContextMenuDeleteItemClick,
  onContextMenuEditItemClick,
}: UserMessageNodeContextMenuProps) {
  return (
    <ContextMenu initialPosition={screenPosition}>
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
