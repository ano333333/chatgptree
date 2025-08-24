export abstract class DomainEventBase {
  public readonly type: string;
  constructor(type: string) {
    this.type = type;
  }
}
