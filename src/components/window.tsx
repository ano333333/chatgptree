import {
  useRef,
  type MouseEvent,
  type DragEvent,
  type ReactNode,
  useMemo,
  useCallback,
  type RefObject,
  useImperativeHandle,
  useState,
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

type WindowState = {
  open: boolean;
  zIndex: number;
  isFocused: boolean;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
};
const windowStatesContext = createContext<
  (key: string) => {
    windowState: WindowState;
    setWindowState: (state: SetWindowStateArgsType) => void;
  }
>(() => {
  throw new Error("windowStatesContext is not initialized");
});

export function Window({ windowKey, title, children, ref }: WindowProps) {
  const prevState = useRef<WindowState>({
    open: false,
    zIndex: 0,
    isFocused: false,
    position: { x: 0, y: 0 },
    size: { width: 0, height: 0 },
  });
  const { windowState, setWindowState } = useContextSelector(
    windowStatesContext,
    (ctx) => ctx(windowKey),
  );

  const divRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => ({
    style: divRef.current?.style,
    className: divRef.current?.className,
    setWindowState,
  }));

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
      setWindowState({
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
        ref={divRef}
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
 * 全Windowの状態と操作をWindowContextで管理する。
 * Windowは自身の状態と操作関数をuseContextSelectorでWindowContextから取得する。
 */
export function WindowContext({
  "z-index-min": zIndexMin,
  "z-index-max": zIndexMax,
  "default-window-position": defaultWindowPosition,
  "default-window-size": defaultWindowSize,
  children,
}: WindowContextProps) {
  const zIndexMinRef = useRef(zIndexMin ?? 1024);
  const zIndexMaxRef = useRef(zIndexMax ?? 2047);
  const defaultWindowPositionRef = useRef(
    defaultWindowPosition ?? { x: 0, y: 0 },
  );
  const defaultWindowSizeRef = useRef(
    defaultWindowSize ?? { width: 200, height: 200 },
  );
  const [windowStates, setWindowStates] = useState<Record<string, WindowState>>(
    {},
  );

  const contextProvider = useCallback(
    (key: string) => {
      const windowState = getWindowStateLogic(
        key,
        windowStates,
        zIndexMinRef.current,
        defaultWindowPositionRef.current,
        defaultWindowSizeRef.current,
      );
      const setWindowState = (state: SetWindowStateArgsType) => {
        setWindowStates((prevStates) =>
          setWindowStateLogic(
            key,
            state,
            prevStates,
            zIndexMinRef.current,
            zIndexMaxRef.current,
            defaultWindowPositionRef.current,
            defaultWindowSizeRef.current,
          ),
        );
      };
      return { windowState, setWindowState };
    },
    [windowStates],
  );

  return (
    <windowStatesContext.Provider value={contextProvider}>
      {children}
    </windowStatesContext.Provider>
  );
}

interface WindowHeaderProps {
  title: string;
  windowKey: string;
}

function WindowHeader({ title, windowKey }: WindowHeaderProps) {
  const { windowState, setWindowState } = useContextSelector(
    windowStatesContext,
    (ctx) => ctx(windowKey),
  );
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

  const closeButtonOnClick = (e: MouseEvent<HTMLButtonElement>) => {
    setWindowState({
      open: false,
    });
    e.stopPropagation();
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
    windowStatesContext,
    (ctx) => ctx(windowKey),
  );
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

function getWindowStateLogic(
  key: string,
  windowStates: Record<string, WindowState>,
  zIndexMin: number,
  defaultWindowPosition: { x: number; y: number },
  defaultWindowSize: { width: number; height: number },
) {
  return (
    windowStates[key] ?? {
      open: false,
      zIndex: zIndexMin,
      isFocused: false,
      position: { ...defaultWindowPosition },
      size: { ...defaultWindowSize },
    }
  );
}

function setWindowStateLogic(
  key: string,
  newState: SetWindowStateArgsType,
  prevStates: Record<string, WindowState>,
  zIndexMin: number,
  zIndexMax: number,
  defaultWindowPosition: { x: number; y: number },
  defaultWindowSize: { width: number; height: number },
) {
  const state = prevStates[key];
  // Windowのstateがない(新規に開く)場合
  if (!state) {
    return openWindowLogic(
      key,
      newState,
      prevStates,
      zIndexMin,
      zIndexMax,
      defaultWindowPosition,
      defaultWindowSize,
    );
  }
  // open -> open
  if (state.open && newState.open) {
    return reopenWindowLogic(key, prevStates, newState, zIndexMin, zIndexMax);
  }
  // open -> close
  if (state.open && !newState.open) {
    return closeWindowLogic(key, prevStates);
  }
  // close -> open
  if (!state.open && newState.open) {
    return openWindowLogic(
      key,
      newState,
      prevStates,
      zIndexMin,
      zIndexMax,
      defaultWindowPosition,
      defaultWindowSize,
    );
  }
  // close -> close
  return prevStates;
}

/**
 * 閉じているwindowを開く。新規に開く場合もこの関数を使用する。
 * @param key
 * @param newState
 * @param prevStates
 * @param zIndexMin
 * @param zIndexMax
 * @param defaultWindowPosition
 * @param defaultWindowSize
 * @returns 更新後のwindowStates
 */
function openWindowLogic(
  key: string,
  newState: SetWindowStateArgsType,
  prevStates: Record<string, WindowState>,
  zIndexMin: number,
  zIndexMax: number,
  defaultWindowPosition: { x: number; y: number },
  defaultWindowSize: { width: number; height: number },
) {
  const zIndexWindowKeyPairs = constructZIndexWindowKeyPairs(prevStates);
  const returnStates = { ...prevStates };
  // zIndexWindowKeyPairsの更新
  // 一番手前のwindowのisFocusedをfalseにする
  const zIndexWindowKeyPairsTop = zIndexWindowKeyPairs[0];
  if (zIndexWindowKeyPairsTop) {
    returnStates[zIndexWindowKeyPairsTop[1]] = {
      ...returnStates[zIndexWindowKeyPairsTop[1]],
      isFocused: false,
    };
  }
  // 最後に開いていた時のwindowのstate、新規に開く場合デフォルト値を使用する
  const lastState = prevStates[key] ?? {
    open: false,
    isFocused: false,
    position: { ...defaultWindowPosition },
    size: { ...defaultWindowSize },
    zIndex: zIndexMax,
  };
  // windowのstateを更新
  returnStates[key] = {
    ...lastState,
    ...newState,
    isFocused: true,
  };
  // 開くwindowをzIndexWindowKeyPairsの先頭に追加し、一番奥の溢れたwindowを取得する
  const poppedWindowKey = unshiftToZIndexWindowKeyPairs(
    zIndexWindowKeyPairs,
    key,
    zIndexMin,
    zIndexMax,
  );
  // 溢れたwindowのopen/isFocusedを更新
  if (poppedWindowKey) {
    returnStates[poppedWindowKey] = {
      ...returnStates[poppedWindowKey],
      open: false,
      isFocused: false,
    };
  }
  // zIndexWindowKeyPairsのz-indexをreturnStatesに反映する
  updateWindowStatesWithZIndexWindowKeyPairs(
    zIndexWindowKeyPairs,
    returnStates,
  );
  return returnStates;
}

/**
 * 開いているwindowを閉じる。
 * @param key
 * @param prevStates
 * @returns 更新後のwindowStates
 */
function closeWindowLogic(
  key: string,
  prevStates: Record<string, WindowState>,
) {
  const zIndexWindowKeyPairs = constructZIndexWindowKeyPairs(prevStates);
  const returnStates = { ...prevStates };
  // open/isFocusedを更新
  returnStates[key] = {
    ...returnStates[key],
    open: false,
    isFocused: false,
  };
  // zIndexWindowKeyPairsの更新
  removeFromZIndexWindowKeyPairs(zIndexWindowKeyPairs, key);
  // zIndexWindowKeyPairsのz-indexをreturnStatesに反映する
  updateWindowStatesWithZIndexWindowKeyPairs(
    zIndexWindowKeyPairs,
    returnStates,
  );
  // 一番手前のwindowのisFocusedをtrueにする
  const zIndexWindowKeyPairsTop = zIndexWindowKeyPairs[0];
  if (zIndexWindowKeyPairsTop) {
    returnStates[zIndexWindowKeyPairsTop[1]] = {
      ...returnStates[zIndexWindowKeyPairsTop[1]],
      isFocused: true,
    };
  }
  return returnStates;
}

/**
 * 既に開いているwindowを再度開き最前面にする
 * @param key
 * @param prevStates
 */
function reopenWindowLogic(
  key: string,
  prevStates: Record<string, WindowState>,
  newState: SetWindowStateArgsType,
  zIndexMin: number,
  zIndexMax: number,
) {
  const state = prevStates[key];
  const zIndexWindowKeyPairs = constructZIndexWindowKeyPairs(prevStates);
  const returnStates = { ...prevStates };
  // 一番手前のwindowのisFocusedをfalseにする
  const zIndexWindowKeyPairsTop = zIndexWindowKeyPairs[0];
  if (zIndexWindowKeyPairsTop) {
    returnStates[zIndexWindowKeyPairsTop[1]] = {
      ...returnStates[zIndexWindowKeyPairsTop[1]],
      isFocused: false,
    };
  }
  // このwindowのisFocusedをtrueにする
  returnStates[key] = {
    ...state,
    ...newState,
    isFocused: true,
  };
  // zIndexWindowKeyPairsから一度windowを削除し、再度unshiftする
  removeFromZIndexWindowKeyPairs(zIndexWindowKeyPairs, key);
  unshiftToZIndexWindowKeyPairs(
    zIndexWindowKeyPairs,
    key,
    zIndexMin,
    zIndexMax,
  );
  // zIndexWindowKeyPairsのz-indexをreturnStatesに反映する
  updateWindowStatesWithZIndexWindowKeyPairs(
    zIndexWindowKeyPairs,
    returnStates,
  );
  return returnStates;
}

/**
 * 各windowのstateから、windowのz-indexを計算するための配列を構築する。
 * @param states
 * @returns [z-index, windowKey]の配列。z-indexは降順。
 */
function constructZIndexWindowKeyPairs(states: Record<string, WindowState>) {
  const zIndexWindowKeyPairs: [number, string][] = [];
  for (const [key, state] of Object.entries(states)) {
    if (state.open) {
      zIndexWindowKeyPairs.push([state.zIndex, key]);
    }
  }
  return zIndexWindowKeyPairs.sort((a, b) => b[0] - a[0]);
}

/**
 * zIndexWindowKeyPairsの先頭に、windowKeyを最大z-indexで挿入する(destructive)。
 * @param zIndexWindowKeyPairs
 * @param windowKey
 * @param zIndexMin
 * @param zIndexMax
 * @returns z-indexがzIndexMinを下回るwindowのWindowKey
 */
function unshiftToZIndexWindowKeyPairs(
  zIndexWindowKeyPairs: [number, string][],
  windowKey: string,
  zIndexMin: number,
  zIndexMax: number,
) {
  zIndexWindowKeyPairs.unshift([zIndexMax, windowKey]);
  for (let i = 1; i < zIndexWindowKeyPairs.length; i++) {
    const curPair = zIndexWindowKeyPairs[i];
    const prevPair = zIndexWindowKeyPairs[i - 1];
    if (curPair[0] === prevPair[0]) {
      curPair[0] -= 1;
    } else {
      break;
    }
  }
  const lastPair = zIndexWindowKeyPairs[zIndexWindowKeyPairs.length - 1];
  if (lastPair[0] < zIndexMin) {
    zIndexWindowKeyPairs.pop();
    return lastPair[1];
  }
}

/**
 * zIndexWindowKeyPairsから、windowKeyを削除する(destructive)。
 * @param zIndexWindowKeyPairs
 * @param windowKey
 */
function removeFromZIndexWindowKeyPairs(
  zIndexWindowKeyPairs: [number, string][],
  windowKey: string,
) {
  const index = zIndexWindowKeyPairs.findIndex((pair) => pair[1] === windowKey);
  if (index !== -1) {
    zIndexWindowKeyPairs.splice(index, 1);
  }
}

/**
 * zIndexWindowKeyPairsのz-indexをwindowStatesに反映する(destructive)。
 * @param zIndexWindowKeyPairs
 * @param windowStates
 * @note open, isFocusedは更新しない
 */
function updateWindowStatesWithZIndexWindowKeyPairs(
  zIndexWindowKeyPairs: [number, string][],
  windowStates: Record<string, WindowState>,
) {
  for (const pair of zIndexWindowKeyPairs) {
    const [zIndex, windowKey] = pair;
    const windowState = windowStates[windowKey];
    if (windowState.zIndex !== zIndex) {
      windowStates[windowKey] = {
        ...windowState,
        zIndex,
      };
    }
  }
}
