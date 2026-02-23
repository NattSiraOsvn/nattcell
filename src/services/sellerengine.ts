// SellerEngine — Commission calculation
export const sellerengine = {};

export class SellerEngine {
  static calculateCommission(params: {
    saleAmount?: number; shellRevenue?: number; stoneRevenue?: number;
    stoneType?: string; isReportedWithin24h?: boolean;
    kpiPoints?: number; [key: string]: unknown;
  }): { total: number; shell: number; stone: number; policyId: string; baseRate: number; kpiFactor: number; estimatedAmount: number; finalAmount: number; status: string } {
    const shellRev = (params.shellRevenue ?? params.saleAmount) || 0;
    const stoneRev = params.stoneRevenue || 0;
    const rate = 0.02;
    const shell = Math.round(shellRev * rate);
    const stone = Math.round(stoneRev * rate);
    const total = shell + stone;
    return { total, shell, stone, policyId: 'DEFAULT', baseRate: rate, kpiFactor: 1, estimatedAmount: total, finalAmount: total, status: 'CALCULATED' };
  }
  static check24hRule(timestamp: number): boolean {
    return (Date.now() - timestamp) <= 86400000;
  }
}

export default { sellerengine: {}, SellerEngine };
