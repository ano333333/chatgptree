import type { ContextId } from "../value-objects/context-id";
import type { EdgeId } from "../value-objects/edge-id";
import type { NodeId } from "../value-objects/node-id";
import type { ProjectId } from "../value-objects/project-id";

export class Edge {
  public readonly id: EdgeId;
  public readonly projectId: ProjectId;
  private _contextIds: ContextId[] = [];
  private _sourceId: NodeId;
  private _targetId: NodeId;
  constructor(
    id: EdgeId,
    projectId: ProjectId,
    sourceId: NodeId,
    targetId: NodeId,
  ) {
    this.id = id;
    this.projectId = projectId;
    this._sourceId = sourceId;
    this._targetId = targetId;
  }
}
