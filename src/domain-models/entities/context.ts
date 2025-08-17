import type { ContextId } from "../value-objects/context-id";
import type { EdgeId } from "../value-objects/edge-id";
import type { NodeId } from "../value-objects/node-id";
import type { ProjectId } from "../value-objects/project-id";
import type { NodeRenderingProperty } from "../value-objects/node-rendering-property";

export class Context {
  public readonly id: ContextId;
  public readonly projectId: ProjectId;
  private _nodeIds: NodeId[] = [];
  private _edgeIds: EdgeId[] = [];
  private _name: string | null = null;
  public readonly renderingProperty: NodeRenderingProperty;
  constructor(
    id: ContextId,
    projectId: ProjectId,
    renderingProperty: NodeRenderingProperty,
  ) {
    this.id = id;
    this.projectId = projectId;
    this.renderingProperty = renderingProperty;
  }
}
