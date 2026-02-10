import { Role, UserRole } from '../domain/entities';

export interface RBACRepository {
  // Role operations
  getRole(id: string): Promise<Role | null>;
  getAllRoles(): Promise<Role[]>;
  saveRole(role: Role): Promise<void>;
  deleteRole(id: string): Promise<boolean>;

  // User-Role operations
  getUserRoles(userId: string): Promise<UserRole[]>;
  assignRole(userRole: UserRole): Promise<void>;
  revokeRole(userId: string, roleId: string): Promise<boolean>;
  
  // Query
  getRolesByPermission(permission: string): Promise<Role[]>;
}
