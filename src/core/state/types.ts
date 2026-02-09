export enum ConstitutionalState {
  STATE_1 = "CONSTITUTIONAL_FOUNDATION_ESTABLISHED",
  STATE_2 = "KERNEL_CORE_BARE_METAL", 
  STATE_3 = "CELL_RUNTIME_OPERATIONAL",
  STATE_4 = "MEMORY_TRUTH_AUDIT_ACTIVE",
  STATE_5 = "OMEGA_RECOVERY_ENABLED",
  STATE_6 = "GOVERNANCE_LAW_ENGINE_ACTIVE", 
  STATE_7 = "AI_HUMAN_CO_EXISTENCE"
}

export type StateTransition = {
  from: ConstitutionalState;
  to: ConstitutionalState;
  timestamp: number;
  evidence: string[]; // Event IDs, Audit IDs
  gatekeeperApproval: boolean;
  transitionHash: string;
};

export type StateRegistry = {
  currentState: ConstitutionalState;
  previousStates: StateTransition[];
  stateEstablishedAt: number;
  stateEvidence: {
    constitutionHash: string;
    kernelCells: string[]; // List of operational kernel cells
    infrastructureCells: string[];
    auditEnabled: boolean;
    omegaActive: boolean;
  };
  allowedTransitions: Record<ConstitutionalState, ConstitutionalState[]>;
};

// Valid transitions (no skipping)
export const VALID_TRANSITIONS: Record<ConstitutionalState, ConstitutionalState[]> = {
  [ConstitutionalState.STATE_1]: [ConstitutionalState.STATE_2],
  [ConstitutionalState.STATE_2]: [ConstitutionalState.STATE_3],
  [ConstitutionalState.STATE_3]: [ConstitutionalState.STATE_4],
  [ConstitutionalState.STATE_4]: [ConstitutionalState.STATE_5],
  [ConstitutionalState.STATE_5]: [ConstitutionalState.STATE_6],
  [ConstitutionalState.STATE_6]: [ConstitutionalState.STATE_7],
  [ConstitutionalState.STATE_7]: [],
};
