import { useCallback, useRef, useState } from "react";

export type UseWindowDispatcherType = {
  setDefaultWindowPosition: (position: { x: number; y: number }) => void;
  setDefaultWindowSize: (size: { width: number; height: number }) => void;
  getWindowState: (key: string) => WindowState;
};

type WindowState = {
  open: boolean;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
};
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

/**
 * 各Windowの状態を管理する。
 * WindowContextへ、Windowが使用する状態のゲッターとイベントハンドラを渡す。
 */
const useWindow = () => {
  const [windowStates, setWindowStates] = useState<Record<string, WindowState>>(
    {},
  );
  const defaultWindowPosition = useRef<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const defaultWindowSize = useRef<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  return {
    getWindowState: useCallback(
      (key: string) =>
        getWindowStateLogic(
          key,
          windowStates,
          defaultWindowPosition.current,
          defaultWindowSize.current,
        ),
      [windowStates],
    ),
    setWindowState: useCallback(
      (key: string, state: SetWindowStateArgsType) => {
        setWindowStates((ps) =>
          setWindowStateLogic(
            key,
            state,
            ps,
            defaultWindowPosition.current,
            defaultWindowSize.current,
          ),
        );
      },
      [],
    ),
    stateDispatcher: {
      setDefaultWindowPosition: useCallback(
        (position: { x: number; y: number }) => {
          defaultWindowPosition.current = position;
        },
        [],
      ),
      setDefaultWindowSize: useCallback(
        (size: { width: number; height: number }) => {
          defaultWindowSize.current = size;
        },
        [],
      ),
      getWindowState: useCallback(
        (key: string) => {
          return getWindowStateLogic(
            key,
            windowStates,
            defaultWindowPosition.current,
            defaultWindowSize.current,
          );
        },
        [windowStates],
      ),
    },
  };
};

export default useWindow;

function getWindowStateLogic(
  key: string,
  windowStates: Record<string, WindowState>,
  defaultWindowPosition: { x: number; y: number },
  defaultWindowSize: { width: number; height: number },
) {
  return (
    windowStates[key] ?? {
      open: false,
      position: { ...defaultWindowPosition },
      size: { ...defaultWindowSize },
    }
  );
}

function setWindowStateLogic(
  key: string,
  newState: SetWindowStateArgsType,
  prevStates: Record<string, WindowState>,
  defaultWindowPosition: { x: number; y: number },
  defaultWindowSize: { width: number; height: number },
) {
  const state = prevStates[key];
  if (!state) {
    return {
      ...prevStates,
      [key]: {
        position: { ...defaultWindowPosition },
        size: { ...defaultWindowSize },
        ...newState,
      },
    };
  }
  if (state.open) {
    if (!newState.open) {
      return {
        ...prevStates,
        [key]: {
          ...state,
          open: false,
        },
      };
    }
  }
  if (!state.open) {
    if (newState.open) {
      return {
        ...prevStates,
        [key]: {
          ...state,
          open: true,
          position: newState.position ?? state.position,
          size: newState.size ?? state.size,
        },
      };
    }
  }
  return {
    ...prevStates,
  };
}
