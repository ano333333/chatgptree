import type { MouseEvent, RefObject } from "react";
import type { WindowElement } from "./window";
import { Hourglass } from "lucide-react";
import { Handle, Position } from "@xyflow/react";
import type { ContextMenuElement } from "./context-menu";

interface AIMessageNodeProps {
  data: {
    nodeId: string;
    content: string;
    recalculating: boolean;
    contextMenuRef: RefObject<ContextMenuElement | null>;
    windowElementRef: RefObject<WindowElement | null>;
  };
}

export default function AIMessageNode({ data }: AIMessageNodeProps) {
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
      </div>
    </>
  );
}
