import { LogAuditUseCase, VerifyChainUseCase } from '../use-cases';
import { AuditChainService } from '../../domain/services';
import { AuditRepository } from '../../ports/AuditRepository';
import { AuditEventEmitter } from '../../ports/AuditEventEmitter';

export class AuditApplicationService {
  private readonly logAuditUseCase: LogAuditUseCase;
  private readonly verifyChainUseCase: VerifyChainUseCase;

  constructor(repository: AuditRepository, eventEmitter: AuditEventEmitter) {
    const chainService = new AuditChainService();
    this.logAuditUseCase = new LogAuditUseCase(repository, eventEmitter);
    this.verifyChainUseCase = new VerifyChainUseCase(repository, eventEmitter, chainService);
  }

  log = (actor: string, action: string, resource: string, resourceId: string, options?: { oldValue?: unknown; newValue?: unknown }) =>
    this.logAuditUseCase.execute(actor, action, resource, resourceId, options);

  verifyChain = () => this.verifyChainUseCase.execute();
}
