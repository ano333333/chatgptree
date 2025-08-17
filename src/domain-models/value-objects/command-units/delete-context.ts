import type { DeepReadonly } from "ts-essentials";
import _ from "lodash";
import type { CommandUnit } from "../command-unit";
import type { Context } from "../../entities/context";

export class DeleteContext implements CommandUnit {
  public readonly type = "deleteContext";
  public readonly context: DeepReadonly<Context>;
  constructor(context: Context) {
    this.context = _.cloneDeep(context);
  }
}
