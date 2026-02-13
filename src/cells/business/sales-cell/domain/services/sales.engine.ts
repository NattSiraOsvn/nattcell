import { SalesTransaction } from '../entities/sales-transaction.entity';
export class SalesEngine {
  static getBySalesPerson(txs: SalesTransaction[], spId: string) { return txs.filter(t => t.salesPersonId === spId); }
  static getByBranch(txs: SalesTransaction[], branch: string) { return txs.filter(t => t.branchCode === branch); }
  static getTotalCommission(txs: SalesTransaction[], spId: string): number {
    return txs.filter(t => t.salesPersonId === spId && t.status === 'COMPLETED').reduce((s, t) => s + t.commissionVND, 0);
  }
  static getConversionRate(txs: SalesTransaction[]): number {
    const total = txs.length; const completed = txs.filter(t => t.status === 'COMPLETED').length;
    return total > 0 ? Math.round(completed / total * 100) : 0;
  }
}
