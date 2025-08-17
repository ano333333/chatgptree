import type { CommandUnit } from "../command-unit";
import type { NodeId } from "../node-id";
import type { ProjectId } from "../project-id";
import type { NodeRenderingProperty } from "../node-rendering-property";
import type { AINodeProperty } from "../ai-node-property";

export class CreateAINode implements CommandUnit {
  public readonly type = "createAINode";
  public readonly id: NodeId;
  public readonly projectId: ProjectId;
  public readonly renderingProperty: NodeRenderingProperty;
  public readonly property: AINodeProperty;
  constructor(
    id: NodeId,
    projectId: ProjectId,
    renderingProperty: NodeRenderingProperty,
    property: AINodeProperty,
  ) {
    this.id = id;
    this.projectId = projectId;
    this.renderingProperty = renderingProperty;
    this.property = property;
  }
}
