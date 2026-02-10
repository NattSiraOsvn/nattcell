/**
 * ConfigCell - Kernel Cell #1
 * System Configuration Management
 */

import { ConfigApplicationService } from '../application/services/ConfigApplicationService';
import { InMemoryConfigRepository } from '../infrastructure/repositories/InMemoryConfigRepository';
import { ConfigEventEmitterAdapter } from '../infrastructure/adapters/ConfigEventEmitterAdapter';

export class ConfigCell {
  private service: ConfigApplicationService | null = null;
  private repository: InMemoryConfigRepository | null = null;

  async initialize(): Promise<void> {
    console.log('[CONFIG-CELL] Initializing...');
    this.repository = new InMemoryConfigRepository();
    const eventEmitter = new ConfigEventEmitterAdapter();
    this.service = new ConfigApplicationService(this.repository, eventEmitter);
    await this.loadDefaults();
    console.log('[CONFIG-CELL] Initialized successfully');
  }

  async shutdown(): Promise<void> {
    console.log('[CONFIG-CELL] Shutting down...');
    if (this.service) await this.service.createSnapshot('SYSTEM', 'Pre-shutdown snapshot');
    this.service = null;
    this.repository = null;
  }

  async get(key: string) {
    this.ensureInitialized();
    return this.service!.get(key);
  }

  async set(key: string, value: unknown, updatedBy: string, metadata?: Record<string, unknown>) {
    this.ensureInitialized();
    return this.service!.set(key, value, updatedBy, metadata);
  }

  async createSnapshot(createdBy: string, reason: string) {
    this.ensureInitialized();
    return this.service!.createSnapshot(createdBy, reason);
  }

  async rollback(snapshotId: string, rolledBackBy: string, reason: string) {
    this.ensureInitialized();
    return this.service!.rollback(snapshotId, rolledBackBy, reason);
  }

  private ensureInitialized() {
    if (!this.service) throw new Error('ConfigCell not initialized');
  }

  private async loadDefaults() {
    const defaults = [
      { key: 'system.name', value: 'NATT-OS' },
      { key: 'system.version', value: '1.0.0' },
      { key: 'system.environment', value: 'development' },
      { key: 'system.constitutional_state', value: 'STATE_1' },
      { key: 'audit.enabled', value: true },
    ];
    for (const { key, value } of defaults) {
      if (!(await this.repository!.exists(key))) {
        await this.service!.set(key, value, 'SYSTEM');
      }
    }
  }
}

let instance: ConfigCell | null = null;
export const getConfigCell = () => instance || (instance = new ConfigCell());
