import { ConfigEntry } from '../../domain/entities';
import { ConfigValidationService } from '../../domain/services';
import { ConfigRepository } from '../../ports/ConfigRepository';
import { ConfigEventEmitter } from '../../ports/EventEmitter';

export class SetConfigUseCase {
  constructor(
    private readonly repository: ConfigRepository,
    private readonly eventEmitter: ConfigEventEmitter,
    private readonly validationService: ConfigValidationService
  ) {}

  async execute(key: string, value: unknown, updatedBy: string, metadata?: Record<string, unknown>) {
    const existingEntry = await this.repository.get(key);
    let entry: ConfigEntry;
    let previousValue: unknown;

    if (existingEntry) {
      previousValue = existingEntry.value;
      entry = existingEntry.update(value, updatedBy);
    } else {
      entry = ConfigEntry.create(key, value, updatedBy, metadata);
    }

    const validation = this.validationService.validateEntry(entry);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    await this.repository.save(entry);
    await this.eventEmitter.emitConfigUpdated(key, previousValue, value, updatedBy);

    return { entry, isNew: !existingEntry, previousValue };
  }
}
