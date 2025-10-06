import Dexie, { type EntityTable } from "dexie";
import { IDBKeyRange, indexedDB } from "fake-indexeddb";
import { IndexedDBProjectRepository } from "../../../src/ui-infrastructures/project-repositories/indexeddb-project-repository";
import type {
  NodeObject,
  ProjectObject,
} from "../../../src/ui-infrastructures/project-repositories/indexeddb-project-repository-schemas";

type ProjectIdObject = {
  id: string;
};

export class FakeIndexedDBProjectRepository extends IndexedDBProjectRepository {
  constructor(projectId: string, testId: string) {
    super(projectId);
    this._db = new Dexie(`project-${projectId}:${testId}`, {
      indexedDB: indexedDB,
      IDBKeyRange: IDBKeyRange,
    }) as Dexie & {
      project: EntityTable<ProjectObject, "id">;
      nodes: EntityTable<NodeObject, "id">;
    };
    this._projectId = projectId;
    this._db.version(1).stores({
      project: "id",
      nodes: "id",
    });
    this._projectIdsDb = new Dexie(`project-ids:${testId}`, {
      indexedDB: indexedDB,
      IDBKeyRange: IDBKeyRange,
    }) as Dexie & {
      projectIds: EntityTable<ProjectIdObject, "id">;
    };
    this._projectIdsDb.version(1).stores({
      projectIds: "id",
    });
  }

  public async upsertProjectId(projectId: string): Promise<void> {
    await this._projectIdsDb.projectIds.put({ id: projectId });
  }

  protected _projectIdsDb: Dexie & {
    projectIds: EntityTable<ProjectIdObject, "id">;
  };
}
