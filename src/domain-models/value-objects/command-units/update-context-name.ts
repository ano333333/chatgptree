import type { CommandUnit } from "../command-unit";
import type { ContextId } from "../id-value-objects/context-id";

export class UpdateContextName implements CommandUnit {
  public readonly type = "updateContextName";
  public readonly contextId: ContextId;
  public readonly before: string | null;
  public readonly after: string | null;
  constructor(
    contextId: ContextId,
    before: string | null,
    after: string | null,
  ) {
    this.contextId = contextId;
    this.before = before;
    this.after = after;
  }
}
