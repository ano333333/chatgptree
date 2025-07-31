import type { RefObject } from "react";
import type { WindowElement } from "./window";

interface UserPromptNodeProps {
  data: {
    nodeId: string;
    content: string;
    onContextMenuCopyItemClick: (nodeId: string) => void;
    onContextMenuDeleteItemClick: (nodeId: string) => void;
    windowElementRef: RefObject<WindowElement | null>;
  };
}

export default function UserPromptNode({ data }: UserPromptNodeProps) {
  return <div>{data.content}</div>;
}
