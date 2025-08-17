import type { CommandUnit } from "../command-unit";
import type { NodeId } from "../node-id";

export class ErrorAINodeCalculation implements CommandUnit {
  public readonly type = "errorAINodeCalculation";
  public readonly nodeId: NodeId;
  // TODO: 非同期制御を管理するアダプタのインターフェースを定義し、
  // StartAINodeCalculationで保持していたジョブIDを引き継ぐ
  constructor(nodeId: NodeId) {
    this.nodeId = nodeId;
  }
}
