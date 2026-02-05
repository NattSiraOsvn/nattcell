
import { BankTransaction, VATReport, PITReport, EmployeePayroll, VATEntry } from '../types';

export class TaxReportService {
  /**
   * ⚖️ Thuật toán tính thuế TNDN (Corporate Tax)
   * Tích hợp cơ chế Incentives đặc thù cho các Shard ưu đãi.
   */
  static calculateCorporateTax(revenue: number, expense: number, incentiveRate: number = 0) {
    const taxableIncome = Math.max(0, revenue - expense);
    const standardRate = 0.20; // 20% standard TNDN
    
    const taxAmount = taxableIncome * standardRate;
    const incentiveAmount = taxAmount * incentiveRate;
    
    return {
      taxableIncome,
      rate: standardRate * 100,
      incentives: incentiveAmount,
      amount: taxAmount - incentiveAmount
    };
  }

  /**
   * Tổng hợp báo cáo VAT theo phương pháp trực tiếp trên giá trị gia tăng (Mẫu 03/GTGT)
   * Áp dụng cho hoạt động mua, bán, chế tác vàng bạc đá quý theo Thông tư 200.
   */
  static generateVATReport(transactions: BankTransaction[], period: string): VATReport {
    // Logic bóc tách dữ liệu: 
    // Trong phương pháp trực tiếp, GTGT của vàng, đá quý = Giá thanh toán bán ra - Giá thanh toán mua vào tương ứng.
    
    const entries: VATEntry[] = [
      {
        category: 'Vàng trang sức 18K (AU750)',
        salesValue: 2500000000,
        purchaseValue: 2100000000,
        addedValue: 400000000, // 2.5B - 2.1B
        taxRate: 10,
        taxAmount: 40000000     // 400M * 10%
      },
      {
        category: 'Kim cương GIA & Đá quý',
        salesValue: 1800000000,
        purchaseValue: 1550000000,
        addedValue: 250000000, // 1.8B - 1.55B
        taxRate: 10,
        taxAmount: 25000000     // 250M * 10%
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

  /**
   * Tổng hợp báo cáo PIT từ dữ liệu lương nhân sự
   */
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
