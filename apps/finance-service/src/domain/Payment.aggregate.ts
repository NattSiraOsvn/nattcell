
import { ShardingService } from '../../../../services/blockchainService';

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export interface PaymentState {
  id: string;
  orderId: string;
  invoiceId: string;
  amount: number;
  status: PaymentStatus;
  method: string;
  correlationId: string;
  transactionRef?: string;
  updatedAt: string;
}

/**
 * 💳 PAYMENT AGGREGATE ROOT
 * Đảm bảo dòng tiền không bao giờ bị mất dấu và trạng thái luôn nhất quán.
 */
export class PaymentAggregate {
  private state: PaymentState;

  private constructor(state: PaymentState) {
    this.state = state;
  }

  public static initiate(orderId: string, invoiceId: string, amount: number, method: string, correlationId: string): PaymentAggregate {
    const state: PaymentState = {
      id: `PAY-${Date.now()}-${Math.random().toString(36).substring(5).toUpperCase()}`,
      orderId,
      invoiceId,
      amount,
      status: PaymentStatus.PENDING,
      method,
      correlationId,
      updatedAt: new Date().toISOString()
    };
    return new PaymentAggregate(state);
  }

  public complete(transactionRef: string): void {
    if (this.state.status !== PaymentStatus.PENDING) {
      throw new Error(`Giao dịch không ở trạng thái PENDING (Trạng thái hiện tại: ${this.state.status})`);
    }
    this.state.status = PaymentStatus.COMPLETED;
    this.state.transactionRef = transactionRef;
    this.state.updatedAt = new Date().toISOString();
  }

  public fail(reason: string): void {
    this.state.status = PaymentStatus.FAILED;
    this.state.updatedAt = new Date().toISOString();
    console.warn(`[PAYMENT-DOMAIN] Payment ${this.state.id} failed: ${reason}`);
  }

  public getState(): Readonly<PaymentState> {
    return Object.freeze({ ...this.state });
  }

  public generateHash(): string {
    return ShardingService.generateShardHash(this.state);
  }
}
