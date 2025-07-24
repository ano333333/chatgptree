import type { WindowState } from "@/components/window/types";
import type { SetWindowStateArgsType } from "@/components/window/types";
import { useRef, type DragEvent } from "react";
import {
  WINDOW_WIDTH_MIN,
  WINDOW_HEIGHT_MIN,
  RESIZE_HANDLE_HEIGHT,
} from "../constants";
import { ListFilter } from "lucide-react";

interface ResizeHandleProps {
  windowState: WindowState;
  setWindowState: (state: SetWindowStateArgsType) => void;
}

export function ResizeHandle({
  windowState,
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
    if (windowState.size.width < WINDOW_WIDTH_MIN) {
      windowState.size.width = WINDOW_WIDTH_MIN;
    }
    if (windowState.size.height < WINDOW_HEIGHT_MIN) {
      windowState.size.height = WINDOW_HEIGHT_MIN;
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
