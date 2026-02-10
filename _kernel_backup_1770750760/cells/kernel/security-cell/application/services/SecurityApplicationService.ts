import { DetectThreatUseCase } from '../use-cases';
import { ThreatDetectionService } from '../../domain/services';
import { SecurityRepository } from '../../ports/SecurityRepository';
import { SecurityEventEmitter } from '../../ports/SecurityEventEmitter';

export class SecurityApplicationService {
  private readonly detectThreatUseCase: DetectThreatUseCase;
  private readonly detectionService: ThreatDetectionService;

  constructor(repository: SecurityRepository, eventEmitter: SecurityEventEmitter) {
    this.detectionService = new ThreatDetectionService();
    this.detectThreatUseCase = new DetectThreatUseCase(repository, eventEmitter, this.detectionService);
  }

  detectThreat = (type: string, severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL', source: string, description: string) =>
    this.detectThreatUseCase.execute(type, severity, source, description);

  isLockdownActive = () => this.detectionService.isLockdownActive();
}
