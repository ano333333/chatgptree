import type { AINodeProperty } from "../ai-node-property";
import type { CommandUnit } from "../command-unit";
import type { NodeId } from "../id-value-objects/node-id";

export class UpdateAINodeProperty implements CommandUnit {
  public readonly type = "updateAINodeProperty";
  public readonly nodeId: NodeId;
  public readonly propertyBefore: AINodeProperty;
  public readonly propertyAfter: AINodeProperty;
  constructor(
    nodeId: NodeId,
    propertyBefore: AINodeProperty,
    propertyAfter: AINodeProperty,
  ) {
    this.nodeId = nodeId;
    this.propertyBefore = propertyBefore;
    this.propertyAfter = propertyAfter;
  }
}
