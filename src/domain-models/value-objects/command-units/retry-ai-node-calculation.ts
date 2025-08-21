import type { CommandUnit } from "../command-unit";
import type { NodeId } from "../id-value-objects/node-id";

export class RetryAINodeCalculation implements CommandUnit {
  public readonly type = "retryAINodeCalculation";
  public readonly nodeId: NodeId;
  // TODO: 非同期制御を管理するアダプタのインターフェースを定義し、
  // 新しいジョブIDを保持する
  constructor(nodeId: NodeId) {
    this.nodeId = nodeId;
  }
}
