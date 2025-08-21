export class AINodeProperty {
  constructor(
    public readonly model: string,
    public readonly temperature: number,
    public readonly topP: number,
  ) {
    if (temperature < 0 || temperature > 1) {
      throw new Error("Temperature must be between 0 and 1");
    }
    if (topP < 0 || topP > 1) {
      throw new Error("Top P must be between 0 and 1");
    }
  }
}
