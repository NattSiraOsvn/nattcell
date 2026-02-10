import { SyncJob, SyncDirection } from '../../domain/entities';
import { SyncEngine } from '../../domain/services';
import { SyncRepository } from '../../ports/SyncRepository';
import { SyncEventEmitter } from '../../ports/SyncEventEmitter';

export class StartSyncUseCase {
  constructor(
    private readonly repository: SyncRepository,
    private readonly eventEmitter: SyncEventEmitter,
    private readonly syncEngine: SyncEngine
  ) {}

  async execute(source: string, target: string, direction: SyncDirection, createdBy: string) {
    let job = SyncJob.create(source, target, direction, createdBy);
    job = job.start();
    
    await this.repository.saveJob(job);
    await this.eventEmitter.emitSyncStarted(job.id, source, target);

    // Execute sync
    const result = await this.syncEngine.executeSync(job);

    if (result.success) {
      job = job.complete();
      await this.eventEmitter.emitSyncCompleted(job.id, result.recordsSynced);
    } else {
      job = job.fail(result.errors.join(', '));
      await this.eventEmitter.emitSyncFailed(job.id, result.errors.join(', '));
    }

    await this.repository.saveJob(job);
    return { job, result };
  }
}
