/**
 * NATT-OS — Warranty Cell
 * Value Object: Warranty Policies — Chính sách bảo hành Tâm Luxury
 */

export type WarrantyType = 'GOLD_STRUCTURE' | 'STONE_SETTING' | 'SURFACE_FINISH' | 'FULL_COVERAGE';

export interface WarrantyPolicy {
  type: WarrantyType;
  name: string;
  durationMonths: number;
  coverageDescription: string;
  excludes: string[];
}

export type ProductCategoryCode =
  | 'BONG_TAI' | 'DAY_CHUYEN' | 'MAT_DAY' | 'VONG_TAY'
  | 'LAC_TAY' | 'NHAN_CUOI' | 'NHAN_KET' | 'NHAN_NAM'
  | 'NHAN_NU' | 'PHU_KIEN';

/**
 * Chính sách bảo hành theo loại
 */
export const WARRANTY_POLICIES: Record<WarrantyType, WarrantyPolicy> = {
  GOLD_STRUCTURE: {
    type: 'GOLD_STRUCTURE',
    name: 'Bảo hành kết cấu vàng',
    durationMonths: 24,
    coverageDescription: 'Gãy, nứt, biến dạng do lỗi sản xuất',
    excludes: ['Va đập mạnh', 'Tự ý sửa chữa ngoài', 'Hao mòn tự nhiên'],
  },
  STONE_SETTING: {
    type: 'STONE_SETTING',
    name: 'Bảo hành ổ đá',
    durationMonths: 12,
    coverageDescription: 'Đá rơi, lỏng chấu do lỗi gắn',
    excludes: ['Va đập', 'Tiếp xúc hóa chất', 'Tự tháo đá'],
  },
  SURFACE_FINISH: {
    type: 'SURFACE_FINISH',
    name: 'Bảo hành bề mặt',
    durationMonths: 6,
    coverageDescription: 'Đánh bóng, xi mạ lại miễn phí',
    excludes: ['Trầy xước do sử dụng', 'Tiếp xúc hóa chất'],
  },
  FULL_COVERAGE: {
    type: 'FULL_COVERAGE',
    name: 'Bảo hành toàn diện (VIP/VVIP)',
    durationMonths: 36,
    coverageDescription: 'Bao gồm kết cấu + ổ đá + bề mặt + đánh bóng định kỳ',
    excludes: ['Mất mát', 'Thiên tai'],
  },
};

/**
 * Chính sách mặc định theo hạng mục sản phẩm
 */
export const DEFAULT_WARRANTY_BY_CATEGORY: Record<ProductCategoryCode, WarrantyType[]> = {
  BONG_TAI:    ['GOLD_STRUCTURE', 'STONE_SETTING'],
  DAY_CHUYEN:  ['GOLD_STRUCTURE', 'STONE_SETTING', 'SURFACE_FINISH'],
  MAT_DAY:     ['GOLD_STRUCTURE', 'STONE_SETTING'],
  VONG_TAY:    ['GOLD_STRUCTURE', 'SURFACE_FINISH'],
  LAC_TAY:     ['GOLD_STRUCTURE', 'SURFACE_FINISH'],
  NHAN_CUOI:   ['GOLD_STRUCTURE', 'STONE_SETTING', 'SURFACE_FINISH'],
  NHAN_KET:    ['GOLD_STRUCTURE', 'STONE_SETTING'],
  NHAN_NAM:    ['GOLD_STRUCTURE', 'SURFACE_FINISH'],
  NHAN_NU:     ['GOLD_STRUCTURE', 'STONE_SETTING', 'SURFACE_FINISH'],
  PHU_KIEN:    ['SURFACE_FINISH'],
};

export const FREE_POLISH_INTERVAL_MONTHS = 6;
export const MAX_FREE_POLISH_COUNT = 4;
