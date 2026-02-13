import { Promotion } from '../../domain/entities/promotion.entity';
import { PromotionEngine } from '../../domain/services/promotion.engine';
export class PromotionService {
  private promos: Promotion[] = [];
  create(p: Promotion) { this.promos.push(p); }
  findByCode(code: string) { return PromotionEngine.findByCode(this.promos, code); }
  getActive() { return PromotionEngine.getActivePromotions(this.promos); }
  getBestDiscount(orderValue: number) { return PromotionEngine.getBestDiscount(this.promos.filter(p => p.isValid()), orderValue); }
  cleanupExpired() { PromotionEngine.checkExpired(this.promos); }
}
