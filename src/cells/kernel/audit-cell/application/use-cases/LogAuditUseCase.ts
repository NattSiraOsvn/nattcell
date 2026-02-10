import { AuditEntry } from '../../domain/entities';
import { AuditRepository } from '../../ports/AuditRepository';
import { AuditEventEmitter } from '../../ports/AuditEventEmitter';

export class LogAuditUseCase {
  constructor(
    private readonly repository: AuditRepository,
    private readonly eventEmitter: AuditEventEmitter
  ) {}

  async execute(actor: string, action: string, resource: string, resourceId: string, options?: { oldValue?: unknown; newValue?: unknown }) {
    const latest = await this.repository.getLatest();
    const previousHash = latest?.hash || 'GENESIS';

    const entry = AuditEntry.create(actor, action, resource, resourceId, previousHash, options);
    await this.repository.append(entry);
    await this.eventEmitter.emitEntryCreated(entry.id, actor, action);

    return { entry };
  }
}
