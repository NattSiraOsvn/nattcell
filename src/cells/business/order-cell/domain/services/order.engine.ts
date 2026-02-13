import { Order } from '../entities/order.entity';
export class OrderEngine {
  static getByCustomer(orders: Order[], cid: string) { return orders.filter(o => o.customerId === cid); }
  static getByStatus(orders: Order[], s: string) { return orders.filter(o => o.status === s); }
  static getTotalRevenue(orders: Order[]): number { return orders.filter(o => o.status === 'COMPLETED').reduce((sum, o) => sum + o.totalVND, 0); }
  static getUnpaidOrders(orders: Order[]) { return orders.filter(o => o.paymentStatus !== 'FULLY_PAID' && o.status !== 'CANCELLED'); }
}
