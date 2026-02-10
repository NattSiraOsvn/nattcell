import { HealthReport } from '../../domain/entities';
import { MonitorRepository } from '../../ports/MonitorRepository';
import { MonitorEventEmitter } from '../../ports/MonitorEventEmitter';

export class ReportHealthUseCase {
  constructor(
    private readonly repository: MonitorRepository,
    private readonly eventEmitter: MonitorEventEmitter
  ) {}

  async execute(cellId: string, status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY', metrics: Record<string, number>) {
    const report = HealthReport.create(cellId, status, metrics);
    await this.repository.saveHealthReport(report);
    await this.eventEmitter.emitHealthReported(cellId, status);
    return { report };
  }
}
