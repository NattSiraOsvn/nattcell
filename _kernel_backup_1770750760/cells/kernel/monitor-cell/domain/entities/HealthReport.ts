export interface HealthReportProps {
  cellId: string;
  status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';
  timestamp: Date;
  metrics: Record<string, number>;
  details?: Record<string, unknown>;
}

export class HealthReport {
  private readonly props: HealthReportProps;

  private constructor(props: HealthReportProps) { this.props = props; }

  static create(cellId: string, status: HealthReportProps['status'], metrics: Record<string, number>, details?: Record<string, unknown>): HealthReport {
    return new HealthReport({ cellId, status, timestamp: new Date(), metrics, details });
  }

  get cellId(): string { return this.props.cellId; }
  get status(): HealthReportProps['status'] { return this.props.status; }
  get timestamp(): Date { return this.props.timestamp; }
  get metrics(): Record<string, number> { return { ...this.props.metrics }; }

  toJSON() { return { ...this.props, timestamp: this.props.timestamp.toISOString() }; }
}
