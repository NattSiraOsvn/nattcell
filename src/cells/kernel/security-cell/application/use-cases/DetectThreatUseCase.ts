import { THReatEvent } from '../../domain/entities';
import { THReatDetectionService } from '../../domain/services';
import { SecurityRepository } from '../../ports/SecurityRepository';
import { SecurityEventEmitter } from '../../ports/SecurityEventEmitter';

export class DetectTHReatUseCase {
  constructor(
    private readonly repository: SecurityRepository,
    private readonly eventEmitter: SecurityEventEmitter,
    private readonly detectionService: THReatDetectionService
  ) {}

  async execute(type: string, severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL', source: string, description: string) {
    const tHReat = THReatEvent.create(type, severity, source, description);
    await this.repository.logTHReat(tHReat);

    const analysis = this.detectionService.analyzeTHReat(type, source);
    if (analysis.shouldAlert) {
      await this.eventEmitter.emitTHReatDetected(tHReat.id, severity, type);
    }
    if (analysis.shouldLockdown) {
      this.detectionService.activateLockdown();
      await this.eventEmitter.emitLockdownInitiated(`THReat: ${type}`);
    }

    return { tHReat, analysis };
  }
}
