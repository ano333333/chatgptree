import { AINode } from "../../domain-models/entities/nodes/ai-node";
import { SystemNode } from "../../domain-models/entities/nodes/system-node";
import { UserNode } from "../../domain-models/entities/nodes/user-node";
import { NodeId } from "../../domain-models/value-objects/id-value-objects/node-id";
import { ProjectId } from "../../domain-models/value-objects/id-value-objects/project-id";
import type { Node } from "../../domain-models/entities/node";
import { AINodeProperty } from "@/domain-models/value-objects/ai-node-property";
import { NodeRenderingProperty } from "@/domain-models/value-objects/node-rendering-property";

export type ProjectObject = {
  id: string;
  name: string;
};

export type NodeObject =
  | {
      id: string;
      role: "system" | "user";
      content: string;
      parentNodeId: string | null;
      childNodeIds: string[];
      renderingProperty: {
        left: number;
        top: number;
        width: number;
        height: number;
      };
    }
  | {
      id: string;
      role: "assistant";
      content: string;
      parentNodeId: string | null;
      childNodeIds: string[];
      renderingProperty: {
        left: number;
        top: number;
        width: number;
        height: number;
      };
      aiNodeProperty: {
        model: string;
        temperature: number;
        topP: number;
      };
      state: "normal" | "waiting" | "running" | "error";
    };

export function convertToNodeEntity(
  node: NodeObject,
  projectId: string,
): Node | null {
  const renderingProperty = new NodeRenderingProperty(
    node.renderingProperty.left,
    node.renderingProperty.top,
    node.renderingProperty.width,
    node.renderingProperty.height,
  );
  const childNodeIds = node.childNodeIds.map((id) => new NodeId(id));
  if (node.role === "system") {
    return new SystemNode(
      new NodeId(node.id),
      new ProjectId(projectId),
      renderingProperty,
      node.content,
      node.parentNodeId ? new NodeId(node.parentNodeId) : null,
      childNodeIds,
    );
  }
  if (node.role === "user") {
    return new UserNode(
      new NodeId(node.id),
      new ProjectId(projectId),
      renderingProperty,
      node.content,
      node.parentNodeId ? new NodeId(node.parentNodeId) : null,
      childNodeIds,
    );
  }
  if (node.role === "assistant") {
    const aiNodeProperty = new AINodeProperty(
      node.aiNodeProperty.model,
      node.aiNodeProperty.temperature,
      node.aiNodeProperty.topP,
    );
    return new AINode(
      new NodeId(node.id),
      new ProjectId(projectId),
      renderingProperty,
      aiNodeProperty,
      node.content,
      node.parentNodeId ? new NodeId(node.parentNodeId) : null,
      childNodeIds,
      node.state,
    );
  }
  return null;
}

export function convertToNodeObject(node: Node): NodeObject {
  if (node instanceof SystemNode) {
    return {
      id: node.id.toString(),
      role: "system",
      content: node.content,
      parentNodeId: node.parentNodeId?.toString() ?? null,
      childNodeIds: node.childNodeIds.map((id) => id.toString()),
      renderingProperty: node.renderingProperty,
    };
  }
  if (node instanceof UserNode) {
    return {
      id: node.id.toString(),
      role: "user",
      content: node.content,
      parentNodeId: node.parentNodeId?.toString() ?? null,
      childNodeIds: node.childNodeIds.map((id) => id.toString()),
      renderingProperty: node.renderingProperty,
    };
  }
  const aiNode = node as AINode;
  return {
    id: aiNode.id.toString(),
    role: "assistant",
    content: aiNode.content,
    parentNodeId: aiNode.parentNodeId?.toString() ?? null,
    childNodeIds: aiNode.childNodeIds.map((id) => id.toString()),
    renderingProperty: aiNode.renderingProperty,
    aiNodeProperty: aiNode.property,
    state: aiNode.state,
  };
}
