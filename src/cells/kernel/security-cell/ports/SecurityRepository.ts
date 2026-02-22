import { THReatEvent } from '../domain/entities';

export interface SecurityRepository {
  logTHReat(tHReat: THReatEvent): Promise<void>;
  getActiveTHReats(): Promise<THReatEvent[]>;
  resolveTHReat(id: string): Promise<boolean>;
  getTHReatHistory(limit?: number): Promise<THReatEvent[]>;
}
