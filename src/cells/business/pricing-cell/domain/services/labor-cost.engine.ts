/**
 * NATT-OS Pricing Cell — Labor Cost Calculation Engine
 * Source: Bảng Giá 2025, extracted from Excel formula (4,049 chars)
 *
 * This is the HEART of Tâm Luxury pricing.
 * 10 product categories × complex conditional formulas.
 *
 * Variables:
 *   E = Trọng lượng vàng sau nguội (gram)
 *   N = Giá tấm / giá đá (VNĐ)
 *   H = Mô tả thiết kế (text)
 *   L = Đơn vị (Chiếc / Đôi)
 */

import { ProductCategoryCode, CUSTOM_QUOTE_TRIGGERS } from '../value-objects/product-categories';

// ═══ Types ═══

export interface LaborCostInput {
  category: ProductCategoryCode;
  goldWeightGram: number;        // E
  stoneValueVND: number;         // N
  designDescription: string;     // H
  unit: 'CHIEC' | 'DOI';        // L
  isCurban?: boolean;            // special Curban flag for Dây Chuyền
}

export type LaborCostResult =
  | { type: 'CALCULATED'; amount: number }
  | { type: 'CUSTOM_QUOTE'; reason: string }
  | { type: 'WAITING'; reason: string }
  | { type: 'ZERO' }
  | { type: 'ERROR'; fallbackAmount: number; reason: string };

// ═══ Custom Quote Check ═══

function requiresCustomQuote(H: string): boolean {
  const upperH = H.toUpperCase();
  return CUSTOM_QUOTE_TRIGGERS.some(trigger => upperH.includes(trigger.toUpperCase()));
}

// ═══ Category-Specific Calculators ═══

/** 1. BÔNG TAI — Fixed Table */
function calcBongTai(E: number, N: number, H: string, L: 'CHIEC' | 'DOI'): LaborCostResult {
  if (!L || E <= 0) return { type: 'WAITING', reason: 'Thiếu đơn vị hoặc trọng lượng' };
  if (requiresCustomQuote(H)) return { type: 'CUSTOM_QUOTE', reason: 'Thiết kế đặc biệt' };

  if (L === 'CHIEC') {
    if (E <= 0.6) return { type: 'CALCULATED', amount: 500_000 };
    if (E <= 1.2) return { type: 'CALCULATED', amount: 1_000_000 };
    if (E <= 2) {
      if (N <= 20_000_000) return { type: 'CALCULATED', amount: 1_000_000 };
      if (N <= 30_000_000) return { type: 'CALCULATED', amount: 1_500_000 };
      if (N <= 80_000_000) return { type: 'CALCULATED', amount: 2_500_000 };
      return { type: 'CUSTOM_QUOTE', reason: 'Bông tai chiếc E≤2g nhưng N>80M' };
    }
    return { type: 'CUSTOM_QUOTE', reason: 'Bông tai chiếc E>2g' };
  }

  if (L === 'DOI') {
    if (E <= 2 && N <= 20_000_000) return { type: 'CALCULATED', amount: 2_000_000 };
    if (E <= 2.5 && N <= 30_000_000) return { type: 'CALCULATED', amount: 3_000_000 };
    if (E <= 3.5 && N <= 80_000_000) return { type: 'CALCULATED', amount: 5_000_000 };
    if (E <= 8 && N <= 120_000_000) return { type: 'CALCULATED', amount: 7_000_000 };
    if (E > 8) return { type: 'CALCULATED', amount: 10_000_000 };
    return { type: 'CUSTOM_QUOTE', reason: 'Bông tai đôi ngoài bảng giá' };
  }

  return { type: 'ERROR', fallbackAmount: 3_000_000, reason: 'Sai kiểu bông — đơn vị không hợp lệ' };
}

/** 2. DÂY CHUYỀN — Scale Type 1: Base × (1 + MAX(0, N/T - 1) × 0.4) */
function calcDayChuyen(E: number, N: number, H: string, isCurban: boolean): LaborCostResult {
  if (E <= 0 || N <= 0) return { type: 'ZERO' };
  if (requiresCustomQuote(H)) return { type: 'CUSTOM_QUOTE', reason: 'Dây chuyền đặc biệt' };

  let base: number;
  let threshold: number;

  // Curban special condition
  if (isCurban && E >= 15 && E <= 25 && N > 200_000_000) {
    base = 50_000_000; threshold = 200_000_000;
  } else if (E > 15 && E <= 25) {
    base = 35_000_000; threshold = 200_000_000;
  } else if (E >= 12 && E <= 15) {
    base = 32_000_000; threshold = 100_000_000;
  } else if (E >= 8 && E < 12) {
    base = 30_000_000; threshold = 100_000_000;
  } else if (E > 5 && E < 8) {
    base = 28_000_000; threshold = 60_000_000;
  } else if (E > 2.5 && E <= 5) {
    base = 27_000_000; threshold = 30_000_000;
  } else {
    base = 25_000_000; threshold = 20_000_000;
  }

  const amount = Math.round(base * (1 + Math.max(0, N / threshold - 1) * 0.4));
  return { type: 'CALCULATED', amount };
}

/** 3. MẶT DÂY — Scale Type 2: Base × MAX(1, N/T) */
function calcMatDay(E: number, N: number, H: string): LaborCostResult {
  if (E <= 0 && N <= 0) return { type: 'ZERO' };
  if (requiresCustomQuote(H)) return { type: 'CUSTOM_QUOTE', reason: 'Mặt dây đặc biệt' };

  let base: number;
  let threshold: number;

  // Priority: H có "chữ" và E ≤ 3
  if (H.includes('chữ') && E <= 3) {
    base = 3_000_000; threshold = 30_000_000;
  } else if (E > 10) {
    base = 12_000_000; threshold = 70_000_000;
  } else if (E > 7) {
    base = 8_000_000; threshold = 70_000_000;
  } else if (E > 5) {
    base = 6_000_000; threshold = 50_000_000;
  } else if (E > 4) {
    base = 5_000_000; threshold = 50_000_000;
  } else if (E > 3) {
    base = 4_000_000; threshold = 40_000_000;
  } else if (E > 2.5) {
    base = 3_000_000; threshold = 30_000_000;
  } else if (E > 1) {
    base = 2_500_000; threshold = 20_000_000;
  } else {
    base = 2_000_000; threshold = 10_000_000;
  }

  const amount = Math.round(base * Math.max(1, N / threshold));
  return { type: 'CALCULATED', amount };
}

/** 4. VÒNG TAY — Scale Type 2 */
function calcVongTay(E: number, N: number, H: string): LaborCostResult {
  if (E <= 0 && N <= 0) return { type: 'ZERO' };
  if (requiresCustomQuote(H)) return { type: 'CUSTOM_QUOTE', reason: 'Vòng tay đặc biệt' };

  let base: number;
  let threshold: number;

  if (E > 5) {
    base = 20_000_000; threshold = 50_000_000;
  } else if (E >= 3) {
    base = 8_000_000; threshold = 30_000_000;
  } else {
    base = 5_000_000; threshold = 20_000_000;
  }

  const amount = Math.round(base * Math.max(1, N / threshold));
  return { type: 'CALCULATED', amount };
}

/** 5. LẮC TAY — Scale Type 2 */
function calcLacTay(E: number, N: number, H: string): LaborCostResult {
  if (E <= 0 && N <= 0) return { type: 'ZERO' };
  if (requiresCustomQuote(H)) return { type: 'CUSTOM_QUOTE', reason: 'Lắc tay đặc biệt' };

  let base: number;
  let threshold: number;

  if (E > 10) {
    base = 15_000_000; threshold = 80_000_000;
  } else if (E > 5) {
    base = 10_000_000; threshold = 50_000_000;
  } else if (E >= 3) {
    base = 7_000_000; threshold = 30_000_000;
  } else {
    base = 5_000_000; threshold = 20_000_000;
  }

  const amount = Math.round(base * Math.max(1, N / threshold));
  return { type: 'CALCULATED', amount };
}

/** 6. NHẪN CƯỚI — Fixed Table */
function calcNhanCuoi(E: number, N: number, H: string, L: 'CHIEC' | 'DOI'): LaborCostResult {
  if (E <= 0 && N <= 0) return { type: 'ZERO' };
  if (requiresCustomQuote(H)) return { type: 'CUSTOM_QUOTE', reason: 'Nhẫn cưới đặc biệt' };

  if (L === 'DOI') {
    if (E <= 3 && N <= 20_000_000) return { type: 'CALCULATED', amount: 3_000_000 };
    if (E <= 5 && N <= 40_000_000) return { type: 'CALCULATED', amount: 5_000_000 };
    if (E <= 8 && N <= 80_000_000) return { type: 'CALCULATED', amount: 8_000_000 };
    return { type: 'CUSTOM_QUOTE', reason: 'Nhẫn cưới đôi ngoài bảng' };
  }

  // Chiếc
  if (E <= 2 && N <= 15_000_000) return { type: 'CALCULATED', amount: 1_500_000 };
  if (E <= 3 && N <= 30_000_000) return { type: 'CALCULATED', amount: 2_500_000 };
  if (E <= 5 && N <= 50_000_000) return { type: 'CALCULATED', amount: 4_000_000 };
  return { type: 'CUSTOM_QUOTE', reason: 'Nhẫn cưới chiếc ngoài bảng' };
}

/** 7. NHẪN KẾT — Scale Type 2 */
function calcNhanKet(E: number, N: number, H: string): LaborCostResult {
  if (E <= 0 && N <= 0) return { type: 'ZERO' };
  if (requiresCustomQuote(H)) return { type: 'CUSTOM_QUOTE', reason: 'Nhẫn kết đặc biệt' };

  let base: number;
  let threshold: number;

  if (E > 5) {
    base = 8_000_000; threshold = 80_000_000;
  } else if (E > 3) {
    base = 5_000_000; threshold = 50_000_000;
  } else if (E > 1.5) {
    base = 3_000_000; threshold = 30_000_000;
  } else {
    base = 2_000_000; threshold = 20_000_000;
  }

  const amount = Math.round(base * Math.max(1, N / threshold));
  return { type: 'CALCULATED', amount };
}

/** 8. NHẪN NAM — Scale Type 2 */
function calcNhanNam(E: number, N: number, H: string): LaborCostResult {
  if (E <= 0 && N <= 0) return { type: 'ZERO' };
  if (requiresCustomQuote(H)) return { type: 'CUSTOM_QUOTE', reason: 'Nhẫn nam đặc biệt' };

  let base: number;
  let threshold: number;

  if (E > 8) {
    base = 10_000_000; threshold = 80_000_000;
  } else if (E > 5) {
    base = 7_000_000; threshold = 50_000_000;
  } else if (E > 3) {
    base = 5_000_000; threshold = 40_000_000;
  } else {
    base = 3_000_000; threshold = 20_000_000;
  }

  const amount = Math.round(base * Math.max(1, N / threshold));
  return { type: 'CALCULATED', amount };
}

/** 9. NHẪN NỮ — Additive: Base + N × 10% */
function calcNhanNu(E: number, N: number, H: string): LaborCostResult {
  if (E <= 0 && N <= 0) return { type: 'ZERO' };
  if (requiresCustomQuote(H)) return { type: 'CUSTOM_QUOTE', reason: 'Nhẫn nữ đặc biệt' };

  const upperH = H.toUpperCase();
  const hasToHalo = upperH.includes('TO') || upperH.includes('HALO');

  if (E > 3 && hasToHalo && N > 100_000_000) return { type: 'CALCULATED', amount: 10_000_000 };
  if (E > 3 && hasToHalo && N > 50_000_000) return { type: 'CALCULATED', amount: 8_000_000 };
  if (E > 3 && hasToHalo) return { type: 'CALCULATED', amount: Math.round(5_000_000 + N * 0.1) };
  if (E > 3) return { type: 'CALCULATED', amount: Math.round(3_000_000 + N * 0.1) };
  if (E >= 2) return { type: 'CALCULATED', amount: Math.round(2_000_000 + N * 0.1) };
  if (E >= 1) return { type: 'CALCULATED', amount: Math.round(1_500_000 + N * 0.1) };
  if (E > 0) return { type: 'CALCULATED', amount: Math.round(1_000_000 + N * 0.1) };

  return { type: 'ZERO' };
}

/** 10. PHỤ KIỆN — Composite: MAX(1.5M, E×1.8M + N×12% + bonus) */
function calcPhuKien(E: number, N: number, H: string): LaborCostResult {
  if (E <= 0 && N <= 0) return { type: 'ZERO' };
  if (requiresCustomQuote(H)) return { type: 'CUSTOM_QUOTE', reason: 'Phụ kiện đặc biệt' };

  const upperH = H.toUpperCase();
  const bonus = (upperH.includes('PHỨC TẠP') || upperH.includes('KỸ THUẬT CAO')) ? 1_500_000 : 0;

  const raw = E * 1_800_000 + N * 0.12 + bonus;
  const amount = Math.max(1_500_000, Math.round(raw));
  return { type: 'CALCULATED', amount };
}

// ═══ Main Calculator ═══

export function calculateLaborCost(input: LaborCostInput): LaborCostResult {
  const { category, goldWeightGram: E, stoneValueVND: N, designDescription: H, unit: L, isCurban } = input;

  try {
    switch (category) {
      case 'BONG_TAI':   return calcBongTai(E, N, H, L);
      case 'DAY_CHUYEN': return calcDayChuyen(E, N, H, isCurban ?? false);
      case 'MAT_DAY':    return calcMatDay(E, N, H);
      case 'VONG_TAY':   return calcVongTay(E, N, H);
      case 'LAC_TAY':    return calcLacTay(E, N, H);
      case 'NHAN_CUOI':  return calcNhanCuoi(E, N, H, L);
      case 'NHAN_KET':   return calcNhanKet(E, N, H);
      case 'NHAN_NAM':   return calcNhanNam(E, N, H);
      case 'NHAN_NU':    return calcNhanNu(E, N, H);
      case 'PHU_KIEN':   return calcPhuKien(E, N, H);
      default:
        return { type: 'ERROR', fallbackAmount: 3_000_000, reason: `Unknown category: ${category}` };
    }
  } catch (err) {
    return { type: 'ERROR', fallbackAmount: 3_000_000, reason: `Calculation error: ${String(err)}` };
  }
}
