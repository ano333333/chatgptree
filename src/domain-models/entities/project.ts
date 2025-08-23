import type { ProjectId } from "../value-objects/id-value-objects/project-id";
import type { NodeId } from "../value-objects/id-value-objects/node-id";

export class Project {
  public readonly id: ProjectId;
  private _name: string;
  private _nodeIds: NodeId[] = [];
  constructor(id: ProjectId, name: string) {
    this.id = id;
    if (name.trim().length === 0) {
      throw new Error("Project name cannot be empty");
    }
    this._name = name;
  }
}
