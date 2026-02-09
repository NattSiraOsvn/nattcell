/**
 * MONITOR EVENTS - cell:monitor (MOD-027)
 */

import { BaseEvent, createBaseEvent, EventActor } from '../base-event.contract';
import { CellHealth } from '../cell.contract';

export interface HealthReportedPayload {
  cell_id: string;
  health: CellHealth;
  metrics: Record<string, number>;
}

export interface AlertTriggeredPayload {
  alert_id: string;
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  message: string;
  source: string;
}

export const MONITOR_EVENTS = {
  HEALTH_REPORTED: 'monitor.health.reported',
  ALERT_TRIGGERED: 'monitor.alert.triggered',
  METRIC_RECORDED: 'monitor.metric.recorded',
} as const;

export function createHealthReportedEvent(
  payload: HealthReportedPayload,
  actor: EventActor,
  correlationId?: string
): BaseEvent<HealthReportedPayload> {
  return createBaseEvent(
    MONITOR_EVENTS.HEALTH_REPORTED,
    payload,
    'cell:monitor',
    'SYSTEM',
    actor,
    correlationId
  );
}
