import type { WindowState } from "@/components/window/types";

/**
 * 指定したWindowの状態を取得する(まだ開けたことがない場合デフォルト値を返す)
 * @param key
 * @param windowStates
 * @param zIndexMin
 * @param defaultWindowPosition
 * @param defaultWindowSize
 * @returns 指定したWindowの状態
 */
export function getWindowStateLogic(
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
