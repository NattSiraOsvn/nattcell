
// 🛠️ Fixed: Import casing for Types
import { EmployeePayroll, SalaryRule, UserRole } from '../types';

export const HR_FIELDS_LEVELS = {
  BASIC: ['fullName', 'dob', 'gender', 'nationality', 'ethnic', 'idCard', 'originAddress', 'permanentAddress', 'temporaryAddress', 'contactAddress', 'email', 'phone'],
  WORK: ['employeeCode', 'status', 'department', 'position', 'workPlace', 'contractNo', 'contractDate', 'contractType', 'approvalStatus'],
  FINANCE: ['baseSalary', 'salaryFactor', 'allowanceLunch', 'allowancePosition', 'bankAccountOwner', 'bankAccountNo', 'bankName', 'bankBranch', 'bankCode'],
  INSURANCE: ['insuranceCode', 'insuranceBookNo', 'medicalCardNo', 'contributionRate', 'minWageRegion', 'contributionAmount', 'medicalRegistration', 'medicalCode', 'medicalUnit']
};

export class HREngine {
  static normalize(str: string): string {
    if (!str) return "";
    return str.toLowerCase().trim()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d");
  }

  // ⚖️ VALIDATION LOGIC chuẩn hóa Y Thịnh
  static validateCCCD(cccd: string): boolean {
    // 12 chữ số
    return /^\d{12}$/.test(cccd);
  }

  static validateTaxID(taxId: string): boolean {
    // 10 hoặc 13 chữ số
    return /^\d{10}(\d{3})?$/.test(taxId);
  }

  static validatePhone(phone: string): boolean {
    return /^(0|84)(3|5|7|8|9)([0-9]{8})$/.test(phone);
  }

  /**
   * 🛡️ FIELD-LEVEL SECURITY
   * Kiểm tra quyền bóc tách từng trường dữ liệu cụ thể.
   */
  static checkPermission(role: UserRole, field: string): boolean {
    // Master, CEO và Kiểm toán độc lập thấy 100% dữ liệu
    if ([UserRole.MASTER, UserRole.LEVEL_1, UserRole.LEVEL_8].includes(role)) return true;
    
    // Quản lý cấp trung (Giám đốc bộ phận/Trưởng phòng) chỉ thấy thông tin cơ bản và công việc
    if (role === UserRole.LEVEL_2 || role === UserRole.LEVEL_3) {
       return HR_FIELDS_LEVELS.BASIC.includes(field) || HR_FIELDS_LEVELS.WORK.includes(field);
    }
    
    // Kế toán thấy thông tin Tài chính & Bảo hiểm nhưng không thấy hồ sơ nhạy cảm khác
    if (role === UserRole.LEVEL_5) {
       // Giả lập logic Kế toán thường được gán cho Staff Level 5 đặc thù
       return HR_FIELDS_LEVELS.FINANCE.includes(field) || HR_FIELDS_LEVELS.INSURANCE.includes(field);
    }

    // Mặc định nhân viên/thợ chỉ thấy thông tin cơ bản
    return HR_FIELDS_LEVELS.BASIC.includes(field);
  }

  static calculateSeniority(startDateStr: string): string {
    if (!startDateStr) return "N/A";
    const start = new Date(startDateStr);
    const now = new Date();
    if (isNaN(start.getTime())) return "Dữ liệu lỗi";

    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    let days = now.getDate() - start.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    return years > 0 ? `${years} năm, ${months} tháng` : `${months} tháng`;
  }

  static processPayroll(employee: EmployeePayroll, rules: SalaryRule[]): EmployeePayroll {
    const standardDays = 26;
    const GIAM_TRU_BAN_THAN = 11000000;
    const GIAM_TRU_NGUOI_PT = 4400000;
    
    const grossSalary = (employee.baseSalary / standardDays) * employee.actualWorkDays;
    const insuranceEmployee = (employee.insuranceSalary || 5000000) * 0.105;
    
    const totalTaxableIncome = grossSalary + employee.allowanceLunch;
    const totalDeductions = insuranceEmployee + GIAM_TRU_BAN_THAN + (employee.dependents * GIAM_TRU_NGUOI_PT);
    const incomeForTax = Math.max(0, totalTaxableIncome - totalDeductions);
    
    // Thuế TNCN lũy tiến 2025
    let tax = 0;
    if (incomeForTax <= 5000000) tax = incomeForTax * 0.05;
    else if (incomeForTax <= 10000000) tax = incomeForTax * 0.1 - 250000;
    else if (incomeForTax <= 18000000) tax = incomeForTax * 0.15 - 750000;
    else tax = incomeForTax * 0.2 - 1650000;

    return {
      ...employee,
      seniority: this.calculateSeniority(employee.startDate),
      grossSalary: Math.round(grossSalary),
      insuranceEmployee: Math.round(insuranceEmployee),
      personalTax: Math.round(tax),
      netSalary: Math.round(grossSalary + employee.allowanceLunch - insuranceEmployee - tax)
    };
  }
}
