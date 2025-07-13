/**
 * ウィンドウを開く操作を略記する関数
 * @param setWindowState - useWindowから取得したsetWindowState関数
 * @param windowKey - ウィンドウのキー
 * @param scrollX - ウィンドウのX座標
 * @param scrollY - ウィンドウのY座標
 * @param width - ウィンドウの幅
 * @param height - ウィンドウの高さ
 */
export function openWindow(
  setWindowState: (
    key: string,
    state: {
      open: boolean;
      position?: { x: number; y: number };
      size?: { width: number; height: number };
    },
  ) => void,
  windowKey: string,
  scrollX: number,
  scrollY: number,
  width: number,
  height: number,
): void {
  setWindowState(windowKey, {
    open: true,
    position: { x: scrollX, y: scrollY },
    size: { width, height },
  });
}
