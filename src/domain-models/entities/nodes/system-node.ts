import type { NodeId } from "@/domain-models/value-objects/id-value-objects/node-id";
import { Node } from "../node";
import type { NodeRenderingProperty } from "@/domain-models/value-objects/node-rendering-property";
import type { ProjectId } from "@/domain-models/value-objects/id-value-objects/project-id";

export class SystemNode extends Node {
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
      "system",
      renderingProperty,
      content,
      parentNodeId,
      childNodeIds,
    );
  }
}
