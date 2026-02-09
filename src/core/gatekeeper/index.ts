export { GatekeeperService } from './service';
export type { GatekeeperDecision, EmergencyToken, GatekeeperState } from './types';

// Singleton instance
import { GatekeeperService } from './service';
export const gatekeeper = GatekeeperService.getInstance();

// Helper for state transitions
export async function approveConstitutionalTransition(
  targetState: string,
  evidence: string[]
): Promise<boolean> {
  return gatekeeper.approveStateTransition(targetState, evidence);
}

// Emergency protocols
export async function emergencyProtocol(action: 'lockdown' | 'recovery', reason: string): Promise<boolean> {
  switch (action) {
    case 'lockdown':
      return gatekeeper.emergencyLockdown(reason);
    case 'recovery':
      // TODO: Implement recovery protocol
      return false;
    default:
      throw new Error(`Unknown emergency action: ${action}`);
  }
}
