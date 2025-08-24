import type { NodeId } from "../domain-models/value-objects/id-value-objects/node-id";
import type { Node } from "../domain-models/entities/node";

/**
 * ストリームレスポンスでチャット増分が到着した際に搬出されるイベント
 */
export type ILLMPortEventOnStreamArrived = {
  type: "stream-arrived";
  requestId: NodeId;
  delta: string;
};

/**
 * リクエストが完了した際に搬出されるイベント
 */
export type ILLMPortEventOnRequestCompleted = {
  type: "request-completed";
  requestId: NodeId;
  result: string;
};

/**
 * リクエストが失敗した際に搬出されるイベント
 */
export type ILLMPortEventOnRequestFailed = {
  type: "request-failed";
  requestId: NodeId;
  status: number;
  error: string;
};

/**
 * ILLMPortから搬出されるイベントの直和
 */
export type ILLMPortEvent =
  | ILLMPortEventOnStreamArrived
  | ILLMPortEventOnRequestCompleted
  | ILLMPortEventOnRequestFailed;

export interface ILLMPort {
  /**
   * イベントハンドラを登録する
   * @param handler イベントハンドラ
   */
  registerEventHandler(handler: (event: ILLMPortEvent) => void): void;
  /**
   * イベントハンドラを削除する
   * @param handler イベントハンドラ
   */
  removeEventHandler(handler: (event: ILLMPortEvent) => void): void;
  /**
   * リクエストを送信する
   * @param requestId リクエストID
   * @param nodes リクエストに含めるノード(先頭から順にcontentを結合する)
   */
  request(requestId: NodeId, nodes: Node[]): void;
  /**
   * リクエストをキャンセルする。以降このリクエストに関するイベントは搬出されない。
   * @param requestId リクエストID
   */
  cancel(requestId: NodeId): void;
}
