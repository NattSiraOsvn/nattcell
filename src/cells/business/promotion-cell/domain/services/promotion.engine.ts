import { Promotion } from '../entities/promotion.entity';
export class PromotionEngine {
  static findByCode(promos: Promotion[], code: string) { return promos.find(p => p.code === code && p.isValid()); }
  static getActivePromotions(promos: Promotion[]) { return promos.filter(p => p.isValid()); }
  static checkExpired(promos: Promotion[]) { const now = new Date(); promos.forEach(p => { if (p.status === 'ACTIVE' && now > p.endDate) p.expire(); }); }
  static getBestDiscount(promos: Promotion[], orderValue: number): { promo: Promotion | null; discount: number } {
    let best: Promotion | null = null; let max = 0;
    for (const p of promos) { const d = p.applyDiscount(orderValue); if (d > max) { max = d; best = p; } }
    return { promo: best, discount: max };
  }
}
