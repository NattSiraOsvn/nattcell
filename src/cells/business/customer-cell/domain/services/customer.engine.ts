/**
 * NATT-OS — Customer Cell
 * Domain Service: CustomerEngine
 */

import { Customer } from '../entities/customer.entity';

export class CustomerEngine {
  static findByPhone(customers: Customer[], phone: string): Customer | undefined {
    return customers.find(c => c.phone === phone);
  }

  static getVIPCustomers(customers: Customer[]): Customer[] {
    return customers.filter(c => c.tier === 'VIP' || c.tier === 'VVIP');
  }

  static getBirthdayCustomers(customers: Customer[], month: number): Customer[] {
    return customers.filter(c => {
      const p = c.toJSON();
      return p.birthday && p.birthday.getMonth() + 1 === month;
    });
  }

  static getUpcomingBirthdays(customers: Customer[], daysAhead: number): Array<{ customer: Customer; daysUntil: number }> {
    const now = new Date();
    const result: Array<{ customer: Customer; daysUntil: number }> = [];

    for (const c of customers) {
      const bd = c.toJSON().birthday;
      if (!bd) continue;

      // Tính ngày sinh năm nay
      const thisYearBD = new Date(now.getFullYear(), bd.getMonth(), bd.getDate());
      if (thisYearBD < now) thisYearBD.setFullYear(now.getFullYear() + 1); // Năm sau nếu đã qua

      const daysUntil = Math.floor((thisYearBD.getTime() - now.getTime()) / (24 * 3600 * 1000));
      if (daysUntil <= daysAhead) result.push({ customer: c, daysUntil });
    }

    return result.sort((a, b) => a.daysUntil - b.daysUntil);
  }

  static getHighValueCustomers(customers: Customer[], minSpendVND: number): Customer[] {
    return customers.filter(c => c.totalSpendVND >= minSpendVND);
  }
}
