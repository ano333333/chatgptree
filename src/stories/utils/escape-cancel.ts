import { wait } from "./wait";

/**
 * 指定された要素でmousedownイベントを発火し、その後Escapeキーでドラッグをキャンセルする処理を実行する
 * @param element - mousedownイベントを発火する要素
 * @param startX - マウスのX座標(ページ座標)
 * @param startY - マウスのY座標(ページ座標)
 * @param endX - ドラッグの終了X座標(ページ座標)
 * @param endY - ドラッグの終了Y座標(ページ座標)
 */
export async function simulateDragStartAndCancelWithEscape(
  element: Element,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
): Promise<void> {
  const elementRect = element.getBoundingClientRect();
  const clientStartX = startX - elementRect.x;
  const clientStartY = startY - elementRect.y;
  const eventDetailOnStart = {
    pageX: startX,
    pageY: startY,
    clientX: clientStartX,
    clientY: clientStartY,
    button: 0,
    bubbles: true,
    cancelable: true,
  };
  // mousedownイベントを発火
  element.dispatchEvent(new MouseEvent("mousedown", eventDetailOnStart));
  await wait();

  element.dispatchEvent(new DragEvent("dragstart", eventDetailOnStart));
  await wait();

  // dragイベントを発火
  const elementRectCancel = element.getBoundingClientRect();
  const clientCancelX = endX - elementRectCancel.x;
  const clientCancelY = endY - elementRectCancel.y;
  const mouseEventDetailOnCancel = {
    pageX: endX,
    pageY: endY,
    clientX: clientCancelX,
    clientY: clientCancelY,
    bubbles: true,
    cancelable: true,
  };
  element.dispatchEvent(new DragEvent("drag", mouseEventDetailOnCancel));
  await wait();

  // Escapeキーでドラッグキャンセル
  const keyboardEventDetailOnCancel = {
    key: "Escape",
    bubbles: true,
    cancelable: true,
  };
  document.dispatchEvent(
    new KeyboardEvent("keydown", keyboardEventDetailOnCancel),
  );
  await wait();

  // dragendイベントを発火
  element.dispatchEvent(new DragEvent("dragend", mouseEventDetailOnCancel));
  await wait();

  // マウスのみ更に移動
  const mouseEventDetailAfterCancel = {
    clientX: endX + 50,
    clientY: endY + 50,
    bubbles: true,
    cancelable: true,
  };
  document.dispatchEvent(
    new MouseEvent("mousemove", mouseEventDetailAfterCancel),
  );
  await wait();

  // mouseupイベントを発火
  element.dispatchEvent(new MouseEvent("mouseup", mouseEventDetailAfterCancel));
  await wait();
}
