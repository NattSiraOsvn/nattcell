/**
 * CONFIG EVENTS - cell:config (MOD-025)
 */

import { BaseEvent, createBaseEvent, Domain, EventActor } from '../base-event.contract';

export interface ConfigValue {
  key: string;
  value: unknown;
  type: 'string' | 'number' | 'boolean' | 'json';
  encrypted: boolean;
}

export interface ConfigUpdatedPayload {
  config_key: string;
  old_value: unknown;
  new_value: unknown;
  updated_by: string;
  reason?: string;
}

export interface ConfigSnapshotPayload {
  snapshot_id: string;
  configs: ConfigValue[];
  created_at: number;
}

export const CONFIG_EVENTS = {
  UPDATED: 'config.updated',
  SNAPSHOT_CREATED: 'config.snapshot.created',
  VALIDATED: 'config.validated',
  ROLLBACK: 'config.rollback',
} as const;

export function createConfigUpdatedEvent(
  payload: ConfigUpdatedPayload,
  actor: EventActor,
  correlationId?: string
): BaseEvent<ConfigUpdatedPayload> {
  return createBaseEvent(
    CONFIG_EVENTS.UPDATED,
    payload,
    'cell:config',
    'GOVERNANCE',
    actor,
    correlationId
  );
}

export function createConfigSnapshotEvent(
  payload: ConfigSnapshotPayload,
  actor: EventActor,
  correlationId?: string
): BaseEvent<ConfigSnapshotPayload> {
  return createBaseEvent(
    CONFIG_EVENTS.SNAPSHOT_CREATED,
    payload,
    'cell:config',
    'GOVERNANCE',
    actor,
    correlationId
  );
}
