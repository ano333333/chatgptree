import type { DeepReadonly } from "ts-essentials";
import _ from "lodash";
import type { CommandUnit } from "../command-unit";
import type { SystemNode } from "../../entities/nodes/system-node";

export class DeleteSystemNode implements CommandUnit {
  public readonly type = "deleteSystemNode";
  public readonly node: DeepReadonly<SystemNode>;
  constructor(node: SystemNode) {
    this.node = _.cloneDeep(node);
  }
}
