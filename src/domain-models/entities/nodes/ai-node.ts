import type { AINodeProperty } from "../../value-objects/ai-node-property";
import type { AINodeState } from "../../value-objects/ai-node-state";
import type { NodeRenderingProperty } from "../../value-objects/node-rendering-property";
import type { ProjectId } from "../../value-objects/id-value-objects/project-id";
import { Node } from "../node";
import type { NodeId } from "../../value-objects/id-value-objects/node-id";

export class AINode extends Node {
  private _property: AINodeProperty;
  private _state: AINodeState = "normal";
  constructor(
    id: NodeId,
    projectId: ProjectId,
    renderingProperty: NodeRenderingProperty,
    property: AINodeProperty,
  ) {
    super(id, projectId, "assistant", renderingProperty);
    this._property = property;
  }
}
