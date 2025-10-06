import { CommandId } from "../value-objects/id-value-objects/command-id";

export class Command {
  public readonly id: CommandId;
  public readonly timestamp: Date;
  constructor(timestamp: Date) {
    this.id = new CommandId();
    this.timestamp = timestamp;
  }
}
