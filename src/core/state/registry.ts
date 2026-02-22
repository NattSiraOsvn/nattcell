import { 
  ConstitutionalState, 
  StateRegistry, 
  StateTransition,
  VALID_TRANSITIONS 
} from './types';
import { StateValidator } from './validator';

export class StateRegistryService {
  private static instance: StateRegistryService;
  private registry: StateRegistry;

  private constructor() {
    // Initialize at STATE_1 (Foundation established)
    this.registry = {
      currentState: ConstitutionalState.STATE_1,
      previousStates: [],
      stateEstablishedAt: Date.now(),
      stateEvidence: {
        constitutionHash: 'CONSTITUTION-v3.1-FINAL-20260208-GK-APPROVED',
        kernelCells: [],
        infrastructureCells: ['WAREHOUSE-cell'], // From audit
        auditEnabled: false,
        omegaActive: false
      },
      allowedTransitions: VALID_TRANSITIONS
    };
  }

  static getInstance(): StateRegistryService {
    if (!StateRegistryService.instance) {
      StateRegistryService.instance = new StateRegistryService();
    }
    return StateRegistryService.instance;
  }

  getCurrentState(): ConstitutionalState {
    return this.registry.currentState;
  }

  getRegistry(): StateRegistry {
    return JSON.parse(JSON.stringify(this.registry)); // Deep copy
  }

  async transitionTo(
    targetState: ConstitutionalState,
    evidence: string[],
    gatekeeperApproval: boolean
  ): Promise<{ success: boolean; errors: string[]; transition?: StateTransition }> {
    
    if (!gatekeeperApproval) {
      return {
        success: false,
        errors: ['Gatekeeper approval required for state transition']
      };
    }

    const validation = StateValidator.validateTransition(
      this.registry.currentState,
      targetState,
      evidence
    );

    if (!validation.valid) {
      return {
        success: false,
        errors: validation.errors
      };
    }

    const transition: Omit<StateTransition, 'transitionHash'> = {
      from: this.registry.currentState,
      to: targetState,
      timestamp: Date.now(),
      evidence,
      gatekeeperApproval
    };

    const transitionHash = StateValidator.createTransitionHash(transition);
    const fullTransition: StateTransition = { ...transition, transitionHash };

    // Update registry
    this.registry.previousStates.push(fullTransition);
    this.registry.currentState = targetState;
    this.registry.stateEstablishedAt = Date.now();

    // Update evidence based on new state
    this.updateStateEvidence(targetState, evidence);

    return {
      success: true,
      errors: [],
      transition: fullTransition
    };
  }

  private updateStateEvidence(state: ConstitutionalState, evidence: string[]) {
    switch (state) {
      case ConstitutionalState.STATE_2:
        this.registry.stateEvidence.kernelCells = [
          'config-cell',
          'rbac-cell', 
          'monitor-cell',
          'audit-cell',
          'security-cell'
        ];
        break;
      case ConstitutionalState.STATE_3:
        this.registry.stateEvidence.kernelCells = evidence
          .filter(e => e.includes('-cell'))
          .map(e => e.split(':')[0]);
        break;
      case ConstitutionalState.STATE_4:
        this.registry.stateEvidence.auditEnabled = true;
        break;
      case ConstitutionalState.STATE_5:
        this.registry.stateEvidence.omegaActive = true;
        break;
    }
  }

  // For CI/CD and audit checks
  validateCurrentState(): { valid: boolean; requirements: string[]; missing: string[] } {
    const requirements: string[] = [];
    const missing: string[] = [];

    switch (this.registry.currentState) {
      case ConstitutionalState.STATE_1:
        requirements.push('Constitution exists');
        requirements.push('State Registry defined');
        if (!this.registry.stateEvidence.constitutionHash) {
          missing.push('Constitution hash');
        }
        break;
      
      case ConstitutionalState.STATE_2:
        requirements.push('5 Kernel cells operational');
        if (this.registry.stateEvidence.kernelCells.length < 5) {
          missing.push(`${5 - this.registry.stateEvidence.kernelCells.length} kernel cells`);
        }
        break;
      
      case ConstitutionalState.STATE_3:
        requirements.push('Cells communicate via EventBus');
        requirements.push('SmartLink active');
        // Check via evidence in transitions
        break;
    }

    return {
      valid: missing.length === 0,
      requirements,
      missing
    };
  }
}
