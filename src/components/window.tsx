import type { ReactNode } from "react";
import type { UseWindowDispatcherType } from "@/hooks/use-window";
import { Layers, ListFilter, X } from "lucide-react";

const WINDOW_HEADER_HEIGHT = 32;
const RESIZE_HANDLE_HEIGHT = 16;

interface WindowProps {
  key: string; // 各ウィンドウに対し一意のstring
  title?: string;
  children?: ReactNode;
}

export function Window({ key, title, children }: WindowProps) {
  const position = {
    x: 100,
    y: 100,
  };
  const size = {
    width: 300,
    height: 200,
  };
  const zIndex = 100;

  const windowStyle = {
    position: "fixed" as const,
    top: position.y,
    left: position.x,
    width: size.width,
    height: size.height,
    zIndex,
  };
  const bodyContainerStyle = {
    height: size.height - WINDOW_HEADER_HEIGHT - RESIZE_HANDLE_HEIGHT,
  };
  return (
    <div
      key={key}
      style={windowStyle}
      className="bg-white border border-gray-300 rounded-lg shadow-2xl overflow-hidden"
    >
      {/* ヘッダー */}
      <div
        className={`window-header bg-gray-100 border-b border-gray-200 pl-2 pr-1 py-2 h-[${WINDOW_HEADER_HEIGHT}px] flex items-center justify-between cursor-move`}
      >
        <Layers size={16} />
        <h3 className="text-sm font-semibold">{title}</h3>
        {/* 閉じるボタン */}
        <button
          type="button"
          className="p-1 ml-auto hover:bg-red-100 hover:text-red-600 rounded transition-colors"
        >
          <X size={16} />
        </button>
      </div>
      <div style={bodyContainerStyle}>{children}</div>
      {/* リサイズハンドル */}
      <ListFilter
        size={RESIZE_HANDLE_HEIGHT}
        className="transform -rotate-45 absolute -bottom-1 -right-1"
      />
    </div>
  );
}

interface WindowContextProps {
  dispatcher: UseWindowDispatcherType;
  "z-index-min"?: number;
  "z-index-max"?: number;
  "default-window-position"?: {
    x: number;
    y: number;
  };
  "default-window-size"?: {
    width: number;
    height: number;
  };
  "width-min"?: number;
  "height-min"?: number;
  children?: ReactNode;
}

export function WindowContext({ children }: WindowContextProps) {
  return <>{children}</>;
}
