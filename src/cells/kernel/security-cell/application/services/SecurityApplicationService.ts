import { DetectTHReatUseCase } from '../use-cases';
import { THReatDetectionService } from '../../domain/services';
import { SecurityRepository } from '../../ports/SecurityRepository';
import { SecurityEventEmitter } from '../../ports/SecurityEventEmitter';

export class SecurityApplicationService {
  private readonly detectTHReatUseCase: DetectTHReatUseCase;
  private readonly detectionService: THReatDetectionService;

  constructor(repository: SecurityRepository, eventEmitter: SecurityEventEmitter) {
    this.detectionService = new THReatDetectionService();
    this.detectTHReatUseCase = new DetectTHReatUseCase(repository, eventEmitter, this.detectionService);
  }

  detectTHReat = (type: string, severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL', source: string, description: string) =>
    this.detectTHReatUseCase.execute(type, severity, source, description);

  isLockdownActive = () => this.detectionService.isLockdownActive();
}
