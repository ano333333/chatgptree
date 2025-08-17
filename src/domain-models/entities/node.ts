import type { NodeRole } from "../value-objects/node-role";
import type { NodeRenderingProperty } from "../value-objects/node-rendering-property";
import type { NodeId } from "../value-objects/id-value-objects/node-id";
import type { ProjectId } from "../value-objects/id-value-objects/project-id";
import type { EdgeId } from "../value-objects/id-value-objects/edge-id";

export class Node {
  public readonly id: NodeId;
  public readonly projectId: ProjectId;
  public readonly role: NodeRole;
  private _content = "";
  private _parentEdgeId: EdgeId | null = null;
  private _childEdgeIds: EdgeId[] = [];
  private _renderingProperty: NodeRenderingProperty;
  constructor(
    id: NodeId,
    projectId: ProjectId,
    role: NodeRole,
    renderingProperty: NodeRenderingProperty,
  ) {
    this.id = id;
    this.projectId = projectId;
    this.role = role;
    this._renderingProperty = renderingProperty;
  }
}
