export interface NotifyPayload {
  type?: string;
  title?: string;
  content?: string;
  persona?: unknown;
  [key: string]: unknown;
}

export class NotifyBus {
  static push(payload: NotifyPayload): void {}
  static emit(_event: string, _data?: unknown): void {}
  static subscribe(_event: string, _handler: (data: unknown) => void): () => void {
    return () => {};
  }
}
export const notificationservice = { NotifyBus };
export default notificationservice;
