import type { CommandUnit } from "./command-unit";

export class Command {
  private _units: CommandUnit[] = [];
  public readonly timestamp: Date;
  constructor(timestamp: Date) {
    this.timestamp = timestamp;
  }
}
