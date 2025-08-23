import type { Project } from "../domain-models/entities/project";
import type { NodeId } from "../domain-models/value-objects/id-value-objects/node-id";
import type { Node } from "../domain-models/entities/node";

export interface IProjectRepository {
  getProject(): Promise<Project>;
  upsertProject(project: Project): Promise<void>;
  putNode(node: Node): Promise<void>;
  getAllNodes(): Promise<Node[]>;
  getNode(id: NodeId): Promise<Node | null>;
  updateNode(node: Node): Promise<void>;
  deleteNode(id: NodeId): Promise<void>;
  startTransaction(func: () => Promise<void>): Promise<void>;
}
