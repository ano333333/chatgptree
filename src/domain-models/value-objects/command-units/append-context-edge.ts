import type { CommandUnit } from "../command-unit";
import type { ContextId } from "../id-value-objects/context-id";
import type { EdgeId } from "../id-value-objects/edge-id";

export class AppendContextEdge implements CommandUnit {
  public readonly type = "appendContextEdge";
  public readonly contextId: ContextId;
  public readonly edgeId: EdgeId;
  constructor(contextId: ContextId, edgeId: EdgeId) {
    this.contextId = contextId;
    this.edgeId = edgeId;
  }
}
