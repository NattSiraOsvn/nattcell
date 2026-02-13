export const SALES_CONTRACT = {
  cellId: 'sales-cell', version: '2.0.0',
  emits: ['sales.initiated','sales.completed','sales.lost','sales.commission.calculated'],
  consumes: ['inventory.item.reserved','pricing.product.calculated','customer.tier.checked','promotion.applied'],
} as const;
