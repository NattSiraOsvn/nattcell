
export class IdempotencyService {
  private ledger: Map<string, any> = new Map();

  async executeIdempotent<T>(key: {key: string, tenantId: string}, operation: () => Promise<T>): Promise<T> {
    const fullKey = `${key.tenantId}:${key.key}`;
    if (this.ledger.has(fullKey)) {
      console.log(`[IDEMPOTENCY] Cache Hit for ${fullKey}`);
      return this.ledger.get(fullKey);
    }

    const result = await operation();
    this.ledger.set(fullKey, result);
    return result;
  }
}
