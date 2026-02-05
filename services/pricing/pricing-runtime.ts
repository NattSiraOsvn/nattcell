
import { QuoteRequest, QuoteResult } from '../../types';
import { evaluateRules } from './rule-engine';
import { ShardingService } from '../blockchainService';

/**
 * 💎 PRICING RUNTIME v1.0
 * Location: services/pricing/pricing-runtime.ts
 */

// Mock Database Rates (Persistent Store Simulation)
const GOLD_RATES = {
  750: 11409091, // 18K
  585: 9009091,  // 14K
  416: 6410000   // 10K
};

export class PricingRuntime {
  /**
   * Khởi tạo Giao thức Tính giá (Execute Quote)
   */
  static async handleQuote(request: QuoteRequest, correlationId: string): Promise<QuoteResult> {
    console.log(`[PRICING-RUNTIME] Processing Request: ${correlationId}`);

    // 1. Validate Input
    if (request.specs.weight <= 0) throw new Error('INVALID_WEIGHT: Trọng lượng phải dương.');

    // 2. Fetch Gold Price (From simulated persistent store)
    const goldUnitPrice = (GOLD_RATES as any)[request.specs.gold_ratio] || GOLD_RATES[750];

    // 3. Execute Rule Engine (Bóc tách công thợ)
    const { labor_price, type } = evaluateRules(request);
    
    if (type === 'MANUAL_QUOTE') {
      throw new Error('REQUIRES_EXECUTIVE_APPROVAL: Thiết kế VIP, cần Master báo giá trực tiếp.');
    }

    // 4. Compute Final Price Matrix
    const goldCost = request.specs.weight * goldUnitPrice;
    const stoneCost = request.specs.stonePrice;
    
    // Markup based on Tier
    const markup = request.customer_tier === 'S-VIP' ? 1.1 : 1.15; // 10% vs 15%
    
    const totalPrice = Math.round((goldCost + labor_price + stoneCost) * markup);

    // 5. Generate Result & Trace
    const result: QuoteResult = {
      total_price: totalPrice,
      breakdown: { 
        gold_cost: goldCost, 
        labor_cost: labor_price, 
        stone_cost: stoneCost, 
        markup 
      },
      pricing_version: '2025.v1-PROD',
      trace: {
        correlation_id: correlationId,
        causation_id: correlationId,
        rule_trace: [{ sheet: 'Total Bảng Giá', range: 'O2:O500' }]
      }
    };

    // 6. Persistent Audit (Niêm phong vào quote_logs)
    const logHash = ShardingService.generateShardHash({ correlationId, result });
    console.info(`[AUDIT-PRICING] Quote Sealed: ${logHash}`);

    return result;
  }
}
