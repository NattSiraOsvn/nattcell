
import { OrderStatus, ProductionJobBag } from '../types';

export class ProductionEngine {
  // Module 1: Định mức hao hụt chuẩn Tâm Luxury
  private static readonly CASTING_LIMIT = 0.015; // 1.5%
  private static readonly COLDWORK_LIMIT = 0.008; // 0.8%
  private static readonly TOTAL_LIMIT = 0.023;    // 2.3%

  /**
   * Tính hao hụt Đúc
   */
  static calculateCastingLoss(issued: number, btp: number, recovery: number) {
    const loss = issued - (btp + recovery);
    const ratio = issued > 0 ? loss / issued : 0;
    return {
      loss,
      ratio,
      isExceeded: ratio > this.CASTING_LIMIT
    };
  }

  /**
   * Tính hao hụt Nguội
   */
  static calculateColdworkLoss(btpBefore: number, btpAfter: number, recovery: number) {
    const loss = btpBefore - (btpAfter + recovery);
    const ratio = btpBefore > 0 ? loss / btpBefore : 0;
    return {
      loss,
      ratio,
      isExceeded: ratio > this.COLDWORK_LIMIT
    };
  }

  /**
   * Xác định trạng thái tiếp theo dựa trên quy tắc niêm phong hao hụt
   */
  static determineNextStatus(job: ProductionJobBag): OrderStatus {
    const { status, issuedWeight, btpWeight, recoveryWeight } = job;

    if (status === OrderStatus.CASTING) {
        const casting = this.calculateCastingLoss(issuedWeight, btpWeight || 0, recoveryWeight || 0);
        return casting.isExceeded ? OrderStatus.CASTING_LOSS_ALERT : OrderStatus.COLLECTING_BTP;
    }

    if (status === OrderStatus.COLD_WORK) {
        const totalL = issuedWeight > 0 ? (issuedWeight - ((btpWeight || 0) + (recoveryWeight || 0))) / issuedWeight : 0;
        if (totalL > this.TOTAL_LIMIT) return OrderStatus.TOTAL_LOSS_LOCKED;
        return OrderStatus.STONE_SETTING;
    }

    const workflow: Partial<Record<OrderStatus, OrderStatus>> = {
        [OrderStatus.SALE_ORDER]: OrderStatus.DESIGNING,
        [OrderStatus.DESIGNING]: OrderStatus.WAX_READY,
        [OrderStatus.WAX_READY]: OrderStatus.MATERIAL_ISSUED,
        [OrderStatus.MATERIAL_ISSUED]: OrderStatus.CASTING,
        [OrderStatus.COLLECTING_BTP]: OrderStatus.COLD_WORK,
        [OrderStatus.STONE_SETTING]: OrderStatus.FINISHING,
        [OrderStatus.FINISHING]: OrderStatus.QC_PENDING,
        [OrderStatus.QC_PENDING]: OrderStatus.QC_PASSED,
        [OrderStatus.QC_PASSED]: OrderStatus.COMPLETED
    };

    return workflow[status] || status;
  }
}
