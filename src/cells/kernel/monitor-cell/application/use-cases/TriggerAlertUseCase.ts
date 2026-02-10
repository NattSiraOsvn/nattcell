import { Alert } from '../../domain/entities';
import { MonitorRepository } from '../../ports/MonitorRepository';
import { MonitorEventEmitter } from '../../ports/MonitorEventEmitter';

export class TriggerAlertUseCase {
  constructor(
    private readonly repository: MonitorRepository,
    private readonly eventEmitter: MonitorEventEmitter
  ) {}

  async execute(cellId: string, type: 'WARNING' | 'ERROR' | 'CRITICAL', message: string) {
    const alert = Alert.create(cellId, type, message);
    await this.repository.saveAlert(alert);
    await this.eventEmitter.emitAlertTriggered(alert.id, cellId, type);
    return { alert };
  }
}
