import type { NodeRenderingProperty } from "@/domain-models/value-objects/node-rendering-property";
import { Node } from "../node";
import type { ProjectId } from "@/domain-models/value-objects/id-value-objects/project-id";
import type { NodeId } from "@/domain-models/value-objects/id-value-objects/node-id";

export class UserNode extends Node {
  constructor(
    id: NodeId,
    projectId: ProjectId,
    renderingProperty: NodeRenderingProperty,
    content = "",
    parentNodeId: NodeId | null = null,
    childNodeIds: NodeId[] = [],
  ) {
    super(
      id,
      projectId,
      "user",
      renderingProperty,
      content,
      parentNodeId,
      childNodeIds,
    );
  }
}
