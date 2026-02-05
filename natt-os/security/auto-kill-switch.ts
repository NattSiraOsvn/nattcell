
import { AuditTrailManager } from '../audit/audit-trail-manager';

/**
 * 💀 AUTO KILL SWITCH
 * Tự động terminate AI và dump memory khi phát hiện vi phạm Critical.
 */
export class AutoKillSwitch {
  private static violationCounts = new Map<string, number>();

  static async onViolation(aiId: string, violation: any) {
    const count = (this.violationCounts.get(aiId) || 0) + 1;
    this.violationCounts.set(aiId, count);

    if (violation.severity === 'CRITICAL' || count >= 3) {
      console.error(`[KILL_SWITCH] TERMINATING ${aiId} DUE TO ${violation.type}`);
      
      // 1. Dump Memory
      const dump = { aiId, last_action: violation, state: 'FROZEN', timestamp: new Date().toISOString() };
      await AuditTrailManager.saveMemoryDump(aiId, dump);

      // 2. Log Termination
      await AuditTrailManager.log({
        type: 'AI_TERMINATED',
        ai_id: aiId,
        reason: violation.type,
        violation_count: count
      });

      // 3. Kích hoạt Quarantine UI
      (window as any).AI_LOCKDOWN = 'ENABLED';
      window.dispatchEvent(new CustomEvent('OMEGA_QUARANTINE_TRIGGERED', { detail: { aiId, reason: violation.type } }));

      return { terminated: true };
    }

    return { terminated: false };
  }
}
