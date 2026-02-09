/**
 * AUDIT EVENTS - cell:audit (MOD-028)
 */

import { BaseEvent, createBaseEvent, EventActor } from '../base-event.contract';

export interface AuditEntryPayload {
  audit_id: string;
  action: string;
  resource: string;
  resource_id: string;
  actor_id: string;
  actor_type: 'USER' | 'SYSTEM' | 'AI';
  details: Record<string, unknown>;
  hash: string;
  prev_hash: string;
}

export const AUDIT_EVENTS = {
  ENTRY_CREATED: 'audit.entry.created',
  CHAIN_VERIFIED: 'audit.chain.verified',
  INTEGRITY_ALERT: 'audit.integrity.alert',
} as const;

export function createAuditEntryEvent(
  payload: AuditEntryPayload,
  actor: EventActor,
  correlationId?: string
): BaseEvent<AuditEntryPayload> {
  return createBaseEvent(
    AUDIT_EVENTS.ENTRY_CREATED,
    payload,
    'cell:audit',
    'GOVERNANCE',
    actor,
    correlationId
  );
}
