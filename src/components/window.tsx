import {
  useEffect,
  useRef,
  type MouseEvent,
  type DragEvent,
  type ReactNode,
  useMemo,
  useCallback,
  type RefObject,
} from "react";
import { Layers, ListFilter, X } from "lucide-react";
import { createContext, useContextSelector } from "use-context-selector";

const WINDOW_HEADER_HEIGHT = 32;
const RESIZE_HANDLE_HEIGHT = 16;

const WINDOW_WIDTH_MIN = 50;
const WINDOW_HEIGHT_MIN = 50;

type SetWindowStateArgsType =
  | {
      open: false;
    }
  | {
      open: true;
      position?: {
        x: number;
        y: number;
      };
      size?: {
        width: number;
        height: number;
      };
    };
export type WindowElement = {
  style: CSSStyleDeclaration | undefined;
  className: string | undefined;
  setWindowState: (state: SetWindowStateArgsType) => void;
};
interface WindowProps {
  windowKey: string; // 各ウィンドウに対し一意のstring
  title?: string;
  children?: ReactNode;
  ref?: RefObject<WindowElement | null>;
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

export function Window({ windowKey, title, children, ref }: WindowProps) {
  const keyRef = useRef(windowKey);
  const { windowState, setWindowState } = useContextSelector(
    innerWindowContext,
    (ctx) => ({
      windowState: ctx.getWindowState(windowKey),
      setWindowState: ctx.setWindowState,
    }),
  );

  const prevState = useRef(windowState);
  if (prevState.current !== windowState) {
    prevState.current = windowState;
  }

  const windowStyle = useMemo(() => {
    return {
      position: "fixed" as const,
      top: windowState.position.y,
      left: windowState.position.x,
      width: windowState.size.width,
      height: windowState.size.height,
      zIndex: windowState.zIndex,
    };
  }, [windowState]);
  const bodyContainerStyle = useMemo(() => {
    return {
      height:
        windowState.size.height - WINDOW_HEADER_HEIGHT - RESIZE_HANDLE_HEIGHT,
    };
  }, [windowState]);

  const windowOnClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      setWindowState(keyRef.current, {
        open: true,
      });
      e.stopPropagation();
    },
    [setWindowState],
  );

  const element = useMemo(() => {
    return (
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
        <WindowHeader title={title ?? ""} windowKey={windowKey} />
        {/* リサイズハンドル */}
        <ResizeHandle windowKey={windowKey} />
        {/* ウィンドウ内容 */}
        <div style={bodyContainerStyle}>{children}</div>
      </div>
    );
  }, [
    windowKey,
    windowStyle,
    bodyContainerStyle,
    children,
    windowOnClick,
    title,
  ]);

  return <>{windowState.open && element}</>;
}

interface WindowContextProps {
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

interface WindowHeaderProps {
  title: string;
  windowKey: string;
}

function WindowHeader({ title, windowKey }: WindowHeaderProps) {
  const { windowState, setWindowState } = useContextSelector(
    innerWindowContext,
    (ctx) => ({
      windowState: ctx.getWindowState(windowKey),
      setWindowState: ctx.setWindowState,
    }),
  );
  const keyRef = useRef(windowKey);
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
    setWindowState(keyRef.current, {
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

  const closeButtonOnClick = (e: MouseEvent<HTMLButtonElement>) => {
    setWindowState(keyRef.current, {
      open: false,
    });
    e.stopPropagation();
  };

  return (
    <div
      onMouseDown={() => {
        console.info("headerOnMouseDown");
      }}
      draggable={true}
      onDragStart={headerOnDragStart}
      onDrag={headerOnDrag}
      onDragEnd={headerOnDragEnd}
      className={`window-header bg-gray-100 border-b border-gray-200 pl-2 pr-1 py-2 h-[${WINDOW_HEADER_HEIGHT}px] flex items-center justify-between cursor-move`}
    >
      {isFocused && <Layers size={16} />}
      <h3 className="text-sm font-semibold">{title}</h3>
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
  );
}

interface ResizeHandleProps {
  windowKey: string;
}

function ResizeHandle({ windowKey }: ResizeHandleProps) {
  const { windowState, setWindowState } = useContextSelector(
    innerWindowContext,
    (ctx) => ({
      windowState: ctx.getWindowState(windowKey),
      setWindowState: ctx.setWindowState,
    }),
  );
  const keyRef = useRef(windowKey);
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
    setWindowState(keyRef.current, windowState);
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
