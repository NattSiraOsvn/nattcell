/**
 * 🛡️ GLOBAL IDEMPOTENCY ENFORCER - PRODUCTION LEDGER
 * Đảm bảo tính duy nhất của giao dịch thông qua sổ cái lưu trữ bền vững.
 * Mô phỏng persistent database ledger thông qua LocalStorage cho môi trường trình duyệt.
 */
export class GlobalIdempotencyEnforcer {
  private static instance: GlobalIdempotencyEnforcer;
  private readonly STORAGE_KEY = 'NATT_OS_IDEMPOTENCY_LEDGER_V2';

  private constructor() {
    this.initLedger();
  }

  static getInstance(): GlobalIdempotencyEnforcer {
    if (!GlobalIdempotencyEnforcer.instance) {
      GlobalIdempotencyEnforcer.instance = new GlobalIdempotencyEnforcer();
    }
    return GlobalIdempotencyEnforcer.instance;
  }

  private initLedger() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({}));
    }
  }

  /**
   * Kiểm tra và thiết lập trạng thái xử lý với cơ chế locking giả lập
   */
  async enforce(
    eventId: string,
    tenantId: string,
    serviceName: string,
    payload: any,
    ttlHours: number = 24
  ): Promise<{ isDuplicate: boolean; cachedResult?: any }> {
    const requestHash = await this.generateHash(eventId, tenantId, serviceName, payload);
    const ledger = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
    const now = Date.now();

    // 1. Cleanup expired entries
    this.cleanup(ledger, now);

    // 2. Check for duplicate/existing process
    if (ledger[requestHash]) {
      const entry = ledger[requestHash];
      if (entry.status === 'PROCESSED') {
        console.log(`[IDEMPOTENCY] Cache Hit: ${requestHash.substring(0, 8)}`);
        return { isDuplicate: true, cachedResult: entry.result_cache };
      }
      // If it's failed or processing, we treat as duplicate for safety in this layer
      return { isDuplicate: true }; 
    }

    // 3. Mark as processing (Simulate optimistic lock)
    ledger[requestHash] = {
      event_id: eventId,
      tenant_id: tenantId,
      service_name: serviceName,
      status: 'PROCESSING',
      processed_at: now,
      expires_at: now + (ttlHours * 3600000)
    };
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(ledger));
    return { isDuplicate: false };
  }

  /**
   * Niêm phong kết quả vào sổ cái vĩnh viễn
   */
  async setResult(
    eventId: string,
    tenantId: string,
    serviceName: string,
    payload: any,
    result: any
  ): Promise<void> {
    const requestHash = await this.generateHash(eventId, tenantId, serviceName, payload);
    const ledger = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
    
    if (ledger[requestHash]) {
      ledger[requestHash].status = result?.status === 'FAILED' ? 'FAILED' : 'PROCESSED';
      ledger[requestHash].result_cache = result;
      ledger[requestHash].completed_at = Date.now();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(ledger));
    }
  }

  private cleanup(ledger: any, now: number) {
    Object.keys(ledger).forEach(key => {
      if (ledger[key].expires_at < now) {
        delete ledger[key];
      }
    });
  }

  private async generateHash(...args: any[]): Promise<string> {
    const str = JSON.stringify(args);
    const msgBuffer = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  }
}