import type { NodeId } from "../../value-objects/id-value-objects/node-id";
import { DomainEventBase } from "../domain-event-base";

export class NodeAdded extends DomainEventBase {
  public readonly nodeId: NodeId;
  constructor(nodeId: NodeId) {
    super("node-added");
    this.nodeId = nodeId;
  }
}
