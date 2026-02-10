export interface SyncEventEmitter {
  emitSyncStarted(jobId: string, source: string, target: string): Promise<void>;
  emitSyncCompleted(jobId: string, recordsSynced: number): Promise<void>;
  emitSyncFailed(jobId: string, error: string): Promise<void>;
  emitSyncProgress(jobId: string, progress: number): Promise<void>;
}
