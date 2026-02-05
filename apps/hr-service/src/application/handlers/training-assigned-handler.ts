
import { ProductionBase } from '../../ProductionBase.ts';
import { EventEnvelope, TrainingStatus } from '../../../../../types.ts';

export class TrainingAssignedHandler extends ProductionBase {
  readonly serviceName = 'hr-service';

  async handle(event: EventEnvelope) {
    const { employee_id, course } = event.payload;
    console.log(`[HR-HANDLER] Training Assigned: ${course} to ${employee_id}`);

    await this.logAudit('TRAINING_ASSIGNED', event.trace.correlation_id, {
      employee_id,
      course,
      status: TrainingStatus.ASSIGNED
    }, event.event_id);
  }
}
