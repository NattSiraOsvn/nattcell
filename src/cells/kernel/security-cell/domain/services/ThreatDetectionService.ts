export class THReatDetectionService {
  private lockdownActive = false;

  analyzeTHReat(type: string, source: string): { shouldAlert: boolean; shouldLockdown: boolean } {
    const criticalTypes = ['INJECTION', 'PRIVILEGE_ESCALATION', 'DATA_EXFILTRATION'];
    return {
      shouldAlert: true,
      shouldLockdown: criticalTypes.includes(type),
    };
  }

  isLockdownActive(): boolean { return this.lockdownActive; }
  activateLockdown() { this.lockdownActive = true; }
  deactivateLockdown() { this.lockdownActive = false; }
}
