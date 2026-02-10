import { HealthReport, Alert } from '../domain/entities';

export interface MonitorRepository {
  saveHealthReport(report: HealthReport): Promise<void>;
  getLatestHealthReport(cellId: string): Promise<HealthReport | null>;
  getAllLatestReports(): Promise<HealthReport[]>;
  saveAlert(alert: Alert): Promise<void>;
  getActiveAlerts(): Promise<Alert[]>;
  acknowledgeAlert(id: string): Promise<boolean>;
}
