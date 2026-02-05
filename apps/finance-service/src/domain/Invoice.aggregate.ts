
import { ShardingService } from '../../../../services/blockchainService';

export enum InvoiceType {
  PROFORMA = 'PROFORMA',
  FINAL = 'FINAL'
}

export interface InvoiceState {
  id: string;
  orderId: string;
  type: InvoiceType;
  amount: number;
  status: 'DRAFT' | 'ISSUED' | 'CANCELLED' | 'PAID';
  correlationId: string;
  createdAt: string;
}

/**
 * 🏛️ INVOICE AGGREGATE ROOT
 */
export class InvoiceAggregate {
  private state: InvoiceState;

  private constructor(state: InvoiceState) {
    this.state = state;
  }

  public static createFromOrder(orderId: string, amount: number, correlationId: string): InvoiceAggregate {
    if (amount <= 0) throw new Error("Số tiền hóa đơn phải là số dương.");
    
    const state: InvoiceState = {
      id: `INV-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`,
      orderId,
      amount,
      type: InvoiceType.PROFORMA,
      status: 'ISSUED',
      correlationId,
      createdAt: new Date().toISOString()
    };

    return new InvoiceAggregate(state);
  }

  public cancel(reason: string): void {
    if (this.state.status === 'PAID') {
      throw new Error("Không thể hủy hóa đơn đã thanh toán.");
    }
    this.state.status = 'CANCELLED';
  }

  public getState(): Readonly<InvoiceState> {
    return Object.freeze({ ...this.state });
  }

  public generateHash(): string {
    return ShardingService.generateShardHash(this.state);
  }
}
