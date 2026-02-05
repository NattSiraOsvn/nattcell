
import { ConfigHub } from '../config/ConfigHub';

interface CommissionResult {
  amount: number;
  appliedRate: number;
  bonus: number;
  error?: string;
}

export class CommissionEngine {
  /**
   * Tính hoa hồng cho một đơn hàng cụ thể
   */
  static async calculateForOrder(orderTotal: number, employeeId: string): Promise<CommissionResult> {
    try {
      const config = ConfigHub.getCurrentConfig();
      const rules = config.commissionRules;

      // Logic: Lấy mức cao nhất đạt được
      let appliedRate = rules.baseRate;
      let bonus = 0;

      if (orderTotal >= rules.thresholdAmount) {
        appliedRate = rules.bonusRate;
        bonus = 500000; // Thưởng nóng cho đơn to theo prompt của Natt
      }

      const commissionAmount = orderTotal * appliedRate;
      
      console.log(`[HR] NV ${employeeId}: Đơn ${orderTotal} -> Hoa hồng ${commissionAmount} (Rate: ${appliedRate})`);
      
      return {
        amount: commissionAmount,
        appliedRate,
        bonus
      };
    } catch (error) {
      console.error('[HR Error] Tính hoa hồng thất bại:', error);
      return { amount: 0, appliedRate: 0, bonus: 0, error: 'CALC_FAILED' };
    }
  }
}
