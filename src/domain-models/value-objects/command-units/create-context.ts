import type { CommandUnit } from "../command-unit";
import type { ContextId } from "../id-value-objects/context-id";
import type { NodeRenderingProperty } from "../node-rendering-property";
import type { ProjectId } from "../id-value-objects/project-id";

export class CreateContext implements CommandUnit {
  public readonly type = "createContext";
  public readonly contextId: ContextId;
  public readonly projectId: ProjectId;
  public readonly renderingProperty: NodeRenderingProperty;
  constructor(
    contextId: ContextId,
    projectId: ProjectId,
    renderingProperty: NodeRenderingProperty,
  ) {
    this.contextId = contextId;
    this.projectId = projectId;
    this.renderingProperty = renderingProperty;
  }
}
