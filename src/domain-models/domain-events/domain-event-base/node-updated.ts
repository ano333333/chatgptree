import type { NodeId } from "../../value-objects/id-value-objects/node-id";
import { DomainEventBase } from "../domain-event-base";

export class NodeUpdated extends DomainEventBase {
  public readonly nodeId: NodeId;
  constructor(nodeId: NodeId) {
    super("node-updated");
    this.nodeId = nodeId;
  }
}
