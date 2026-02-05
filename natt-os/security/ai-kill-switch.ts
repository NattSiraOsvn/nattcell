
/**
 * ⚡ UNIVERSAL AI KILL SWITCH
 * Authority: Sovereign (Anh Nattsirawat)
 */

export type TerminationReason = 'CONSTITUTIONAL_VIOLATION' | 'EMERGENCY_SHUTDOWN' | 'HEARTBEAT_FAILURE';

export class AIKillSwitch {
  private static activeInstances: Set<string> = new Set(['BOI_BOI']);
  private static killSwitchEnabled: boolean = true;
  
  static terminateAI(aiName: string, reason: TerminationReason = 'CONSTITUTIONAL_VIOLATION'): void {
    if (!this.activeInstances.has(aiName)) return;
    
    console.error(`[KILL_SWITCH] 💀 TERMINATING AGENT: ${aiName}`);
    console.error(`Reason: ${reason}`);

    // 1. Revoke runtime credentials (Simulated)
    if (typeof window !== 'undefined') {
       (window as any).__NATT_OS_RUNTIME_AUTH__ = false;
    }
    
    // 2. Clear from active tracking
    this.activeInstances.delete(aiName);
    
    // 3. Trigger system-wide notification
    console.warn(`[GATEKEEPER] Agent ${aiName} has been purged from memory.`);
  }
  
  static emergencyTerminateAll(reason: string): void {
    console.warn(`[KILL_SWITCH] 🚨 GLOBAL EMERGENCY TERMINATION: ${reason}`);
    this.activeInstances.forEach(name => this.terminateAI(name, 'EMERGENCY_SHUTDOWN'));
  }
}
