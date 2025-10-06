import _ from "lodash";
import type { DeepReadonly } from "ts-essentials";
import type { SystemNode } from "../../entities/nodes/system-node";
import type { CommandUnit } from "../command-unit";

export class DeleteSystemNode implements CommandUnit {
  public readonly type = "deleteSystemNode";
  public readonly node: DeepReadonly<SystemNode>;
  constructor(node: SystemNode) {
    this.node = _.cloneDeep(node);
  }
}
