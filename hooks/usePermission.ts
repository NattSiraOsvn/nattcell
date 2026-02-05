
import { UserRole, Permission, UserContext } from '../types';

export const usePermission = (user: UserContext | null) => {
  const can = (permission: Permission): boolean => {
    if (!user) return false;
    
    // Master và Admin có toàn quyền
    if (user.role === UserRole.MASTER || user.role === UserRole.ADMIN) {
      return true;
    }

    // Check cụ thể trong danh sách permissions
    return user.permissions.includes(permission);
  };

  return { can };
};
