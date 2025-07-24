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
import {
  WINDOW_HEADER_HEIGHT,
  RESIZE_HANDLE_HEIGHT,
  DEFAULT_WINDOW_WIDTH_MIN,
  DEFAULT_WINDOW_HEIGHT_MIN,
} from "./window/constants";
import type { SetWindowStateArgsType, WindowState } from "./window/types";
import { getWindowStateLogic } from "./window/logics/get-window-state-logic";
import { setWindowStateLogic } from "./window/logics/set-window-state-logic";
import { Header } from "./window/subcomponents/header";
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
    minimumSize: {
      width: number;
      height: number;
    };
    setWindowState: (state: SetWindowStateArgsType) => void;
  }
>(() => {
  throw new Error("windowStatesContext is not initialized");
});

/**
 * ウィンドウを表示するコンポーネント
 * @param windowKey 各ウィンドウのキー 所属するWindowContextに同じキーを持つWindowがあってはならない
 * @param title ヘッダーに表示するタイトル
 * @param children
 * @param ref
 */
export function Window({ windowKey, title, children, ref }: WindowProps) {
  const { windowState, minimumSize, setWindowState } = useContextSelector(
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
          // NOTE: この3つは1つのファイルにまとめ、HeaderはwindowStatesContextではなくWindowからwindowState, setWindowStateを受け取るようにしている。
        }
        <Header
          title={title ?? ""}
          windowState={windowState}
          setWindowState={setWindowState}
        />
        {
          /* リサイズハンドル */
          // NOTE: HeaderのNOTE参照
        }
        <ResizeHandle
          windowState={windowState}
          minimumSize={minimumSize}
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
    minimumSize,
    setWindowState,
  ]);

  return <>{windowState.open && element}</>;
}

interface WindowContextProps {
  zIndexMin?: number;
  zIndexMax?: number;
  defaultWindowPosition?: {
    x: number;
    y: number;
  };
  defaultWindowSize?: {
    width: number;
    height: number;
  };
  minimumSize?: {
    width: number;
    height: number;
  };
  children?: ReactNode;
}

/**
 * 所属WIndowの状態を管理する
 * Windowは1つのWindowContextの子でなければならない
 * @param zIndexMin ウィンドウのz-indexの最小値
 * @param zIndexMax ウィンドウのz-indexの最大値
 * @param defaultWindowPosition ウィンドウの初期位置
 * @param defaultWindowSize ウィンドウの初期サイズ
 * @param minimumSize ウィンドウの最小サイズ これ以下の幅/高さにはリサイズできない
 * @param children 子ウィンドウ
 */
export function WindowContext({
  zIndexMin,
  zIndexMax,
  defaultWindowPosition,
  defaultWindowSize,
  minimumSize,
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
  const minimumSizeRef = useRef(
    minimumSize ?? {
      width: DEFAULT_WINDOW_WIDTH_MIN,
      height: DEFAULT_WINDOW_HEIGHT_MIN,
    },
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
      const minimumSize = minimumSizeRef.current;
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
      return { windowState, minimumSize, setWindowState };
    },
    [windowStates],
  );

  return (
    <windowStatesContext.Provider value={contextProvider}>
      {children}
    </windowStatesContext.Provider>
  );
}
