export interface Specs {
  weight: number;
  gold_ratio: number;
  stonePrice: number;
  [key: string]: any;
}

export interface QuoteRequest {
  product_group: string;
  specs: Specs;
  customer_tier: string;
  [key: string]: any;
}

export type LaborRuleType = 'FIXED' | 'ALGORITHMIC' | 'MANUAL_QUOTE' | 'WAITING' | 'ERROR';

export interface LaborRuleResult {
  laborPrice: number;
  type: LaborRuleType;
  formula_trace?: string;
  [key: string]: any;
}

export interface QuoteResult {
  totalPrice: number;
  breakdown: any;
  [key: string]: any;
}
