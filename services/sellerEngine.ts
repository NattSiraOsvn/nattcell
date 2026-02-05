
import { SellerReport, UserPosition, SellerIdentity, CommissionInfo } from '../types';

export class SellerEngine {
  /**
   * Tính hoa hồng theo Cơ chế mới (Commission Engine v2.0)
   * - Vỏ: 5%
   * - Đá dưới 4 ly: 5%
   * - Đá tròn >= 4 ly: 2%
   * - Đá Fancy: 3%
   * - KPI Factor: 0.8 - 1.2
   */
  static calculateCommission(report: Partial<SellerReport>, sellerKPI: number = 100): CommissionInfo {
    const shellHH = (report.shellRevenue || 0) * 0.05; // 5% cho vỏ
    let stoneHH = 0;
    let baseRate = 5; 

    switch (report.stoneType) {
      case 'UNDER_4LY':
        stoneHH = (report.stoneRevenue || 0) * 0.05;
        break;
      case 'ROUND_OVER_4LY':
        stoneHH = (report.stoneRevenue || 0) * 0.02;
        break;
      case 'FANCY_SHAPE':
        stoneHH = (report.stoneRevenue || 0) * 0.03;
        break;
      default:
        stoneHH = 0;
    }

    // KPI Multiplier (Giả định: 100 điểm = hệ số 1.0, mỗi 10 điểm +/- 0.05)
    // 80 điểm = 0.9, 120 điểm = 1.1
    const kpiFactor = 1 + ((sellerKPI - 100) / 100) * 0.5; // Max variation +/- 0.5
    const normalizedKPI = Math.max(0.8, Math.min(1.2, kpiFactor)); // Clamp between 0.8 and 1.2

    let totalBeforePenalty = (shellHH + stoneHH) * normalizedKPI;

    // Logic Quỹ Gatekeeper: Nếu vi phạm thời gian, trừ hoa hồng
    let penalty = 0;
    if (report.isReportedWithin24h === false) {
       penalty = totalBeforePenalty * 0.1; // Phạt 10% nếu báo cáo chậm
    }

    // Fix: Return full CommissionInfo matching types.ts interface
    return {
      policyId: 'POL-COMM-2026-V2',
      baseRate,
      kpiFactor: normalizedKPI,
      estimatedAmount: totalBeforePenalty,
      finalAmount: totalBeforePenalty - penalty,
      status: 'PENDING',
      total: totalBeforePenalty - penalty,
      shell: shellHH,
      stone: stoneHH
    };
  }

  /**
   * Kiểm tra quy tắc 24h (Điều 9)
   */
  static check24hRule(reportTimestamp: number): boolean {
    const reportDate = new Date(reportTimestamp);
    const now = new Date();
    // Quy tắc: Trước 23h59 cùng ngày phát sinh giao dịch
    return reportDate.getDate() === now.getDate() && 
           reportDate.getMonth() === now.getMonth() && 
           reportDate.getFullYear() === now.getFullYear();
  }

  /**
   * Kiểm tra quy tắc 90 ngày sở hữu Data (Điều 9)
   */
  static isLeadExpired(assignedAt: number): boolean {
    const ninetyDaysInMs = 90 * 24 * 60 * 60 * 1000;
    return (Date.now() - assignedAt) > ninetyDaysInMs;
  }

  /**
   * Kiểm tra quy tắc 7 ngày không tương tác
   */
  static isLeadInactive(lastInteraction: number): boolean {
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
    return (Date.now() - lastInteraction) > sevenDaysInMs;
  }

  /**
   * Tính lương thực lãnh dựa trên vị trí (CTV = 0 lương cứng)
   */
  static calculateIncome(identity: SellerIdentity, baseSalary: number, commission: number): number {
    if (identity.isCollaborator) {
        return commission; // CTVT chỉ ăn hoa hồng
    }
    return baseSalary + commission; // Nhân viên chính thức
  }
}
