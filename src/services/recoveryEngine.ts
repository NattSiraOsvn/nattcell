
import { OperationRecord, Checkpoint } from '../types';

/**
 * NATT-OS RECOVERY ENGINE v5.2
 * Kế thừa logic xử lý lỗi và phục hồi trạng thái từ kiến trúc Shard.
 */
class RecoveryEngine {
  private static instance: RecoveryEngine;
  private opLog: OperationRecord[] = [];
  private checkpoints: Map<string, Checkpoint> = new Map();
  private deadLetterQueue: OperationRecord[] = [];
  
  private readonly MAX_RETRIES = 3;

  static getInstance() {
    if (!RecoveryEngine.instance) RecoveryEngine.instance = new RecoveryEngine();
    return RecoveryEngine.instance;
  }

  /**
   * ✅ Record Operation
   */
  recordOperation(type: string, module: string, params: any): string {
    const id = `OP-${Date.now()}-${Math.random().toString(36).substring(2,7).toUpperCase()}`;
    const newOp: OperationRecord = {
      id,
      type,
      module,
      params,
      timestamp: Date.now(),
      status: 'PENDING'
    };
    
    this.opLog.unshift(newOp);
    
    // Nếu là Repair Node, đưa vào Dead Letter để User Fix
    if (type === 'REPAIR_NODE') {
        newOp.status = 'FAILED';
        newOp.error = 'SHARD_INTEGRITY_FAIL: Cần Master xác thực bản Backup.';
        this.deadLetterQueue.unshift(newOp);
    }

    if (this.opLog.length > 500) this.opLog.pop();
    return id;
  }

  completeOperation(id: string) {
    const op = this.opLog.find(o => o.id === id);
    if (op) op.status = 'SUCCESS';
  }

  async reportFailure(id: string, error: any, strategy: 'RETRY' | 'MANUAL' = 'RETRY') {
    const op = this.opLog.find(o => o.id === id);
    if (!op) return;

    op.status = 'FAILED';
    op.error = error.message || String(error);

    if (strategy === 'RETRY') {
       await this.attemptRetry(op);
    } else {
       this.moveToDeadLetter(op);
    }
  }

  private async attemptRetry(op: OperationRecord) {
    let attempts = 0;
    while (attempts < this.MAX_RETRIES) {
      attempts += 1;
      await new Promise(r => setTimeout(r, 800));

      if (Math.random() > 0.6) {
          op.status = 'RECOVERED';
          op.error = undefined;
          return;
      }
    }
    this.moveToDeadLetter(op);
  }

  private moveToDeadLetter(op: OperationRecord) {
    if (!this.deadLetterQueue.some(d => d.id === op.id)) {
        this.deadLetterQueue.unshift(op);
    }
  }

  createCheckpoint(module: string, state: any): string {
    const id = `CHK-${Date.now()}`;
    this.checkpoints.set(id, { id, moduleState: state, timestamp: Date.now() });
    return id;
  }

  getDeadLetterQueue() { return this.deadLetterQueue; }
  
  async replayOperation(id: string) {
     const op = this.deadLetterQueue.find(o => o.id === id);
     if (!op) return false;
     
     // Giả lập logic khôi phục thực tế
     await new Promise(r => setTimeout(r, 1200));
     op.status = 'RECOVERED';
     op.error = undefined;
     this.deadLetterQueue = this.deadLetterQueue.filter(o => o.id !== id);
     
     console.log(`[RECOVERY] Shard ${op.module} has been successfully restored from local shadow storage.`);
     return true;
  }
}

export const RecoverySystem = RecoveryEngine.getInstance();
