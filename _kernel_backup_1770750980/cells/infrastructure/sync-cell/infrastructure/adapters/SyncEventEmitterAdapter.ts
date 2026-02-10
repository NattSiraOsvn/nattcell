import { SyncEventEmitter } from '../../ports/SyncEventEmitter';

export class SyncEventEmitterAdapter implements SyncEventEmitter {
  async emitSyncStarted(jobId: string, source: string, target: string) {
    console.log('[SYNC-CELL] sync.started:', { jobId, source, target });
  }
  async emitSyncCompleted(jobId: string, recordsSynced: number) {
    console.log('[SYNC-CELL] sync.completed:', { jobId, recordsSynced });
  }
  async emitSyncFailed(jobId: string, error: string) {
    console.log('[SYNC-CELL] sync.failed:', { jobId, error });
  }
  async emitSyncProgress(jobId: string, progress: number) {
    console.log('[SYNC-CELL] sync.progress:', { jobId, progress });
  }
}
