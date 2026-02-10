import { AuditEntry } from '../domain/entities';

export interface AuditRepository {
  append(entry: AuditEntry): Promise<void>;
  getById(id: string): Promise<AuditEntry | null>;
  getByResource(resource: string, resourceId: string): Promise<AuditEntry[]>;
  getByActor(actor: string, limit?: number): Promise<AuditEntry[]>;
  getLatest(): Promise<AuditEntry | null>;
  getAll(limit?: number): Promise<AuditEntry[]>;
  count(): Promise<number>;
}
