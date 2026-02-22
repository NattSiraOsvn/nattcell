import { SecurityApplicationService } from '../application/services/SecurityApplicationService';
import { InMemorySecurityRepository } from '../infrastructure/repositories/InMemorySecurityRepository';
import { SecurityEventEmitterAdapter } from '../infrastructure/adapters/SecurityEventEmitterAdapter';

export class SecurityCell {
  private service: SecurityApplicationService | null = null;

  async initialize(): Promise<void> {
    console.log('[SECURITY-CELL] Initializing...');
    const repository = new InMemorySecurityRepository();
    const eventEmitter = new SecurityEventEmitterAdapter();
    this.service = new SecurityApplicationService(repository, eventEmitter);
    console.log('[SECURITY-CELL] Initialized successfully');
  }

  async shutdown(): Promise<void> { this.service = null; }

  detectTHReat = (type: string, severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL', source: string, description: string) => {
    if (!this.service) throw new Error('SecurityCell not initialized');
    return this.service.detectTHReat(type, severity, source, description);
  };

  isLockdownActive = () => this.service?.isLockdownActive() ?? false;
}

let instance: SecurityCell | null = null;
export const getSecurityCell = () => instance || (instance = new SecurityCell());
