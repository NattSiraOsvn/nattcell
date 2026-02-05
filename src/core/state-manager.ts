
import { StateChange } from '../types';

export interface TransitionMatrix {
  [currentState: string]: string[];
}

export interface StateTransition {
  fromState: string;
  toState: string;
  allowed: boolean;
  reason?: string;
}

export class StateManager {
  private stateMachines: Map<string, TransitionMatrix>;
  private stateHistory: Map<string, StateChange[]>;

  constructor() {
    this.stateMachines = new Map();
    this.stateHistory = new Map();
    this.initializeStateMachines();
  }

  private initializeStateMachines(): void {
    const orderStateMachine: TransitionMatrix = {
      'CREATED': ['PAYMENT_PENDING', 'CANCELLED'],
      'PAYMENT_PENDING': ['PAID', 'CANCELLED'],
      'PAID': ['PROCESSING', 'REFUND_REQUESTED'],
      'PROCESSING': ['SHIPPED', 'FAILED'],
      'SHIPPED': ['DELIVERED', 'RETURN_REQUESTED'],
      'DELIVERED': ['COMPLETED', 'RETURNED'],
      'COMPLETED': [],
      'CANCELLED': [],
      'REFUNDED': [],
      'RETURNED': []
    };

    const inventoryStateMachine: TransitionMatrix = {
      'AVAILABLE': ['RESERVED', 'OUT_OF_STOCK'],
      'RESERVED': ['ALLOCATED', 'RELEASED'],
      'ALLOCATED': ['SHIPPED', 'RETURNED'],
      'SHIPPED': ['DELIVERED', 'LOST'],
      'DELIVERED': ['AVAILABLE'],
      'OUT_OF_STOCK': ['AVAILABLE'],
      'LOST': ['WRITTEN_OFF']
    };

    this.stateMachines.set('order', orderStateMachine);
    this.stateMachines.set('inventory', inventoryStateMachine);
  }

  async validateTransition(domain: string, operation: string, payload: any, tenantId: string): Promise<StateTransition> {
    const stateMachine = this.stateMachines.get(domain);
    if (!stateMachine) {
      throw new Error(`KCS STATE ERROR: No state machine defined for domain: ${domain}`);
    }

    const entityId = payload.id;
    const currentState = await this.getCurrentState(entityId, tenantId, domain);
    const nextState = this.determineNextState(domain, operation, payload);

    const allowedStates = stateMachine[currentState] || [];
    const isAllowed = allowedStates.includes(nextState);

    if (!isAllowed) {
      throw new Error(`KCS STATE VIOLATION: Cannot transition from ${currentState} to ${nextState} in ${domain}.`);
    }

    return { fromState: currentState, toState: nextState, allowed: true };
  }

  async recordStateChange(change: StateChange): Promise<void> {
    const key = `${change.tenantId}:${change.entityId}`;
    if (!this.stateHistory.has(key)) this.stateHistory.set(key, []);
    this.stateHistory.get(key)!.push(change);
    console.log(`[STATE_DISCIPLINE] ${change.entityId} (${change.tenantId}): ${change.fromState} -> ${change.toState}`);
  }

  async getCurrentState(entityId: string, tenantId: string, domain: string): Promise<string> {
    const key = `${tenantId}:${entityId}`;
    const history = this.stateHistory.get(key) || [];
    return history.length === 0 ? this.getInitialState(domain) : history[history.length - 1].toState;
  }

  private getInitialState(domain: string): string {
    return domain === 'order' ? 'CREATED' : 'AVAILABLE';
  }

  private determineNextState(domain: string, operation: string, payload: any): string {
    const maps: any = {
      order: { create: 'CREATED', pay: 'PAID', ship: 'SHIPPED', complete: 'COMPLETED' },
      inventory: { reserve: 'RESERVED', allocate: 'ALLOCATED', release: 'AVAILABLE' }
    };
    return maps[domain]?.[operation] || 'UNKNOWN';
  }
}
