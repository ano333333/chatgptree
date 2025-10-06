import type { ProjectId } from "../value-objects/id-value-objects/project-id";

export class CommandHistory {
  public readonly projectId: ProjectId;
  constructor(projectId: ProjectId) {
    this.projectId = projectId;
  }
}
