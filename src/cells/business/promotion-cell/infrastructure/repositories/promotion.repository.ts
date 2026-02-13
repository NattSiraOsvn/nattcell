import { Promotion, PromotionProps } from '../../domain/entities/promotion.entity';
export class InMemoryPromotionRepository {
  private store: Map<string, PromotionProps> = new Map();
  async findByCode(code: string) { for (const d of this.store.values()) { if (d.code === code) return new Promotion(d); } return null; }
  async save(p: Promotion) { this.store.set(p.id, p.toJSON()); }
  async getAll() { return Array.from(this.store.values()).map(d => new Promotion(d)); }
}
