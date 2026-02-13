export type SalesChannel = 'IN_STORE' | 'REFERRAL' | 'ONLINE_INQUIRY' | 'EVENT';
export type SaleStatus = 'INITIATED' | 'CONSULTING' | 'PRICING' | 'NEGOTIATING' | 'CLOSING' | 'COMPLETED' | 'LOST';

export const VALID_SALE_TRANSITIONS: Record<SaleStatus, SaleStatus[]> = {
  INITIATED:    ['CONSULTING', 'LOST'],
  CONSULTING:   ['PRICING', 'LOST'],
  PRICING:      ['NEGOTIATING', 'CLOSING', 'LOST'],
  NEGOTIATING:  ['CLOSING', 'LOST'],
  CLOSING:      ['COMPLETED', 'LOST'],
  COMPLETED:    [],
  LOST:         [],
};

export interface CommissionRate { role: 'SALES_STAFF' | 'MANAGER'; ratePercent: number; }
export const COMMISSION_RATES: CommissionRate[] = [
  { role: 'SALES_STAFF', ratePercent: 1.5 },
  { role: 'MANAGER', ratePercent: 0.5 },
];
