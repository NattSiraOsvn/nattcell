/**
 * SyncJob Entity - Represents a data synchronization job
 */

export type SyncStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
export type SyncDirection = 'PUSH' | 'PULL' | 'BIDIRECTIONAL';

export interface SyncJobProps {
  id: string;
  source: string;
  target: string;
  direction: SyncDirection;
  status: SyncStatus;
  progress: number;
  recordsProcessed: number;
  recordsTotal: number;
  errors: string[];
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  createdBy: string;
}

export class SyncJob {
  private readonly props: SyncJobProps;

  private constructor(props: SyncJobProps) { this.props = props; }

  static create(source: string, target: string, direction: SyncDirection, createdBy: string, recordsTotal = 0): SyncJob {
    return new SyncJob({
      id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      source, target, direction,
      status: 'PENDING',
      progress: 0,
      recordsProcessed: 0,
      recordsTotal,
      errors: [],
      createdAt: new Date(),
      createdBy,
    });
  }

  get id(): string { return this.props.id; }
  get source(): string { return this.props.source; }
  get target(): string { return this.props.target; }
  get status(): SyncStatus { return this.props.status; }
  get progress(): number { return this.props.progress; }
  get errors(): string[] { return [...this.props.errors]; }

  start(): SyncJob {
    if (this.status !== 'PENDING') throw new Error('Can only start PENDING jobs');
    return new SyncJob({ ...this.props, status: 'RUNNING', startedAt: new Date() });
  }

  updateProgress(processed: number): SyncJob {
    const progress = this.props.recordsTotal > 0 ? (processed / this.props.recordsTotal) * 100 : 0;
    return new SyncJob({ ...this.props, recordsProcessed: processed, progress });
  }

  complete(): SyncJob {
    return new SyncJob({ ...this.props, status: 'COMPLETED', progress: 100, completedAt: new Date() });
  }

  fail(error: string): SyncJob {
    return new SyncJob({
      ...this.props,
      status: 'FAILED',
      errors: [...this.props.errors, error],
      completedAt: new Date(),
    });
  }

  cancel(): SyncJob {
    return new SyncJob({ ...this.props, status: 'CANCELLED', completedAt: new Date() });
  }

  toJSON(): Record<string, unknown> {
    return {
      ...this.props,
      createdAt: this.props.createdAt.toISOString(),
      startedAt: this.props.startedAt?.toISOString(),
      completedAt: this.props.completedAt?.toISOString(),
    };
  }
}
