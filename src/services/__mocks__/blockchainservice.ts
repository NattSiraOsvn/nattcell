export const ShardingService = {
  generateShardHash: (data: any) => `shard-${Date.now()}`,
};
