
import { ViewType, UserRole, ModuleConfig } from '@/types';

export const MODULE_REGISTRY: Record<string, ModuleConfig> = {
  [ViewType.DASHBOARD]: { id: ViewType.DASHBOARD, title: 'TỔNG QUAN', icon: '🏠', group: 'CORE', allowedRoles: [UserRole.ADMIN, UserRole.ADMIN, UserRole.MANAGER], componentName: 'MasterDashboard', active: true } as any,
  [ViewType.sales_tax]: { id: ViewType.sales_tax, title: 'FISCAL TERMINAL (HDĐT)', icon: '📊', group: 'ACCOUNTING', allowedRoles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.SALES_STAFF], componentName: 'SalesTaxModule', active: true } as any,
  [ViewType.production_manager]: { id: ViewType.production_manager, title: 'XƯỞNG CHẾ TÁC', icon: '🏭', group: 'CORE', allowedRoles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.SENIOR_STAFF], componentName: 'ProductionManager', active: true } as any,
  [ViewType.WAREHOUSE]: { id: ViewType.WAREHOUSE, title: 'KHO TỔNG', icon: '📦', group: 'CORE', allowedRoles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.SENIOR_STAFF], componentName: 'WarehouseManagement', active: true } as any,
  [ViewType.HR]: { id: ViewType.HR, title: 'NHÂN SỰ', icon: '👥', group: 'CORE', allowedRoles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.SENIOR_STAFF], componentName: 'HRManagement', active: true } as any,
  [ViewType.command]: { id: ViewType.command, title: 'COMMAND CENTER', icon: '🔱', group: 'CORE', allowedRoles: [UserRole.ADMIN], componentName: 'ThienCommandCenter', active: true } as any,
  [ViewType.chat]: { id: ViewType.chat, title: 'CHAT ADVISOR', icon: '💬', group: 'CORE', allowedRoles: [UserRole.ADMIN, UserRole.ADMIN], componentName: 'ChatConsultant', active: true } as any,
  [ViewType.audit_center]: { id: ViewType.audit_center, title: 'DEEP AUDIT HUB', icon: '🔍', group: 'SYSTEM', allowedRoles: [UserRole.ADMIN, UserRole.AUDITOR], componentName: 'AuditDashboard', active: true } as any,
  [ViewType.sales_terminal]: { id: ViewType.sales_terminal, title: 'CHỐT ĐƠN HÀNG', icon: '🛍️', group: 'CORE', allowedRoles: [UserRole.ADMIN, UserRole.ADMIN, UserRole.MANAGER, UserRole.SALES_STAFF], componentName: 'SaleTerminal', active: true } as any,
  // NEW SHOWROOM V2 MODULE
  [ViewType.SHOWROOM]: { id: ViewType.SHOWROOM, title: 'SHOWROOM V2 (BETA)', icon: '💎', group: 'SALES', allowedRoles: [UserRole.ADMIN, UserRole.ADMIN, UserRole.MANAGER, UserRole.SALES_STAFF, UserRole.VIEWER], componentName: 'ProductPage', active: true } as any,
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
