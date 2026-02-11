/**
 * NATT-OS Pricing Cell — Full Price Calculator
 *
 * Giá bán = (Giá vàng × Trọng lượng + Giá tấm/đá + Công thợ) × Markup
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
  /** Giá trị đá / tấm (VNĐ) */
  stoneValueVND: number;
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
  /** Giá vàng/chỉ đã dùng */
  goldPricePerChi: number;
  /** Nguồn giá vàng */
  goldPriceSource: 'baseline' | 'market_override';
  /** Giá vàng thành phẩm = goldPricePerGram × goldWeightGram */
  goldComponentVND: number;
  /** Giá tấm/đá */
  stoneComponentVND: number;
  /** Kết quả tính công thợ */
  laborResult: LaborCostResult;
  /** Công thợ số tiền (0 nếu CUSTOM_QUOTE/WAITING/ZERO) */
  laborAmountVND: number;
  /** Giá trước markup = gold + stone + labor */
  subtotalVND: number;
  /** Markup tier đã áp dụng */
  markupTier: MarkupTierCode;
  /** Hệ số markup */
  markupMultiplier: number;
  /** Giá bán cuối cùng = subtotal × markup */
  finalPriceVND: number;
  /** Có cần báo giá riêng không */
  requiresCustomQuote: boolean;
  /** Timestamp tính giá */
  calculatedAt: string;
}

// ═══ Calculator ═══

const CHI_TO_GRAM = 3.75;

export function calculateFullPrice(input: PricingInput): PricingBreakdown {
  // 1. Gold price
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

  // 2. Stone/Tấm component
  const stoneComponentVND = input.stoneValueVND;

  // 3. Labor cost
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

  // 4. Markup
  const markupTier = input.markupTier ?? DEFAULT_MARKUP;
  const markupMultiplier = MARKUP_TIERS[markupTier].multiplier;

  // 5. Final price
  const subtotalVND = goldComponentVND + stoneComponentVND + laborAmountVND;
  const finalPriceVND = Math.round(subtotalVND * markupMultiplier);

  return {
    input,
    goldPricePerChi,
    goldPriceSource,
    goldComponentVND,
    stoneComponentVND,
    laborResult,
    laborAmountVND,
    subtotalVND,
    markupTier,
    markupMultiplier,
    finalPriceVND,
    requiresCustomQuote,
    calculatedAt: new Date().toISOString(),
  };
}
