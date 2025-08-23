import type { CommandUnit } from "../command-unit";
import type { NodeId } from "../id-value-objects/node-id";

export class UpdateParentNode implements CommandUnit {
  readonly type = "updateParentNode";
  readonly nodeId: NodeId;
  readonly parentNodeId: NodeId | null;

  constructor(nodeId: NodeId, parentNodeId: NodeId | null) {
    this.nodeId = nodeId;
    this.parentNodeId = parentNodeId;
  }
}
