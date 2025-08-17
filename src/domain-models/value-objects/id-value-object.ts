import { v7 as uuidv7 } from "uuid";

export abstract class IDValueObject {
  private readonly _value: string;
  constructor() {
    this._value = uuidv7();
  }
  public equals(other: IDValueObject): boolean {
    return this._brand === other._brand && this._value === other._value;
  }
  protected readonly _brand: string = "IDValueObject";
}
