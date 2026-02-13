/**
 * NATT-OS — Customer Cell
 * Value Object: Customer Tier — Hạng khách Tâm Luxury
 */
export type CustomerTier = 'STANDARD' | 'VIP' | 'VVIP';

export interface TierPolicy {
  tier: CustomerTier;
  minSpendVND: number;
  minPurchaseCount: number;
  benefits: string[];
}

export const TIER_POLICIES: Record<CustomerTier, TierPolicy> = {
  STANDARD: {
    tier: 'STANDARD', minSpendVND: 0, minPurchaseCount: 0,
    benefits: ['Bảo hành tiêu chuẩn', 'Đánh bóng miễn phí 6 tháng/lần'],
  },
  VIP: {
    tier: 'VIP', minSpendVND: 50_000_000, minPurchaseCount: 3,
    benefits: ['Giữ hàng 48h', 'Cọc 5%', 'Ưu tiên sửa chữa', 'Quà sinh nhật'],
  },
  VVIP: {
    tier: 'VVIP', minSpendVND: 200_000_000, minPurchaseCount: 5,
    benefits: ['Giữ hàng 72h', 'Không cần cọc', 'Bảo hành toàn diện 36 tháng', 'Tư vấn riêng', 'Ưu đãi buyback'],
  },
};

export function calculateTier(totalSpend: number, purchaseCount: number): CustomerTier {
  if (totalSpend >= TIER_POLICIES.VVIP.minSpendVND && purchaseCount >= TIER_POLICIES.VVIP.minPurchaseCount) return 'VVIP';
  if (totalSpend >= TIER_POLICIES.VIP.minSpendVND && purchaseCount >= TIER_POLICIES.VIP.minPurchaseCount) return 'VIP';
  return 'STANDARD';
}
