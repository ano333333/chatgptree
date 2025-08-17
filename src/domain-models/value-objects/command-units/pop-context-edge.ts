import type { CommandUnit } from "../command-unit";
import type { ContextId } from "../id-value-objects/context-id";

export class PopContextEdge implements CommandUnit {
  public readonly type = "popContextEdge";
  public readonly contextId: ContextId;
  constructor(contextId: ContextId) {
    this.contextId = contextId;
  }
}
