import { v7 as uuidv7 } from "uuid";

export class NodeId {
  private readonly _value: string;
  constructor() {
    this._value = uuidv7();
  }
  public equals(other: NodeId): boolean {
    return this._value === other._value;
  }
  public get value(): string {
    return this._value;
  }
}
