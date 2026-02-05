
import { EventBridge } from '../../../../../services/eventBridge';
import { PaymentAggregate } from '../../domain/Payment.aggregate';
import { EventEnvelope } from '../../../../../types';
import { RetryPolicy } from '../../infrastructure/messaging/RetryPolicy';
import { DeadLetterHandler } from '../../infrastructure/messaging/DeadLetterHandler';
import { FinanceAuditLogger } from '../../infrastructure/audit/AuditLogger';

/**
 * 🎼 PAYMENT SAGA ORCHESTRATOR
 * Điều phối luồng tiền từ khi khởi tạo đến khi chốt đơn.
 */
export class PaymentSaga {
  
  public static init() {
    // Lắng nghe yêu cầu thanh toán từ Gateway/UI
    EventBridge.subscribe('finance.invoice.created.v1', async (event: EventEnvelope) => {
      await this.handleInvoiceIssued(event);
    });
  }

  private static async handleInvoiceIssued(event: EventEnvelope) {
    await RetryPolicy.execute(
      async () => {
        const payment = PaymentAggregate.initiate(
          event.payload.order_id,
          event.payload.invoice_id,
          event.payload.amounts.total,
          'VNPAY', // Mặc định trong v1
          event.trace.correlation_id
        );

        await FinanceAuditLogger.logAction({
          action: 'PAYMENT_INITIATED',
          actor: 'finance-service-saga',
          entity_type: 'PAYMENT',
          entity_id: payment.getState().id,
          new_state_hash: payment.generateHash(),
          correlation_id: event.trace.correlation_id
        });

        console.log(`[SAGA-PAYMENT] Khởi tạo giao dịch ${payment.getState().id} cho Hóa đơn ${event.payload.invoice_id}`);
      },
      `PaymentInitiation[Order:${event.payload.order_id}]`,
      async (err) => await DeadLetterHandler.escalate(event, err)
    );
  }
}
