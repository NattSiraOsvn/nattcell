
import React from 'react';
import { usePermission } from '../../hooks/usePermission';
import { Permission, UserContext } from '../../types';

interface PermissionGuardProps {
  user: UserContext | null;
  requiredPermission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({ 
  user,
  requiredPermission, 
  children, 
  fallback = (
    <div className="p-10 ai-panel bg-red-950/20 border-red-500/30 text-center">
       <span className="text-4xl mb-4 block">🚫</span>
       <h3 className="text-red-400 font-black uppercase tracking-widest text-xs">Access Restricted</h3>
       <p className="text-gray-500 text-[10px] mt-2 italic">Anh Natt quy định: Bạn không có quyền truy cập Shard này.</p>
    </div>
  ) 
}) => {
  const { can } = usePermission(user);

  if (!user) return null;

  if (can(requiredPermission)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};
