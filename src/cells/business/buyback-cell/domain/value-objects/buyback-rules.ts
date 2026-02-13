/**
 * NATT-OS — Buyback Cell
 * Value Object: Buyback Rules — Quy tắc thu mua Tâm Luxury
 */

export type BuybackCondition = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';

export interface DepreciationRate {
  condition: BuybackCondition;
  goldRetentionRate: number;
  stoneRetentionRate: number;
  description: string;
}

export const DEPRECIATION_RATES: Record<BuybackCondition, DepreciationRate> = {
  EXCELLENT: { condition: 'EXCELLENT', goldRetentionRate: 0.98, stoneRetentionRate: 0.90, description: 'Như mới, không trầy xước' },
  GOOD:      { condition: 'GOOD',      goldRetentionRate: 0.95, stoneRetentionRate: 0.80, description: 'Ít dấu hiệu sử dụng' },
  FAIR:      { condition: 'FAIR',      goldRetentionRate: 0.90, stoneRetentionRate: 0.60, description: 'Có dấu hiệu sử dụng rõ' },
  POOR:      { condition: 'POOR',      goldRetentionRate: 0.80, stoneRetentionRate: 0.30, description: 'Hư hỏng, cần sửa chữa nhiều' },
};

export type BuybackStatus = 'ASSESSMENT' | 'OFFER_MADE' | 'ACCEPTED' | 'REJECTED' | 'PAYMENT_PENDING' | 'COMPLETED' | 'CANCELLED';

export const VALID_BUYBACK_TRANSITIONS: Record<BuybackStatus, BuybackStatus[]> = {
  ASSESSMENT:      ['OFFER_MADE', 'CANCELLED'],
  OFFER_MADE:      ['ACCEPTED', 'REJECTED'],
  ACCEPTED:        ['PAYMENT_PENDING'],
  REJECTED:        ['CANCELLED'],
  PAYMENT_PENDING: ['COMPLETED'],
  COMPLETED:       [],
  CANCELLED:       [],
};

export const BUYBACK_FEE_RATE = 0.02;
export const MIN_GOLD_WEIGHT_GRAM = 0.5;
export const AUTHENTICATION_REQUIRED_THRESHOLD = 10_000_000;
