import type { CommandUnit } from "../command-unit";
import type { ContextId } from "../context-id";
import type { NodeId } from "../node-id";

export class RemoveContextNode implements CommandUnit {
  public readonly type = "removeContextNode";
  public readonly contextId: ContextId;
  public readonly nodeId: NodeId;
  constructor(contextId: ContextId, nodeId: NodeId) {
    this.contextId = contextId;
    this.nodeId = nodeId;
  }
}
