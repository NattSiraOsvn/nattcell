
import { HUDMetric, Department, ActionLog, WarehouseLocation } from '../types';
import { getCell } from '../../cells/shared-kernel/smartlink.registry';

/**
 * 📊 DASHBOARD SERVICE - REGISTRY-BASED
 * Thực thi bóc tách dữ liệu qua SmartLink Registry v5.0.
 */
class DashboardService {
  private static instance: DashboardService;

  static getInstance() {
    if (!DashboardService.instance) DashboardService.instance = new DashboardService();
    return DashboardService.instance;
  }

  async getHUDMetrics(): Promise<HUDMetric[]> {
    // 🛡️ HỢP HIẾN: Pull logic thực thi từ Registry thay vì import tĩnh
    const WarehouseProvider = await getCell('WAREHOUSE');
    const SalesProvider = await getCell('SALES');

    // Bóc tách dữ liệu thống kê từ các Shard Isolate
    const inventory = WarehouseProvider.getAllInventory();
    
    // Phase 4: Multi-branch stats
    const totalItems = inventory.length;
    const hcmCount = inventory.filter((i: any) => i.location === WarehouseLocation.HCM_HEADQUARTER).length;
    const hnCount = inventory.filter((i: any) => i.location === WarehouseLocation.HANOI_BRANCH).length;
    
    const totalRevenue = await SalesProvider.getRevenueStats();

    return [
      {
        id: 'M1',
        name: 'DOANH THU CHỐT SHARD',
        value: totalRevenue || 449120,
        unit: 'VND',
        trend: { direction: 'UP', percentage: 100, isPositive: true },
        department: Department.SALES,
        icon: '💰'
      },
      {
        id: 'M2',
        name: 'TỒN KHO MASTER (HCM/HN)',
        value: totalItems,
        unit: 'SP',
        trend: { direction: 'STABLE', percentage: 0, isPositive: true },
        department: Department.PRODUCTION,
        icon: '📦'
      },
      {
        id: 'M3',
        name: 'BRANCH DISTRIBUTION',
        value: hnCount,
        unit: 'HN_NODE',
        trend: { direction: 'UP', percentage: 35, isPositive: true },
        department: Department.WAREHOUSE,
        icon: '📡'
      }
    ];
  }

  async getActionLogs(): Promise<ActionLog[]> {
    return [];
  }
}

export const DashboardProvider = DashboardService.getInstance();
