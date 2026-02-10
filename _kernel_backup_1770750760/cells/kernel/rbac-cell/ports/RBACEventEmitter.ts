export interface RBACEventEmitter {
  emitRoleAssigned(userId: string, roleId: string, assignedBy: string): Promise<void>;
  emitRoleRevoked(userId: string, roleId: string, revokedBy: string): Promise<void>;
  emitPermissionGranted(roleId: string, permission: string): Promise<void>;
  emitPermissionRevoked(roleId: string, permission: string): Promise<void>;
  emitAccessDenied(userId: string, resource: string, action: string): Promise<void>;
}
