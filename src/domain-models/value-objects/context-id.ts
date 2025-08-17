import { v7 as uuidv7 } from "uuid";

export class ContextId {
  private readonly _value: string;
  constructor() {
    this._value = uuidv7();
  }
  public equals(other: ContextId): boolean {
    return this._value === other._value;
  }
  public get value(): string {
    return this._value;
  }
}
