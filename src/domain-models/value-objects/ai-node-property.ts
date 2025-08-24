export class AINodeProperty {
  public readonly model: string;
  public readonly temperature: number;
  public readonly topP: number;
  constructor(model: string, temperature: number, topP: number) {
    if (temperature < 0 || temperature > 1) {
      throw new Error("Temperature must be between 0 and 1");
    }
    if (topP < 0 || topP > 1) {
      throw new Error("Top P must be between 0 and 1");
    }
    this.model = model;
    this.temperature = temperature;
    this.topP = topP;
  }
}
