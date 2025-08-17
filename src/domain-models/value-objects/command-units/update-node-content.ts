import type { CommandUnit } from "../command-unit";
import type { NodeId } from "../node-id";

export class UpdateNodeContent implements CommandUnit {
  public readonly type = "updateNodeContent";
  public readonly nodeId: NodeId;
  public readonly contentBefore: string;
  public readonly contentAfter: string;
  constructor(nodeId: NodeId, contentBefore: string, contentAfter: string) {
    this.nodeId = nodeId;
    this.contentBefore = contentBefore;
    this.contentAfter = contentAfter;
  }
}
