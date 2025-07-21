import { useCallback, useRef, useState } from "react";

export type UseWindowDispatcherType = {
  setZIndexMin: (zIndex: number) => void;
  setZIndexMax: (zIndex: number) => void;
  setDefaultWindowPosition: (position: { x: number; y: number }) => void;
  setDefaultWindowSize: (size: { width: number; height: number }) => void;
  getWindowState: (key: string) => WindowState;
  setWindowState: (key: string, state: SetWindowStateArgsType) => void;
};

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

type GetWindowStateReturnType = {
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

  const zIndexMin = useRef<number>(1024);
  const zIndexMax = useRef<number>(2047);
  const defaultWindowPosition = useRef<{ x: number; y: number }>({
    x: 100,
    y: 100,
  });
  const defaultWindowSize = useRef<{ width: number; height: number }>({
    width: 200,
    height: 200,
  });

  return {
    getWindowState: useCallback(
      (key: string) =>
        getWindowStateLogic(
          key,
          windowStates,
          zIndexMin.current,
          defaultWindowPosition.current,
          defaultWindowSize.current,
        ) as GetWindowStateReturnType,
      [windowStates],
    ),
    setWindowState: useCallback(
      (key: string, state: SetWindowStateArgsType) => {
        setWindowStates((ps) =>
          setWindowStateLogic(
            key,
            state,
            ps,
            zIndexMin.current,
            zIndexMax.current,
            defaultWindowPosition.current,
            defaultWindowSize.current,
          ),
        );
      },
      [],
    ),
    stateDispatcher: {
      setZIndexMin: useCallback((zIndex: number) => {
        zIndexMin.current = zIndex;
      }, []),
      setZIndexMax: useCallback((zIndex: number) => {
        zIndexMax.current = zIndex;
      }, []),
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
            zIndexMin.current,
            defaultWindowPosition.current,
            defaultWindowSize.current,
          );
        },
        [windowStates],
      ),
      setWindowState: useCallback(
        (key: string, state: SetWindowStateArgsType) => {
          setWindowStates((ps) =>
            setWindowStateLogic(
              key,
              state,
              ps,
              zIndexMin.current,
              zIndexMax.current,
              defaultWindowPosition.current,
              defaultWindowSize.current,
            ),
          );
        },
        [],
      ),
    },
  };
};

export default useWindow;

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
