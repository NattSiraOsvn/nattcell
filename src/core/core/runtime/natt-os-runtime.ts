import { 
  RuntimeInput, 
  RuntimeOutput, 
  RuntimeState, 
  TraceContext 
} from '@/types';

/**
 * [A. KỶ LUẬT TRẠNG THÁI] - State Machine & Validation Service
 */
class StateValidator {
  private static readonly DOMAIN_MATRICES: Record<string, Record<string, string[]>> = {
    'ORDER': {
      'CREATED': ['VALIDATED', 'CANCELLED'],
      'VALIDATED': ['PAID', 'FAILED'],
      'PAID': ['SHIPPED'],
      'SHIPPED': ['COMPLETED']
    },
    'INVENTORY': {
      'AVAILABLE': ['RESERVED', 'OUT_OF_STOCK'],
      'RESERVED': ['DEDUCTED', 'RELEASED']
    }
  };

  static readonly TERMINAL_STATES = ['COMPLETED', 'CANCELLED', 'FAILED', 'DEDUCTED'];
  static readonly RETRYABLE_STATES = ['NETWORK_TIMEOUT', 'LOCK_CONTENTION'];

  static validate(domain: string, current: string, next: string): void {
    const allowed = this.DOMAIN_MATRICES[domain]?.[current];
    if (!allowed || !allowed.includes(next)) {
      throw new Error(`INVALID_STATE_TRANSITION: ${domain} from ${current} to ${next}`);
    }
  }
}

/**
 * [D. RBAC & SECURITY ENFORCEMENT] - Policy Engine (ABAC)
 */
class PolicyEngine {
  static authorize(input: RuntimeInput, dataOwnershipId: string): void {
    // 1. Kiểm tra Ownership (Data-level security)
    const isOwner = dataOwnershipId === input.tenantId;
    
    // 2. Kiểm tra Attribute-Based Access Control
    const canWrite = input.identity.roles.some(role => ['ADMIN', 'OPERATOR', 'MASTER'].includes(role));
    
    // Đảm bảo dữ liệu thuộc đúng phòng ban
    const isCorrectDept = input.identity.attributes.department_id === input.payload.department_id;

    if (!isOwner || !canWrite || !isCorrectDept) {
      throw new Error("ACCESS_DENIED: SECURITY_POLICY_VIOLATION");
    }
  }
}

/**
 * [E. IDEMPOTENCY BỀN VỮNG] - Service xử lý trùng lặp
 */
class IdempotencyService {
  private storage = new Map<string, string>(); // Interface với persistent storage thực

  async resolve(key: string): Promise<RuntimeOutput | null> {
    const record = this.storage.get(key);
    return record ? JSON.parse(record) : null;
  }

  async save(key: string, output: RuntimeOutput): Promise<void> {
    this.storage.set(key, JSON.stringify(output));
  }
}

/**
 * [F. FAILURE MODES & RESILIENCE] - Circuit Breaker & Retry
 */
class ResilienceEngine {
  private static failureCount = 0;
  private static isBroken = false;

  static async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.isBroken) throw new Error("CIRCUIT_BREAKER_OPEN");

    try {
      let attempt = 0;
      while (attempt < 3) {
        try {
          const result = await operation();
          this.failureCount = 0; 
          return result;
        } catch (e) {
          // 🛠️ Fixed: use standard increment
          attempt += 1;
          if (attempt >= 3) throw e;
        }
      }
      throw new Error("RESILIENCE_EXHAUSTED");
    } catch (error) {
      // 🛠️ Fixed: use standard increment
      this.failureCount += 1;
      if (this.failureCount > 5) this.isBroken = true;
      throw error;
    }
  }
}

/**
 * [B & H. COMMAND/EVENT & DURABILITY] - Engine chính điều hành luồng dữ liệu
 */
export class NATTOS_Runtime {
  private state: RuntimeState;
  private idempotency: IdempotencyService;
  private outbox: any[] = []; 

  constructor() {
    this.state = { status: 'booting', lastTick: Date.now(), version: '2.5.0' };
    this.idempotency = new IdempotencyService();
  }

  /* ---------- [J] ENTRY POINT ---------- */
  init() {
    this.state.status = 'active';
    this.state.lastTick = Date.now();
    console.log(`[RUNTIME] NATT-OS Engine v${this.state.version} is ACTIVE.`);
  }

  /* ---------- [I] OBSERVABILITY HANDLER ---------- */
  async handle(input: RuntimeInput): Promise<RuntimeOutput> {
    if (this.state.status !== 'active') {
      return { 
        tenantId: input.tenantId, 
        correlationId: input.correlationId, 
        ok: false, 
        success: false, 
        error: 'RUNTIME_INACTIVE', 
        trace: input.traceId,
        metadata: { tenantId: input.tenantId, processedAt: new Date(), processingMs: 0, stateChanges: [], eventsPublished: [] }
      };
    }

    this.log('COMMAND_RECEIVED', input);
    return await this.execute(input);
  }

  /* ---------- CORE RUNTIME LOGIC ---------- */
  private async execute(input: RuntimeInput): Promise<RuntimeOutput> {
    const iKey = `IDEM:${input.tenantId}:${input.correlationId}`;

    try {
      // 1. [E] Idempotency Check
      const cached = await this.idempotency.resolve(iKey);
      if (cached) return cached;

      // 2. [D] Security Enforcement (ABAC)
      PolicyEngine.authorize(input, input.payload.tenantId || input.tenantId);

      // 3. [B] CQRS Logic
      const result = await ResilienceEngine.execute(async () => {
        return await this.processDomainLogic(input);
      });

      // 4. [H] Persistence & Outbox
      const output: RuntimeOutput = { 
        tenantId: input.tenantId, 
        correlationId: input.correlationId, 
        ok: true, 
        success: true, 
        data: result, 
        trace: input.traceId,
        metadata: { tenantId: input.tenantId, processedAt: new Date(), processingMs: 0, stateChanges: [], eventsPublished: [] }
      };
      await this.idempotency.save(iKey, output);
      this.publishToOutbox(input, result);

      return output;

    } catch (error: any) {
      this.log('FAILURE_MODE_TRIGGERED', { error: error.message, input });
      return { 
        tenantId: input.tenantId, 
        correlationId: input.correlationId, 
        ok: false, 
        success: false, 
        error: JSON.stringify("error"), 
        trace: input.traceId,
        metadata: { tenantId: input.tenantId, processedAt: new Date(), processingMs: 0, stateChanges: [], eventsPublished: [] }
      };
    }
  }

  private async processDomainLogic(input: RuntimeInput) {
    // [A] State Discipline
    if (input.payload.currentState && input.payload.nextState) {
      StateValidator.validate(input.domain, input.payload.currentState, input.payload.nextState);
    }

    switch(input.domain) {
      case 'ORDER':
        return { order_id: input.payload.id, status: 'VALIDATED', processed_at: Date.now() };
      case 'INVENTORY':
        return { stock_id: input.payload.sku, status: 'RESERVED' };
      default:
        return { message: "DOMAIN_PROCESSED", timestamp: Date.now() };
    }
  }

  private publishToOutbox(input: RuntimeInput, result: any) {
    this.outbox.push({
      event_type: `${input.domain}_UPDATED`,
      correlation_id: input.correlationId,
      causation_id: input.spanId, 
      data: result,
      timestamp: Date.now()
    });
  }

  private log(event: string, data: any) {
    console.info(JSON.stringify({
      level: 'INFO',
      service: 'NATTOS_RUNTIME',
      event,
      ...data,
      runtime_version: this.state.version
    }));
  }

  suspend() {
    this.state.status = 'suspended';
    this.log('RUNTIME_SUSPENDED', { lastTick: this.state.lastTick });
  }

  terminate() {
    this.state.status = 'terminated';
    this.log('RUNTIME_TERMINATED', {});
  }
}

export const runtime = new NATTOS_Runtime();
runtime.init();
