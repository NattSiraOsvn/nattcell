
import { RuntimeInput, RuntimeOutput, Event, StateChange } from '../types';
import { StateManager } from './state-manager';
import { TraceManager } from './trace-manager';
import { PolicyEngine } from './policy-engine';
import { IdempotencyService } from './idempotency-service';
import { OutboxService } from './outbox-service';

export class NATTOS_Runtime {
  private stateManager = new StateManager();
  private traceManager = new TraceManager();
  private policyEngine = new PolicyEngine();
  private idempotencyService = new IdempotencyService();
  private outboxService = new OutboxService();
  
  async handle(input: RuntimeInput): Promise<RuntimeOutput> {
    const startTime = Date.now();
    try {
      // 1. KCS Validation
      if (!input.tenantId) throw new Error('KCS VIOLATION: tenantId is required');
      if (!input.correlationId) throw new Error('KCS VIOLATION: correlationId is required');

      // 2. Start Trace Span
      const span = await this.traceManager.startSpan(input.operation, input);

      // 3. Idempotency Check
      const output = await this.idempotencyService.executeIdempotent(
        { key: `${input.tenantId}:${input.correlationId}`, tenantId: input.tenantId },
        async () => {
          // 4. Policy Enforcement
          const auth = await this.policyEngine.evaluate(input.userId, input.operation, input.domain, input.tenantId);
          if (!auth.allowed) throw new Error(`KCS POLICY DENIED: ${auth.reason}`);

          // 5. State Discipline
          const transition = await this.stateManager.validateTransition(input.domain, input.operation, input.payload, input.tenantId);

          // 6. Execute Business Logic (Mock)
          const result = { entityId: input.payload.id || 'NEW', status: 'SUCCESS' };

          // 7. Record State Change
          await this.stateManager.recordStateChange({
            entityId: result.entityId,
            tenantId: input.tenantId,
            entityType: input.domain,
            fromState: transition.fromState,
            toState: transition.toState,
            changedAt: new Date(),
            changedBy: input.userId,
            causationId: input.correlationId
          });

          // 8. Publish Event via Outbox
          await this.outboxService.publish({
            id: `evt_${Date.now()}`,
            type: `${input.domain}.${input.operation}`,
            correlationId: input.correlationId,
            tenantId: input.tenantId,
            payload: result,
            occurredAt: new Date(),
            recordedAt: new Date()
          } as Event);

          return result;
        }
      );

      return {
        tenantId: input.tenantId,
        correlationId: input.correlationId,
        success: true,
        data: output,
        metadata: {
          tenantId: input.tenantId,
          processedAt: new Date(),
          processingMs: Date.now() - startTime,
          stateChanges: [], // Populated in real impl
          eventsPublished: []
        }
      };

    } catch (error: any) {
      return {
        tenantId: input.tenantId,
        correlationId: input.correlationId,
        success: false,
        error: { code: 'RUNTIME_ERROR', message: error.message, timestamp: new Date() },
        metadata: { tenantId: input.tenantId, processedAt: new Date(), processingMs: Date.now() - startTime, stateChanges: [], eventsPublished: [] }
      };
    }
  }
}

export const runtime = new NATTOS_Runtime();
