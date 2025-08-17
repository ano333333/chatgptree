import type { CommandUnit } from "../command-unit";
import type { ContextId } from "../context-id";
import type { NodeId } from "../node-id";

export class AddContextNode implements CommandUnit {
  public readonly type = "addContextNode";
  public readonly contextId: ContextId;
  public readonly nodeId: NodeId;
  constructor(contextId: ContextId, nodeId: NodeId) {
    this.contextId = contextId;
    this.nodeId = nodeId;
  }
}
