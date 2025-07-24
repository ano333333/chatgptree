import type { WindowState } from "@/components/window/types";
import type { SetWindowStateArgsType } from "@/components/window/types";
import { useRef, type DragEvent } from "react";
import { RESIZE_HANDLE_HEIGHT } from "../constants";
import { ListFilter } from "lucide-react";

interface ResizeHandleProps {
  windowState: WindowState;
  minimumSize: {
    width: number;
    height: number;
  };
  setWindowState: (state: SetWindowStateArgsType) => void;
}

/**
 * ウィンドウ右下のリサイズハンドル
 * @param windowState
 * @param minimumSize
 * @param setWindowState
 */
export function ResizeHandle({
  windowState,
  minimumSize,
  setWindowState,
}: ResizeHandleProps) {
  const resizeDraggingState = useRef<{
    /** ドラッグ開始時にクリックした点の座標(クライアント座標) */
    // NOTE: テスト(drag.ts、excape-cancel.ts)でevent detailのpageX、pageYを設定しても、受け取り側ではpageX、pageYがそれぞれclientX、clientYになっている。差分計算はpageとclientどちらでも良いため、clientを使う。
    initialClickedPoint: {
      x: number;
      y: number;
    };
    /** ドラッグ開始時のウィンドウのサイズ */
    initialWindowSize: {
      width: number;
      height: number;
    };
  } | null>(null);

  const resizeOnDragStart = (e: DragEvent<HTMLDivElement>) => {
    if (resizeDraggingState.current) {
      return;
    }
    resizeDraggingState.current = {
      initialClickedPoint: {
        x: e.clientX,
        y: e.clientY,
      },
      initialWindowSize: windowState.size,
    };
  };
  const updateWindowSizeOnResizeDrag = (e: DragEvent<HTMLDivElement>) => {
    if (!resizeDraggingState.current) {
      return;
    }
    const deltaX =
      e.clientX - resizeDraggingState.current.initialClickedPoint.x;
    const deltaY =
      e.clientY - resizeDraggingState.current.initialClickedPoint.y;
    const windowState = {
      open: true,
      size: {
        width: resizeDraggingState.current.initialWindowSize.width + deltaX,
        height: resizeDraggingState.current.initialWindowSize.height + deltaY,
      },
    };
    if (windowState.size.width < minimumSize.width) {
      windowState.size.width = minimumSize.width;
    }
    if (windowState.size.height < minimumSize.height) {
      windowState.size.height = minimumSize.height;
    }
    setWindowState(windowState);
  };
  const resizeOnDrag = (e: DragEvent<HTMLDivElement>) => {
    updateWindowSizeOnResizeDrag(e);
  };
  const resizeOnDragEnd = (e: DragEvent<HTMLDivElement>) => {
    updateWindowSizeOnResizeDrag(e);
    resizeDraggingState.current = null;
  };

  return (
    <div
      className="absolute -bottom-1 -right-1 cursor-se-resize"
      draggable={true}
      onDragStart={resizeOnDragStart}
      onDrag={resizeOnDrag}
      onDragEnd={resizeOnDragEnd}
      aria-label="resize-window"
    >
      <ListFilter
        size={RESIZE_HANDLE_HEIGHT}
        className="transform -rotate-45"
      />
    </div>
  );
}
