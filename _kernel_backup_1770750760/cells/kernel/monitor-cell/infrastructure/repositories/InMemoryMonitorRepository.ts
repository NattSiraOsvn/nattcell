import { HealthReport, Alert } from '../../domain/entities';
import { MonitorRepository } from '../../ports/MonitorRepository';

export class InMemoryMonitorRepository implements MonitorRepository {
  private healthReports = new Map<string, HealthReport>();
  private alerts: Alert[] = [];

  async saveHealthReport(report: HealthReport) { this.healthReports.set(report.cellId, report); }
  async getLatestHealthReport(cellId: string) { return this.healthReports.get(cellId) || null; }
  async getAllLatestReports() { return Array.from(this.healthReports.values()); }
  async saveAlert(alert: Alert) { this.alerts.push(alert); }
  async getActiveAlerts() { return this.alerts.filter(a => !a.acknowledged); }
  async acknowledgeAlert(id: string) {
    const idx = this.alerts.findIndex(a => a.id === id);
    if (idx >= 0) { this.alerts[idx] = this.alerts[idx].acknowledge(); return true; }
    return false;
  }
}
