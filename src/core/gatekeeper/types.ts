export type GatekeeperDecision = {
  decisionId: string;
  type: 'APPROVAL' | 'REJECTION' | 'OVERRIDE' | 'EMERGENCY';
  resource: string;
  actor: string;
  timestamp: number;
  reasoning: string;
  evidence: string[];
  coolingOffApplied: boolean;
  aiCouncilNotified: boolean;
  hash: string;
};

export type EmergencyToken = {
  token: string; // Hashed
  created: number;
  expires: number;
  purpose: string;
  used: boolean;
};

export type GatekeeperState = {
  identity: 'NATT_SIRAWAT';
  roles: ['GATEKEEPER', 'THIEN']; // Bootstrap phase
  currentCoolingOff: string | null;
  emergencyTokens: EmergencyToken[];
  decisionJournal: GatekeeperDecision[];
  biasChecks: {
    lastFamilyMemoryAccess: number;
    stressLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    recentDecisions: number; // Last 24h
  };
};
