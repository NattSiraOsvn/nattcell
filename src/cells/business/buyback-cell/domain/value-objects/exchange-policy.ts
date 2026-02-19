/**
 * NATT-OS — Buyback Cell
 * Value Object: Exchange Policy — Chính sách thu đổi Tâm Luxury
 *
 * Source of truth: Giấy Đảm Bảo (GĐB) — quét khi khách mang đến
 * Override door: Sếp duyệt — ghi audit bắt buộc
 *
 * Ground truth từ GĐB thật:
 *   NC875 (Nhẫn cưới):  Vỏ 20%/15% | Viên chủ 20%/15%
 *   BT478 (Bông tai):   Vỏ 20%/15% | Viên chủ 5%/0%
 *   MD1297 (Mặt+Dây):   Vỏ 30%/20% | Viên chủ 5%/0%
 *   VT627 (Vòng tay):   Vỏ 30%/20% | Viên chủ /  (không có)
 */

// Inline category codes — tránh cross-cell import trực tiếp
// Sync với pricing-cell/domain/value-objects/product-categories.ts
type ProductCategoryCode =
  | 'BONG_TAI' | 'DAY_CHUYEN' | 'MAT_DAY' | 'VONG_TAY' | 'LAC_TAY'
  | 'NHAN_CUOI' | 'NHAN_KET' | 'NHAN_NAM' | 'NHAN_NU' | 'PHU_KIEN';

// ═══ BOUNDS ═══

export const EXCHANGE_RATE_BOUNDS = {
  min: 0,     // 0% — hòa vốn hoàn toàn
  max: 0.35,  // 35% — khấu hao tối đa
} as const;

// ═══ TYPES ═══

export type ExchangeActionType = 'BUYBACK' | 'UPGRADE';

/**
 * Chính sách thu đổi được lock từ GĐB
 * 4 con số độc lập — không gộp chung
 */
export interface GDBLockedPolicy {
  // Giá trị thực tế từ GĐB — luôn tách bạch
  gdbJewelryCaseValue: number;   // Giá vỏ ghi trên GĐB (VD: NC875 = 36,000,000)
  gdbMainStoneValue: number;     // Giá viên chủ ghi trên GĐB (VD: NC875 = 19,000,000), 0 nếu không có

  // Vỏ trang sức
  jewelryCase: {
    buybackDeduction: number;   // % khấu hao khi thu lại vỏ  (VD: 20 = 20%)
    upgradeDeduction: number;   // % khấu hao khi đổi lớn vỏ  (VD: 15 = 15%)
  };
  // Viên chủ — null nếu SP không có viên chủ (VT627)
  mainStone: {
    buybackDeduction: number | null;   // null = không áp dụng
    upgradeDeduction: number | null;   // null = không áp dụng
  } | null;
}

/**
 * Override door — bắt buộc sếp duyệt
 * Range: 0–35% bất kỳ
 */
export interface ExchangeOverride {
  overriddenFields: {
    jewelryCaseBuyback?: number;
    jewelryCaseUpgrade?: number;
    mainStoneBuyback?: number;
    mainStoneUpgrade?: number;
  };
  approvedBy: string;       // Tên người duyệt
  reason: string;           // Lý do override
  approvedAt: string;       // ISO timestamp
}

/**
 * Kết quả tính giá trị thu đổi
 */
export interface ExchangeValuation {
  actionType: ExchangeActionType;
  originalValue: number;          // Giá gốc trên GĐB
  jewelryCaseValue: number;       // Giá trị phần vỏ sau khấu hao
  mainStoneValue: number;         // Giá trị phần viên chủ sau khấu hao (0 nếu null)
  totalExchangeValue: number;     // Tổng giá trị được cấn trừ / hoàn trả
  appliedRates: {
    jewelryCase: number;          // Rate thực tế đã dùng (%)
    mainStone: number | null;
  };
  isOverridden: boolean;
}

// ═══ DEFAULT RATES THEO CATEGORY (từ GĐB thật) ═══

export interface CategoryExchangeDefault {
  jewelryCase: { buyback: number; upgrade: number };
  mainStoneApplicable: boolean;  // Có viên chủ không
}

export const CATEGORY_EXCHANGE_DEFAULTS: Partial<Record<ProductCategoryCode, CategoryExchangeDefault>> = {
  NHAN_CUOI:  { jewelryCase: { buyback: 20, upgrade: 15 }, mainStoneApplicable: true },
  BONG_TAI:   { jewelryCase: { buyback: 20, upgrade: 15 }, mainStoneApplicable: true },
  MAT_DAY:    { jewelryCase: { buyback: 30, upgrade: 20 }, mainStoneApplicable: true },
  DAY_CHUYEN: { jewelryCase: { buyback: 30, upgrade: 20 }, mainStoneApplicable: true },
  VONG_TAY:   { jewelryCase: { buyback: 30, upgrade: 20 }, mainStoneApplicable: false },
  LAC_TAY:    { jewelryCase: { buyback: 30, upgrade: 20 }, mainStoneApplicable: false },
  NHAN_KET:   { jewelryCase: { buyback: 20, upgrade: 15 }, mainStoneApplicable: true },
  NHAN_NAM:   { jewelryCase: { buyback: 20, upgrade: 15 }, mainStoneApplicable: true },
  NHAN_NU:    { jewelryCase: { buyback: 20, upgrade: 15 }, mainStoneApplicable: true },
  PHU_KIEN:   { jewelryCase: { buyback: 30, upgrade: 20 }, mainStoneApplicable: false },
};

// ═══ VALIDATORS ═══

export function validateGDBLockedPolicy(policy: GDBLockedPolicy): string | null {
  const { min, max } = EXCHANGE_RATE_BOUNDS;
  const minPct = min * 100;
  const maxPct = max * 100;

  if (policy.jewelryCase.buybackDeduction < minPct || policy.jewelryCase.buybackDeduction > maxPct)
    return `jewelryCase.buybackDeduction phải trong khoảng ${minPct}–${maxPct}%`;
  if (policy.jewelryCase.upgradeDeduction < minPct || policy.jewelryCase.upgradeDeduction > maxPct)
    return `jewelryCase.upgradeDeduction phải trong khoảng ${minPct}–${maxPct}%`;

  if (policy.mainStone) {
    if (policy.mainStone.buybackDeduction !== null) {
      if (policy.mainStone.buybackDeduction < minPct || policy.mainStone.buybackDeduction > maxPct)
        return `mainStone.buybackDeduction phải trong khoảng ${minPct}–${maxPct}%`;
    }
    if (policy.mainStone.upgradeDeduction !== null) {
      if (policy.mainStone.upgradeDeduction < minPct || policy.mainStone.upgradeDeduction > maxPct)
        return `mainStone.upgradeDeduction phải trong khoảng ${minPct}–${maxPct}%`;
    }
  }
  return null;
}

export function validateExchangeOverride(override: ExchangeOverride): string | null {
  if (!override.approvedBy?.trim()) return 'Override bắt buộc có approvedBy';
  if (!override.reason?.trim()) return 'Override bắt buộc có reason';
  if (!override.approvedAt) return 'Override bắt buộc có approvedAt';

  const { min, max } = EXCHANGE_RATE_BOUNDS;
  const minPct = min * 100;
  const maxPct = max * 100;

  for (const [field, val] of Object.entries(override.overriddenFields)) {
    if (val !== undefined && (val < minPct || val > maxPct))
      return `Override field '${field}' = ${val}% phải trong khoảng ${minPct}–${maxPct}%`;
  }
  return null;
}

// ═══ CALCULATOR ═══

/**
 * Tính giá trị thu đổi từ GDB policy + action type
 *
 * GĐB luôn tách bạch giá vỏ và viên chủ — không estimate.
 * VD NC875: jewelryCaseValueOnGDB=36M, mainStoneValueOnGDB=19M → tính riêng
 * VD VT627: jewelryCaseValueOnGDB=131M, mainStoneValueOnGDB=null (không có viên chủ)
 */
export function calculateExchangeValuation(
  jewelryCaseValueOnGDB: number,        // Giá vỏ ghi trên GĐB
  mainStoneValueOnGDB: number | null,   // Giá viên chủ ghi trên GĐB (null nếu không có)
  actionType: ExchangeActionType,
  policy: GDBLockedPolicy,
  override?: ExchangeOverride,
): ExchangeValuation {

  const originalValue = jewelryCaseValueOnGDB + (mainStoneValueOnGDB ?? 0);

  // Resolve rates — override wins nếu có
  const jewelryCaseDeduction = actionType === 'BUYBACK'
    ? (override?.overriddenFields.jewelryCaseBuyback ?? policy.jewelryCase.buybackDeduction)
    : (override?.overriddenFields.jewelryCaseUpgrade ?? policy.jewelryCase.upgradeDeduction);

  let mainStoneDeduction: number | null = null;
  if (policy.mainStone && mainStoneValueOnGDB !== null) {
    mainStoneDeduction = actionType === 'BUYBACK'
      ? (override?.overriddenFields.mainStoneBuyback ?? policy.mainStone.buybackDeduction)
      : (override?.overriddenFields.mainStoneUpgrade ?? policy.mainStone.upgradeDeduction);
  }

  // Tính từ giá thật trên GĐB — không bao giờ estimate
  const jewelryCaseValue = Math.round(jewelryCaseValueOnGDB * (1 - jewelryCaseDeduction / 100));
  const mainStoneValue = (mainStoneDeduction !== null && mainStoneValueOnGDB !== null)
    ? Math.round(mainStoneValueOnGDB * (1 - mainStoneDeduction / 100))
    : 0;

  return {
    actionType,
    originalValue,
    jewelryCaseValue,
    mainStoneValue,
    totalExchangeValue: jewelryCaseValue + mainStoneValue,
    appliedRates: {
      jewelryCase: jewelryCaseDeduction,
      mainStone: mainStoneDeduction,
    },
    isOverridden: !!override,
  };
}
