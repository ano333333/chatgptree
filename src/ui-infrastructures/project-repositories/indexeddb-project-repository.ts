import Dexie, { type EntityTable } from "dexie";
import { ProjectId } from "../../domain-models/value-objects/id-value-objects/project-id";
import type { NodeId } from "../../domain-models/value-objects/id-value-objects/node-id";
import type { IProjectRepository } from "../../domain-services/project-repository";
import { Project } from "../../domain-models/entities/project";
import type { Node } from "../../domain-models/entities/node";
import {
  convertToNodeEntity,
  convertToNodeObject,
  type ProjectObject,
  type NodeObject,
} from "./indexeddb-project-repository-schemas";

export class IndexedDBProjectRepository implements IProjectRepository {
  protected _db: Dexie & {
    project: EntityTable<ProjectObject, "id">;
    nodes: EntityTable<NodeObject, "id">;
  };
  protected _projectId: string;
  constructor(projectId: string) {
    this._db = new Dexie(`project-${projectId}`) as Dexie & {
      project: EntityTable<ProjectObject, "id">;
      nodes: EntityTable<NodeObject, "id">;
    };
    this._projectId = projectId;
    this._db.version(1).stores({
      project: "id",
      nodes: "id",
    });
  }

  public async getProject(): Promise<Project> {
    const project = await this._db.project.get(this._projectId);
    if (!project) {
      throw new Error(
        `invalid object store "project" in database ${this._db.name}`,
      );
    }
    return new Project(new ProjectId(project.id), project.name);
  }

  public async upsertProject(project: Project): Promise<void> {
    const projectObject = {
      id: project.id.toString(),
      name: project.name,
    };
    await this._db.project.put(projectObject);
  }

  public async putNode(node: Node): Promise<void> {
    const num = await this._db.nodes
      .where("id")
      .equals(node.id.toString())
      .count();
    if (num !== 0) {
      throw new Error(
        `node ${node.id.toString()} already exists in project ${this._projectId}`,
      );
    }
    await this._db.nodes.put(convertToNodeObject(node));
  }

  public async getAllNodes(): Promise<Node[]> {
    const nodes = await this._db.nodes.toArray();
    return nodes.map((node, index) => {
      const nodeEntity = convertToNodeEntity(node, this._projectId);
      if (!nodeEntity) {
        throw new Error(
          `invalid node at index ${index}(id: ${node.id}) of project ${this._projectId}: ${node}`,
        );
      }
      return nodeEntity;
    });
  }

  public async getNode(id: NodeId): Promise<Node | null> {
    const node = await this._db.nodes.get(id.toString());
    if (!node) {
      return null;
    }
    const nodeEntity = convertToNodeEntity(node, this._projectId);
    if (!nodeEntity) {
      throw new Error(
        `invalid node in node ${id.toString()} of project ${this._projectId}: ${node}`,
      );
    }
    return nodeEntity;
  }

  public async updateNode(node: Node): Promise<void> {
    const num = await this._db.nodes.update(
      node.id.toString(),
      convertToNodeObject(node),
    );
    if (num === 0) {
      throw new Error(
        `no node ${node.id.toString()} in project ${this._projectId}`,
      );
    }
  }

  public async deleteNode(id: NodeId): Promise<void> {
    await this._db.nodes.delete(id.toString());
  }

  public async startTransaction(func: () => Promise<void>): Promise<void> {
    await this._db.transaction(
      "rw",
      this._db.nodes,
      this._db.project,
      async () => {
        await func();
      },
    );
  }
}
