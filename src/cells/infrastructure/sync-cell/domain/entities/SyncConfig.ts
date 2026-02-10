/**
 * SyncConfig Entity - Configuration for sync operations
 */

export interface SyncConfigProps {
  id: string;
  name: string;
  source: string;
  target: string;
  schedule?: string; // cron expression
  enabled: boolean;
  lastRunAt?: Date;
  nextRunAt?: Date;
  options: Record<string, unknown>;
}

export class SyncConfig {
  private readonly props: SyncConfigProps;

  private constructor(props: SyncConfigProps) { this.props = props; }

  static create(name: string, source: string, target: string, options: Record<string, unknown> = {}): SyncConfig {
    return new SyncConfig({
      id: `syncconfig_${Date.now()}`,
      name, source, target,
      enabled: true,
      options,
    });
  }

  get id(): string { return this.props.id; }
  get name(): string { return this.props.name; }
  get source(): string { return this.props.source; }
  get target(): string { return this.props.target; }
  get enabled(): boolean { return this.props.enabled; }

  enable(): SyncConfig { return new SyncConfig({ ...this.props, enabled: true }); }
  disable(): SyncConfig { return new SyncConfig({ ...this.props, enabled: false }); }

  toJSON() { return { ...this.props }; }
}
