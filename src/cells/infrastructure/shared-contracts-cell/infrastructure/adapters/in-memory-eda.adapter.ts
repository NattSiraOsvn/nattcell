import { IdempotencyKey, OutboxEvent } from '../../domain/entities/eda-foundation';
import { IIdempotencyGuard, IOutboxRetryService } from '../../application/services/eda-guard.service';

export class InMemoryEdaAdapter implements IIdempotencyGuard, IOutboxRetryService {
  private keys = new Set<string>();
  private events: OutboxEvent[] = [];

  async isDuplicate(hashKey: string): Promise<boolean> {
    return this.keys.has(hashKey);
  }

  async saveKey(key: IdempotencyKey): Promise<void> {
    this.keys.add(key.hashKey);
  }

  async processPendingEvents(): Promise<void> {
    // Retry logic
  }

  async saveEvent(event: OutboxEvent): Promise<void> {
    this.events.push(event);
  }
}
