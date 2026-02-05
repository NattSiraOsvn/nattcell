
import { ProductionBase } from '../../ProductionBase.ts';
import { EventEnvelope, FinanceStatus, OrderStatus } from '../../../../../types.ts';
import { EventBridge } from '../../../../../services/eventBridge.ts';

export class PaymentSucceededHandler extends ProductionBase {
  readonly serviceName = 'finance-service';

  async handle(event: EventEnvelope) {
    const { invoice_id, order_id, amount } = event.payload;
    console.log(`[FINANCE-HANDLER] Payment Succeeded for Invoice: ${invoice_id}`);

    await this.logAudit('PAYMENT_PROCESSED', event.trace.correlation_id, {
      invoice_id,
      amount,
      status: FinanceStatus.PAID
    }, event.event_id);

    // Trigger Order Completion in Sales
    await EventBridge.publish('sales.order.completed.v1', {
      ...event,
      event_name: 'sales.order.completed.v1',
      payload: { order_id, status: OrderStatus.COMPLETED }
    });
  }
}
