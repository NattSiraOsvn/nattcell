import { MonitorApplicationService } from '../application/services/MonitorApplicationService';
import { InMemoryMonitorRepository } from '../infrastructure/repositories/InMemoryMonitorRepository';
import { MonitorEventEmitterAdapter } from '../infrastructure/adapters/MonitorEventEmitterAdapter';

export class MonitorCell {
  private service: MonitorApplicationService | null = null;

  async initialize(): Promise<void> {
    console.log('[MONITOR-CELL] Initializing...');
    const repository = new InMemoryMonitorRepository();
    const eventEmitter = new MonitorEventEmitterAdapter();
    this.service = new MonitorApplicationService(repository, eventEmitter);
    console.log('[MONITOR-CELL] Initialized successfully');
  }

  async shutdown(): Promise<void> { this.service = null; }

  reportHealth = (cellId: string, status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY', metrics: Record<string, number>) => {
    if (!this.service) throw new Error('MonitorCell not initialized');
    return this.service.reportHealth(cellId, status, metrics);
  };

  triggerAlert = (cellId: string, type: 'WARNING' | 'ERROR' | 'CRITICAL', message: string) => {
    if (!this.service) throw new Error('MonitorCell not initialized');
    return this.service.triggerAlert(cellId, type, message);
  };

  getSystemHealth = () => {
    if (!this.service) throw new Error('MonitorCell not initialized');
    return this.service.getSystemHealth();
  };
}

let instance: MonitorCell | null = null;
export const getMonitorCell = () => instance || (instance = new MonitorCell());
