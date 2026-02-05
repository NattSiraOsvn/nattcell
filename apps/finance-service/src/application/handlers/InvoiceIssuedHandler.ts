
import { ProductionBase } from '../../ProductionBase.ts';
import { EventEnvelope, FinanceStatus } from '../../../../../types.ts';
import { EventBridge } from '../../../../../services/eventBridge.ts';

export class InvoiceIssuedHandler extends ProductionBase {
  readonly serviceName = 'finance-service';

  async handle(event: EventEnvelope) {
    console.log(`[FINANCE-HANDLER] Processing InvoiceIssued for Order: ${event.payload.order_id}`);
    
    // Simulate Append-Only Persistence
    const invoiceId = event.payload.invoice_id;
    
    // Log to Immutable Ledger
    await this.logAudit('INVOICE_RECORDED', event.trace.correlation_id, {
      invoice_id: invoiceId,
      amount: event.payload.amounts.total,
      status: FinanceStatus.ISSUED
    }, event.event_id);

    // Emit Confirmation to Analytics
    await EventBridge.publish('finance.invoice.issued.confirmed.v1', {
      ...event,
      event_name: 'finance.invoice.issued.confirmed.v1',
      occurred_at: new Date().toISOString(),
      producer: this.serviceName,
      trace: {
        ...event.trace,
        causation_id: event.event_id
      }
    });
  }
}
