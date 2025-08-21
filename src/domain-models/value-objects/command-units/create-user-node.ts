import type { CommandUnit } from "../command-unit";
import type { NodeId } from "../id-value-objects/node-id";
import type { ProjectId } from "../id-value-objects/project-id";
import type { NodeRenderingProperty } from "../node-rendering-property";

export class CreateUserNode implements CommandUnit {
  public readonly type = "createUserNode";
  public readonly id: NodeId;
  public readonly projectId: ProjectId;
  public readonly renderingProperty: NodeRenderingProperty;
  constructor(
    id: NodeId,
    projectId: ProjectId,
    renderingProperty: NodeRenderingProperty,
  ) {
    this.id = id;
    this.projectId = projectId;
    this.renderingProperty = renderingProperty;
  }
}
