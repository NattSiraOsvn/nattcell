/**
 * Pricing Cell — Public Interface
 * Exported API cho các cells khác consume qua shared-contracts-cell.
 */

export type {
  PricingInput,
  PricingBreakdown,
} from '../domain/entities/pricing-calculator';

export type {
  LaborCostInput,
  LaborCostResult,
} from '../domain/services/labor-cost.engine';

export type {
  GoldTypeCode,
  GoldType,
  GoldMarketPrice,
} from '../domain/value-objects/gold-types';

export type {
  MarkupTierCode,
  MarkupTier,
} from '../domain/value-objects/markup-tiers';

export type {
  ProductCategoryCode,
  LaborFormulaType,
  ProductCategory,
} from '../domain/value-objects/product-categories';

export { PricingService } from '../application/services/pricing.service';
