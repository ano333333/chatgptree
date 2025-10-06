import type { RefObject } from "react";
import {
  ContextMenu,
  type ContextMenuElement,
  ContextMenuItem,
  ContextMenuSeparator,
} from "./context-menu";
import type { WindowElement } from "./window";

interface UserMessageNodeContextMenuProps {
  nodeId: string;
  onCopyItemClick: (nodeId: string) => void;
  onDeleteItemClick: (nodeId: string) => void;
  windowElementRef: RefObject<WindowElement | null>;
  ref: RefObject<ContextMenuElement | null>;
}

export default function UserMessageNodeContextMenu({
  nodeId,
  onCopyItemClick,
  onDeleteItemClick,
  windowElementRef,
  ref,
}: UserMessageNodeContextMenuProps) {
  const closeContextMenu = () => {
    ref.current?.setContextMenuState({ status: "close" });
  };
  return (
    <ContextMenu ref={ref}>
      <ContextMenuItem
        key={`${nodeId}-contextmenu-copy`}
        onClick={() => {
          onCopyItemClick(nodeId);
          closeContextMenu();
        }}
      >
        コピー
      </ContextMenuItem>
      <ContextMenuItem
        key={`${nodeId}-contextmenu-delete`}
        onClick={() => {
          onDeleteItemClick(nodeId);
          closeContextMenu();
        }}
      >
        削除
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem
        key={`${nodeId}-contextmenu-edit`}
        onClick={(e) => {
          e.preventDefault();
          windowElementRef.current?.setWindowState({ open: true });
          closeContextMenu();
        }}
      >
        編集
      </ContextMenuItem>
    </ContextMenu>
  );
}
