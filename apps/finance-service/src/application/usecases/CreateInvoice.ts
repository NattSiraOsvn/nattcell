
import { EventEnvelope } from '../../../../../types';
import { InvoiceAggregate, InvoiceState } from '../../domain/Invoice.aggregate';
import { EventBridge } from '../../../../../services/eventBridge';
import { AuditProvider } from '../../../../../services/admin/AuditService';

export class CreateInvoice {
  
  public static async handle(event: EventEnvelope): Promise<InvoiceState | null> {
    const { id, total } = event.payload;

    try {
      // 1. Thực thi nghiệp vụ qua Aggregate (Domain)
      const invoice = InvoiceAggregate.createFromOrder(
        id, 
        total, 
        event.trace.correlation_id
      );

      const state = invoice.getState();

      // 2. Niêm phong vào Audit Ledger
      await AuditProvider.logAction(
        'FINANCE', 
        'INVOICE_CREATED', 
        { invoice_id: state.id, hash: invoice.generateHash() }, 
        'system:finance',
        event.event_id
      );

      // 3. Phát hành sự kiện bóc tách cho các team khác (Team 4 Analytics)
      await EventBridge.publish('finance.invoice.created.v1', {
        event_name: 'finance.invoice.created.v1',
        event_version: 'v1',
        event_id: crypto.randomUUID(),
        occurred_at: new Date().toISOString(),
        producer: 'finance-service',
        trace: {
          correlation_id: event.trace.correlation_id,
          causation_id: event.event_id,
          trace_id: crypto.randomUUID()
        },
        tenant: event.tenant,
        payload: state
      });

      return state;

    } catch (err) {
      console.error(`[FINANCE-USECASE] Lỗi tạo hóa đơn cho Order ${id}:`, err);
      return null;
    }
  }
}
