import { GetConfigUseCase, SetConfigUseCase, CreateSnapshotUseCase, RollbackConfigUseCase } from '../use-cases';
import { ConfigValidationService } from '../../domain/services';
import { ConfigRepository } from '../../ports/ConfigRepository';
import { ConfigEventEmitter } from '../../ports/EventEmitter';

export class ConfigApplicationService {
  private readonly getConfigUseCase: GetConfigUseCase;
  private readonly setConfigUseCase: SetConfigUseCase;
  private readonly createSnapshotUseCase: CreateSnapshotUseCase;
  private readonly rollbackConfigUseCase: RollbackConfigUseCase;

  constructor(repository: ConfigRepository, eventEmitter: ConfigEventEmitter) {
    const validationService = new ConfigValidationService();
    this.getConfigUseCase = new GetConfigUseCase(repository);
    this.setConfigUseCase = new SetConfigUseCase(repository, eventEmitter, validationService);
    this.createSnapshotUseCase = new CreateSnapshotUseCase(repository, eventEmitter);
    this.rollbackConfigUseCase = new RollbackConfigUseCase(repository, eventEmitter);
  }

  get = (key: string) => this.getConfigUseCase.execute(key);
  set = (key: string, value: unknown, updatedBy: string, metadata?: Record<string, unknown>) => 
    this.setConfigUseCase.execute(key, value, updatedBy, metadata);
  createSnapshot = (createdBy: string, reason: string) => 
    this.createSnapshotUseCase.execute(createdBy, reason);
  rollback = (snapshotId: string, rolledBackBy: string, reason: string) => 
    this.rollbackConfigUseCase.execute(snapshotId, rolledBackBy, reason);
}
