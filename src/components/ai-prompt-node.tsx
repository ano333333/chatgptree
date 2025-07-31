import type { RefObject } from "react";
import type { WindowElement } from "./window";

interface AIPromptNodeProps {
  data: {
    nodeId: string;
    content: string;
    recalculating: boolean;
    onContextMenuCopyItemClick: (nodeId: string) => void;
    onContextMenuDeleteItemClick: (nodeId: string) => void;
    windowElementRef: RefObject<WindowElement | null>;
  };
}

export default function AIPromptNode({ data }: AIPromptNodeProps) {
  return (
    <div>
      <div>{data.content}</div>
    </div>
  );
}
