import { SalesTransaction, SalesTransactionProps } from '../../domain/entities/sales-transaction.entity';
export class InMemorySalesRepository {
  private store: Map<string, SalesTransactionProps> = new Map();
  async findById(id: string) { const d = this.store.get(id); return d ? new SalesTransaction(d) : null; }
  async save(tx: SalesTransaction) { this.store.set(tx.id, tx.toJSON()); }
  async getAll() { return Array.from(this.store.values()).map(d => new SalesTransaction(d)); }
}
