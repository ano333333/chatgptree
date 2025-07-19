import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type MouseEvent,
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
  setWindowState: UseWindowDispatcherType["setWindowState"];
}>({
  getWindowState: () => {
    throw new Error("getWindowState is not implemented");
  },
  setWindowState: () => {
    throw new Error("setWindowState is not implemented");
  },
});

export function Window({ windowKey, title, children }: WindowProps) {
  const keyRef = useRef(windowKey);
  const { getWindowState, setWindowState } = useContext(innerWindowContext);

  const prevState = useRef(getWindowState(keyRef.current));
  if (prevState.current !== getWindowState(keyRef.current)) {
    prevState.current = getWindowState(keyRef.current);
  }
  const { open, zIndex, isFocused, position, size } = getWindowState(
    keyRef.current,
  );

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

  const windowOnClick = (e: MouseEvent<HTMLDivElement>) => {
    setWindowState(keyRef.current, {
      open: true,
    });
    e.stopPropagation();
  };

  const closeButtonOnClick = (e: MouseEvent<HTMLButtonElement>) => {
    setWindowState(keyRef.current, {
      open: false,
    });
    e.stopPropagation();
  };

  // TODO: getWindowState(keyRef.current)の結果とchildrenをdependentsとするuseMemoを使う
  return (
    <>
      {open && (
        <div
          key={windowKey}
          style={windowStyle}
          className="bg-white border border-gray-300 rounded-lg shadow-2xl overflow-hidden"
          onClick={windowOnClick}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
          onMouseMove={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          onKeyUp={(e) => e.stopPropagation()}
        >
          {/* ヘッダー */}
          <div
            className={`window-header bg-gray-100 border-b border-gray-200 pl-2 pr-1 py-2 h-[${WINDOW_HEADER_HEIGHT}px] flex items-center justify-between cursor-move`}
          >
            {isFocused && <Layers size={16} />}
            <h3 className="text-sm font-semibold"> {title}</h3>
            {/* 閉じるボタン */}
            <button
              type="button"
              aria-label="close-window"
              onClick={closeButtonOnClick}
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
  "z-index-min": zIndexMin,
  "z-index-max": zIndexMax,
  "default-window-position": defaultWindowPosition,
  "default-window-size": defaultWindowSize,
  children,
}: WindowContextProps) {
  console.info("WindowContext");
  const {
    setZIndexMin,
    setZIndexMax,
    setDefaultWindowPosition,
    setDefaultWindowSize,
    getWindowState,
    setWindowState,
  } = dispatcher;
  const setZIndexMinRef = useRef(setZIndexMin);
  const setZIndexMaxRef = useRef(setZIndexMax);
  const setDefaultWindowPositionRef = useRef(setDefaultWindowPosition);
  const setDefaultWindowSizeRef = useRef(setDefaultWindowSize);

  const initialZIndexMin = useRef(zIndexMin);
  const initialZIndexMax = useRef(zIndexMax);
  const initialDefaultWindowPosition = useRef(defaultWindowPosition);
  const initialDefaultWindowSize = useRef(defaultWindowSize);

  useEffect(() => {
    if (initialZIndexMin.current) {
      setZIndexMinRef.current(initialZIndexMin.current);
    }
    if (initialZIndexMax.current) {
      setZIndexMaxRef.current(initialZIndexMax.current);
    }
    if (initialDefaultWindowPosition.current) {
      setDefaultWindowPositionRef.current(initialDefaultWindowPosition.current);
    }
    if (initialDefaultWindowSize.current) {
      setDefaultWindowSizeRef.current(initialDefaultWindowSize.current);
    }
  }, []);

  return (
    <innerWindowContext.Provider value={{ getWindowState, setWindowState }}>
      {children}
    </innerWindowContext.Provider>
  );
}
