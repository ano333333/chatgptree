import { wait } from "./wait";

/**
 * 要素に対してドラッグ操作を実行する
 * @param element ドラッグ対象の要素
 * @param startX 開始X座標(ページ座標)
 * @param startY 開始Y座標(ページ座標)
 * @param endX 終了X座標(ページ座標)
 * @param endY 終了Y座標(ページ座標)
 */
export const simulateDrag = async (
  element: Element,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
): Promise<void> => {
  // 要素のページ座標
  const elementRect = element.getBoundingClientRect();
  const clientStartX = startX - elementRect.x;
  const clientStartY = startY - elementRect.y;

  const eventDetailOnStart = {
    pageX: startX,
    pageY: startY,
    clientX: clientStartX,
    clientY: clientStartY,
    button: 0, // 左ボタン
    bubbles: true,
    cancelable: true,
  };

  // マウスダウンイベント（ドラッグ開始）
  element.dispatchEvent(new MouseEvent("mousedown", eventDetailOnStart));
  await wait();

  // ドラッグ開始イベント
  element.dispatchEvent(new DragEvent("dragstart", eventDetailOnStart));
  await wait();

  // 移動後の要素のページ座標
  const elementRectAfterDrag = element.getBoundingClientRect();
  const clientEndX = endX - elementRectAfterDrag.x;
  const clientEndY = endY - elementRectAfterDrag.y;

  const eventDetailOnEnd = {
    pageX: endX,
    pageY: endY,
    clientX: clientEndX,
    clientY: clientEndY,
    button: 0, // 左ボタン
    bubbles: true,
    cancelable: true,
  };

  // ドラッグ中の移動イベント
  element.dispatchEvent(new DragEvent("drag", eventDetailOnEnd));
  await wait();

  // マウスアップイベント（ドラッグ終了）
  element.dispatchEvent(new MouseEvent("mouseup", eventDetailOnEnd));
  await wait();

  // ドラッグ終了イベント
  element.dispatchEvent(new DragEvent("dragend", eventDetailOnEnd));
  await wait();
};
