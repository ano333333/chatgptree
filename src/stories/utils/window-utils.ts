import type { WindowElement } from "@/components/window";

/**
 * ウィンドウの位置を取得する関数
 * @param windowElement - ウィンドウの要素
 * @returns ウィンドウの位置
 */
export function getWindowPosition(windowElement: WindowElement | null) {
  if (!windowElement) {
    throw new Error("Window is not open");
  }
  const style = windowElement.style;
  if (!style) {
    throw new Error("Window is not open");
  }
  return {
    x: style.left ? Number.parseInt(style.left) : Number.NaN,
    y: style.top ? Number.parseInt(style.top) : Number.NaN,
  };
}

/**
 * ウィンドウのサイズを取得する関数
 * @param windowElement - ウィンドウの要素
 * @returns ウィンドウのサイズ
 */
export function getWindowSize(windowElement: WindowElement | null) {
  if (!windowElement) {
    throw new Error("Window is not open");
  }
  const style = windowElement.style;
  if (!style) {
    throw new Error("Window is not open");
  }
  return {
    width: style.width ? Number.parseInt(style.width) : Number.NaN,
    height: style.height ? Number.parseInt(style.height) : Number.NaN,
  };
}

export function getWindowZIndex(windowElement: WindowElement | null) {
  if (!windowElement) {
    throw new Error("Window is not open");
  }
  const style = windowElement.style;
  if (!style) {
    throw new Error("Window is not open");
  }
  return style.zIndex ? Number.parseInt(style.zIndex) : Number.NaN;
}
