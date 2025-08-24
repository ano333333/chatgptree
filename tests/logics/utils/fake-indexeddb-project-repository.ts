import Dexie, { type EntityTable } from "dexie";
import { indexedDB, IDBKeyRange } from "fake-indexeddb";
import type {
  ProjectObject,
  NodeObject,
} from "../../../src/ui-infrastructures/project-repositories/indexeddb-project-repository-schemas";
import { IndexedDBProjectRepository } from "../../../src/ui-infrastructures/project-repositories/indexeddb-project-repository";

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
