import { DomainEventBase } from "../domain-event-base";
import type { NodeId } from "../../value-objects/id-value-objects/node-id";

export class NodeDeleted extends DomainEventBase {
  public readonly nodeId: NodeId;
  constructor(nodeId: NodeId) {
    super("node-deleted");
    this.nodeId = nodeId;
  }
}
