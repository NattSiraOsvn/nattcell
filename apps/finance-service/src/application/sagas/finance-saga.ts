
import { EventBridge } from '../../../../../services/eventBridge';
import { InvoiceAggregate } from '../../domain/Invoice.aggregate';
import { EventEnvelope, PersonaID } from '../../../../../types';
import { AuditProvider } from '../../../../../services/admin/AuditService';
import { NotifyBus } from '../../../../../services/notificationService';

export class FinanceSaga {
  private static processedEvents: Set<string> = new Set();

  public static init() {
    EventBridge.subscribe('sales.order.created.v1', async (event: EventEnvelope) => {
      await this.handleOrderCreated(event);
    });

    EventBridge.subscribe('warehouse.inventory.insufficient.v1', async (event: EventEnvelope) => {
      await this.handleInventoryInsufficient(event);
    });
  }

  private static async handleOrderCreated(event: EventEnvelope) {
    if (this.processedEvents.has(event.event_id)) return;

    console.log(`[SAGA-FINANCE] Nhận Order ${event.payload.id}. Đang tạo Proforma Invoice...`);
    
    const invoice = InvoiceAggregate.createFromOrder(
      event.payload.id, 
      event.payload.total, 
      event.trace.correlation_id
    );

    await AuditProvider.logAction(
      'FINANCE',
      'INVOICE_GENERATED',
      { invoice_id: invoice.getState().id, correlation_id: event.trace.correlation_id },
      'system'
    );

    const outEvent: EventEnvelope = {
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
      payload: invoice.getState()
    };

    await EventBridge.publish(outEvent.event_name, outEvent);
    this.processedEvents.add(event.event_id);
  }

  private static async handleInventoryInsufficient(event: EventEnvelope) {
    console.log(`[SAGA-COMPENSATION] Thiếu kho cho Order ${event.payload.order_id}. Đang thu hồi hóa đơn...`);
    NotifyBus.push({
      type: 'RISK',
      title: 'FINANCE COMPENSATION',
      content: `Hóa đơn cho Order ${event.payload.order_id} đã bị hủy do thiếu kho.`,
      persona: PersonaID.KRIS
    });
  }
}
