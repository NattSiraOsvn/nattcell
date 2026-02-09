import { ConstitutionalState, VALID_TRANSITIONS, StateTransition } from './types';

export class StateValidator {
  static validateTransition(
    currentState: ConstitutionalState,
    targetState: ConstitutionalState,
    evidence: string[]
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // 1. Check if transition is allowed
    const allowedTargets = VALID_TRANSITIONS[currentState];
    if (!allowedTargets.includes(targetState)) {
      errors.push(`Invalid transition: ${currentState} → ${targetState}`);
    }

    // 2. Check evidence requirements
    if (evidence.length === 0) {
      errors.push('Transition requires evidence');
    }

    // 3. State-specific requirements
    switch (targetState) {
      case ConstitutionalState.STATE_2:
        if (!evidence.some(e => e.includes('config-cell') && e.includes('rbac-cell'))) {
          errors.push('STATE_2 requires config-cell and rbac-cell evidence');
        }
        break;
      case ConstitutionalState.STATE_3:
        if (!evidence.some(e => e.includes('EventBus'))) {
          errors.push('STATE_3 requires EventBus operational evidence');
        }
        break;
      case ConstitutionalState.STATE_4:
        if (!evidence.some(e => e.includes('audit-trail'))) {
          errors.push('STATE_4 requires audit trail evidence');
        }
        break;
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  static createTransitionHash(transition: Omit<StateTransition, 'transitionHash'>): string {
    const data = JSON.stringify({
      from: transition.from,
      to: transition.to,
      timestamp: transition.timestamp,
      evidence: transition.evidence.sort(),
      gatekeeperApproval: transition.gatekeeperApproval
    });
    
    // Simple hash for now - replace with crypto in production
    return `trans_${btoa(data).slice(0, 32)}`;
  }
}
