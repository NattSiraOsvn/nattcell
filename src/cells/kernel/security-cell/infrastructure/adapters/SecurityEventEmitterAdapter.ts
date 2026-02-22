import { SecurityEventEmitter } from '../../ports/SecurityEventEmitter';

export class SecurityEventEmitterAdapter implements SecurityEventEmitter {
  async emitTHReatDetected(tHReatId: string, severity: string, type: string) {
    console.log('[SECURITY-CELL] security.tHReat.detected:', { tHReatId, severity, type });
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
