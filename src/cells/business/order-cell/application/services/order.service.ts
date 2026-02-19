/**
 * NATT-OS — Order Cell
 * Application Service: OrderService
 * Quản lý đơn hàng Tâm Luxury — VAT 10% direct method
 */

import { Order, OrderProps, OrderLineItem } from '../../domain/entities/order.entity';
import { OrderEngine } from '../../domain/services/order.engine';
import { OrderStatus, PaymentMethod } from '../../domain/value-objects/order-status';

// ═══ CONSTANTS ═══

export const VAT_RATE = 0.10;        // 10% VAT direct method
export const DEPOSIT_MIN_RATE = 0.30; // Cọc tối thiểu 30% tổng giá trị

// ═══ COMMANDS ═══

export interface CreateOrderCommand {
  customerId: string;
  branchCode: string;
  lineItems: OrderLineItem[];
  salesPersonId?: string;
  notes?: string;
}

export interface RecordPaymentCommand {
  orderId: string;
  amount: number;
  method: PaymentMethod;
}

// ═══ SERVICE ═══

export class OrderService {
  private orders: Order[] = [];

  // ─── Create ───

  createOrder(cmd: CreateOrderCommand): { order: Order; errors: string[] } {
    const errors: string[] = [];
    if (cmd.lineItems.length === 0) errors.push('Đơn hàng phải có ít nhất 1 sản phẩm');

    const subtotalVND = cmd.lineItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const vatAmountVND = Math.round(subtotalVND * VAT_RATE);
    const totalVND = subtotalVND + vatAmountVND;

    const props: OrderProps = {
      id: `OD-${Date.now()}`,
      customerId: cmd.customerId,
      branchCode: cmd.branchCode,
      status: 'DRAFT',
      paymentStatus: 'UNPAID',
      lineItems: cmd.lineItems,
      subtotalVND,
      vatAmountVND,
      totalVND,
      depositVND: 0,
      balanceVND: totalVND,
      salesPersonId: cmd.salesPersonId,
      notes: cmd.notes,
      createdAt: new Date(),
    };

    const order = new Order(props);
    if (errors.length === 0) this.orders.push(order);
    return { order, errors };
  }

  // ─── Payment ───

  recordPayment(cmd: RecordPaymentCommand): { success: boolean; paymentStatus?: string; balanceVND?: number; error?: string } {
    const order = this.findById(cmd.orderId);
    if (!order) return { success: false, error: `Không tìm thấy đơn hàng ${cmd.orderId}` };
    if (order.status === 'CANCELLED') return { success: false, error: 'Đơn hàng đã bị hủy' };
    if (order.paymentStatus === 'FULLY_PAID') return { success: false, error: 'Đơn hàng đã thanh toán đủ' };
    if (cmd.amount <= 0) return { success: false, error: 'Số tiền thanh toán phải > 0' };

    order.recordPayment(cmd.amount, cmd.method);
    return { success: true, paymentStatus: order.paymentStatus, balanceVND: order.balanceVND };
  }

  // ─── Transitions ───

  transition(orderId: string, newStatus: OrderStatus): { success: boolean; error?: string } {
    const order = this.findById(orderId);
    if (!order) return { success: false, error: `Không tìm thấy đơn hàng ${orderId}` };
    try {
      order.transitionTo(newStatus);
      return { success: true };
    } catch (e) {
      return { success: false, error: String(e) };
    }
  }

  confirmOrder(orderId: string): { success: boolean; error?: string } {
    const order = this.findById(orderId);
    if (!order) return { success: false, error: `Không tìm thấy đơn hàng ${orderId}` };
    if (order.depositVND < order.totalVND * DEPOSIT_MIN_RATE)
      return { success: false, error: `Cần cọc tối thiểu ${DEPOSIT_MIN_RATE * 100}% để xác nhận đơn` };
    try { order.confirm(); return { success: true }; }
    catch (e) { return { success: false, error: String(e) }; }
  }

  completeOrder(orderId: string): { success: boolean; error?: string } {
    const order = this.findById(orderId);
    if (!order) return { success: false, error: `Không tìm thấy đơn hàng ${orderId}` };
    try { order.complete(); return { success: true }; }
    catch (e) { return { success: false, error: String(e) }; }
  }

  cancelOrder(orderId: string): { success: boolean; refundVND?: number; error?: string } {
    const order = this.findById(orderId);
    if (!order) return { success: false, error: `Không tìm thấy đơn hàng ${orderId}` };
    if (order.status === 'COMPLETED') return { success: false, error: 'Không thể hủy đơn đã hoàn thành' };
    const depositBefore = order.depositVND;
    try {
      order.cancel();
      return { success: true, refundVND: depositBefore > 0 ? depositBefore : undefined };
    } catch (e) { return { success: false, error: String(e) }; }
  }

  // ─── Queries ───

  findById(id: string): Order | undefined {
    return this.orders.find(o => o.id === id);
  }

  getByCustomer(customerId: string): Order[] {
    return OrderEngine.getByCustomer(this.orders, customerId);
  }

  getByStatus(status: OrderStatus): Order[] {
    return OrderEngine.getByStatus(this.orders, status);
  }

  getUnpaid(): Order[] {
    return OrderEngine.getUnpaidOrders(this.orders);
  }

  getTotalRevenue(): number {
    return OrderEngine.getTotalRevenue(this.orders);
  }

  getDailyRevenue(date: Date): number {
    return OrderEngine.getDailyRevenue(this.orders, date);
  }
}
