export interface ThreatEventProps {
  id: string;
  type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  source: string;
  description: string;
  timestamp: Date;
  resolved: boolean;
}

export class ThreatEvent {
  private readonly props: ThreatEventProps;

  private constructor(props: ThreatEventProps) { this.props = props; }

  static create(type: string, severity: ThreatEventProps['severity'], source: string, description: string): ThreatEvent {
    return new ThreatEvent({
      id: `threat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type, severity, source, description,
      timestamp: new Date(),
      resolved: false,
    });
  }

  get id(): string { return this.props.id; }
  get type(): string { return this.props.type; }
  get severity(): ThreatEventProps['severity'] { return this.props.severity; }
  get source(): string { return this.props.source; }
  get resolved(): boolean { return this.props.resolved; }

  resolve(): ThreatEvent {
    return new ThreatEvent({ ...this.props, resolved: true });
  }

  toJSON() { return { ...this.props, timestamp: this.props.timestamp.toISOString() }; }
}
