import { RBACEventEmitter } from '../../ports/RBACEventEmitter';

export class RBACEventEmitterAdapter implements RBACEventEmitter {
  async emitRoleAssigned(userId: string, roleId: string, assignedBy: string) {
    console.log('[RBAC-CELL] rbac.role.assigned:', { userId, roleId, assignedBy });
  }
  async emitRoleRevoked(userId: string, roleId: string, revokedBy: string) {
    console.log('[RBAC-CELL] rbac.role.revoked:', { userId, roleId, revokedBy });
  }
  async emitPermissionGranted(roleId: string, permission: string) {
    console.log('[RBAC-CELL] rbac.permission.granted:', { roleId, permission });
  }
  async emitPermissionRevoked(roleId: string, permission: string) {
    console.log('[RBAC-CELL] rbac.permission.revoked:', { roleId, permission });
  }
  async emitAccessDenied(userId: string, resource: string, action: string) {
    console.log('[RBAC-CELL] rbac.access.denied:', { userId, resource, action });
  }
}
