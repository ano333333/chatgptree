import type { DeepReadonly } from "ts-essentials";
import _ from "lodash";
import type { UserNode } from "../../entities/nodes/user-node";
import type { CommandUnit } from "../command-unit";

export class DeleteUserNode implements CommandUnit {
  public readonly type = "deleteUserNode";
  public readonly node: DeepReadonly<UserNode>;
  constructor(node: UserNode) {
    this.node = _.cloneDeep(node);
  }
}
