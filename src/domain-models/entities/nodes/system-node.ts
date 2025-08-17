import type { NodeId } from "@/domain-models/value-objects/node-id";
import { Node } from "../node";
import type { NodeRenderingProperty } from "@/domain-models/value-objects/node-rendering-property";
import type { ProjectId } from "@/domain-models/value-objects/project-id";

export class SystemNode extends Node {
  constructor(
    id: NodeId,
    projectId: ProjectId,
    renderingProperty: NodeRenderingProperty,
  ) {
    super(id, projectId, "system", renderingProperty);
  }
}
