/**
 * ConfigRepository Port
 * Interface for config persistence
 */

import { ConfigEntry, ConfigSnapshot } from '../domain/entities';

export interface ConfigRepository {
  get(key: string): Promise<ConfigEntry | null>;
  getAll(): Promise<Map<string, ConfigEntry>>;
  getByNamespace(namespace: string): Promise<Map<string, ConfigEntry>>;
  save(entry: ConfigEntry): Promise<void>;
  saveBatch(entries: ConfigEntry[]): Promise<void>;
  delete(key: string): Promise<boolean>;

  createSnapshot(snapshot: ConfigSnapshot): Promise<void>;
  getSnapshot(id: string): Promise<ConfigSnapshot | null>;
  getLatestSnapshot(): Promise<ConfigSnapshot | null>;
  listSnapshots(limit?: number): Promise<ConfigSnapshot[]>;

  exists(key: string): Promise<boolean>;
  count(): Promise<number>;
}
