import { DomainEventBase } from "../domain-event-base";
import type { NodeId } from "../../value-objects/id-value-objects/node-id";

export class NodeUpdated extends DomainEventBase {
  public readonly nodeId: NodeId;
  constructor(nodeId: NodeId) {
    super("node-updated");
    this.nodeId = nodeId;
  }
}
