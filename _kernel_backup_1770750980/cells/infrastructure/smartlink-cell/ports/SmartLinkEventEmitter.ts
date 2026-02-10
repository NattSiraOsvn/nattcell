export interface SmartLinkEventEmitter {
  emitLinkCreated(linkId: string, sourceKey: string, targetKey: string): Promise<void>;
  emitLinkDeleted(linkId: string): Promise<void>;
  emitLinkAccessed(linkId: string): Promise<void>;
}
