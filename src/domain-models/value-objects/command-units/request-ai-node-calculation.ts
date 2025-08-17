import type { CommandUnit } from "../command-unit";
import type { NodeId } from "../node-id";

export class RequestAINodeCalculation implements CommandUnit {
  public readonly type = "requestAINodeCalculation";
  public readonly nodeId: NodeId;
  constructor(nodeId: NodeId) {
    this.nodeId = nodeId;
  }
}
