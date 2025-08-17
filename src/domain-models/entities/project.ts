import type { ProjectId } from "../value-objects/id-value-objects/project-id";
import type { NodeId } from "../value-objects/id-value-objects/node-id";
import type { EdgeId } from "../value-objects/id-value-objects/edge-id";
import type { ContextId } from "../value-objects/id-value-objects/context-id";

export class Project {
  public readonly id: ProjectId;
  private _name: string;
  private _nodeIds: NodeId[] = [];
  private _edgeIds: EdgeId[] = [];
  private _contextIds: ContextId[] = [];
  constructor(id: ProjectId, name: string) {
    this.id = id;
    if (name.trim().length === 0) {
      throw new Error("Project name cannot be empty");
    }
    this._name = name;
  }
}
