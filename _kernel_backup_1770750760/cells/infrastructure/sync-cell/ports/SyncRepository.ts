import { SyncJob, SyncConfig } from '../domain/entities';

export interface SyncRepository {
  // Job operations
  saveJob(job: SyncJob): Promise<void>;
  getJob(id: string): Promise<SyncJob | null>;
  getActiveJobs(): Promise<SyncJob[]>;
  getJobHistory(limit?: number): Promise<SyncJob[]>;

  // Config operations
  saveConfig(config: SyncConfig): Promise<void>;
  getConfig(id: string): Promise<SyncConfig | null>;
  getAllConfigs(): Promise<SyncConfig[]>;
  deleteConfig(id: string): Promise<boolean>;
}
