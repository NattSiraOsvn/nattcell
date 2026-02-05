
import { RBACRole, RBACPermission, Permission } from '../types';

class RBACService {
  private static instance: RBACService;
  private roles: RBACRole[] = [
    { id: 'r1', name: 'MASTER', description: 'Quyền tối thượng Natt-OS', is_system: true, permissions: ['ALL'] },
    { id: 'r2', name: 'MANAGER', description: 'Quản lý bộ phận', is_system: false, permissions: ['VIEW_DASHBOARD', 'MANAGE_STOCK'] },
    { id: 'r3', name: 'SALES', description: 'Nhân viên bán hàng', is_system: false, permissions: ['VIEW_DASHBOARD', 'CREATE_ORDER'] }
  ];

  private permissions: RBACPermission[] = [
    { id: 'VIEW_DASHBOARD', resource: 'dashboard', action: 'read', description: 'Xem tổng quan hệ thống' },
    { id: 'CREATE_ORDER', resource: 'order', action: 'create', description: 'Khởi tạo đơn hàng mới' },
    { id: 'APPROVE_REFUND', resource: 'refund', action: 'approve', description: 'Phê duyệt hoàn tiền' },
    { id: 'MANAGE_STOCK', resource: 'stock', action: 'update', description: 'Điều chỉnh tồn kho' },
    { id: 'EDIT_SYSTEM_CONFIG', resource: 'config', action: 'update', description: 'Thay đổi tham số lõi' }
  ];

  static getInstance() {
    if (!RBACService.instance) RBACService.instance = new RBACService();
    return RBACService.instance;
  }

  async getRoles() { return this.roles; }
  async getPermissions() { return this.permissions; }

  async hasPermission(userRole: string, permission: Permission): Promise<boolean> {
    if (userRole === 'MASTER' || userRole === 'ADMIN') return true;
    const role = this.roles.find(r => r.name === userRole);
    if (!role) return false;
    return role.permissions.includes(permission as string);
  }

  async updateRolePermissions(roleId: string, permissionIds: string[]) {
    this.roles = this.roles.map(r => r.id === roleId ? { ...r, permissions: permissionIds } : r);
    console.log(`[RBAC] Updated permissions for role ${roleId}`);
  }
}

export const RBACProvider = RBACService.getInstance();
