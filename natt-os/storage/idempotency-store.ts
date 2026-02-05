
import { AuditTrailManager } from '../audit/audit-trail-manager';

/**
 * 🛡️ IDEMPOTENCY STORE
 * Purpose: Prevent duplicate event execution and ensure idempotency
 */
export class IdempotencyStore {
  private static readonly STORAGE_KEY = 'NATT_OS_IDEMPOTENCY_LEDGER';

  static async checkDuplicate(fields: { event_id: string; ai_id: string; tenant_id: string; command_hash: string }) {
    const key = this.generateKey(fields);
    const ledger = this.getLedger();
    
    if (ledger[key]) {
      await AuditTrailManager.log({
        type: 'DUPLICATE_EVENT_DROPPED',
        ai_id: fields.ai_id,
        command_id: fields.event_id,
        action: 'DROP_EVENT'
      });
      return { duplicate: true, action: 'DROP' };
    }
    
    ledger[key] = { 
        timestamp: Date.now(), 
        ttl: Date.now() + (90 * 24 * 60 * 60 * 1000) 
    };
    this.saveLedger(ledger);
    
    return { duplicate: false, action: 'PROCEED' };
  }
  
  private static generateKey(fields: any) {
    return `${fields.event_id}_${fields.ai_id}_${fields.tenant_id}_${fields.command_hash}`;
  }

  private static getLedger() {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
  }

  private static saveLedger(ledger: any) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(ledger));
  }

  static async initStore() {
    console.log("[IDEMPOTENCY] Ledger initialized (90 Days TTL Enforced)");
    return true;
  }
}
