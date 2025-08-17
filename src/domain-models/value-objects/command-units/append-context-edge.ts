import type { CommandUnit } from "../command-unit";
import type { ContextId } from "../context-id";
import type { EdgeId } from "../edge-id";

export class AppendContextEdge implements CommandUnit {
  public readonly type = "appendContextEdge";
  public readonly contextId: ContextId;
  public readonly edgeId: EdgeId;
  constructor(contextId: ContextId, edgeId: EdgeId) {
    this.contextId = contextId;
    this.edgeId = edgeId;
  }
}
