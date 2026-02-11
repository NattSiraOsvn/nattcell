/**
 * NATT-OS Pricing Cell — Gold Types & Market Prices
 * Source: Bảng Giá 2025, Tâm Luxury
 *
 * Đơn vị giá: VNĐ/chỉ (1 chỉ = 3.75g)
 * Gold purity codes follow Vietnamese jewelry industry standard
 */

export type GoldTypeCode = '750' | '585' | '416' | '990' | '999';

export interface GoldType {
  readonly code: GoldTypeCode;
  readonly karatLabel: string;
  readonly purityPercent: number;
  readonly description: string;
}

export const GOLD_TYPES: Record<GoldTypeCode, GoldType> = {
  '750': { code: '750', karatLabel: '18K', purityPercent: 75.0, description: 'Vàng 18K — phổ biến nhất cho trang sức' },
  '585': { code: '585', karatLabel: '14K', purityPercent: 58.5, description: 'Vàng 14K — bền, giá hợp lý' },
  '416': { code: '416', karatLabel: '10K', purityPercent: 41.6, description: 'Vàng 10K — entry level' },
  '990': { code: '990', karatLabel: 'SJC Nhẫn', purityPercent: 99.0, description: 'Vàng SJC dạng nhẫn' },
  '999': { code: '999', karatLabel: '24K', purityPercent: 99.9, description: 'Vàng 24K nguyên chất' },
} as const;

/**
 * Giá vàng thị trường — cập nhật hàng ngày từ nguồn bên ngoài.
 * Đơn vị: VNĐ/chỉ (3.75g)
 */
export interface GoldMarketPrice {
  readonly goldType: GoldTypeCode;
  readonly pricePerChi: number;        // VNĐ/chỉ
  readonly pricePerGram: number;       // VNĐ/gram (tính từ pricePerChi / 3.75)
  readonly updatedAt: string;          // ISO 8601
  readonly source: string;             // 'manual' | 'sjc_api' | 'pnj_api'
}

/**
 * Giá vàng baseline từ Bảng Giá 2025
 * Đây là giá MUA VÀO (giá gốc) — giá bán = giá gốc × markup
 */
export const BASELINE_GOLD_PRICES: Record<GoldTypeCode, number> = {
  '750': 11_409_091,   // 18K: 11,409,091 VNĐ/chỉ
  '585': 9_009_091,    // 14K: 9,009,091 VNĐ/chỉ
  '416': 6_550_909,    // 10K: 6,550,909 VNĐ/chỉ
  '990': 14_400_000,   // SJC Nhẫn: 14,400,000 VNĐ/chỉ
  '999': 15_000_000,   // 24K: 15,000,000 VNĐ/chỉ (est.)
} as const;
