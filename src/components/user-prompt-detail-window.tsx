import type { RefObject } from "react";
import { Window, type WindowElement } from "./window";

interface UserPromptDetailWindowProps {
  nodeId: string;
  content: string;
  onConfirmButtonClick: (content: string) => void;
  ref: RefObject<WindowElement | null>;
}

export default function UserPromptDetailWindow({
  content,
  nodeId,
}: UserPromptDetailWindowProps) {
  return (
    <Window
      windowKey={`user-prompt-detail-window-${nodeId}`}
      title="User Prompt Detail"
    >
      <div>{content}</div>
    </Window>
  );
}
