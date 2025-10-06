import _ from "lodash";
import type { DeepReadonly } from "ts-essentials";
import type { AINode } from "../../entities/nodes/ai-node";
import type { CommandUnit } from "../command-unit";

export class DeleteAINode implements CommandUnit {
  public readonly type = "deleteAINode";
  public readonly node: DeepReadonly<AINode>;
  constructor(node: AINode) {
    this.node = _.cloneDeep(node);
  }
}
