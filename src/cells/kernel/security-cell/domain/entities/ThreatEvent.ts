export interface THReatEventProps {
  id: string;
  type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  source: string;
  description: string;
  timestamp: Date;
  resolved: boolean;
}

export class THReatEvent {
  private readonly props: THReatEventProps;

  private constructor(props: THReatEventProps) { this.props = props; }

  static create(type: string, severity: THReatEventProps['severity'], source: string, description: string): THReatEvent {
    return new THReatEvent({
      id: `tHReat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type, severity, source, description,
      timestamp: new Date(),
      resolved: false,
    });
  }

  get id(): string { return this.props.id; }
  get type(): string { return this.props.type; }
  get severity(): THReatEventProps['severity'] { return this.props.severity; }
  get source(): string { return this.props.source; }
  get resolved(): boolean { return this.props.resolved; }

  resolve(): THReatEvent {
    return new THReatEvent({ ...this.props, resolved: true });
  }

  toJSON() { return { ...this.props, timestamp: this.props.timestamp.toISOString() }; }
}
