/**
 * RBAC EVENTS - cell:rbac (MOD-026)
 */

import { BaseEvent, createBaseEvent, EventActor } from '../base-event.contract';

export interface RoleAssignedPayload {
  user_id: string;
  role_id: string;
  assigned_by: string;
  effective_from: number;
  effective_to?: number;
}

export interface PermissionGrantedPayload {
  role_id: string;
  permission: string;
  resource: string;
  granted_by: string;
}

export const RBAC_EVENTS = {
  ROLE_ASSIGNED: 'rbac.role.assigned',
  ROLE_REVOKED: 'rbac.role.revoked',
  PERMISSION_GRANTED: 'rbac.permission.granted',
  PERMISSION_REVOKED: 'rbac.permission.revoked',
} as const;

export function createRoleAssignedEvent(
  payload: RoleAssignedPayload,
  actor: EventActor,
  correlationId?: string
): BaseEvent<RoleAssignedPayload> {
  return createBaseEvent(
    RBAC_EVENTS.ROLE_ASSIGNED,
    payload,
    'cell:rbac',
    'GOVERNANCE',
    actor,
    correlationId
  );
}
