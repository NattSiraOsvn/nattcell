
import { EventEnvelope } from '../../../../../types';
import { CreateInvoice } from '../usecases/CreateInvoice';
import { RiskProjection } from '../projections/RiskProjection';
import { AuditProvider } from '../../../../../services/admin/AuditService';

/**
 * 🔁 FINANCE EVENT PIPELINE
 */
export class FinanceEventPipeline {
  
  public static async process(event: EventEnvelope) {
    console.log(`[FINANCE-PIPELINE] 📥 Processing event: ${event.event_name}`);

    // Ghi nhật ký bóc tách
    await AuditProvider.logAction(
      'FINANCE', 
      'EVENT_INGESTED', 
      { name: event.event_name, correlation_id: event.trace.correlation_id }, 
      'finance-ingestor',
      event.event_id
    );

    switch (event.event_name) {
      case 'sales.order.created.v1':
        const invoice = await CreateInvoice.handle(event);
        // Sau khi tạo invoice, chạy ngay Risk Analysis
        if (invoice) await RiskProjection.analyze(invoice);
        break;

      case 'finance.payment.completed.v1':
        // Cập nhật trạng thái thanh toán trong Read-model
        console.log(`[FINANCE-READ-MODEL] Payment verified for ${event.payload.order_id}`);
        break;

      default:
        console.warn(`[FINANCE-PIPELINE] Unhandled event: ${event.event_name}`);
    }
  }
}
