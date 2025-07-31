import { useState, type RefObject } from "react";
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
  recalculating,
  onConfirmButtonClick,
  onRecalculateButtonClick,
  onRecalculateCancelButtonClick,
  ref,
}: AIPromptDetailWindowProps) {
  const [currentContent, setCurrentContent] = useState(content);
  const onRecalcOrCancelRecalcButtonOnClick = () => {
    if (recalculating) {
      onRecalculateCancelButtonClick(nodeId);
    } else {
      onRecalculateButtonClick(nodeId);
    }
  };
  return (
    <Window
      windowKey={`ai-prompt-detail-window-${nodeId}`}
      title="AIPrompt Detail"
      ref={ref}
    >
      <div className="flex flex-col m-2">
        {/* 上部のコントロール */}
        <div className="flex justify-end mb-2">
          <button
            type="button"
            onClick={onRecalcOrCancelRecalcButtonOnClick}
            disabled={recalculating}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              recalculating
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            {recalculating ? "再計算中" : "再計算"}
          </button>
        </div>

        {/* テキストエリア */}
        <textarea
          value={currentContent}
          onChange={(e) => setCurrentContent(e.target.value)}
          className={`flex-1 w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm ${
            recalculating ? "bg-gray-50 cursor-not-allowed" : ""
          }`}
          readOnly={recalculating}
        />

        {/* 下部のボタン */}
        <div className="flex justify-end space-x-2 mt-4">
          <button
            type="button"
            onClick={() => {
              onConfirmButtonClick(nodeId, currentContent);
              // FIXME: Window内部からref経由でsetWindowState({open: false})出来ていない
              ref.current?.setWindowState({ open: false });
            }}
            disabled={recalculating}
            className={`px-4 py-2 text-sm rounded-md transition-colors ${
              recalculating
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            確定
          </button>
        </div>
      </div>
    </Window>
  );
}
