export class ShardingService {
  static generateShardHash(data: Record<string, unknown>): string {
    return `shard_${JSON.stringify(data).length}_${Date.now()}`;
  }
  static getShard(_key: string): number { return 0; }
}
// Global accessible
(globalThis as unknown as Record<string, unknown>)['ShardingService'] = ShardingService;
