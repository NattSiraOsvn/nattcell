/**
 * ConfigSnapshot Entity
 * Point-in-time snapshot of all configuration
 */

import { ConfigEntry } from './ConfigEntry';

export interface ConfigSnapshotProps {
  id: string;
  entries: Map<string, ConfigEntry>;
  createdAt: Date;
  createdBy: string;
  reason: string;
  checksum: string;
}

export class ConfigSnapshot {
  private readonly props: ConfigSnapshotProps;

  private constructor(props: ConfigSnapshotProps) {
    this.props = props;
  }

  static create(
    id: string,
    entries: Map<string, ConfigEntry>,
    createdBy: string,
    reason: string
  ): ConfigSnapshot {
    const checksum = ConfigSnapshot.calculateChecksum(entries);

    return new ConfigSnapshot({
      id,
      entries: new Map(entries),
      createdAt: new Date(),
      createdBy,
      reason,
      checksum,
    });
  }

  private static calculateChecksum(entries: Map<string, ConfigEntry>): string {
    const sortedKeys = Array.from(entries.keys()).sort();
    let hash = 0;
    for (const key of sortedKeys) {
      const entry = entries.get(key)!;
      const str = `${key}:${JSON.stringify(entry.value)}`;
      for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash = hash & hash;
      }
    }
    return Math.abs(hash).toString(16).padStart(16, '0');
  }

  get id(): string { return this.props.id; }
  get entries(): Map<string, ConfigEntry> { return new Map(this.props.entries); }
  get createdAt(): Date { return this.props.createdAt; }
  get createdBy(): string { return this.props.createdBy; }
  get reason(): string { return this.props.reason; }
  get checksum(): string { return this.props.checksum; }
  get entryCount(): number { return this.props.entries.size; }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      entryCount: this.entryCount,
      createdAt: this.props.createdAt.toISOString(),
      createdBy: this.props.createdBy,
      reason: this.props.reason,
      checksum: this.checksum,
    };
  }
}
