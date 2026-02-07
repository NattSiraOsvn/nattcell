
import { GovernanceKPI, TeamPerformance, BusinessMetrics } from '@/types';

/**
 * 📊 ANALYTICS API (TEAM 4 - BĂNG)
 * Chịu trách nhiệm cung cấp dữ liệu cho bảng điều hành.
 */
export class AnalyticsAPI {
  private static instance: AnalyticsAPI;

  public static getInstance(): AnalyticsAPI {
    if (!AnalyticsAPI.instance) {
      AnalyticsAPI.instance = new AnalyticsAPI();
    }
    return AnalyticsAPI.instance;
  }

  /**
   * Lấy danh sách KPI quản trị (Thien Command Center)
   */
  public async getGovernanceKPIs(): Promise<GovernanceKPI[]> {
    const now = new Date().toISOString().split('T')[0];
    return [
      {
        kpi_id: 'KPI-001',
        kpi_name: 'Tổng doanh thu (NET)',
        category: 'FINANCIAL',
        period_date: now,
        target_value: 500000000,
        actual_value: 449120000,
        previous_value: 410000000,
        change_percent: 9.5,
        status: 'OK',
        owner_team: 'Bối Bối',
        threshold_warning: 400000000,
        threshold_critical: 300000000
      },
      {
        kpi_id: 'KPI-002',
        kpi_name: 'Hao hụt sản xuất (WIP)',
        category: 'OPERATIONAL',
        period_date: now,
        target_value: 1.0,
        actual_value: 1.2,
        previous_value: 0.8,
        change_percent: 50,
        status: 'WARNING',
        owner_team: 'Bối Bối',
        threshold_warning: 1.1,
        threshold_critical: 1.5
      },
      {
        kpi_id: 'KPI-003',
        kpi_name: 'Độ trễ Shard (Avg)',
        category: 'STRATEGIC',
        period_date: now,
        target_value: 50,
        actual_value: 12,
        previous_value: 15,
        change_percent: -20,
        status: 'OK',
        owner_team: 'KIM',
        threshold_warning: 100,
        threshold_critical: 500
      }
    ];
  }

  /**
   * Thống kê tải trọng các Team AI
   */
  public async getTeamPerformance(): Promise<TeamPerformance[]> {
    return [
      { team_name: 'Bối Bối (Team 1)', total_tasks: 124, tasks_completed: 110, tasks_in_progress: 10, tasks_blocked: 4, load_percentage: 85, completion_rate: 88.7 },
      { team_name: 'ChatGPT (Team 2)', total_tasks: 85, tasks_completed: 80, tasks_in_progress: 5, tasks_blocked: 0, load_percentage: 60, completion_rate: 94.1 },
      { team_name: 'KIM (Team 3)', total_tasks: 42, tasks_completed: 40, tasks_in_progress: 2, tasks_blocked: 0, load_percentage: 30, completion_rate: 95.2 },
      { team_name: 'BĂNG (Team 4)', total_tasks: 15, tasks_completed: 15, tasks_in_progress: 0, tasks_blocked: 0, load_percentage: 10, completion_rate: 100 }
    ];
  }
}

export const AnalyticsProvider = AnalyticsAPI.getInstance();
