import { SecurityEventEmitter } from '../../ports/SecurityEventEmitter';

export class SecurityEventEmitterAdapter implements SecurityEventEmitter {
  async emitThreatDetected(threatId: string, severity: string, type: string) {
    console.log('[SECURITY-CELL] security.threat.detected:', { threatId, severity, type });
  }
  async emitLockdownInitiated(reason: string) {
    console.log('[SECURITY-CELL] security.lockdown.initiated:', { reason });
  }
  async emitLockdownLifted() {
    console.log('[SECURITY-CELL] security.lockdown.lifted');
  }
  async emitAccessDenied(userId: string, reason: string) {
    console.log('[SECURITY-CELL] security.access.denied:', { userId, reason });
  }
}
