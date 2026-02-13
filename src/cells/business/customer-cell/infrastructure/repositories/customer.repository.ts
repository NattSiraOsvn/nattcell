import { Customer, CustomerProps } from '../../domain/entities/customer.entity';
export interface ICustomerRepository { findById(id: string): Promise<Customer | null>; findByPhone(phone: string): Promise<Customer | null>; save(c: Customer): Promise<void>; getAll(): Promise<Customer[]>; }
export class InMemoryCustomerRepository implements ICustomerRepository {
  private store: Map<string, CustomerProps> = new Map();
  async findById(id: string) { const d = this.store.get(id); return d ? new Customer(d) : null; }
  async findByPhone(phone: string) { for (const d of this.store.values()) { if (d.phone === phone) return new Customer(d); } return null; }
  async save(c: Customer) { this.store.set(c.id, c.toJSON()); }
  async getAll() { return Array.from(this.store.values()).map(d => new Customer(d)); }
}
