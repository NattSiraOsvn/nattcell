
import { EventEnvelope } from '../../../types';

/**
 * 💰 PaymentCompleted.v1
 * Phát hành bởi Finance Service khi tiền đã thực vào tài khoản (Bank/Gate confirm).
 */
export interface PaymentCompletedPayload {
  payment_id: string;
  order_id: string;
  invoice_id: string;
  amount: number;
  method: 'BANK_TRANSFER' | 'VNPAY' | 'MOMO' | 'CASH';
  transaction_ref: string; // Mã tham chiếu ngân hàng
  completed_at: string;
}

export type PaymentCompletedEvent = EventEnvelope<PaymentCompletedPayload>;

export const PaymentCompletedSchema = {
  event_name: 'finance.payment.completed.v1',
  producer: 'finance-service',
  version: 'v1'
};
