import { SalesTransaction } from '../../domain/entities/sales-transaction.entity';
import { SalesEngine } from '../../domain/services/sales.engine';
export class SalesService {
  private txs: SalesTransaction[] = [];
  create(tx: SalesTransaction) { this.txs.push(tx); }
  findById(id: string) { return this.txs.find(t => t.id === id); }
  getBySalesPerson(spId: string) { return SalesEngine.getBySalesPerson(this.txs, spId); }
  getConversionRate() { return SalesEngine.getConversionRate(this.txs); }
  getTotalCommission(spId: string) { return SalesEngine.getTotalCommission(this.txs, spId); }
}
