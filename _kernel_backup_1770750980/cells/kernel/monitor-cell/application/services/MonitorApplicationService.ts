import { ReportHealthUseCase, TriggerAlertUseCase } from '../use-cases';
import { HealthAnalyzer } from '../../domain/services';
import { MonitorRepository } from '../../ports/MonitorRepository';
import { MonitorEventEmitter } from '../../ports/MonitorEventEmitter';

export class MonitorApplicationService {
  private readonly reportHealthUseCase: ReportHealthUseCase;
  private readonly triggerAlertUseCase: TriggerAlertUseCase;
  private readonly healthAnalyzer: HealthAnalyzer;
  private readonly repository: MonitorRepository;

  constructor(repository: MonitorRepository, eventEmitter: MonitorEventEmitter) {
    this.repository = repository;
    this.healthAnalyzer = new HealthAnalyzer();
    this.reportHealthUseCase = new ReportHealthUseCase(repository, eventEmitter);
    this.triggerAlertUseCase = new TriggerAlertUseCase(repository, eventEmitter);
  }

  reportHealth = (cellId: string, status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY', metrics: Record<string, number>) =>
    this.reportHealthUseCase.execute(cellId, status, metrics);

  triggerAlert = (cellId: string, type: 'WARNING' | 'ERROR' | 'CRITICAL', message: string) =>
    this.triggerAlertUseCase.execute(cellId, type, message);

  getSystemHealth = async () => {
    const reports = await this.repository.getAllLatestReports();
    return this.healthAnalyzer.analyzeSystem(reports);
  };
}
