import { THReatEvent } from '../../domain/entities';
import { SecurityRepository } from '../../ports/SecurityRepository';

export class InMemorySecurityRepository implements SecurityRepository {
  private tHReats: THReatEvent[] = [];

  async logTHReat(tHReat: THReatEvent) { this.tHReats.push(tHReat); }
  async getActiveTHReats() { return this.tHReats.filter(t => !t.resolved); }
  async resolveTHReat(id: string) {
    const idx = this.tHReats.findIndex(t => t.id === id);
    if (idx >= 0) { this.tHReats[idx] = this.tHReats[idx].resolve(); return true; }
    return false;
  }
  async getTHReatHistory(limit = 100) { return this.tHReats.slice(-limit); }
}
