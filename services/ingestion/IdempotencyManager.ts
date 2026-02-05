import { GlobalIdempotencyEnforcer } from '../shared/GlobalIdempotencyEnforcer.ts';

/**
 * 🧬 IDEMPOTENCY MANAGER - OMEGA CORE
 * Chuyển đổi từ cache tạm sang Sổ cái Database (Persistent Ledger).
 */
export class IdempotencyManager {
  private enforcer: GlobalIdempotencyEnforcer;

  constructor() {
    this.enforcer = GlobalIdempotencyEnforcer.getInstance();
  }

  /**
   * Thực thi logic với đảm bảo tính nhất quán và chống trùng lặp tuyệt đối.
   */
  async processWithIdempotency<T>(
    eventId: string,
    tenantId: string,
    serviceName: string,
    payload: any,
    handler: () => Promise<T>
  ): Promise<T> {
    // 🛡️ Kiểm tra sổ cái toàn cục (Persistent Ledger)
    const { isDuplicate, cachedResult } = await this.enforcer.enforce(
      eventId,
      tenantId,
      serviceName,
      payload
    );

    if (isDuplicate) {
      if (cachedResult) {
        console.log(`🔄 Idempotency hit for ${eventId}. Returning cached result.`);
        return cachedResult as T;
      }
      throw new Error(`Giao dịch ${eventId} đang được xử lý hoặc đã thất bại trong Shard khác.`);
    }

    try {
      const result = await handler();
      
      // 📝 Niêm phong kết quả vào sổ cái
      await this.enforcer.setResult(eventId, tenantId, serviceName, payload, result);
      
      return result;
    } catch (error: any) {
      // Đánh dấu thất bại trong ledger để Audit
      await this.enforcer.setResult(eventId, tenantId, serviceName, payload, {
        error: error.message,
        status: 'FAILED',
        timestamp: Date.now()
      });
      throw error;
    }
  }

  // Legacy compatibility method
  async isDuplicate(file: File): Promise<boolean> {
      const { isDuplicate } = await this.enforcer.enforce(
          file.name,
          'SYSTEM',
          'INGESTION',
          { size: file.size, lastModified: file.lastModified }
      );
      return isDuplicate;
  }

  async recordEvent(file: File, status: string): Promise<void> {
       await this.enforcer.setResult(
          file.name,
          'SYSTEM',
          'INGESTION',
          { size: file.size, lastModified: file.lastModified },
          { status }
      );
  }
}