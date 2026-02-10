import { ConfigSnapshot } from '../../domain/entities';
import { ConfigRepository } from '../../ports/ConfigRepository';
import { ConfigEventEmitter } from '../../ports/EventEmitter';

export class RollbackConfigUseCase {
  constructor(
    private readonly repository: ConfigRepository,
    private readonly eventEmitter: ConfigEventEmitter
  ) {}

  async execute(snapshotId: string, rolledBackBy: string, reason: string) {
    const snapshot = await this.repository.getSnapshot(snapshotId);
    if (!snapshot) {
      throw new Error(`Snapshot not found: ${snapshotId}`);
    }

    // Backup current state
    const currentEntries = await this.repository.getAll();
    const backupSnapshot = ConfigSnapshot.create(
      `backup_${Date.now()}`,
      currentEntries,
      rolledBackBy,
      `Backup before rollback to ${snapshotId}`
    );
    await this.repository.createSnapshot(backupSnapshot);

    // Restore from snapshot
    const entriesToRestore = Array.from(snapshot.entries.values());
    await this.repository.saveBatch(entriesToRestore);
    await this.eventEmitter.emitConfigRollback(snapshotId, rolledBackBy);

    return { success: true, restoredCount: entriesToRestore.length, snapshot };
  }
}
