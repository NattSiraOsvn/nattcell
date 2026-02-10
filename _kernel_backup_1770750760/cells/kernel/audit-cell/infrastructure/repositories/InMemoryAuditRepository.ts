import { AuditEntry } from '../../domain/entities';
import { AuditRepository } from '../../ports/AuditRepository';

export class InMemoryAuditRepository implements AuditRepository {
  private entries: AuditEntry[] = [];

  async append(entry: AuditEntry) { this.entries.push(entry); }
  async getById(id: string) { return this.entries.find(e => e.id === id) || null; }
  async getByResource(resource: string, resourceId: string) {
    return this.entries.filter(e => e.resource === resource);
  }
  async getByActor(actor: string, limit = 100) {
    return this.entries.filter(e => e.actor === actor).slice(-limit);
  }
  async getLatest() { return this.entries[this.entries.length - 1] || null; }
  async getAll(limit = 1000) { return this.entries.slice(-limit); }
  async count() { return this.entries.length; }
  clear() { this.entries = []; }
}
