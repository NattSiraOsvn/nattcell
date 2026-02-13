import type { AuditPort, AuditRecord, AppendResult } from "../../ports/audit.port";

export class NoopAuditPort implements AuditPort {
  async append(_record: AuditRecord): Promise<AppendResult> { return { accepted: 0, rejected: 0 }; }
  async appendMany(_records: AuditRecord[]): Promise<AppendResult> { return { accepted: 0, rejected: 0 }; }
  async health() { return { status: "healthy" as const }; }
}
