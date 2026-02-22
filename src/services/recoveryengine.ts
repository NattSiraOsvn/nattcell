export class RecoverySystem {
  static getDeadLetterQueue(): unknown[] { return []; }
  static replayOperation(_id: string): Promise<void> { return Promise.resolve(); }
  static recordOperation(_type: string, _name: string, _meta?: unknown): void {}
}

export const recoveryengine = { RecoverySystem };
export default recoveryengine;
