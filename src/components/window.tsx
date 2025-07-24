import {
  useRef,
  type MouseEvent,
  type ReactNode,
  useMemo,
  useCallback,
  type RefObject,
  useImperativeHandle,
  useState,
} from "react";
import { createContext, useContextSelector } from "use-context-selector";
import { WINDOW_HEADER_HEIGHT, RESIZE_HANDLE_HEIGHT } from "./window/constants";
import type { SetWindowStateArgsType, WindowState } from "./window/types";
import { getWindowStateLogic } from "./window/logics/get-window-state-logic";
import { setWindowStateLogic } from "./window/logics/set-window-state-logic";
import { WindowHeader } from "./window/subcomponents/window-header";
import { ResizeHandle } from "./window/subcomponents/resize-handle";

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

const windowStatesContext = createContext<
  (key: string) => {
    windowState: WindowState;
    setWindowState: (state: SetWindowStateArgsType) => void;
  }
>(() => {
  throw new Error("windowStatesContext is not initialized");
});

export function Window({ windowKey, title, children, ref }: WindowProps) {
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
        {
          /* ヘッダー */
          // NOTE: windowStatesContextとWindow, WindowContextを3つのファイルに分割するとStoryBookが壊れるため、
          // NOTE: この3つは1つのファイルにまとめ、WindowHeaderはwindowStatesContextではなくWindowからwindowState, setWindowStateを受け取るようにしている。
        }
        <WindowHeader
          title={title ?? ""}
          windowState={windowState}
          setWindowState={setWindowState}
        />
        {
          /* リサイズハンドル */
          // NOTE: WindowHeaderのNOTE参照
        }
        <ResizeHandle
          windowState={windowState}
          setWindowState={setWindowState}
        />
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
    windowState,
    setWindowState,
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
