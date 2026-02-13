export const ORDER_CONTRACT = {
  cellId: 'order-cell', version: '2.0.0',
  emits: ['order.created','order.confirmed','order.completed','order.cancelled','order.payment.received'],
  consumes: ['inventory.item.reserved','inventory.item.sold','pricing.product.calculated','customer.tier.checked'],
} as const;
