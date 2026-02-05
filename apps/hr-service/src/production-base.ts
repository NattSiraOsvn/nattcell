
import { AuditProvider } from '../../../services/admin/AuditService';

/**
 * 🔐 HR PRODUCTION BASE - TEAM 2
 */
export abstract class ProductionBase {
  abstract readonly serviceName: string;
  readonly owner = 'Team 2 - CAN';
  readonly environment = 'production';

  constructor() {
    // Fix: Cannot access abstract property 'serviceName' in constructor. Using constructor name instead.
    AuditProvider.logAction('SYSTEM', 'HR_SERVICE_STARTUP', {
      service: this.constructor.name,
      timestamp: new Date().toISOString()
    }, 'system');
  }

  protected async logAudit(action: string, correlationId: string, details: any, causationId: string | null = null) {
    return await AuditProvider.logAction(
      this.serviceName,
      action,
      details,
      'system:hr',
      causationId
    );
  }
}
