/**
 * Gold Price Repository
 * Persistence layer cho giá vàng thị trường.
 * TODO: implement khi có database layer
 */

import { GoldTypeCode, GoldMarketPrice } from '../../domain/value-objects/gold-types';

export interface IGoldPriceRepository {
  getLatestPrice(goldType: GoldTypeCode): Promise<GoldMarketPrice | null>;
  savePrice(price: GoldMarketPrice): Promise<void>;
  getPriceHistory(goldType: GoldTypeCode, days: number): Promise<GoldMarketPrice[]>;
}

// In-memory implementation for scaffold phase
export class InMemoryGoldPriceRepository implements IGoldPriceRepository {
  private prices: Map<GoldTypeCode, GoldMarketPrice[]> = new Map();

  async getLatestPrice(goldType: GoldTypeCode): Promise<GoldMarketPrice | null> {
    const history = this.prices.get(goldType) ?? [];
    return history[history.length - 1] ?? null;
  }

  async savePrice(price: GoldMarketPrice): Promise<void> {
    const history = this.prices.get(price.goldType) ?? [];
    history.push(price);
    this.prices.set(price.goldType, history);
  }

  async getPriceHistory(goldType: GoldTypeCode, days: number): Promise<GoldMarketPrice[]> {
    const cutoff = Date.now() - days * 86_400_000;
    const history = this.prices.get(goldType) ?? [];
    return history.filter(p => new Date(p.updatedAt).getTime() >= cutoff);
  }
}
