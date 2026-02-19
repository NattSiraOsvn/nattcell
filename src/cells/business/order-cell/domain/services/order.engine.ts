/**
 * NATT-OS — Order Cell
 * Domain Service: OrderEngine
 */

import { Order } from '../entities/order.entity';
import { OrderStatus } from '../value-objects/order-status';

export class OrderEngine {
  static getByCustomer(orders: Order[], cid: string): Order[] {
    return orders.filter(o => o.customerId === cid);
  }

  static getByStatus(orders: Order[], status: string): Order[] {
    return orders.filter(o => o.status === status);
  }

  static getTotalRevenue(orders: Order[]): number {
    return orders
      .filter(o => o.status === 'COMPLETED')
      .reduce((sum, o) => sum + o.totalVND, 0);
  }

  static getUnpaidOrders(orders: Order[]): Order[] {
    return orders.filter(o =>
      o.paymentStatus !== 'FULLY_PAID' && o.status !== 'CANCELLED'
    );
  }

  static getDailyRevenue(orders: Order[], date: Date): number {
    return orders
      .filter(o => {
        if (o.status !== 'COMPLETED') return false;
        const d = o.toJSON().completedAt;
        if (!d) return false;
        return d.getFullYear() === date.getFullYear()
          && d.getMonth() === date.getMonth()
          && d.getDate() === date.getDate();
      })
      .reduce((sum, o) => sum + o.totalVND, 0);
  }

  static getOrdersByBranch(orders: Order[], branchCode: string): Order[] {
    return orders.filter(o => o.branchCode === branchCode);
  }
}
