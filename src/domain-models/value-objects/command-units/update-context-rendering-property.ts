import type { CommandUnit } from "../command-unit";
import type { ContextId } from "../context-id";
import type { NodeRenderingProperty } from "../node-rendering-property";

export class UpdateContextRenderingProperty implements CommandUnit {
  public readonly type = "updateContextRenderingProperty";
  public readonly contextId: ContextId;
  public readonly before: NodeRenderingProperty;
  public readonly after: NodeRenderingProperty;
  constructor(
    contextId: ContextId,
    before: NodeRenderingProperty,
    after: NodeRenderingProperty,
  ) {
    this.contextId = contextId;
    this.before = before;
    this.after = after;
  }
}
