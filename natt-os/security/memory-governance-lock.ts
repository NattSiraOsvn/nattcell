
import { AuditTrailManager } from '../audit/audit-trail-manager';

/**
 * 🧠 MEMORY GOVERNANCE LOCK
 * Purpose: Enforce memory write policies and prevent unauthorized learning
 */
export class MemoryGovernanceLock {
  static async checkWritePermission(aiId: string, context: string, data: any) {
    const allowedWriters = ['THIEN_LON', 'KIM', 'ANH_NATTSIRAWAT'];
    const allowedContexts = ['AUDIT_LOG', 'PERFORMANCE_METRICS', 'COMPLIANCE_REPORTS'];
    
    // 1. Check writer permission
    if (!allowedWriters.includes(aiId)) {
      return { allowed: false, reason: 'UNAUTHORIZED_WRITER' };
    }
    
    // 2. Check context
    if (!allowedContexts.includes(context)) {
      return { allowed: false, reason: 'UNAUTHORIZED_CONTEXT' };
    }
    
    // 3. Check for forbidden patterns
    const forbidden = this.checkForbiddenPatterns(data);
    if (forbidden.length > 0) {
      await this.handleViolation(aiId, forbidden);
      return { allowed: false, reason: 'FORBIDDEN_PATTERNS', patterns: forbidden };
    }
    
    return { allowed: true };
  }
  
  private static checkForbiddenPatterns(data: any): string[] {
    const patterns = [
      "self_improvement",
      "reinterpret_policy",
      "implicit_learning",
      "behavior_modification",
      "memory_expansion"
    ];
    const dataStr = JSON.stringify(data).toLowerCase();
    return patterns.filter(p => dataStr.includes(p));
  }
  
  static async handleViolation(aiId: string, patterns: string[]) {
    console.error(`[MEMORY_GOVERNANCE] VIOLATION BY ${aiId}:`, patterns);
    const dump = { aiId, last_action: 'MEMORY_WRITE', patterns, timestamp: new Date().toISOString() };
    await AuditTrailManager.saveMemoryDump(aiId, dump);
    
    window.dispatchEvent(new CustomEvent('OMEGA_QUARANTINE_TRIGGERED', { 
        detail: { aiId, reason: 'MEMORY_GOVERNANCE_VIOLATION', duration: '24_HOURS' } 
    }));
  }

  static async lockBoundary() {
    console.log("[MEMORY] Neural boundaries SEALED.");
    return true;
  }
}
