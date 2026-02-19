import { IdempotencyKey, OutboxEvent } from '../../domain/entities/eda-foundation';

export interface IIdempotencyGuard {
  isDuplicate(hashKey: string): Promise<boolean>;
  saveKey(key: IdempotencyKey): Promise<void>;
}

export interface IOutboxRetryService {
  processPendingEvents(): Promise<void>;
  saveEvent(event: OutboxEvent): Promise<void>;
}
