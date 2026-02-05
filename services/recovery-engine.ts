
import { OperationRecord, Checkpoint } from '../types';

// Exporting locally if needed, but primarily relying on types.ts
export type { OperationRecord, Checkpoint };

/**
 * NATT-OS RECOVERY ENGINE v5.0
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
   * ✅ Record Operation (Before Execution)
   * Ghi nhận tác vụ trước khi thực thi để sẵn sàng Replay nếu crash.
   */
  recordOperation(type: string, module: string, params: any): string {
    const id = `OP-${Date.now()}-${Math.random().toString(36).substr(2,5)}`;
    this.opLog.unshift({
      id,
      type,
      module,
      params,
      timestamp: Date.now(),
      status: 'PENDING'
    });
    if (this.opLog.length > 500) this.opLog.pop();
    return id;
  }

  completeOperation(id: string) {
    const op = this.opLog.find(o => o.id === id);
    if (op) op.status = 'SUCCESS';
  }

  /**
   * ✅ Handle Failure & Auto-Recover
   * Tự động thử lại hoặc đưa vào hàng chờ xử lý lỗi (Dead Letter Queue).
   */
  async reportFailure(id: string, error: any, strategy: 'RETRY' | 'MANUAL' | 'COMPENSATE' = 'RETRY') {
    const op = this.opLog.find(o => o.id === id);
    if (!op) return;

    console.error(`[Recovery] Operation ${id} failed:`, error);
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
      attempts++;
      console.log(`[Recovery] Retrying ${op.id} (Attempt ${attempts})...`);
      await new Promise(r => setTimeout(r, 1000 * attempts));

      if (Math.random() > 0.4) { // Giả lập tỷ lệ hồi phục thành công
          op.status = 'RECOVERED';
          op.error = undefined;
          console.log(`[Recovery] ${op.id} recovered successfully.`);
          return;
      }
    }
    this.moveToDeadLetter(op);
  }

  private moveToDeadLetter(op: OperationRecord) {
    this.deadLetterQueue.push(op);
  }

  /**
   * ✅ Checkpoints
   * Lưu trữ trạng thái module tại một thời điểm nhất định.
   */
  createCheckpoint(module: string, state: any): string {
    const id = `CHK-${Date.now()}`;
    this.checkpoints.set(id, { id, moduleState: state, timestamp: Date.now() });
    return id;
  }

  async restoreCheckpoint(id: string): Promise<any> {
    const chk = this.checkpoints.get(id);
    if (!chk) throw new Error("Checkpoint not found");
    return chk.moduleState;
  }

  getDeadLetterQueue() { return this.deadLetterQueue; }
  getRecentLogs() { return this.opLog.slice(0, 50); }
  
  async replayOperation(id: string) {
     const op = this.deadLetterQueue.find(o => o.id === id) || this.opLog.find(o => o.id === id);
     if (!op) return false;
     
     await new Promise(r => setTimeout(r, 800));
     op.status = 'RECOVERED';
     this.deadLetterQueue = this.deadLetterQueue.filter(o => o.id !== id);
     return true;
  }
}

export const RecoverySystem = RecoveryEngine.getInstance();
