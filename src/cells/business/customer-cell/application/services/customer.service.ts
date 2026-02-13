import { Customer } from '../../domain/entities/customer.entity';
import { CustomerEngine } from '../../domain/services/customer.engine';
export class CustomerService {
  private customers: Customer[] = [];
  register(c: Customer) { this.customers.push(c); }
  findByPhone(phone: string) { return CustomerEngine.findByPhone(this.customers, phone); }
  findById(id: string) { return this.customers.find(c => c.id === id); }
  getVIPs() { return CustomerEngine.getVIPCustomers(this.customers); }
  recordPurchase(customerId: string, amount: number) { const c = this.findById(customerId); if (!c) return null; return c.recordPurchase(amount); }
}
