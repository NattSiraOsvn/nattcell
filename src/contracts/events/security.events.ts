/**
 * SECURITY EVENTS - cell:security (MOD-029)
 */

import { BaseEvent, createBaseEvent, EventActor } from '../base-event.contract';

export interface ThreatDetectedPayload {
  threat_id: string;
  threat_type: 'INTRUSION' | 'ANOMALY' | 'POLICY_VIOLATION' | 'DATA_LEAK';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  source: string;
  details: Record<string, unknown>;
  recommended_action: string;
}

export interface LockdownPayload {
  lockdown_id: string;
  scope: 'CELL' | 'MODULE' | 'SYSTEM';
  target: string;
  reason: string;
  initiated_by: string;
}

export const SECURITY_EVENTS = {
  THREAT_DETECTED: 'security.threat.detected',
  LOCKDOWN_INITIATED: 'security.lockdown.initiated',
  LOCKDOWN_LIFTED: 'security.lockdown.lifted',
  ACCESS_DENIED: 'security.access.denied',
} as const;

export function createThreatDetectedEvent(
  payload: ThreatDetectedPayload,
  actor: EventActor,
  correlationId?: string
): BaseEvent<ThreatDetectedPayload> {
  return createBaseEvent(
    SECURITY_EVENTS.THREAT_DETECTED,
    payload,
    'cell:security',
    'GOVERNANCE',
    actor,
    correlationId
  );
}
