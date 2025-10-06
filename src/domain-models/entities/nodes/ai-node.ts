import type { AINodeProperty } from "../../value-objects/ai-node-property";
import type { AINodeState } from "../../value-objects/ai-node-state";
import type { NodeId } from "../../value-objects/id-value-objects/node-id";
import type { ProjectId } from "../../value-objects/id-value-objects/project-id";
import type { NodeRenderingProperty } from "../../value-objects/node-rendering-property";
import { Node } from "../node";

export class AINode extends Node {
  protected _property: AINodeProperty;
  protected _state: AINodeState = "normal";
  constructor(
    id: NodeId,
    projectId: ProjectId,
    renderingProperty: NodeRenderingProperty,
    property: AINodeProperty,
    content = "",
    parentNodeId: NodeId | null = null,
    childNodeIds: NodeId[] = [],
    state: AINodeState = "normal",
  ) {
    super(
      id,
      projectId,
      "assistant",
      renderingProperty,
      content,
      parentNodeId,
      childNodeIds,
    );
    this._property = property;
    this._state = state;
  }

  public get property(): AINodeProperty {
    return this._property;
  }

  public get state(): AINodeState {
    return this._state;
  }

  public get content(): string {
    if (this._state === "normal") {
      return this._content;
    }
    return "";
  }
}
