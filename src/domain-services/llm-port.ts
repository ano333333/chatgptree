import type { Node } from "../domain-models/entities/node";
import type { NodeId } from "../domain-models/value-objects/id-value-objects/node-id";
import type { CommandId } from "../domain-models/value-objects/id-value-objects/command-id";

/**
 * ストリームレスポンスでチャット増分が到着した際に搬出されるイベント
 */
export type ILLMPortEventOnStreamArrived = {
  readonly type: "stream-arrived";
  readonly requestId: NodeId;
  readonly commandId: CommandId;
  readonly delta: string;
};

/**
 * リクエストが完了した際に搬出されるイベント
 */
export type ILLMPortEventOnRequestCompleted = {
  readonly type: "request-completed";
  readonly requestId: NodeId;
  readonly commandId: CommandId;
  // ストリームレスポンスでない場合のみ、結果全体が入る
  readonly result: string | null;
};

/**
 * リクエストが失敗した際に搬出されるイベント
 */
export type ILLMPortEventOnRequestFailed = {
  readonly type: "request-failed";
  readonly requestId: NodeId;
  readonly commandId: CommandId;
  readonly status: number;
  readonly error: string;
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
   * @param commandId コマンドID
   * @param nodes リクエストに含めるノード(先頭から順にcontentを結合する)
   */
  request(requestId: NodeId, commandId: CommandId, nodes: Node[]): void;
  /**
   * リクエストをキャンセルする。以降このリクエストに関するイベントは搬出されない。
   * @param requestId リクエストID
   */
  cancel(requestId: NodeId, commandId: CommandId): void;
}
