// Re-export từ main types - VALUE exports (not type) cho các const được dùng làm value
export { UserRole, Department, PersonaID } from '../../types';
export type { UserPosition, HUDMetric } from '../../types';

export interface CellHealthState {
  cellId: string;
  status: 'HEALTHY' | 'DEGRADED' | 'FAILED' | 'UNKNOWN';
  lastChecked: number;
  metrics?: Record<string, number>;
}

export interface CoordinationTask {
  id: string;
  type: string;
  assignedTo?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'DONE';
  createdAt: number;
}
