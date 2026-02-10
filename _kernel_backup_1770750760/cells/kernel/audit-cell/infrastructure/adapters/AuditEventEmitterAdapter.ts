import { AuditEventEmitter } from '../../ports/AuditEventEmitter';

export class AuditEventEmitterAdapter implements AuditEventEmitter {
  async emitEntryCreated(entryId: string, actor: string, action: string) {
    console.log('[AUDIT-CELL] audit.entry.created:', { entryId, actor, action });
  }
  async emitChainVerified(isValid: boolean, totalEntries: number) {
    console.log('[AUDIT-CELL] audit.chain.verified:', { isValid, totalEntries });
  }
  async emitIntegrityAlert(brokenAt: string) {
    console.log('[AUDIT-CELL] audit.integrity.alert:', { brokenAt });
  }
}
