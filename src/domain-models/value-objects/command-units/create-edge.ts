import type { CommandUnit } from "../command-unit";
import type { EdgeId } from "../edge-id";
import type { ProjectId } from "../project-id";
import type { NodeId } from "../node-id";

export class CreateEdge implements CommandUnit {
  public readonly type = "createEdge";
  public readonly id: EdgeId;
  public readonly projectId: ProjectId;
  public readonly sourceId: NodeId;
  public readonly targetId: NodeId;
  constructor(
    id: EdgeId,
    projectId: ProjectId,
    sourceId: NodeId,
    targetId: NodeId,
  ) {
    this.id = id;
    this.projectId = projectId;
    this.sourceId = sourceId;
    this.targetId = targetId;
  }
}
