
import { ConfigHub } from './configHub';
import { ShardingService } from './blockchainService';
import { ShiftSession } from '../types';

export class HRCoreEngine {
  /**
   * Tính toán hoa hồng dựa trên cấu hình trung tâm
   */
  static async calculateCommission(orderTotal: number, employeeId: string) {
    const config = ConfigHub.getCurrentConfig();
    const rules = config.commissionRules;
    
    let rate = rules.baseRate;
    let bonus = 0;

    if (orderTotal >= rules.thresholdAmount) {
      rate += rules.bonusRate;
      bonus = 500000; // Thưởng nóng cho đơn to
    }

    const amount = orderTotal * rate;
    
    return {
      amount,
      rate,
      bonus,
      traceId: ShardingService.generateShardHash({ employeeId, orderTotal, amount })
    };
  }

  /**
   * Quản lý ca làm việc
   */
  static async openShift(employeeId: string, openingCash: number): Promise<ShiftSession> {
    return {
      id: `SHFT-${Date.now()}`,
      employeeId,
      // Fixed: property name matches interface definition in types.ts
      openingCash: openingCash,
      startTime: Date.now(),
      status: 'OPEN'
    };
  }

  static async closeShift(shiftId: string, endCash: number, systemRevenue: number): Promise<{ status: 'CLOSED', difference: number }> {
    const difference = endCash - systemRevenue;
    console.log(`[HR] Shift ${shiftId} closed. Cash difference: ${difference}`);
    return { status: 'CLOSED', difference };
  }
}
