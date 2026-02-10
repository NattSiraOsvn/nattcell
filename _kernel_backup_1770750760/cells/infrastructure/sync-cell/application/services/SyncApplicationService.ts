import { StartSyncUseCase } from '../use-cases';
import { SyncEngine } from '../../domain/services';
import { SyncRepository } from '../../ports/SyncRepository';
import { SyncEventEmitter } from '../../ports/SyncEventEmitter';
import { SyncDirection } from '../../domain/entities';

export class SyncApplicationService {
  private readonly startSyncUseCase: StartSyncUseCase;
  private readonly repository: SyncRepository;

  constructor(repository: SyncRepository, eventEmitter: SyncEventEmitter) {
    this.repository = repository;
    const syncEngine = new SyncEngine();
    this.startSyncUseCase = new StartSyncUseCase(repository, eventEmitter, syncEngine);
  }

  startSync = (source: string, target: string, direction: SyncDirection, createdBy: string) =>
    this.startSyncUseCase.execute(source, target, direction, createdBy);

  getActiveJobs = () => this.repository.getActiveJobs();
  getJobHistory = (limit?: number) => this.repository.getJobHistory(limit);
}
