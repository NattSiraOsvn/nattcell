import { ThreatEvent } from '../../domain/entities';
import { SecurityRepository } from '../../ports/SecurityRepository';

export class InMemorySecurityRepository implements SecurityRepository {
  private threats: ThreatEvent[] = [];

  async logThreat(threat: ThreatEvent) { this.threats.push(threat); }
  async getActiveThreats() { return this.threats.filter(t => !t.resolved); }
  async resolveThreat(id: string) {
    const idx = this.threats.findIndex(t => t.id === id);
    if (idx >= 0) { this.threats[idx] = this.threats[idx].resolve(); return true; }
    return false;
  }
  async getThreatHistory(limit = 100) { return this.threats.slice(-limit); }
}
