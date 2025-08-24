import type { NodeRole } from "../value-objects/node-role";
import type { NodeRenderingProperty } from "../value-objects/node-rendering-property";
import type { NodeId } from "../value-objects/id-value-objects/node-id";
import type { ProjectId } from "../value-objects/id-value-objects/project-id";

export class Node {
  public readonly id: NodeId;
  public readonly projectId: ProjectId;
  public readonly role: NodeRole;
  protected _content = "";
  protected _parentNodeId: NodeId | null = null;
  protected _childNodeIds: NodeId[] = [];
  protected _renderingProperty: NodeRenderingProperty;
  constructor(
    id: NodeId,
    projectId: ProjectId,
    role: NodeRole,
    renderingProperty: NodeRenderingProperty,
    content = "",
    parentNodeId: NodeId | null = null,
    childNodeIds: NodeId[] = [],
  ) {
    this.id = id;
    this.projectId = projectId;
    this.role = role;
    this._renderingProperty = renderingProperty;
    this._content = content;
    this._parentNodeId = parentNodeId;
    this._childNodeIds = [...childNodeIds];
  }

  public get renderingProperty(): NodeRenderingProperty {
    return this._renderingProperty;
  }

  public get content(): string {
    return this._content;
  }

  public get parentNodeId(): NodeId | null {
    return this._parentNodeId;
  }

  public get childNodeIds(): NodeId[] {
    return [...this._childNodeIds];
  }
}
