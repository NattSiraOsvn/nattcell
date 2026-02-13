/**
 * NATT-OS Pricing Cell — Full Price Calculator
 *
 * CÔNG THỨC GIÁ BÁN TRANG SỨC TÂM LUXURY:
 *
 * Giá vốn (COGS) = Vàng + Tấm/đá + Viên chủ + Công thợ + Chi phí SX khác
 * Giá bán trước thuế = Giá vốn × Markup
 * Thuế GTGT (PP trực tiếp) = (Giá bán − Giá vốn) × 10%
 * Giá bán cuối = Giá bán trước thuế + Thuế GTGT
 *
 * Theo quy định: Doanh nghiệp SX-KD nữ trang trang sức kim cương
 * kê khai GTGT theo phương pháp trực tiếp.
 *
 * Đây là aggregate root của pricing domain.
 */

import { GoldTypeCode, BASELINE_GOLD_PRICES, GoldMarketPrice } from '../value-objects/gold-types';
import { MarkupTierCode, MARKUP_TIERS, DEFAULT_MARKUP } from '../value-objects/markup-tiers';
import { ProductCategoryCode } from '../value-objects/product-categories';
import { calculateLaborCost, LaborCostInput, LaborCostResult } from '../services/labor-cost.engine';

// ═══ Types ═══

export interface PricingInput {
  /** Mã sản phẩm */
  productCode: string;
  /** Hạng mục sản phẩm */
  category: ProductCategoryCode;
  /** Loại vàng */
  goldType: GoldTypeCode;
  /** Trọng lượng vàng sau nguội (gram) */
  goldWeightGram: number;
  /** Giá trị đá / tấm (VNĐ) — đá tấm, đá phụ */
  stoneValueVND: number;
  /** Giá trị viên chủ (VNĐ) — kim cương chính, đá quý chính (nếu có) */
  mainStoneVND?: number;
  /** Chi phí SX khác (VNĐ) — phụ gia, hợp kim, khấu hao máy móc, bao bì... */
  otherProductionCostVND?: number;
  /** Mô tả thiết kế */
  designDescription: string;
  /** Đơn vị */
  unit: 'CHIEC' | 'DOI';
  /** Mức markup */
  markupTier?: MarkupTierCode;
  /** Giá vàng thị trường override (nếu muốn dùng giá realtime) */
  goldMarketPriceOverride?: GoldMarketPrice;
  /** Flag Curban cho dây chuyền */
  isCurban?: boolean;
}

export interface PricingBreakdown {
  /** Input gốc */
  input: PricingInput;

  // ═══ THÀNH PHẦN GIÁ VỐN (COGS) ═══

  /** Giá vàng/chỉ đã dùng */
  goldPricePerChi: number;
  /** Nguồn giá vàng */
  goldPriceSource: 'baseline' | 'market_override';
  /** (1) Vàng nguyên liệu = goldPricePerGram × goldWeightGram */
  goldComponentVND: number;
  /** (2) Tấm/đá phụ */
  stoneComponentVND: number;
  /** (3) Viên chủ (kim cương chính / đá quý chính) */
  mainStoneVND: number;
  /** (4) Kết quả tính công thợ */
  laborResult: LaborCostResult;
  /** (4) Công thợ số tiền (0 nếu CUSTOM_QUOTE/WAITING/ZERO) */
  laborAmountVND: number;
  /** (5) Chi phí SX khác (phụ gia, hợp kim, khấu hao...) */
  otherProductionCostVND: number;

  // ═══ TỔNG HỢP GIÁ ═══

  /** Giá vốn (COGS) = (1)+(2)+(3)+(4)+(5) */
  cogsVND: number;
  /** Markup tier đã áp dụng */
  markupTier: MarkupTierCode;
  /** Hệ số markup */
  markupMultiplier: number;
  /** Giá bán trước thuế = COGS × Markup */
  priceBeforeTaxVND: number;

  // ═══ THUẾ GTGT PHƯƠNG PHÁP TRỰC TIẾP ═══

  /** Giá trị gia tăng = Giá bán trước thuế − Giá vốn */
  valueAddedVND: number;
  /** Thuế suất GTGT (10%) */
  vatRate: number;
  /** Thuế GTGT = Giá trị gia tăng × 10% */
  vatAmountVND: number;

  // ═══ GIÁ CUỐI CÙNG ═══

  /** Giá bán cuối cùng = Giá bán trước thuế + Thuế GTGT */
  finalPriceVND: number;

  /** Có cần báo giá riêng không */
  requiresCustomQuote: boolean;
  /** Timestamp tính giá */
  calculatedAt: string;

  // ═══ BACKWARD COMPATIBILITY ═══
  /** @deprecated — dùng cogsVND thay thế */
  subtotalVND: number;
}

// ═══ Constants ═══

const CHI_TO_GRAM = 3.75;

/**
 * Thuế suất GTGT phương pháp trực tiếp cho ngành nữ trang
 * Theo quy định: DN SX-KD nữ trang trang sức kim cương
 */
const VAT_RATE_DIRECT_METHOD = 0.10;  // 10%

// ═══ Calculator ═══

export function calculateFullPrice(input: PricingInput): PricingBreakdown {
  // ═══ 1. THÀNH PHẦN GIÁ VỐN ═══

  // (1) Vàng nguyên liệu
  let goldPricePerChi: number;
  let goldPriceSource: 'baseline' | 'market_override';

  if (input.goldMarketPriceOverride) {
    goldPricePerChi = input.goldMarketPriceOverride.pricePerChi;
    goldPriceSource = 'market_override';
  } else {
    goldPricePerChi = BASELINE_GOLD_PRICES[input.goldType] ?? 0;
    goldPriceSource = 'baseline';
  }

  const goldPricePerGram = goldPricePerChi / CHI_TO_GRAM;
  const goldComponentVND = Math.round(goldPricePerGram * input.goldWeightGram);

  // (2) Tấm/đá phụ
  const stoneComponentVND = input.stoneValueVND;

  // (3) Viên chủ (kim cương chính, đá quý chính)
  const mainStoneVND = input.mainStoneVND ?? 0;

  // (4) Công thợ
  const laborInput: LaborCostInput = {
    category: input.category,
    goldWeightGram: input.goldWeightGram,
    stoneValueVND: input.stoneValueVND,
    designDescription: input.designDescription,
    unit: input.unit,
    isCurban: input.isCurban,
  };
  const laborResult = calculateLaborCost(laborInput);

  let laborAmountVND = 0;
  let requiresCustomQuote = false;

  switch (laborResult.type) {
    case 'CALCULATED':
      laborAmountVND = laborResult.amount;
      break;
    case 'CUSTOM_QUOTE':
      requiresCustomQuote = true;
      break;
    case 'ERROR':
      laborAmountVND = laborResult.fallbackAmount;
      break;
    case 'WAITING':
      requiresCustomQuote = true;
      break;
    case 'ZERO':
      laborAmountVND = 0;
      break;
  }

  // (5) Chi phí SX khác (phụ gia, hợp kim, khấu hao máy móc, bao bì...)
  const otherProductionCostVND = input.otherProductionCostVND ?? 0;

  // ═══ 2. GIÁ VỐN (COGS) ═══
  const cogsVND = goldComponentVND + stoneComponentVND + mainStoneVND + laborAmountVND + otherProductionCostVND;

  // ═══ 3. MARKUP → GIÁ BÁN TRƯỚC THUẾ ═══
  const markupTier = input.markupTier ?? DEFAULT_MARKUP;
  const markupMultiplier = MARKUP_TIERS[markupTier].multiplier;
  const priceBeforeTaxVND = Math.round(cogsVND * markupMultiplier);

  // ═══ 4. THUẾ GTGT PHƯƠNG PHÁP TRỰC TIẾP ═══
  // Công thức: Thuế GTGT = (Giá bán ra − Giá mua vào) × 10%
  // Giá bán ra = priceBeforeTaxVND
  // Giá mua vào = cogsVND (tất cả chi phí cấu thành SP)
  const valueAddedVND = priceBeforeTaxVND - cogsVND;
  const vatAmountVND = Math.round(valueAddedVND * VAT_RATE_DIRECT_METHOD);

  // ═══ 5. GIÁ BÁN CUỐI CÙNG ═══
  const finalPriceVND = priceBeforeTaxVND + vatAmountVND;

  return {
    input,
    goldPricePerChi,
    goldPriceSource,
    goldComponentVND,
    stoneComponentVND,
    mainStoneVND,
    laborResult,
    laborAmountVND,
    otherProductionCostVND,
    cogsVND,
    markupTier,
    markupMultiplier,
    priceBeforeTaxVND,
    valueAddedVND,
    vatRate: VAT_RATE_DIRECT_METHOD,
    vatAmountVND,
    finalPriceVND,
    requiresCustomQuote,
    calculatedAt: new Date().toISOString(),
    // Backward compatibility
    subtotalVND: cogsVND,
  };
}
