import { BuybackTransaction, BuybackTransactionProps } from '../../domain/entities/buyback-transaction.entity';
export interface IBuybackRepository { findById(id: string): Promise<BuybackTransaction | null>; save(tx: BuybackTransaction): Promise<void>; getAll(): Promise<BuybackTransaction[]>; }
export class InMemoryBuybackRepository implements IBuybackRepository {
  private store: Map<string, BuybackTransactionProps> = new Map();
  async findById(id: string) { const d = this.store.get(id); return d ? new BuybackTransaction(d) : null; }
  async save(tx: BuybackTransaction) { this.store.set(tx.id, tx.toJSON()); }
  async getAll() { return Array.from(this.store.values()).map(d => new BuybackTransaction(d)); }
}
