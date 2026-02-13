import { Order, OrderProps } from '../../domain/entities/order.entity';
export interface IOrderRepository { findById(id: string): Promise<Order | null>; save(o: Order): Promise<void>; getAll(): Promise<Order[]>; }
export class InMemoryOrderRepository implements IOrderRepository {
  private store: Map<string, OrderProps> = new Map();
  async findById(id: string) { const d = this.store.get(id); return d ? new Order(d) : null; }
  async save(o: Order) { this.store.set(o.id, o.toJSON()); }
  async getAll() { return Array.from(this.store.values()).map(d => new Order(d)); }
}
