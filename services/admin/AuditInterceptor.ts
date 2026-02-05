
import { ShardingService } from '../blockchainService.ts';
import { EventBridge } from '../eventBridge.ts';
import { AuditProvider } from './AuditService.ts';

/**
 * 🛡️ GLOBAL AUDIT INTERCEPTOR (KIM - TEAM 3)
 * Quản lý hàng chờ niêm phong và bóc tách dữ liệu nhạy cảm.
 */
class GlobalAuditInterceptor {
  private static instance: GlobalAuditInterceptor;
  private queue: any[] = [];
  private readonly BATCH_SIZE = 50;
  private isProcessing = false;

  public static getInstance() {
    if (!GlobalAuditInterceptor.instance) GlobalAuditInterceptor.instance = new GlobalAuditInterceptor();
    return GlobalAuditInterceptor.instance;
  }

  /**
   * Ghi nhận sự kiện Audit vào hàng chờ Staging
   */
  public async record(moduleId: string, action: string, payload: any, userId: string) {
    const sanitizedPayload = this.maskSensitiveData(payload);
    
    const entry = {
      id: crypto.randomUUID(),
      moduleId,
      action,
      payload: sanitizedPayload,
      userId,
      timestamp: Date.now()
    };

    this.queue.push(entry);
    
    if (this.queue.length >= this.BATCH_SIZE) {
      await this.flush();
    }
  }

  /**
   * Niêm phong hàng loạt (Batch Sealing)
   */
  private async flush() {
    if (this.isProcessing || this.queue.length === 0) return;
    this.isProcessing = true;

    const batch = this.queue.splice(0, this.BATCH_SIZE);
    const batchHash = ShardingService.generateShardHash(batch);

    console.log(`[AUDIT-INTERCEPTOR] Sealing Batch of ${batch.length} events. RootHash: ${batchHash}`);
    
    // Ghi log tổng hợp vào AuditProvider
    await AuditProvider.logAction(
      'SYSTEM',
      'BATCH_AUDIT_SEALED',
      { count: batch.length, rootHash: batchHash },
      'system'
    );

    this.isProcessing = false;
  }

  private maskSensitiveData(data: any): any {
    if (!data || typeof data !== 'object') return data;
    const sensitiveKeys = ['password', 'token', 'cccd', 'secret', 'pin', 'bank_account'];
    const masked = { ...data };

    for (const key in masked) {
      if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
        masked[key] = '***MASKED***';
      } else if (typeof masked[key] === 'object') {
        masked[key] = this.maskSensitiveData(masked[key]);
      }
    }
    return masked;
  }
}

export const AuditInterceptor = GlobalAuditInterceptor.getInstance();
