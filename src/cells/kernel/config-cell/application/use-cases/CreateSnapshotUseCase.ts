import { ConfigSnapshot } from '../../domain/entities';
import { ConfigRepository } from '../../ports/ConfigRepository';
import { ConfigEventEmitter } from '../../ports/EventEmitter';

export class CreateSnapshotUseCase {
  constructor(
    private readonly repository: ConfigRepository,
    private readonly eventEmitter: ConfigEventEmitter
  ) {}

  async execute(createdBy: string, reason: string) {
    const entries = await this.repository.getAll();
    const snapshotId = `snap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const snapshot = ConfigSnapshot.create(snapshotId, entries, createdBy, reason);

    await this.repository.createSnapshot(snapshot);
    await this.eventEmitter.emitSnapshotCreated(snapshot.id, snapshot.entryCount, createdBy);

    return { snapshot };
  }
}
