
/**
 * 📜 AUDIT TRAIL MANAGER - OMEGA CORE
 * Chịu trách nhiệm lưu trữ mọi hành động của AI và các vi phạm.
 */
export class AuditTrailManager {
  private static readonly STORAGE_KEY = 'NATT_OS_AUDIT_TRAIL';

  static async log(event: any) {
    const logs = this.getLogs();
    logs.push({ ...event, timestamp: new Date().toISOString() });
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(logs.slice(-5000)));
    console.log(`[AUDIT] Event recorded: ${event.type}`);
  }

  static async logViolation(violation: any) {
    const violations = this.getViolations();
    violations.push({ ...violation, timestamp: new Date().toISOString() });
    localStorage.setItem('NATT_OS_VIOLATIONS', JSON.stringify(violations));
    console.error(`[AUDIT][VIOLATION] ${violation.type} by ${violation.ai_id}`);
  }

  static async saveMemoryDump(aiId: string, dump: any) {
    const key = `NATT_OS_DUMP_${aiId}_${Date.now()}`;
    localStorage.setItem(key, JSON.stringify(dump));
    this.log({ type: 'MEMORY_DUMP_SAVED', ai_id: aiId, dump_ref: key });
  }

  private static getLogs() {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
  }

  private static getViolations() {
    return JSON.parse(localStorage.getItem('NATT_OS_VIOLATIONS') || '[]');
  }
}
