import { UserRole, Permission } from '../types';

export class RBACGuard {
  static getPermissions(role: UserRole): Record<string, boolean> {
    const matrix: Record<UserRole, Record<string, boolean>> = {
      [UserRole.ADMIN]: { read: true, write: true, delete: true },
      [UserRole.MANAGER]: { read: true, write: true, delete: false },
      [UserRole.STAFF]: { read: true, write: false, delete: false },
      [UserRole.VIEWER]: { read: true, write: false, delete: false },
    } as any;
    return matrix[role] ?? { read: true, write: false, delete: false };
  }
}
