
import { QuantumTask } from '../types';
import { NotifyBus } from './notificationService';
import { PersonaID } from '../types';

class QuantumBufferService {
  private static instance: QuantumBufferService;
  private queue: QuantumTask[] = [];
  private isProcessing: boolean = false;
  private listeners: ((queue: QuantumTask[]) => void)[] = [];

  public static getInstance(): QuantumBufferService {
    if (!QuantumBufferService.instance) {
      QuantumBufferService.instance = new QuantumBufferService();
    }
    return QuantumBufferService.instance;
  }

  public enqueue(type: string, payload: any, priority: number = 1) {
    const task: QuantumTask = {
      id: `TASK-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type,
      payload,
      priority,
      timestamp: Date.now()
    };
    this.queue.push(task);
    this.notify();
    
    if (!this.isProcessing) {
      this.startProcessing();
    }
  }

  private async startProcessing() {
    this.isProcessing = true;
    
    while (this.queue.length > 0) {
      // Sắp xếp theo ưu tiên
      this.queue.sort((a, b) => b.priority - a.priority);
      const task = this.queue.shift();
      
      if (task) {
        // Giả lập xử lý nhịp độ (mỗi task mất 500ms - 1s)
        await new Promise(r => setTimeout(r, 600 + Math.random() * 400));
        console.log(`[QuantumBuffer] Processed task ${task.id}: ${task.type}`);
        this.notify();
      }
    }
    
    this.isProcessing = false;
  }

  public subscribe(callback: (queue: QuantumTask[]) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notify() {
    this.listeners.forEach(l => l([...this.queue]));
  }

  public getQueueLength() {
    return this.queue.length;
  }
}

export const QuantumBuffer = QuantumBufferService.getInstance();
