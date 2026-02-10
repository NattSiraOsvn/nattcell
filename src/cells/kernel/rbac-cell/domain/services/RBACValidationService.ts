/**
 * RBACValidationService - Validates RBAC operations
 */

import { Role, Permission, UserRole } from '../entities';

export interface AccessCheckResult {
  allowed: boolean;
  reason: string;
  matchedPermissions: string[];
}

export class RBACValidationService {
  checkAccess(roles: Role[], resource: string, action: string): AccessCheckResult {
    const matchedPermissions: string[] = [];
    
    for (const role of roles) {
      const permissionKey = `${resource}:${action}`;
      if (role.hasPermission(permissionKey) || role.hasPermission(`${resource}:*`) || role.hasPermission('*')) {
        matchedPermissions.push(`${role.name}:${permissionKey}`);
      }
    }

    return {
      allowed: matchedPermissions.length > 0,
      reason: matchedPermissions.length > 0 ? 'Access granted' : 'No matching permissions',
      matchedPermissions,
    };
  }

  validateRole(role: Role): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!role.name || role.name.trim().length === 0) errors.push('Role name required');
    if (role.name.length > 100) errors.push('Role name too long');
    return { isValid: errors.length === 0, errors };
  }
}
