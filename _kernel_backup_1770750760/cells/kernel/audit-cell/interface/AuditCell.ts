/**
 * AuditCell - Kernel Cell #3
 * Immutable Audit Trail with Chain Verification
 */

import { AuditApplicationService } from '../application/services/AuditApplicationService';
import { InMemoryAuditRepository } from '../infrastructure/repositories/InMemoryAuditRepository';
import { AuditEventEmitterAdapter } from '../infrastructure/adapters/AuditEventEmitterAdapter';

export class AuditCell {
  private service: AuditApplicationService | null = null;

  async initialize(): Promise<void> {
    console.log('[AUDIT-CELL] Initializing...');
    const repository = new InMemoryAuditRepository();
    const eventEmitter = new AuditEventEmitterAdapter();
    this.service = new AuditApplicationService(repository, eventEmitter);
    console.log('[AUDIT-CELL] Initialized successfully');
  }

  async shutdown(): Promise<void> {
    console.log('[AUDIT-CELL] Shutting down...');
    this.service = null;
  }

  log = (actor: string, action: string, resource: string, resourceId: string, options?: { oldValue?: unknown; newValue?: unknown }) => {
    if (!this.service) throw new Error('AuditCell not initialized');
    return this.service.log(actor, action, resource, resourceId, options);
  };

  verifyChain = () => {
    if (!this.service) throw new Error('AuditCell not initialized');
    return this.service.verifyChain();
  };
}

let instance: AuditCell | null = null;
export const getAuditCell = () => instance || (instance = new AuditCell());
