import {
  v7 as uuidv7,
  validate as uuidValidate,
  version as uuidVersion,
} from "uuid";

export abstract class IDValueObject {
  private readonly _value: string;
  constructor(value?: string) {
    if (
      value !== undefined &&
      (!uuidValidate(value) || uuidVersion(value) !== 7)
    ) {
      throw new Error(`Invalid ID: ${value}`);
    }
    this._value = value ?? uuidv7();
  }
  public equals(other: IDValueObject): boolean {
    return this._brand === other._brand && this._value === other._value;
  }
  public toString(): string {
    return this._value;
  }
  protected readonly _brand: string = "IDValueObject";
}
