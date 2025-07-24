import type {
  SetWindowStateArgsType,
  WindowState,
} from "@/components/window/types";
import {
  constructZIndexWindowKeyPairs,
  unshiftToZIndexWindowKeyPairs,
  removeFromZIndexWindowKeyPairs,
  updateWindowStatesWithZIndexWindowKeyPairs,
} from "./zindex-window-key-pairs";

export function setWindowStateLogic(
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
