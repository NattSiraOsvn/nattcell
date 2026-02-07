
import { ViewType, UserRole, ModuleConfig } from '@/types.ts';

export const MODULE_REGISTRY: Record<string, ModuleConfig> = {
  [ViewType.dashboard]: { id: ViewType.dashboard, title: 'TỔNG QUAN', icon: '🏠', group: 'CORE', allowedRoles: [UserRole.MASTER, UserRole.ADMIN, UserRole.LEVEL_1], componentName: 'MasterDashboard', active: true },
  [ViewType.sales_tax]: { id: ViewType.sales_tax, title: 'FISCAL TERMINAL (HDĐT)', icon: '📊', group: 'FINANCE', allowedRoles: [UserRole.MASTER, UserRole.LEVEL_1, UserRole.LEVEL_5], componentName: 'SalesTaxModule', active: true },
  [ViewType.production_manager]: { id: ViewType.production_manager, title: 'XƯỞNG CHẾ TÁC', icon: '🏭', group: 'CORE', allowedRoles: [UserRole.MASTER, UserRole.LEVEL_1, UserRole.LEVEL_2], componentName: 'ProductionManager', active: true },
  [ViewType.warehouse]: { id: ViewType.warehouse, title: 'KHO TỔNG', icon: '📦', group: 'CORE', allowedRoles: [UserRole.MASTER, UserRole.LEVEL_1, UserRole.LEVEL_2], componentName: 'WarehouseManagement', active: true },
  [ViewType.hr]: { id: ViewType.hr, title: 'NHÂN SỰ', icon: '👥', group: 'CORE', allowedRoles: [UserRole.MASTER, UserRole.LEVEL_1, UserRole.LEVEL_2], componentName: 'HRManagement', active: true },
  [ViewType.command]: { id: ViewType.command, title: 'COMMAND CENTER', icon: '🔱', group: 'CORE', allowedRoles: [UserRole.MASTER], componentName: 'ThienCommandCenter', active: true },
  [ViewType.chat]: { id: ViewType.chat, title: 'CHAT ADVISOR', icon: '💬', group: 'CORE', allowedRoles: [UserRole.MASTER, UserRole.ADMIN], componentName: 'ChatConsultant', active: true },
  [ViewType.audit_center]: { id: ViewType.audit_center, title: 'DEEP AUDIT HUB', icon: '🔍', group: 'SYSTEM', allowedRoles: [UserRole.MASTER, UserRole.LEVEL_8], componentName: 'AuditDashboard', active: true },
  [ViewType.sales_terminal]: { id: ViewType.sales_terminal, title: 'CHỐT ĐƠN HÀNG', icon: '🛍️', group: 'CORE', allowedRoles: [UserRole.MASTER, UserRole.ADMIN, UserRole.LEVEL_1, UserRole.LEVEL_5], componentName: 'SaleTerminal', active: true },
  // NEW SHOWROOM V2 MODULE
  [ViewType.showroom_v2]: { id: ViewType.showroom_v2, title: 'SHOWROOM V2 (BETA)', icon: '💎', group: 'SALES', allowedRoles: [UserRole.MASTER, UserRole.ADMIN, UserRole.LEVEL_1, UserRole.LEVEL_5, UserRole.LEVEL_7], componentName: 'ProductPage', active: true },
};

export class ModuleRegistryService {
  private static instance: ModuleRegistryService;
  private constructor() {}

  static getInstance() {
    if (!ModuleRegistryService.instance) ModuleRegistryService.instance = new ModuleRegistryService();
    return ModuleRegistryService.instance;
  }

  getAllModules(): ModuleConfig[] {
    return Object.values(MODULE_REGISTRY);
  }

  registerModule(config: ModuleConfig) {
    MODULE_REGISTRY[config.id] = config;
  }
}

export const ModuleRegistry = ModuleRegistryService.getInstance();
export default ModuleRegistry;
