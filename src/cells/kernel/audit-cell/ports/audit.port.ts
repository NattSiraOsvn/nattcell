export type PersonaID =
  | "KIM_CHIEF_GOVERNANCE_ENFORCER"
  | "CAN_BUSINESS_LOGIC_ARCHITECT"
  | "THIEN_SECURITY_GUARDIAN"
  | "NA_DATA_ANALYST_STRATEGIST"
  | "BANG_DATA_INTEGRITY_GUARDIAN"
  | "BOI_BOI_DEVELOPER_REHAB"
  | "KRIS_UI_ARCHITECT"
  | "PHIEU_SYSTEM_INTEGRATOR"
  | "ANH_NAT_GATEKEEPER"
  | "SYSTEM_AUTO"
  | "UNKNOWN";

export interface Actor {
  persona_id: PersonaID;
  user_id?: string;
  role?: string;
}

export interface AuditScope {
  cell: string;
  layer: "kernel" | "infrastructure" | "business" | "foundation";
  wave?: number;
}

export interface AuditTrace {
  trace_id?: string;
  span_id?: string;
  causation_id?: string;
  correlation_id?: string;
}

export interface AuditIntegrity {
  hash?: string;
  prev_hash?: string;
  algo?: "sha256" | "blake3";
}

export interface AuditRecord {
  record_id: string;
  timestamp: string;
  actor: Actor;
  action: string;
  scope: AuditScope;
  target?: { entity?: string; entity_id?: string };
  trace?: AuditTrace;
  payload?: Record<string, unknown>;
  integrity?: AuditIntegrity;
}

export interface AppendResult {
  accepted: number;
  rejected: number;
  errors?: Array<{ record_id?: string; message: string }>;
}

export interface AuditPort {
  append(record: AuditRecord): Promise<AppendResult>;
  appendMany(records: AuditRecord[]): Promise<AppendResult>;
  health?(): Promise<{ status: "healthy" | "degraded" | "unhealthy" }>;
}
