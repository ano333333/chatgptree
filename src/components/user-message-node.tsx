import { Handle, Position } from "@xyflow/react";
import type { MouseEvent, RefObject } from "react";
import type { ContextMenuElement } from "./context-menu";
import type { WindowElement } from "./window";

interface UserMessageNodeProps {
  data: {
    nodeId: string;
    content: string;
    contextMenuRef: RefObject<ContextMenuElement | null>;
    windowElementRef: RefObject<WindowElement | null>;
  };
}

export default function UserMessageNode({ data }: UserMessageNodeProps) {
  const onNodeDoubleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    data.windowElementRef.current?.setWindowState({ open: true });
  };
  const onNodeRightClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    data.contextMenuRef.current?.setContextMenuState({
      status: "open",
      position: {
        x: e.clientX,
        y: e.clientY,
      },
    });
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
    </>
  );
}
