
import { Event } from '../types';

export class OutboxService {
  private queue: Event[] = [];

  async publish(event: Event): Promise<void> {
    // 🛡️ KCS: Reliable Messaging
    // 1. Lưu vào bảng outbox (Mock)
    this.queue.push(event);
    
    // 2. Dispatch tới Message Broker (EventBridge)
    console.log(`[OUTBOX_COMMIT] Event ${event.type} niêm phong cho Tenant ${event.tenantId}`);
  }
}
