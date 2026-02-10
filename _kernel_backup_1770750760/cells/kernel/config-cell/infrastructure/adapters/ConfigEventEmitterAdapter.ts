import { ConfigEventEmitter } from '../../ports/EventEmitter';

export class ConfigEventEmitterAdapter implements ConfigEventEmitter {
  async emitConfigUpdated(key: string, oldValue: unknown, newValue: unknown, updatedBy: string) {
    console.log('[CONFIG-CELL] config.updated:', { key, updatedBy });
  }
  async emitSnapshotCreated(snapshotId: string, entryCount: number, createdBy: string) {
    console.log('[CONFIG-CELL] config.snapshot.created:', { snapshotId, entryCount });
  }
  async emitConfigValidated(isValid: boolean, errorCount: number) {
    console.log('[CONFIG-CELL] config.validated:', { isValid, errorCount });
  }
  async emitConfigRollback(snapshotId: string, rolledBackBy: string) {
    console.log('[CONFIG-CELL] config.rollback:', { snapshotId, rolledBackBy });
  }
}
