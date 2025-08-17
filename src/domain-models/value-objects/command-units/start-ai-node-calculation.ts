import type { CommandUnit } from "../command-unit";
import type { NodeId } from "../id-value-objects/node-id";

export class StartAINodeCalculation implements CommandUnit {
  public readonly type = "startAINodeCalculation";
  public readonly nodeId: NodeId;
  // TODO: 非同期制御を管理するアダプタのインターフェースを定義し、それに依頼するジョブIDを持つ
  constructor(nodeId: NodeId) {
    this.nodeId = nodeId;
  }
}
