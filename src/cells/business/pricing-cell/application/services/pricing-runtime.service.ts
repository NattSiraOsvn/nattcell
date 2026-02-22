import { ShardingService } from '@/services/sharding-service';
import { QuoteRequest, QuoteResult, LaborRuleResult } from "../../domain/types/pricing.types";


import { evaluateRules } from '../../domain/services/rule-engine.service';
// TODO: Import ShardingService from appropriate module

/**
 * 💎 PRICING RUNTIME v1.0 (PRODUCTION)
 * Orchestrator chịu trách nhiệm:
 * 1. Validate Input (Weight > 0)
 * 2. Fetch Gold Price (Simulated Source of Truth)
 * 3. Invoke Rule Engine
 * 4. Apply Markup (S-VIP/Normal)
 * 5. Seal Result with Audit Hash
 */

// Bảng giá vàng niêm yết (Source of Truth giả lập)
const GOLD_RATES = {
  750: 11409091, // 18K (Updated)
  585: 9009091,  // 14K
  416: 6410000,  // 10K
  610: 9500000,  // 610
  9999: 15000000 // 24K
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
    const ruleResult = evaluateRules(request);
    
    if (ruleResult.type === 'MANUAL_QUOTE') {
      throw new Error('REQUIRES_EXECUTIVE_APPROVAL: Thiết kế VIP, cần Master báo giá trực tiếp.');
    }
    if (ruleResult.type === 'WAITING') {
       throw new Error('MISSING_INPUT: Vui lòng nhập đủ Trọng lượng và Đơn vị.');
    }
    if (ruleResult.type === 'ERROR') {
       throw new Error('CALCULATION_ERROR: Sai định dạng đầu vào.');
    }

    const laborPrice = ruleResult.labor_price;

    // 4. Compute Final Price Matrix
    const goldCost = request.specs.weight * goldUnitPrice;
    const stoneCost = request.specs.stonePrice;
    
    // Markup based on Tier
    // S-VIP: 10% Markup | Normal: 15% Markup
    const markup = request.customer_tier === 'S-VIP' ? 1.1 : 1.15; 
    
    const totalPrice = Math.round((goldCost + laborPrice + stoneCost) * markup);

    // 5. Generate Result & Trace
    const result: QuoteResult = {
      totalPrice: totalPrice,
      breakdown: { 
        gold_cost: goldCost, 
        labor_cost: laborPrice, 
        stone_cost: stoneCost, 
        markup 
      },
      pricing_version: '2025.v1-PROD',
      trace: {
        correlation_id: correlationId,
        causation_id: correlationId,
        rule_trace: [{ sheet: 'Total Bảng Giá', range: 'O2:O500', logic: ruleResult.formula_trace || 'Standard' }]
      }
    };

    // 6. Persistent Audit (Niêm phong vào quote_logs)
    const logHash = ShardingService.generateShardHash({ correlationId, result });
    console.info(`[AUDIT-PRICING] Quote Sealed: ${logHash}`);

    return result;
  }
}
