/**
 * Pricing Application Service
 * Facade cho các use cases — interface chính cho cells khác gọi qua EDA.
 */

import { PricingInput, PricingBreakdown } from '../../domain/entities/pricing-calculator';
import { executeCalculateProductPrice } from '../use-cases/calculate-product-price';
import { executeUpdateGoldMarketPrice, UpdateGoldPriceCommand } from '../use-cases/update-gold-market-price';
import { GoldTypeCode, GoldMarketPrice } from '../../domain/value-objects/gold-types';

export class PricingService {
  /**
   * Tính giá cho một sản phẩm
   */
  calculatePrice(input: PricingInput): PricingBreakdown {
    const result = executeCalculateProductPrice({ input });
    if (!result.success || !result.breakdown) {
      throw new Error(result.error ?? 'Unknown pricing error');
    }
    return result.breakdown;
  }

  /**
   * Cập nhật giá vàng thị trường
   */
  updateGoldPrice(command: UpdateGoldPriceCommand): GoldMarketPrice {
    const result = executeUpdateGoldMarketPrice(command);
    if (!result.success || !result.updatedPrice) {
      throw new Error(result.error ?? 'Unknown update error');
    }
    return result.updatedPrice;
  }
}
