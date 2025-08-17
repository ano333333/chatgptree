import type { DeepReadonly } from "ts-essentials";
import _ from "lodash";
import type { CommandUnit } from "../command-unit";
import type { AINode } from "../../entities/nodes/ai-node";

export class DeleteAINode implements CommandUnit {
  public readonly type = "deleteAINode";
  public readonly node: DeepReadonly<AINode>;
  constructor(node: AINode) {
    this.node = _.cloneDeep(node);
  }
}
