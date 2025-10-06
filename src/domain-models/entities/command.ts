import type { CommandUnit } from "../value-objects/command-unit";
import { CommandId } from "../value-objects/id-value-objects/command-id";

export class Command {
  public readonly id: CommandId;
  private _units: CommandUnit[] = [];
  public readonly timestamp: Date;
  constructor(timestamp: Date) {
    this.id = new CommandId();
    this.timestamp = timestamp;
  }
}
