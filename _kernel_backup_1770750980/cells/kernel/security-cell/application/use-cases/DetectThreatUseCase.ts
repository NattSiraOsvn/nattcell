import { ThreatEvent } from '../../domain/entities';
import { ThreatDetectionService } from '../../domain/services';
import { SecurityRepository } from '../../ports/SecurityRepository';
import { SecurityEventEmitter } from '../../ports/SecurityEventEmitter';

export class DetectThreatUseCase {
  constructor(
    private readonly repository: SecurityRepository,
    private readonly eventEmitter: SecurityEventEmitter,
    private readonly detectionService: ThreatDetectionService
  ) {}

  async execute(type: string, severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL', source: string, description: string) {
    const threat = ThreatEvent.create(type, severity, source, description);
    await this.repository.logThreat(threat);

    const analysis = this.detectionService.analyzeThreat(type, source);
    if (analysis.shouldAlert) {
      await this.eventEmitter.emitThreatDetected(threat.id, severity, type);
    }
    if (analysis.shouldLockdown) {
      this.detectionService.activateLockdown();
      await this.eventEmitter.emitLockdownInitiated(`Threat: ${type}`);
    }

    return { threat, analysis };
  }
}
