import type { SetWindowStateArgsType } from "@/components/window/types";
import { X } from "lucide-react";
import type { MouseEvent } from "react";

interface CloseButtonProps {
  setWindowState: (state: SetWindowStateArgsType) => void;
}

/**
 * ウィンドウを閉じるボタン
 * @param setWindowState
 */
export function CloseButton({ setWindowState }: CloseButtonProps) {
  const closeButtonOnClick = (e: MouseEvent<HTMLButtonElement>) => {
    setWindowState({
      open: false,
    });
    e.stopPropagation();
  };

  return (
    <button
      type="button"
      aria-label="close-window"
      onClick={closeButtonOnClick}
      className="p-1 ml-auto hover:bg-red-100 hover:text-red-600 rounded transition-colors"
    >
      <X size={16} />
    </button>
  );
}
