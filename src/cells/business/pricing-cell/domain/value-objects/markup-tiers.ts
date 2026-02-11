/**
 * NATT-OS Pricing Cell — Markup Tiers
 * Source: Bảng Giá 2025, Tâm Luxury
 *
 * Từ SaleTerminal v2 review (Băng đánh giá 7.25/10):
 * Gap đã fix: thiếu mức 30% markup
 *
 * Markup = hệ số nhân lên giá gốc để ra giá bán
 */

export type MarkupTierCode = 'STANDARD' | 'PREMIUM' | 'LUXURY';

export interface MarkupTier {
  readonly code: MarkupTierCode;
  readonly multiplier: number;      // 1.15, 1.20, 1.30
  readonly percentLabel: string;    // "15%", "20%", "30%"
  readonly description: string;
}

export const MARKUP_TIERS: Record<MarkupTierCode, MarkupTier> = {
  STANDARD: { code: 'STANDARD', multiplier: 1.15, percentLabel: '15%', description: 'Sản phẩm thông thường' },
  PREMIUM:  { code: 'PREMIUM',  multiplier: 1.20, percentLabel: '20%', description: 'Sản phẩm cao cấp / thiết kế riêng' },
  LUXURY:   { code: 'LUXURY',   multiplier: 1.30, percentLabel: '30%', description: 'Hàng luxury / limited edition / VIP' },
} as const;

/** Default markup nếu không chỉ định */
export const DEFAULT_MARKUP: MarkupTierCode = 'STANDARD';
