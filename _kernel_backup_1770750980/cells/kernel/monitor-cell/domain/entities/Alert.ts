export interface AlertProps {
  id: string;
  cellId: string;
  type: 'WARNING' | 'ERROR' | 'CRITICAL';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

export class Alert {
  private readonly props: AlertProps;

  private constructor(props: AlertProps) { this.props = props; }

  static create(cellId: string, type: AlertProps['type'], message: string): Alert {
    return new Alert({
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      cellId, type, message, timestamp: new Date(), acknowledged: false,
    });
  }

  get id(): string { return this.props.id; }
  get cellId(): string { return this.props.cellId; }
  get type(): AlertProps['type'] { return this.props.type; }
  get message(): string { return this.props.message; }
  get acknowledged(): boolean { return this.props.acknowledged; }

  acknowledge(): Alert { return new Alert({ ...this.props, acknowledged: true }); }

  toJSON() { return { ...this.props, timestamp: this.props.timestamp.toISOString() }; }
}
