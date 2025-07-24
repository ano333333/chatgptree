import type {
  SetWindowStateArgsType,
  WindowState,
} from "@/components/window/types";
import { useRef, type DragEvent } from "react";
import { WINDOW_HEADER_HEIGHT } from "../constants";
import { Layers } from "lucide-react";
import { CloseButton } from "./close-button";

interface HeaderProps {
  windowState: WindowState;
  setWindowState: (state: SetWindowStateArgsType) => void;
  title: string;
}

/**
 * ウィンドウのヘッダー
 * @param windowState
 * @param setWindowState
 * @param title
 */
export function Header({ windowState, setWindowState, title }: HeaderProps) {
  const { isFocused } = windowState;

  /** ドラッグの状況 */
  const headerDraggingState = useRef<{
    /** ドラッグ開始時にクリックした点の座標(ページ座標) */
    initialClickedPoint: {
      x: number;
      y: number;
    };
    /** ドラッグ開始時のウィンドウの座標 */
    initialWindowPosition: {
      x: number;
      y: number;
    };
  } | null>(null);

  const headerOnDragStart = (e: DragEvent<HTMLDivElement>) => {
    if (headerDraggingState.current) {
      return;
    }
    headerDraggingState.current = {
      initialClickedPoint: {
        x: e.pageX,
        y: e.pageY,
      },
      initialWindowPosition: {
        x: windowState.position.x,
        y: windowState.position.y,
      },
    };
  };
  const updateWindowPositionOnHeaderDrag = (e: DragEvent<HTMLDivElement>) => {
    if (!headerDraggingState.current) {
      return;
    }
    const deltaX = e.pageX - headerDraggingState.current.initialClickedPoint.x;
    const deltaY = e.pageY - headerDraggingState.current.initialClickedPoint.y;
    setWindowState({
      open: true,
      position: {
        x: headerDraggingState.current.initialWindowPosition.x + deltaX,
        y: headerDraggingState.current.initialWindowPosition.y + deltaY,
      },
    });
  };
  const headerOnDrag = (e: DragEvent<HTMLDivElement>) => {
    updateWindowPositionOnHeaderDrag(e);
  };
  const headerOnDragEnd = (e: DragEvent<HTMLDivElement>) => {
    updateWindowPositionOnHeaderDrag(e);
    headerDraggingState.current = null;
  };

  return (
    <div
      draggable={true}
      onDragStart={headerOnDragStart}
      onDrag={headerOnDrag}
      onDragEnd={headerOnDragEnd}
      className={`window-header bg-gray-100 border-b border-gray-200 pl-2 pr-1 py-2 h-[${WINDOW_HEADER_HEIGHT}px] flex items-center justify-between cursor-move`}
    >
      {isFocused && <Layers size={16} />}
      <h3 className="text-sm font-semibold">{title}</h3>
      {/* 閉じるボタン */}
      <CloseButton setWindowState={setWindowState} />
    </div>
  );
}
