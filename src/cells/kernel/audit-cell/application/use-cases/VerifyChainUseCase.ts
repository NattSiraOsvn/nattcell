import { AuditRepository } from '../../ports/AuditRepository';
import { AuditEventEmitter } from '../../ports/AuditEventEmitter';
import { AuditChainService } from '../../domain/services';

export class VerifyChainUseCase {
  constructor(
    private readonly repository: AuditRepository,
    private readonly eventEmitter: AuditEventEmitter,
    private readonly chainService: AuditChainService
  ) {}

  async execute() {
    const entries = await this.repository.getAll();
    const result = this.chainService.verifyChain(entries);

    await this.eventEmitter.emitChainVerified(result.isValid, result.totalEntries);
    if (!result.isValid && result.brokenAt) {
      await this.eventEmitter.emitIntegrityAlert(result.brokenAt);
    }

    return result;
  }
}
