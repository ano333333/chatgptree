import { v7 as uuidv7 } from "uuid";

export class EdgeId {
  private readonly _value: string;
  constructor() {
    this._value = uuidv7();
  }
  public equals(other: EdgeId): boolean {
    return this._value === other._value;
  }
}
