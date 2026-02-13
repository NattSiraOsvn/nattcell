export type PromotionType = 'PERCENTAGE' | 'FIXED_AMOUNT' | 'GIFT_WITH_PURCHASE' | 'BUNDLE';
export type PromotionStatus = 'DRAFT' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED';

export interface PromotionRule {
  minOrderValueVND?: number;
  applicableCategories?: string[];
  applicableTiers?: Array<'STANDARD' | 'VIP' | 'VVIP'>;
  maxUsageCount?: number;
  maxUsagePerCustomer?: number;
}
