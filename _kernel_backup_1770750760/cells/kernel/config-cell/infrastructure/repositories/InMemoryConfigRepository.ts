import { ConfigEntry, ConfigSnapshot } from '../../domain/entities';
import { ConfigRepository } from '../../ports/ConfigRepository';

export class InMemoryConfigRepository implements ConfigRepository {
  private entries = new Map<string, ConfigEntry>();
  private snapshots = new Map<string, ConfigSnapshot>();

  async get(key: string) { return this.entries.get(key) || null; }
  async getAll() { return new Map(this.entries); }
  async getByNamespace(namespace: string) {
    const result = new Map<string, ConfigEntry>();
    for (const [key, entry] of this.entries) {
      if (key.startsWith(`${namespace}.`)) result.set(key, entry);
    }
    return result;
  }
  async save(entry: ConfigEntry) { this.entries.set(entry.key, entry); }
  async saveBatch(entries: ConfigEntry[]) { entries.forEach(e => this.entries.set(e.key, e)); }
  async delete(key: string) { return this.entries.delete(key); }
  async createSnapshot(snapshot: ConfigSnapshot) { this.snapshots.set(snapshot.id, snapshot); }
  async getSnapshot(id: string) { return this.snapshots.get(id) || null; }
  async getLatestSnapshot() {
    const sorted = Array.from(this.snapshots.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return sorted[0] || null;
  }
  async listSnapshots(limit = 10) {
    return Array.from(this.snapshots.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }
  async exists(key: string) { return this.entries.has(key); }
  async count() { return this.entries.size; }
  clear() { this.entries.clear(); this.snapshots.clear(); }
}
