import { BuybackTransaction } from '../../domain/entities/buyback-transaction.entity';
import { BuybackEngine } from '../../domain/services/buyback.engine';

export class BuybackService {
  private transactions: BuybackTransaction[] = [];
  createTransaction(tx: BuybackTransaction): string[] { const e = BuybackEngine.validateTransaction(tx); if (e.length === 0) this.transactions.push(tx); return e; }
  getByCustomer(cid: string) { return this.transactions.filter(t => t.toJSON().customerId === cid); }
  getById(id: string) { return this.transactions.find(t => t.id === id); }
}
