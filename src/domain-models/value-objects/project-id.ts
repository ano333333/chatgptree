import { v7 as uuidv7 } from "uuid";

export class ProjectId {
  private readonly _value: string;
  constructor() {
    this._value = uuidv7();
  }
  public equals(other: ProjectId): boolean {
    return this._value === other._value;
  }
}
