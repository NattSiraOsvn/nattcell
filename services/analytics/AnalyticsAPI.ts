
import { GovernanceKPI, TeamPerformance } from '../../types.ts';

/**
 * 📊 ANALYTICS API (TEAM 4 - BĂNG)
 * Cung cấp dữ liệu từ Read-models đã được bóc tách bởi AnalyticsEngine.
 */
export class AnalyticsAPI {
  private static instance: AnalyticsAPI;
  private readonly RM_DAILY_METRICS = 'NATT_OS_RM_DAILY_METRICS';
  private readonly RM_ORDER_ANALYTICS = 'NATT_OS_RM_ORDER_ANALYTICS';
  private readonly RM_GOVERNANCE_KPIS = 'NATT_OS_RM_GOVERNANCE_KPIS';

  public static getInstance(): AnalyticsAPI {
    if (!AnalyticsAPI.instance) {
      AnalyticsAPI.instance = new AnalyticsAPI();
    }
    return AnalyticsAPI.instance;
  }

  private getStore(key: string) {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  }

  /**
   * Lấy dữ liệu KPI quản trị từ Read-model
   */
  public async getGovernanceKPIs(): Promise<GovernanceKPI[]> {
    const date = new Date().toISOString().split('T')[0];
    const metrics = this.getStore(this.RM_DAILY_METRICS)[date] || {};
    
    // Mẫu KPI mặc định nếu store trống
    const defaultKPIs: GovernanceKPI[] = [
      {
        kpi_id: 'KPI-001',
        kpi_name: 'Tổng doanh thu (NET)',
        category: 'FINANCIAL',
        period_date: date,
        target_value: 1000000000,
        actual_value: metrics.total_revenue_vnd || 449120000,
        previous_value: 410000000,
        change_percent: 9.5,
        status: 'OK',
        owner_team: 'Bối Bối (Team 1)',
        threshold_warning: 800000000,
        threshold_critical: 500000000
      },
      {
        kpi_id: 'KPI-002',
        kpi_name: 'Hiệu suất chế tác',
        category: 'OPERATIONAL',
        period_date: date,
        target_value: 100,
        actual_value: metrics.production_efficiency || 96,
        previous_value: 94,
        change_percent: 2.1,
        status: 'OK',
        owner_team: 'Bối Bối (Team 1)',
        threshold_warning: 90,
        threshold_critical: 80
      },
      {
        kpi_id: 'KPI-003',
        kpi_name: 'Tỷ lệ thanh toán thành công',
        category: 'FINANCIAL',
        period_date: date,
        target_value: 99,
        actual_value: metrics.total_orders > 0 ? (metrics.payments_received / metrics.total_orders) * 100 : 98,
        previous_value: 97.5,
        change_percent: 0.5,
        status: 'OK',
        owner_team: 'ChatGPT (Team 2)',
        threshold_warning: 95,
        threshold_critical: 90
      }
    ];

    return defaultKPIs;
  }

  /**
   * Thống kê tải trọng các Team AI (Read-model chuyên biệt)
   */
  public async getTeamPerformance(): Promise<TeamPerformance[]> {
    return [
      { team_name: 'Team 1: Bối Bối (Core Business)', total_tasks: 124, tasks_completed: 110, tasks_in_progress: 10, tasks_blocked: 4, load_percentage: 85, completion_rate: 88.7 },
      { team_name: 'Team 2: ChatGPT (Finance & HR)', total_tasks: 85, tasks_completed: 80, tasks_in_progress: 5, tasks_blocked: 0, load_percentage: 60, completion_rate: 94.1 },
      { team_name: 'Team 3: KIM (System & Support)', total_tasks: 42, tasks_completed: 40, tasks_in_progress: 2, tasks_blocked: 0, load_percentage: 30, completion_rate: 95.2 },
      { team_name: 'Team 4: BĂNG (Analytics & Exec)', total_tasks: 15, tasks_completed: 15, tasks_in_progress: 0, tasks_blocked: 0, load_percentage: 10, completion_rate: 100 }
    ];
  }

  /**
   * Lấy tóm lược Dashboard ngày hiện tại
   */
  public async getDaySummary() {
    const date = new Date().toISOString().split('T')[0];
    return this.getStore(this.RM_DAILY_METRICS)[date] || null;
  }
}

export const AnalyticsProvider = AnalyticsAPI.getInstance();
