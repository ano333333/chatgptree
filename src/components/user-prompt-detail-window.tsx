import { useState, type RefObject } from "react";
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
  onConfirmButtonClick,
  ref,
}: UserPromptDetailWindowProps) {
  const [currentContent, setCurrentContent] = useState(content);
  return (
    <Window
      windowKey={`user-prompt-detail-window-${nodeId}`}
      title="User Prompt Detail"
      ref={ref}
    >
      <div className="flex flex-col m-2">
        <textarea
          value={currentContent}
          onChange={(e) => setCurrentContent(e.target.value)}
          className="flex-1 w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={() => {
              onConfirmButtonClick(currentContent);
              // FIXME: Window内部からref経由でsetWindowState({open: false})出来ていない
              ref.current?.setWindowState({ open: false });
            }}
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            確定
          </button>
        </div>
      </div>
    </Window>
  );
}
