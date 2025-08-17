import type { ProjectId } from "../value-objects/id-value-objects/project-id";
import type { Command } from "../value-objects/command";

export class CommandHistory {
  public readonly projectId: ProjectId;
  private _pastCommands: Command[] = [];
  private _futureCommands: Command[] = [];
  constructor(projectId: ProjectId) {
    this.projectId = projectId;
  }
}
