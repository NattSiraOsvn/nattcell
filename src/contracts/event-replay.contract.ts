/**
 * EVENT REPLAY CONTRACT - NATT-OS
 * Điều 21: Replay State Binding
 */

import { ConstitutionalState } from './cell.contract';
import { BaseEvent } from './base-event.contract';

export type ReplayMode = 'FULL' | 'SAGA' | 'SELECTIVE' | 'POINT_IN_TIME';

export interface ReplayContext {
  target_state: ConstitutionalState;
  mode: ReplayMode;
  correlation_id?: string;
  from_timestamp?: number;
  to_timestamp?: number;
  event_types?: string[];
  dry_run: boolean;
}

export interface ReplayResult {
  success: boolean;
  events_processed: number;
  events_skipped: number;
  errors: string[];
  final_state: ConstitutionalState;
}

export const STATE_EVENT_VALIDITY: Record<ConstitutionalState, string[]> = {
  STATE_1: ['config.*'],
  STATE_2: ['config.*', 'rbac.*', 'monitor.*', 'audit.*', 'security.*'],
  STATE_3: ['config.*', 'rbac.*', 'monitor.*', 'audit.*', 'security.*', 'sync.*', 'api.*'],
  STATE_4: ['*'],
  STATE_5: ['*'],
  STATE_6: ['*'],
  STATE_7: ['*'],
};

export function isEventValidForState(
  eventType: string,
  state: ConstitutionalState
): boolean {
  const validPatterns = STATE_EVENT_VALIDITY[state];
  
  return validPatterns.some(pattern => {
    if (pattern === '*') return true;
    if (pattern.endsWith('.*')) {
      const prefix = pattern.slice(0, -2);
      return eventType.startsWith(prefix + '.');
    }
    return pattern === eventType;
  });
}

export function validateReplayContext(context: ReplayContext): string[] {
  const errors: string[] = [];
  
  if (!context.target_state) {
    errors.push('target_state is required');
  }
  
  if (context.mode === 'SAGA' && !context.correlation_id) {
    errors.push('correlation_id is required for SAGA replay');
  }
  
  if (context.mode === 'POINT_IN_TIME' && !context.to_timestamp) {
    errors.push('to_timestamp is required for POINT_IN_TIME replay');
  }
  
  if (context.mode === 'SELECTIVE' && (!context.event_types || context.event_types.length === 0)) {
    errors.push('event_types is required for SELECTIVE replay');
  }
  
  return errors;
}

export function filterEventsForReplay(
  events: BaseEvent[],
  context: ReplayContext
): BaseEvent[] {
  return events.filter(event => {
    // Check state validity
    if (!isEventValidForState(event.event_type, context.target_state)) {
      return false;
    }
    
    // Check time range
    if (context.from_timestamp && event.timestamp < context.from_timestamp) {
      return false;
    }
    if (context.to_timestamp && event.timestamp > context.to_timestamp) {
      return false;
    }
    
    // Check correlation for SAGA mode
    if (context.mode === 'SAGA' && event.correlation_id !== context.correlation_id) {
      return false;
    }
    
    // Check event types for SELECTIVE mode
    if (context.mode === 'SELECTIVE' && context.event_types) {
      if (!context.event_types.includes(event.event_type)) {
        return false;
      }
    }
    
    return true;
  });
}
