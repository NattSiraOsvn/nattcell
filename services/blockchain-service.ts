
// 🛠️ Fixed: Import casing for Types
import { BlockShard, AuditTrailEntry, UserRole, SealingLevel, SealingRecord } from '../types.ts';

export class BlockchainShardingService {
  private static instance: BlockchainShardingService;

  public static getInstance(): BlockchainShardingService {
    if (!BlockchainShardingService.instance) {
      BlockchainShardingService.instance = new BlockchainShardingService();
    }
    return BlockchainShardingService.instance;
  }

  private filterPII(data: any): any {
    const cleanData = JSON.parse(JSON.stringify(data));
    const piiFields = ['customerName', 'phone', 'cccd', 'address', 'email', 'customer_info'];
    
    const recursiveFilter = (obj: any) => {
      for (const key in obj) {
        if (piiFields.includes(key)) {
          obj[key] = '[HIDDEN_FOR_INTEGRITY]';
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          recursiveFilter(obj[key]);
        }
      }
    };
    
    recursiveFilter(cleanData);
    return cleanData;
  }

  public generateShardHash(data: any): string {
    const safeData = this.filterPII(data);
    const str = JSON.stringify(safeData); 
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `0x${Math.abs(hash).toString(16).padStart(64, 'f')}`;
  }

  public createAggregateSeal(
    level: SealingLevel, 
    period: string, 
    metrics: any, 
    userId: string
  ): SealingRecord {
    const aggregateHash = this.generateShardHash({ level, period, metrics });
    
    return {
      id: `SEAL-${level}-${period.replace(/\//g, '')}`,
      level,
      period,
      aggregateHash,
      sealedAt: Date.now(),
      sealedBy: userId,
      metrics: {
        totalRevenue: metrics.revenue || 0,
        totalExpense: metrics.expense || 0,
        totalTax: metrics.tax || 0,
        checkSum: this.generateShardHash(metrics.details || {})
      }
    };
  }

  public createIsolatedShard(enterpriseId: string): BlockShard {
    return {
      shardId: `SHARD-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      enterpriseId,
      blockHash: this.generateShardHash({ enterpriseId, ts: Date.now() }),
      prevHash: '0x00000000000000000000000000000000',
      status: 'ACTIVE',
      timestamp: Date.now()
    };
  }

  public signAuditEntry(userId: string, role: UserRole, action: string, oldValue: string, newValue: string): AuditTrailEntry {
    const timestamp = Date.now();
    const dataToHash = { userId, action, oldValue, newValue, timestamp };
    return {
      id: `SIG-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      timestamp, userId, role, action, oldValue, newValue,
      hash: this.generateShardHash(dataToHash)
    };
  }
}

export const ShardingService = BlockchainShardingService.getInstance();
