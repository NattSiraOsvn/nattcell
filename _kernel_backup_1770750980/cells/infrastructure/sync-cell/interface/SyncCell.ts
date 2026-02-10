import { SyncApplicationService } from '../application/services/SyncApplicationService';
import { InMemorySyncRepository } from '../infrastructure/repositories/InMemorySyncRepository';
import { SyncEventEmitterAdapter } from '../infrastructure/adapters/SyncEventEmitterAdapter';
import { SyncDirection } from '../domain/entities';

export class SyncCell {
  private service: SyncApplicationService | null = null;

  async initialize(): Promise<void> {
    console.log('[SYNC-CELL] Initializing...');
    const repository = new InMemorySyncRepository();
    const eventEmitter = new SyncEventEmitterAdapter();
    this.service = new SyncApplicationService(repository, eventEmitter);
    console.log('[SYNC-CELL] Initialized successfully');
  }

  async shutdown(): Promise<void> { this.service = null; }

  startSync = (source: string, target: string, direction: SyncDirection, createdBy: string) => {
    if (!this.service) throw new Error('SyncCell not initialized');
    return this.service.startSync(source, target, direction, createdBy);
  };

  getActiveJobs = () => {
    if (!this.service) throw new Error('SyncCell not initialized');
    return this.service.getActiveJobs();
  };
}

let instance: SyncCell | null = null;
export const getSyncCell = () => instance || (instance = new SyncCell());
