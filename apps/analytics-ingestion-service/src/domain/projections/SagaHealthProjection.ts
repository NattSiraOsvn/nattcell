
import { EventEnvelope, SagaLog } from '../../../../../types.ts';

export interface SagaState {
  correlation_id: string;
  current_status: 'PROCESSING' | 'COMPLETED' | 'COMPENSATING' | 'FAILED';
  steps: SagaLog[];
  last_updated: number;
}

/**
 * 📊 SAGA HEALTH PROJECTION (BĂNG - TEAM 4)
 */
export class SagaHealthProjection {
  private static store: Map<string, SagaState> = new Map();

  public static async project(event: EventEnvelope) {
    const correlationId = event.trace.correlation_id;
    let state = this.store.get(correlationId);

    if (!state) {
      state = {
        correlation_id: correlationId,
        current_status: 'PROCESSING',
        steps: [],
        last_updated: Date.now()
      };
    }

    const stepName = this.formatStepName(event.event_name);
    
    const step: SagaLog = {
      id: `STEP-${Date.now()}-${event.event_id.slice(-4)}`,
      correlation_id: correlationId,
      step: stepName,
      status: 'SUCCESS',
      details: `Producer: ${event.producer}`,
      timestamp: Date.now(),
      causation_id: event.trace.causation_id
    };

    state.steps.push(step);
    state.last_updated = Date.now();
    this.store.set(correlationId, state);
  }

  private static formatStepName(name: string): string {
    return name.toUpperCase().replace('.V1', '').replace(/\./g, '_');
  }

  public static getAllStates(): SagaState[] {
    return Array.from(this.store.values()).sort((a, b) => b.last_updated - a.last_updated);
  }
}
