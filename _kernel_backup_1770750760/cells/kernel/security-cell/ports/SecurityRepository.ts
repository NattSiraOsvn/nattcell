import { ThreatEvent } from '../domain/entities';

export interface SecurityRepository {
  logThreat(threat: ThreatEvent): Promise<void>;
  getActiveThreats(): Promise<ThreatEvent[]>;
  resolveThreat(id: string): Promise<boolean>;
  getThreatHistory(limit?: number): Promise<ThreatEvent[]>;
}
