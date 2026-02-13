export const BUYBACK_CONTRACT = {
  cellId: 'buyback-cell', version: '2.0.0',
  emits: ['buyback.item.assessed','buyback.offer.made','buyback.accepted','buyback.completed','buyback.item.received'],
  consumes: ['pricing.gold.updated','inventory.item.received','customer.tier.checked'],
} as const;
