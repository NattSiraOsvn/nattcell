/**
 * NATT-OS Pricing Cell — Product Categories
 * Source: Bảng Giá 2025 — 10 hạng mục sản phẩm Tâm Luxury
 *
 * Mỗi hạng mục có công thức tính công thợ riêng.
 * Biến đầu vào: E (trọng lượng vàng gram), N (giá tấm/đá VNĐ), H (mô tả), L (đơn vị)
 */

export type ProductCategoryCode =
  | 'BONG_TAI'       // Bông Tai
  | 'DAY_CHUYEN'     // Dây Chuyền
  | 'MAT_DAY'        // Mặt Dây
  | 'VONG_TAY'       // Vòng Tay
  | 'LAC_TAY'        // Lắc Tay
  | 'NHAN_CUOI'      // Nhẫn Cưới
  | 'NHAN_KET'       // Nhẫn Kết (Đính Hôn)
  | 'NHAN_NAM'       // Nhẫn Nam
  | 'NHAN_NU'        // Nhẫn Nữ
  | 'PHU_KIEN';      // Phụ Kiện

export type LaborFormulaType =
  | 'FIXED_TABLE'    // Bông Tai, Nhẫn Cưới — bảng giá cố định
  | 'SCALE_TYPE_1'   // Dây Chuyền — Base × (1 + MAX(0, N/T - 1) × 0.4)
  | 'SCALE_TYPE_2'   // Mặt Dây, Vòng Tay, Lắc Tay, Nhẫn Kết, Nhẫn Nam — Base × MAX(1, N/T)
  | 'ADDITIVE'       // Nhẫn Nữ — Base + N × 10%
  | 'COMPOSITE';     // Phụ Kiện — MAX(1.5M, E×1.8M + N×12% + bonus)

export interface ProductCategory {
  readonly code: ProductCategoryCode;
  readonly label: string;
  readonly labelVi: string;
  readonly formulaType: LaborFormulaType;
}

export const PRODUCT_CATEGORIES: Record<ProductCategoryCode, ProductCategory> = {
  BONG_TAI:   { code: 'BONG_TAI',   label: 'Earrings',        labelVi: 'Bông Tai',       formulaType: 'FIXED_TABLE' },
  DAY_CHUYEN: { code: 'DAY_CHUYEN', label: 'Necklace',        labelVi: 'Dây Chuyền',     formulaType: 'SCALE_TYPE_1' },
  MAT_DAY:    { code: 'MAT_DAY',    label: 'Pendant',         labelVi: 'Mặt Dây',        formulaType: 'SCALE_TYPE_2' },
  VONG_TAY:   { code: 'VONG_TAY',   label: 'Bracelet',        labelVi: 'Vòng Tay',       formulaType: 'SCALE_TYPE_2' },
  LAC_TAY:    { code: 'LAC_TAY',    label: 'Bangle',          labelVi: 'Lắc Tay',        formulaType: 'SCALE_TYPE_2' },
  NHAN_CUOI:  { code: 'NHAN_CUOI',  label: 'Wedding Ring',    labelVi: 'Nhẫn Cưới',      formulaType: 'FIXED_TABLE' },
  NHAN_KET:   { code: 'NHAN_KET',   label: 'Engagement Ring', labelVi: 'Nhẫn Kết',       formulaType: 'SCALE_TYPE_2' },
  NHAN_NAM:   { code: 'NHAN_NAM',   label: 'Men Ring',        labelVi: 'Nhẫn Nam',       formulaType: 'SCALE_TYPE_2' },
  NHAN_NU:    { code: 'NHAN_NU',    label: 'Women Ring',      labelVi: 'Nhẫn Nữ',        formulaType: 'ADDITIVE' },
  PHU_KIEN:   { code: 'PHU_KIEN',   label: 'Accessories',     labelVi: 'Phụ Kiện',       formulaType: 'COMPOSITE' },
} as const;

/** Trigger patterns cho "Báo giá riêng" — áp dụng cho tất cả categories */
export const CUSTOM_QUOTE_TRIGGERS: readonly string[] = [
  'VIP', 'siêu to', 'full tấm', 'đặc biệt', 'max tấm',
  'khủng', 'KAT', 'dây vàng nhiều', 'hàng nhập', 'cao cấp',
] as const;
