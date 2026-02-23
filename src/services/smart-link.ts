// Stub for smart-link
export const smartLink = {};


export class SmartLinkClient {
  static connect(_config?: unknown): void {}
  static disconnect(): void {}
  static async send(_event: unknown, _data?: unknown): Promise<any> { return undefined; }
  static createEnvelope(target: string, method: string, payload?: unknown): unknown { return { target, method, payload: payload ?? {}, timestamp: Date.now() }; }
}
