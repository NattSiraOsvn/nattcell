export const CUSTOMER_CONTRACT = {
  cellId: 'customer-cell', version: '2.0.0',
  emits: ['customer.registered','customer.tier.upgraded','customer.purchase.recorded','customer.birthday.upcoming'],
  consumes: ['order.completed','sales.completed'],
} as const;
