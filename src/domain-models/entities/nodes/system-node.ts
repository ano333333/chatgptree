import type { NodeId } from "@/domain-models/value-objects/id-value-objects/node-id";
import type { ProjectId } from "@/domain-models/value-objects/id-value-objects/project-id";
import type { NodeRenderingProperty } from "@/domain-models/value-objects/node-rendering-property";
import { Node } from "../node";

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
