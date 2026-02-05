
import { ModuleConfig, ViewType, UserRole } from '../types';

/**
 * 🧩 MODULE REGISTRY
 * Danh mục các Node Shard được phép vận hành trong hệ thống.
 */
export const MODULE_REGISTRY: Record<string, ModuleConfig> = {
  [ViewType.dashboard]: { 
    id: ViewType.dashboard, 
    title: 'TỔNG QUAN', 
    icon: '🏠', 
    group: 'CORE', 
    allowedRoles: [UserRole.MASTER, UserRole.ADMIN], 
    componentName: 'MasterDashboard', 
    active: true 
  },
  [ViewType.sales_terminal]: { 
    id: ViewType.sales_terminal, 
    title: 'CHỐT ĐƠN HÀNG', 
    icon: '🛍️', 
    group: 'CORE', 
    allowedRoles: [UserRole.MASTER, UserRole.LEVEL_5], 
    componentName: 'SaleTerminal', 
    active: true 
  },
  [ViewType.warehouse]: { 
    id: ViewType.warehouse, 
    title: 'KHO TỔNG', 
    icon: '📦', 
    group: 'CORE', 
    allowedRoles: [UserRole.MASTER, UserRole.LEVEL_2], 
    componentName: 'WarehouseManagement', 
    active: true 
  },
  [ViewType.command]: { 
    id: ViewType.command, 
    title: 'COMMAND CENTER', 
    icon: '🔱', 
    group: 'CORE', 
    allowedRoles: [UserRole.MASTER], 
    componentName: 'ThienCommandCenter', 
    active: true 
  }
};

export class ModuleRegistry {
  static getAllModules(): ModuleConfig[] {
    return Object.values(MODULE_REGISTRY);
  }

  static registerModule(config: ModuleConfig) {
    MODULE_REGISTRY[config.id] = config;
  }

  static getModuleById(id: string): ModuleConfig | undefined {
    return MODULE_REGISTRY[id];
  }
}
