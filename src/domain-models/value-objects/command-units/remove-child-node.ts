import type { CommandUnit } from "../command-unit";
import type { NodeId } from "../id-value-objects/node-id";

export class RemoveChildNode implements CommandUnit {
  readonly type = "removeChildNode";
  readonly nodeId: NodeId;
  readonly childNodeId: NodeId;

  constructor(nodeId: NodeId, childNodeId: NodeId) {
    this.nodeId = nodeId;
    this.childNodeId = childNodeId;
  }
}
