
import { UserRole, Permission, ModuleID, RolePermissions } from '../types';

/**
 * NATT-OS AUTHENTICATION & RBAC ENGINE
 * Quản lý ma trận quyền hạn dựa trên Identity Role
 */
export class AuthService {
  private static instance: AuthService;
  
  // Helper for full access
  private getFullPermissions(): Permission[] {
    return [Permission.VIEW, Permission.CREATE, Permission.EDIT, Permission.DELETE, Permission.APPROVE, Permission.SIGN, Permission.EXPORT];
  }

  // Helper for view only
  private getViewPermissions(): Permission[] {
    return [Permission.VIEW, Permission.EXPORT];
  }

  // Helper for Operator/Staff
  private getOperatorPermissions(): Permission[] {
    return [Permission.VIEW, Permission.CREATE, Permission.EDIT];
  }

  // Định nghĩa ma trận quyền mặc định cho các vai trò Identity
  private readonly matrix: Record<UserRole, RolePermissions> = {
    [UserRole.MASTER]: {
      [ModuleID.PRODUCTION]: this.getFullPermissions(),
      [ModuleID.SALES]: this.getFullPermissions(),
      [ModuleID.FINANCE]: this.getFullPermissions(),
      [ModuleID.LEGAL]: this.getFullPermissions(),
      [ModuleID.HR]: this.getFullPermissions(),
      [ModuleID.REPORTING]: this.getFullPermissions(),
      [ModuleID.INVENTORY]: this.getFullPermissions()
    },
    [UserRole.ADMIN]: {
      [ModuleID.PRODUCTION]: this.getFullPermissions(),
      [ModuleID.SALES]: this.getFullPermissions(),
      [ModuleID.FINANCE]: this.getFullPermissions(),
      [ModuleID.LEGAL]: this.getFullPermissions(),
      [ModuleID.HR]: this.getFullPermissions(),
      [ModuleID.REPORTING]: this.getFullPermissions(),
      [ModuleID.INVENTORY]: this.getFullPermissions()
    },
    [UserRole.LEVEL_1]: { // CEO
      [ModuleID.PRODUCTION]: this.getFullPermissions(),
      [ModuleID.SALES]: this.getFullPermissions(),
      [ModuleID.FINANCE]: this.getFullPermissions(),
      [ModuleID.LEGAL]: this.getFullPermissions(),
      [ModuleID.HR]: this.getFullPermissions(),
      [ModuleID.REPORTING]: this.getFullPermissions(),
      [ModuleID.INVENTORY]: this.getFullPermissions()
    },
    [UserRole.LEVEL_2]: { // Manager
      [ModuleID.PRODUCTION]: [Permission.VIEW, Permission.EDIT, Permission.APPROVE],
      [ModuleID.SALES]: [Permission.VIEW, Permission.EDIT, Permission.APPROVE],
      [ModuleID.FINANCE]: [Permission.VIEW, Permission.APPROVE],
      [ModuleID.LEGAL]: [Permission.VIEW, Permission.APPROVE],
      [ModuleID.HR]: [Permission.VIEW, Permission.APPROVE],
      [ModuleID.REPORTING]: [Permission.VIEW, Permission.EXPORT],
      [ModuleID.INVENTORY]: [Permission.VIEW, Permission.APPROVE]
    },
    [UserRole.LEVEL_3]: { // Leader
        [ModuleID.PRODUCTION]: this.getOperatorPermissions(),
        [ModuleID.SALES]: this.getOperatorPermissions(),
        [ModuleID.FINANCE]: [Permission.VIEW],
        [ModuleID.LEGAL]: [Permission.VIEW],
        [ModuleID.HR]: [Permission.VIEW],
        [ModuleID.REPORTING]: [Permission.VIEW],
        [ModuleID.INVENTORY]: this.getOperatorPermissions()
    },
    [UserRole.LEVEL_4]: { // Deputy
        [ModuleID.PRODUCTION]: this.getOperatorPermissions(),
        [ModuleID.SALES]: this.getOperatorPermissions(),
        [ModuleID.FINANCE]: [Permission.VIEW],
        [ModuleID.LEGAL]: [Permission.VIEW],
        [ModuleID.HR]: [Permission.VIEW],
        [ModuleID.REPORTING]: [Permission.VIEW],
        [ModuleID.INVENTORY]: this.getOperatorPermissions()
    },
    [UserRole.LEVEL_5]: { // Staff
        [ModuleID.PRODUCTION]: this.getOperatorPermissions(),
        [ModuleID.SALES]: this.getOperatorPermissions(),
        [ModuleID.FINANCE]: [Permission.VIEW],
        [ModuleID.LEGAL]: [Permission.VIEW],
        [ModuleID.HR]: [Permission.VIEW],
        [ModuleID.REPORTING]: [Permission.VIEW],
        [ModuleID.INVENTORY]: this.getOperatorPermissions()
    },
    [UserRole.LEVEL_6]: { // Worker
        [ModuleID.PRODUCTION]: [Permission.VIEW],
        [ModuleID.SALES]: [],
        [ModuleID.FINANCE]: [],
        [ModuleID.LEGAL]: [],
        [ModuleID.HR]: [Permission.VIEW],
        [ModuleID.REPORTING]: [],
        [ModuleID.INVENTORY]: [Permission.VIEW]
    },
    [UserRole.LEVEL_7]: { // Collaborator
        [ModuleID.PRODUCTION]: [],
        [ModuleID.SALES]: [Permission.VIEW, Permission.CREATE],
        [ModuleID.FINANCE]: [],
        [ModuleID.LEGAL]: [],
        [ModuleID.HR]: [],
        [ModuleID.REPORTING]: [],
        [ModuleID.INVENTORY]: [Permission.VIEW]
    },
    [UserRole.LEVEL_8]: { // Auditor
        [ModuleID.PRODUCTION]: this.getViewPermissions(),
        [ModuleID.SALES]: this.getViewPermissions(),
        [ModuleID.FINANCE]: this.getViewPermissions(),
        [ModuleID.LEGAL]: this.getViewPermissions(),
        [ModuleID.HR]: this.getViewPermissions(),
        [ModuleID.REPORTING]: this.getFullPermissions(),
        [ModuleID.INVENTORY]: this.getViewPermissions()
    },
    // Fix: Unified role mapping for legacy support
    [UserRole.SIGNER]: {
      [ModuleID.PRODUCTION]: [Permission.VIEW],
      [ModuleID.SALES]: [Permission.VIEW],
      [ModuleID.FINANCE]: [Permission.VIEW, Permission.APPROVE, Permission.SIGN, Permission.EXPORT],
      [ModuleID.LEGAL]: [Permission.VIEW, Permission.APPROVE, Permission.SIGN, Permission.EXPORT],
      [ModuleID.HR]: [Permission.VIEW],
      [ModuleID.REPORTING]: [Permission.VIEW, Permission.EXPORT],
      [ModuleID.INVENTORY]: [Permission.VIEW, Permission.EXPORT]
    },
    [UserRole.APPROVER]: {
      [ModuleID.PRODUCTION]: [Permission.VIEW, Permission.EDIT, Permission.APPROVE],
      [ModuleID.SALES]: [Permission.VIEW, Permission.EDIT, Permission.APPROVE],
      [ModuleID.FINANCE]: [Permission.VIEW],
      [ModuleID.LEGAL]: [Permission.VIEW],
      [ModuleID.HR]: [Permission.VIEW, Permission.APPROVE],
      [ModuleID.REPORTING]: [Permission.VIEW, Permission.EXPORT],
      [ModuleID.INVENTORY]: [Permission.VIEW, Permission.APPROVE]
    },
    [UserRole.OPERATOR]: {
      [ModuleID.PRODUCTION]: [Permission.VIEW, Permission.CREATE, Permission.EDIT],
      [ModuleID.SALES]: [Permission.VIEW, Permission.CREATE, Permission.EDIT],
      [ModuleID.FINANCE]: [Permission.VIEW],
      [ModuleID.LEGAL]: [Permission.VIEW],
      [ModuleID.HR]: [Permission.VIEW],
      [ModuleID.REPORTING]: [Permission.VIEW],
      [ModuleID.INVENTORY]: [Permission.VIEW, Permission.CREATE]
    }
  };

  public static getInstance() {
    if (!AuthService.instance) AuthService.instance = new AuthService();
    return AuthService.instance;
  }

  /**
   * Kiểm tra Identity có quyền thực hiện hành động trên Module không
   */
  public hasPermission(role: UserRole, module: ModuleID, action: Permission): boolean {
    const rolePerms = this.matrix[role];
    if (!rolePerms) {
        return false;
    }
    const permissions = rolePerms[module];
    return permissions ? permissions.includes(action) : false;
  }

  /**
   * Lấy toàn bộ ma trận quyền của một Role
   */
  public getPermissions(role: UserRole): RolePermissions {
    return this.matrix[role] || {
        [ModuleID.FINANCE]: [],
        [ModuleID.PRODUCTION]: [],
        [ModuleID.INVENTORY]: [],
        [ModuleID.SALES]: [],
        [ModuleID.LEGAL]: [],
        [ModuleID.HR]: [],
        [ModuleID.REPORTING]: []
    };
  }
}

export const RBACGuard = AuthService.getInstance();
