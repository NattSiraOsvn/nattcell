export interface AuditEventEmitter {
  emitEntryCreated(entryId: string, actor: string, action: string): Promise<void>;
  emitChainVerified(isValid: boolean, totalEntries: number): Promise<void>;
  emitIntegrityAlert(brokenAt: string): Promise<void>;
}
