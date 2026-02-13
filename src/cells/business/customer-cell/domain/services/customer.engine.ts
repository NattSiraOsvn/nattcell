import { Customer } from '../entities/customer.entity';
export class CustomerEngine {
  static findByPhone(customers: Customer[], phone: string): Customer | undefined { return customers.find(c => c.phone === phone); }
  static getVIPCustomers(customers: Customer[]): Customer[] { return customers.filter(c => c.tier === 'VIP' || c.tier === 'VVIP'); }
  static getBirthdayCustomers(customers: Customer[], month: number): Customer[] {
    return customers.filter(c => { const p = c.toJSON(); return p.birthday && p.birthday.getMonth() + 1 === month; });
  }
}
