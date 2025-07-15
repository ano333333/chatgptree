import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import type { UseWindowDispatcherType } from "@/hooks/use-window";
import { Layers, ListFilter, X } from "lucide-react";

const WINDOW_HEADER_HEIGHT = 32;
const RESIZE_HANDLE_HEIGHT = 16;

interface WindowProps {
  windowKey: string; // 各ウィンドウに対し一意のstring
  title?: string;
  children?: ReactNode;
}

const innerWindowContext = createContext<{
  getWindowState: UseWindowDispatcherType["getWindowState"];
}>({
  getWindowState: () => {
    throw new Error("getWindowState is not implemented");
  },
});

export function Window({ windowKey, title, children }: WindowProps) {
  const keyRef = useRef(windowKey);
  const { getWindowState } = useContext(innerWindowContext);

  const { open, position, size } = getWindowState(keyRef.current);

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
  // TODO: getWindowState(keyRef.current)の結果とchildrenをdependentsとするuseMemoを使う
  return (
    <>
      {open && (
        <div
          key={windowKey}
          style={windowStyle}
          className="bg-white border border-gray-300 rounded-lg shadow-2xl overflow-hidden"
        >
          {/* ヘッダー */}
          <div
            className={`window-header bg-gray-100 border-b border-gray-200 pl-2 pr-1 py-2 h-[${WINDOW_HEADER_HEIGHT}px] flex items-center justify-between cursor-move`}
          >
            {isFocused && <Layers size={16} />}
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
      )}
    </>
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

/**
 * 各Windowの状態とその操作はuseWindowで持つ。
 * WindowContextはuseWindowからWindowへ状態のゲッターとイベントハンドラを渡す。
 */
export function WindowContext({
  dispatcher,
  "default-window-position": defaultWindowPosition,
  "default-window-size": defaultWindowSize,
  children,
}: WindowContextProps) {
  const {
    setZIndexMin,
    setZIndexMax,
    setDefaultWindowPosition,
    setDefaultWindowSize,
    getWindowState,
  } = dispatcher;
  const setZIndexMinRef = useRef(setZIndexMin);
  const setZIndexMaxRef = useRef(setZIndexMax);
  const setDefaultWindowPositionRef = useRef(setDefaultWindowPosition);
  const setDefaultWindowSizeRef = useRef(setDefaultWindowSize);

  useEffect(() => {
    if (defaultWindowPosition) {
      setDefaultWindowPositionRef.current(defaultWindowPosition);
    }
    if (defaultWindowSize) {
      setDefaultWindowSizeRef.current(defaultWindowSize);
    }
  }, [defaultWindowPosition, defaultWindowSize]);

  return (
    <innerWindowContext.Provider value={{ getWindowState }}>
      {children}
    </innerWindowContext.Provider>
  );
}
