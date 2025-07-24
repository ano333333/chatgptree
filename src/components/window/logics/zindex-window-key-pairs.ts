/**
 * @abstract WindowContextのwindowStatesから[z-index, windowKey]の配列を構築し、
 * イベント時のz-indexの計算に使用する。
 */
import type { WindowState } from "@/components/window/types";

/**
 * 各windowのstateから、windowのz-indexを計算するための配列を構築する。
 * @param states
 * @returns [z-index, windowKey]の配列。z-indexは降順。
 */
export function constructZIndexWindowKeyPairs(
  states: Record<string, WindowState>,
) {
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
export function unshiftToZIndexWindowKeyPairs(
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
export function removeFromZIndexWindowKeyPairs(
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
export function updateWindowStatesWithZIndexWindowKeyPairs(
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
