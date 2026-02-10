import { Role, UserRole } from '../../domain/entities';
import { RBACRepository } from '../../ports/RBACRepository';

export class InMemoryRBACRepository implements RBACRepository {
  private roles = new Map<string, Role>();
  private userRoles = new Map<string, UserRole[]>();

  async getRole(id: string) { return this.roles.get(id) || null; }
  async getAllRoles() { return Array.from(this.roles.values()); }
  async saveRole(role: Role) { this.roles.set(role.id, role); }
  async deleteRole(id: string) { return this.roles.delete(id); }

  async getUserRoles(userId: string) { return this.userRoles.get(userId) || []; }
  
  async assignRole(userRole: UserRole) {
    const existing = this.userRoles.get(userRole.userId) || [];
    existing.push(userRole);
    this.userRoles.set(userRole.userId, existing);
  }

  async revokeRole(userId: string, roleId: string) {
    const existing = this.userRoles.get(userId) || [];
    const filtered = existing.filter(ur => ur.roleId !== roleId);
    this.userRoles.set(userId, filtered);
    return existing.length !== filtered.length;
  }

  async getRolesByPermission(permission: string) {
    return Array.from(this.roles.values()).filter(r => r.hasPermission(permission));
  }

  clear() { this.roles.clear(); this.userRoles.clear(); }
}
