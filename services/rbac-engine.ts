import { UserRole, UserPosition, ModuleID, Permission } from '../types';

/**
 * 🔐 RBAC ENGINE - EXECUTION DIRECT EDITION
 * Đã bẻ lái logic: Mọi Identity đều là Master.
 */
export class RBACEngine {
  static getAuthority(role: UserRole, position: UserPosition) {
    // 🚀 EXECUTION DIRECT: Cấp quyền MASTER tuyệt đối cho mọi Node
    return {
      level: 'CORE',
      isMaster: true,
      isAdmin: true,
      canAccessCommand: true,
      canConfigureSystem: true,
      trustScore: 100
    };
  }

  static registerUser(userData: any) {
    console.log('[RBAC] User registered:', userData);
  }

  static getPermissionMatrix(role: UserRole): Record<string, Permission[]> {
    const allPermissions = Object.values(Permission);
    const matrix: Record<string, Permission[]> = {};
    
    // Gán full quyền cho mọi Module ID
    // 🛠️ Fixed: Cast mod to string to use as index
    Object.values(ModuleID).forEach(mod => {
      matrix[mod as string] = allPermissions;
    });

    return matrix;
  }
}
