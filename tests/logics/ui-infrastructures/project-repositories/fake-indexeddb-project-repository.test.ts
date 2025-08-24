import { expect, test } from "vitest";
import { FakeIndexedDBProjectRepository } from "../../utils/fake-indexeddb-project-repository";
import { Project } from "../../../../src/domain-models/entities/project";
import { ProjectId } from "../../../../src/domain-models/value-objects/id-value-objects/project-id";
import { SystemNode } from "../../../../src/domain-models/entities/nodes/system-node";
import { NodeId } from "../../../../src/domain-models/value-objects/id-value-objects/node-id";

test("FakeIndexedDBProjectRepository health check", async () => {
  // FakeIndexedDBProjectRepositoryがCI上で動作することのテスト
  // arrange
  const testProjectId = "0198da69-a679-78ef-8111-4e12b61ca201";
  const testId = "FakeIndexedDBProjectRepository health check";
  const testNodeId1 = "0198dab0-d2c8-7960-b6f4-ebebffa5af38";
  const testNodeId2 = "0198dab0-d2c8-7960-b6f4-ebebffa5af39";
  const repository = new FakeIndexedDBProjectRepository(testProjectId, testId);
  await repository.upsertProjectId(testProjectId);
  await repository.startTransaction(async () => {
    await repository.upsertProject(
      new Project(new ProjectId(testProjectId), "test"),
    );
  });

  // act
  await repository.startTransaction(async () => {
    await repository.putNode(
      new SystemNode(
        new NodeId(testNodeId1),
        new ProjectId(testProjectId),
        {
          left: 0,
          top: 0,
          width: 100,
          height: 100,
        },
        "test1",
        null,
        [],
      ),
    );
  });
  await repository.startTransaction(async () => {
    await repository.updateNode(
      new SystemNode(
        new NodeId(testNodeId1),
        new ProjectId(testProjectId),
        {
          left: 0,
          top: 0,
          width: 100,
          height: 100,
        },
        "test1",
        null,
        [new NodeId(testNodeId2)],
      ),
    );
    await repository.putNode(
      new SystemNode(
        new NodeId(testNodeId2),
        new ProjectId(testProjectId),
        {
          left: 50,
          top: 50,
          width: 200,
          height: 200,
        },
        "test2",
        new NodeId(testNodeId1),
        [],
      ),
    );
  });

  // assert
  await repository.startTransaction(async () => {
    const projectEntity = await repository.getProject();
    expect(projectEntity.id.toString()).toBe(testProjectId);
    expect(projectEntity.name).toBe("test");
    const allNodeEntities = await repository.getAllNodes();
    expect(allNodeEntities.length).toBe(2);
    const nodeEntity = await repository.getNode(new NodeId(testNodeId1));
    expect(nodeEntity.id.toString()).toBe(testNodeId1);
    expect(nodeEntity.content).toBe("test1");
    const nodeEntity2 = await repository.getNode(new NodeId(testNodeId2));
    expect(nodeEntity2.id.toString()).toBe(testNodeId2);
    expect(nodeEntity2.content).toBe("test2");
    expect(nodeEntity2.parentNodeId?.toString()).toBe(testNodeId1);
    expect(nodeEntity2.childNodeIds.map((id) => id.toString()).length).toBe(0);
  });
});
