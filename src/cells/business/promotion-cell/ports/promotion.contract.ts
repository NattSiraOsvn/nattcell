export const PROMOTION_CONTRACT = {
  cellId: 'promotion-cell', version: '2.0.0',
  emits: ['promotion.applied','promotion.expired','promotion.created'],
  consumes: ['order.created','customer.tier.upgraded'],
} as const;
