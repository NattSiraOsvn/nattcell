import { StateChange } from '../types';
import { CONSTITUTIONAL_ROADLOAD_ID } 
  from '../../governance/gatekeeper/constitutional';

/**
 * ============================================================
 * STATE TRANSITION – CONSTITUTIONAL AWARE
 * ============================================================
 */

export interface TransitionMatrix {
  [currentState: string]: string[];
}

export interface StateTransition {
  fromState: string;
  toState: string;
  allowed: boolean;
  reason?: string;

  /**
   * Constitutional metadata (BƯỚC 5)
   * KHÔNG enforce – chỉ ghi nhận
   */
  metadata?: {
    roadload: string;
    domain: string;
    operation: string;
    tenantId: string;
    entityId: string;
  };
}

export class StateManager {
  private stateMachines: Map<string, TransitionMatrix>;
  private stateHistory: Map<string, StateChange[]>;

  constructor() {
    this.stateMachines = new Map();
    this.stateHistory = new Map();
    this.initializeStateMachines();
  }

  /**
   * ============================================================
   * DEFINE STATE MACHINES (BUSINESS TRUTH)
   * ============================================================
   */
  private initializeStateMachines(): void {
    const orderStateMachine: TransitionMatrix = {
      CREATED: ['PAYMENT_PENDING', 'CANCELLED'],
      PAYMENT_PENDING: ['PAID', 'CANCELLED'],
      PAID: ['PROCESSING', 'REFUND_REQUESTED'],
      PROCESSING: ['SHIPPED', 'FAILED'],
      SHIPPED: ['DELIVERED', 'RETURN_REQUESTED'],
      DELIVERED: ['COMPLETED', 'RETURNED'],
      COMPLETED: [],
      CANCELLED: [],
      REFUNDED: [],
      RETURNED: [],
    };

    const inventoryStateMachine: TransitionMatrix = {
      AVAILABLE: ['RESERVED', 'OUT_OF_STOCK'],
      RESERVED: ['ALLOCATED', 'RELEASED'],
      ALLOCATED: ['SHIPPED', 'RETURNED'],
      SHIPPED: ['DELIVERED', 'LOST'],
      DELIVERED: ['AVAILABLE'],
      OUT_OF_STOCK: ['AVAILABLE'],
      LOST: ['WRITTEN_OFF'],
    };

    this.stateMachines.set('order', orderStateMachine);
    this.stateMachines.set('inventory', inventoryStateMachine);
  }

  /**
   * ============================================================
   * VALIDATE STATE TRANSITION (NO ENFORCE)
   * ============================================================
   */
  async validateTransition(
    domain: string,
    operation: string,
    payload: any,
    tenantId: string
  ): Promise<StateTransition> {
    const stateMachine = this.stateMachines.get(domain);
    if (!stateMachine) {
      throw new Error(
        `KCS STATE ERROR: No state machine defined for domain: ${domain}`
      );
    }

    const entityId = payload.id;
    const currentState = await this.getCurrentState(
      entityId,
      tenantId,
      domain
    );
    const nextState = this.determineNextState(domain, operation, payload);

    const allowedStates = stateMachine[currentState] || [];
    const isAllowed = allowedStates.includes(nextState);

    if (!isAllowed) {
      throw new Error(
        `KCS STATE VIOLATION: Cannot transition from ${currentState} to ${nextState} in ${domain}.`
      );
    }

    /**
     * ⚠️ BƯỚC 5 – GẮN NEO HIẾN PHÁP
     * Không chặn – không enforce – chỉ ghi nhận
     */
    return {
      fromState: currentState,
      toState: nextState,
      allowed: true,
      metadata: {
        roadload: CONSTITUTIONAL_ROADLOAD_ID,
        domain,
        operation,
        tenantId,
        entityId,
      },
    };
  }

  /**
   * ============================================================
   * RECORD STATE CHANGE (AUDITABLE)
   * ============================================================
   */
  async recordStateChange(change: StateChange): Promise<void> {
    const key = `${change.tenantId}:${change.entityId}`;
    if (!this.stateHistory.has(key)) {
      this.stateHistory.set(key, []);
    }

    this.stateHistory.get(key)!.push(change);

    console.log(
      `[STATE_DISCIPLINE] ${change.entityId} (${change.tenantId}): ${change.fromState} -> ${change.toState}`
    );
  }

  /**
   * ============================================================
   * READ CURRENT STATE
   * ============================================================
   */
  async getCurrentState(
    entityId: string,
    tenantId: string,
    domain: string
  ): Promise<string> {
    const key = `${tenantId}:${entityId}`;
    const history = this.stateHistory.get(key) || [];
    return history.length === 0
      ? this.getInitialState(domain)
      : history[history.length - 1].toState;
  }

  private getInitialState(domain: string): string {
    switch (domain) {
      case 'order':
        return 'CREATED';
      case 'inventory':
        return 'AVAILABLE';
      default:
        return 'UNKNOWN';
    }
  }

  /**
   * ============================================================
   * DETERMINE NEXT STATE (BUSINESS OPERATION)
   * ============================================================
   */
  private determineNextState(
    domain: string,
    operation: string,
    payload: any
  ): string {
    const maps: Record<string, Record<string, string>> = {
      order: {
        create: 'CREATED',
        pay: 'PAID',
        ship: 'SHIPPED',
        complete: 'COMPLETED',
        cancel: 'CANCELLED',
      },
      inventory: {
        reserve: 'RESERVED',
        allocate: 'ALLOCATED',
        release: 'AVAILABLE',
        ship: 'SHIPPED',
      },
    };

    return maps[domain]?.[operation] || 'UNKNOWN';
  }
}

