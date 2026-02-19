/**
 * NATT-OS — Customer Cell
 * Application Service: CustomerService
 * Quản lý khách hàng & tier Tâm Luxury
 */

import { Customer, CustomerProps } from '../../domain/entities/customer.entity';
import { CustomerEngine } from '../../domain/services/customer.engine';
import { CustomerTier, TIER_POLICIES } from '../../domain/value-objects/customer-tier';

// ═══ COMMANDS ═══

export interface RegisterCustomerCommand {
  fullName: string;
  phone: string;
  email?: string;
  birthday?: Date;
  preferredBranch?: 'HANOI' | 'HCMC';
  notes?: string;
}

export interface RecordPurchaseResult {
  tierChanged: boolean;
  oldTier: CustomerTier;
  newTier: CustomerTier;
  newTotalSpend: number;
  newPurchaseCount: number;
  unlockedBenefits?: string[];
}

// ═══ SERVICE ═══

export class CustomerService {
  private customers: Customer[] = [];

  // ─── Register ───

  register(cmd: RegisterCustomerCommand): { customer: Customer; errors: string[] } {
    const errors: string[] = [];

    if (!cmd.fullName?.trim()) errors.push('Họ tên không được để trống');
    if (!cmd.phone?.trim()) errors.push('Số điện thoại không được để trống');

    // Kiểm tra trùng SĐT
    if (cmd.phone && this.findByPhone(cmd.phone))
      errors.push(`SĐT ${cmd.phone} đã tồn tại trong hệ thống`);

    const props: CustomerProps = {
      id: `CU-${Date.now()}`,
      fullName: cmd.fullName,
      phone: cmd.phone,
      email: cmd.email,
      tier: 'STANDARD',
      totalSpendVND: 0,
      purchaseCount: 0,
      birthday: cmd.birthday,
      preferredBranch: cmd.preferredBranch,
      notes: cmd.notes,
      createdAt: new Date(),
    };

    const customer = new Customer(props);
    if (errors.length === 0) this.customers.push(customer);
    return { customer, errors };
  }

  // ─── Purchase recording ───

  recordPurchase(customerId: string, amountVND: number): RecordPurchaseResult | null {
    const customer = this.findById(customerId);
    if (!customer) return null;

    const result = customer.recordPurchase(amountVND);
    let unlockedBenefits: string[] | undefined;

    if (result.tierChanged) {
      unlockedBenefits = TIER_POLICIES[result.newTier].benefits;
    }

    return {
      ...result,
      newTotalSpend: customer.totalSpendVND,
      newPurchaseCount: customer.purchaseCount,
      unlockedBenefits,
    };
  }

  // ─── Birthday notifications ───

  getBirthdayCustomersThisMonth(): Customer[] {
    const now = new Date();
    return CustomerEngine.getBirthdayCustomers(this.customers, now.getMonth() + 1);
  }

  getUpcomingBirthdays(daysAhead: number = 7): Array<{ customer: Customer; daysUntil: number }> {
    return CustomerEngine.getUpcomingBirthdays(this.customers, daysAhead);
  }

  // ─── Queries ───

  findByPhone(phone: string): Customer | undefined {
    return CustomerEngine.findByPhone(this.customers, phone);
  }

  findById(id: string): Customer | undefined {
    return this.customers.find(c => c.id === id);
  }

  getVIPs(): Customer[] {
    return CustomerEngine.getVIPCustomers(this.customers);
  }

  getByTier(tier: CustomerTier): Customer[] {
    return this.customers.filter(c => c.tier === tier);
  }

  getTierSummary(): Record<CustomerTier, number> {
    return {
      STANDARD: this.customers.filter(c => c.tier === 'STANDARD').length,
      VIP: this.customers.filter(c => c.tier === 'VIP').length,
      VVIP: this.customers.filter(c => c.tier === 'VVIP').length,
    };
  }
}
