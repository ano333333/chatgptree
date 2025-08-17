import type { CommandUnit } from "../command-unit";
import type { NodeId } from "../node-id";
import type { NodeRenderingProperty } from "../node-rendering-property";

export class UpdateNodeRenderingProperty implements CommandUnit {
  public readonly type = "updateNodeRenderingProperty";
  public readonly nodeId: NodeId;
  public readonly renderingPropertyBefore: NodeRenderingProperty;
  public readonly renderingPropertyAfter: NodeRenderingProperty;
  constructor(
    nodeId: NodeId,
    renderingPropertyBefore: NodeRenderingProperty,
    renderingPropertyAfter: NodeRenderingProperty,
  ) {
    this.nodeId = nodeId;
    this.renderingPropertyBefore = renderingPropertyBefore;
    this.renderingPropertyAfter = renderingPropertyAfter;
  }
}
