import { Order } from '../../domain/entities/order.entity';
import { OrderEngine } from '../../domain/services/order.engine';
export class OrderService {
  private orders: Order[] = [];
  create(o: Order) { this.orders.push(o); }
  findById(id: string) { return this.orders.find(o => o.id === id); }
  getByCustomer(cid: string) { return OrderEngine.getByCustomer(this.orders, cid); }
  getByStatus(s: string) { return OrderEngine.getByStatus(this.orders, s); }
  getTotalRevenue() { return OrderEngine.getTotalRevenue(this.orders); }
  getUnpaid() { return OrderEngine.getUnpaidOrders(this.orders); }
}
