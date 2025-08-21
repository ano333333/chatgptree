import type { DeepReadonly } from "ts-essentials";
import _ from "lodash";
import type { CommandUnit } from "../command-unit";
import type { Edge } from "../../entities/edge";

export class DeleteEdge implements CommandUnit {
  public readonly type = "deleteEdge";
  public readonly edge: DeepReadonly<Edge>;
  constructor(edge: Edge) {
    this.edge = _.cloneDeep(edge);
  }
}
