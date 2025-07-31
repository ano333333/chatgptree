import type { RefObject } from "react";
import { Window, type WindowElement } from "./window";

interface AIPromptDetailWindowProps {
  nodeId: string;
  content: string;
  recalculating: boolean;
  onConfirmButtonClick: (nodeId: string, content: string) => void;
  onRecalculateButtonClick: (nodeId: string) => void;
  onRecalculateCancelButtonClick: (nodeId: string) => void;
  ref: RefObject<WindowElement | null>;
}

export default function AIPromptDetailWindow({
  nodeId,
  content,
}: AIPromptDetailWindowProps) {
  return (
    <Window
      windowKey={`ai-prompt-detail-window-${nodeId}`}
      title="AIPrompt Detail"
    >
      <div>{content}</div>
    </Window>
  );
}
