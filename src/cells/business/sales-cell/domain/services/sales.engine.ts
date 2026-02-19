/**
 * NATT-OS — Sales Cell
 * Domain Service: SalesEngine
 */

import { SalesTransaction } from '../entities/sales-transaction.entity';

export class SalesEngine {
  static getBySalesPerson(txs: SalesTransaction[], spId: string): SalesTransaction[] {
    return txs.filter(t => t.salesPersonId === spId);
  }

  static getByBranch(txs: SalesTransaction[], branch: string): SalesTransaction[] {
    return txs.filter(t => t.branchCode === branch);
  }

  static getTotalCommission(txs: SalesTransaction[], spId: string): number {
    return txs
      .filter(t => t.salesPersonId === spId && t.status === 'COMPLETED')
      .reduce((s, t) => s + t.commissionVND, 0);
  }

  static getConversionRate(txs: SalesTransaction[]): number {
    const total = txs.length;
    const completed = txs.filter(t => t.status === 'COMPLETED').length;
    return total > 0 ? Math.round(completed / total * 100) : 0;
  }

  static getDailyRevenue(txs: SalesTransaction[], date: Date): number {
    return txs
      .filter(t => {
        if (t.status !== 'COMPLETED') return false;
        const d = t.toJSON().closedAt;
        if (!d) return false;
        return d.getFullYear() === date.getFullYear()
          && d.getMonth() === date.getMonth()
          && d.getDate() === date.getDate();
      })
      .reduce((sum, t) => sum + t.finalValueVND, 0);
  }

  static getTopPerformers(txs: SalesTransaction[], limit = 5): Array<{ spId: string; revenue: number; count: number }> {
    const map = new Map<string, { revenue: number; count: number }>();
    for (const t of txs) {
      if (t.status !== 'COMPLETED') continue;
      const cur = map.get(t.salesPersonId) ?? { revenue: 0, count: 0 };
      map.set(t.salesPersonId, { revenue: cur.revenue + t.finalValueVND, count: cur.count + 1 });
    }
    return Array.from(map.entries())
      .map(([spId, data]) => ({ spId, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, limit);
  }
}
