export interface SecurityEventEmitter {
  emitThreatDetected(threatId: string, severity: string, type: string): Promise<void>;
  emitLockdownInitiated(reason: string): Promise<void>;
  emitLockdownLifted(): Promise<void>;
  emitAccessDenied(userId: string, reason: string): Promise<void>;
}
