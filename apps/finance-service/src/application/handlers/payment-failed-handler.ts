
import { ProductionBase } from '../../ProductionBase.ts';
import { EventEnvelope, OrderStatus } from '../../../../../types.ts';
import { EventBridge } from '../../../../../services/eventBridge.ts';

export class PaymentFailedHandler extends ProductionBase {
  readonly serviceName = 'finance-service';

  async handle(event: EventEnvelope) {
    const { order_id, reason } = event.payload;
    console.warn(`[FINANCE-HANDLER] Payment Failed for Order: ${order_id}. Reason: ${reason}`);

    await this.logAudit('PAYMENT_FAILURE_LOGGED', event.trace.correlation_id, {
      order_id,
      reason
    }, event.event_id);

    // 🔄 COMPENSATION: Put Order on Hold
    await EventBridge.publish('sales.order.on_hold.v1', {
      ...event,
      event_name: 'sales.order.on_hold.v1',
      payload: { order_id, reason: 'PAYMENT_FAILED', detail: reason }
    });
  }
}
