
import { DistributedTask, ViewType } from '../types';

class TaskRouterService {
  private static instance: TaskRouterService;
  private queue: DistributedTask[] = [];
  private listeners: ((tasks: DistributedTask[]) => void)[] = [];

  public static getInstance() {
    if (!TaskRouterService.instance) TaskRouterService.instance = new TaskRouterService();
    return TaskRouterService.instance;
  }

  /**
   * Truyền một Shard tác vụ tới module đích
   */
  public transmit(task: Omit<DistributedTask, 'id' | 'timestamp' | 'status'>) {
    const newTask: DistributedTask = {
      ...task,
      id: `TXN-${Math.random().toString(36).substring(7).toUpperCase()}`,
      timestamp: Date.now(),
      status: 'PENDING'
    };
    this.queue = [newTask, ...this.queue];
    this.notify();
    console.log(`[TASK-ROUTER] Đã truyền tin tới module: ${task.targetModule}`, newTask);
  }

  public getTasksByModule(module: ViewType) {
    return this.queue.filter(t => t.targetModule === module);
  }

  public completeTask(id: string) {
    this.queue = this.queue.map(t => t.id === id ? { ...t, status: 'COMPLETED' } : t);
    this.notify();
  }

  public subscribe(callback: (tasks: DistributedTask[]) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notify() {
    this.listeners.forEach(l => l(this.queue));
  }
}

export const TaskRouter = TaskRouterService.getInstance();
