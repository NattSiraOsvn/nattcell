/**
 * BASE EVENT CONTRACT - NATT-OS EDA Foundation
 * Điều 17: Mọi hành vi tạo thay đổi trạng thái PHẢI là Event
 */

export type Domain = 
  | 'GOVERNANCE'
  | 'ACCOUNTING'
  | 'HR'
  | 'SALES'
  | 'WAREHOUSE'
  | 'PRODUCTION'
  | 'SYSTEM';

export type PersonaID = 
  | 'SYSTEM'
  | 'GATEKEEPER'
  | 'ADMIN'
  | 'USER'
  | 'AI_KIM'
  | 'AI_BANG'
  | 'AI_BOIBOI';

export interface EventActor {
  persona: PersonaID;
  user_id?: string;
  session_id?: string;
}

export interface BaseEvent<T = unknown> {
  // Identity
  event_id: string;
  event_type: string;
  event_version: string;
  
  // Source
  source_cell: string;
  source_module: string;
  
  // Actor & Domain
  actor: EventActor;
  domain: Domain;
  
  // Causality Chain
  timestamp: number;
  correlation_id: string;
  causation_id?: string;
  
  // Payload
  payload: T;
  
  // Audit
  audit_required: boolean;
}

export interface EventMetadata {
  retry_count?: number;
  original_timestamp?: number;
  replay_mode?: boolean;
  dry_run?: boolean;
}

export function createEventId(prefix: string = 'evt'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${random}`;
}

export function createCorrelationId(): string {
  return `cor_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

export function createBaseEvent<T>(
  type: string,
  payload: T,
  source_cell: string,
  domain: Domain,
  actor: EventActor,
  correlation_id?: string,
  causation_id?: string
): BaseEvent<T> {
  return {
    event_id: createEventId(),
    event_type: type,
    event_version: '1.0.0',
    source_cell,
    source_module: source_cell.replace('cell:', ''),
    actor,
    domain,
    timestamp: Date.now(),
    correlation_id: correlation_id || createCorrelationId(),
    causation_id,
    payload,
    audit_required: domain === 'GOVERNANCE' || domain === 'ACCOUNTING',
  };
}
