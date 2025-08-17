import type { NodeRenderingProperty } from "@/domain-models/value-objects/node-rendering-property";
import { Node } from "../node";
import type { ProjectId } from "@/domain-models/value-objects/project-id";
import type { NodeId } from "@/domain-models/value-objects/node-id";

export class UserNode extends Node {
  constructor(
    id: NodeId,
    projectId: ProjectId,
    renderingProperty: NodeRenderingProperty,
  ) {
    super(id, projectId, "user", renderingProperty);
  }
}
