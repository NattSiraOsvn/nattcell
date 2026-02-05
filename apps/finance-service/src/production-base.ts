
import { AuditProvider } from '../../../services/admin/AuditService';

/**
 * 🔐 FINANCE PRODUCTION BASE - TEAM 2
 * Enforces production-only rules and audit requirements.
 */
export abstract class ProductionBase {
  abstract readonly serviceName: string;
  readonly owner = 'Team 2 - CAN';
  readonly environment = 'production';

  constructor() {
    this.validateConstitutionalRules();
    // Fix: Cannot access abstract property 'serviceName' in constructor. Using constructor name instead.
    AuditProvider.logAction('SYSTEM', 'SERVICE_STARTUP', {
      service: this.constructor.name,
      owner: this.owner,
      timestamp: new Date().toISOString()
    }, 'system');
  }

  private validateConstitutionalRules() {
    const className = this.constructor.name;
    if (className.includes('Prototype') || className.includes('Demo')) {
      throw new Error(`[LEGAL_BLOCK] ${className} violates NATT-OS DSP v2026.01: NO PROTOTYPES ALLOWED.`);
    }
  }

  protected async logAudit(action: string, correlationId: string, details: any, causationId: string | null = null) {
    return await AuditProvider.logAction(
      this.serviceName,
      action,
      details,
      'system:finance',
      causationId
    );
  }
}
