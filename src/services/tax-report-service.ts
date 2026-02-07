
import { BankTransaction, VATReport, PITReport, EmployeePayroll, VATEntry, TaxCalculationResult } from '@/types';

export class TaxReportService {
  /**
   * Tính toán Thuế TNDN (CIT) với ưu đãi
   */
  static calculateCorporateTax(revenue: number, expense: number, incentiveRate: number = 0): TaxCalculationResult['cit'] {
    const taxableIncome = Math.max(0, revenue - expense);
    const standardRate = 0.20; // 20%
    
    const taxAmount = taxableIncome * standardRate;
    const incentiveAmount = taxAmount * incentiveRate;
    
    return {
      taxableIncome,
      rate: standardRate * 100,
      incentives: incentiveAmount,
      amount: taxAmount - incentiveAmount
    };
  }

  static generateVATReport(transactions: BankTransaction[], period: string): VATReport {
    const entries: VATEntry[] = [
      {
        category: 'Vàng trang sức 18K (AU750)',
        salesValue: 2500000000,
        purchaseValue: 2100000000,
        addedValue: 400000000,
        taxRate: 10,
        taxAmount: 40000000
      },
      {
        category: 'Kim cương GIA & Đá quý',
        salesValue: 1800000000,
        purchaseValue: 1550000000,
        addedValue: 250000000,
        taxRate: 10,
        taxAmount: 25000000
      },
      {
        category: 'Sản phẩm chế tác theo đơn',
        salesValue: 950000000,
        purchaseValue: 780000000,
        addedValue: 170000000,
        taxRate: 10,
        taxAmount: 17000000
      }
    ];

    const totalAddedValue = entries.reduce((sum, e) => sum + e.addedValue, 0);
    const totalVATPayable = entries.reduce((sum, e) => sum + e.taxAmount, 0);

    return {
      period,
      entries,
      totalAddedValue,
      totalVATPayable,
      accountingStandard: 'TT200',
      formNumber: '03/GTGT'
    };
  }

  static generatePITReport(payrolls: EmployeePayroll[], period: string): PITReport {
    const entries = payrolls.map(p => ({
      employeeName: p.name,
      employeeCode: p.employeeCode || 'N/A',
      taxableIncome: p.taxableIncome || 0,
      deductions: (p.baseSalary + p.allowanceLunch) - (p.taxableIncome || 0),
      taxPaid: p.personalTax || 0
    }));

    return {
      period,
      entries,
      totalTaxableIncome: entries.reduce((sum, e) => sum + e.taxableIncome, 0),
      totalTaxPaid: entries.reduce((sum, e) => sum + e.taxPaid, 0)
    };
  }
}
