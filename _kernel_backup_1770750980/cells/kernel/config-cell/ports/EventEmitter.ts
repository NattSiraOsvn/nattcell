/**
 * ConfigEventEmitter Port
 * Interface for emitting config events
 */

export interface ConfigEventEmitter {
  emitConfigUpdated(key: string, oldValue: unknown, newValue: unknown, updatedBy: string): Promise<void>;
  emitSnapshotCreated(snapshotId: string, entryCount: number, createdBy: string): Promise<void>;
  emitConfigValidated(isValid: boolean, errorCount: number): Promise<void>;
  emitConfigRollback(snapshotId: string, rolledBackBy: string): Promise<void>;
}
