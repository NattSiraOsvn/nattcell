export interface GateContext {
  action: {
    name: string;
    payload?: any;
  };
  actor?: {
    id: string;
    role?: string;
  };
  metadata?: {
    roadload?: string;
    [key: string]: any;
  };
}

export interface GateResult {
  allowed: boolean;
  reason?: string;
  auditTrail?: string[];
  riskLevel?: string;
  requireAudit?: boolean;
}
