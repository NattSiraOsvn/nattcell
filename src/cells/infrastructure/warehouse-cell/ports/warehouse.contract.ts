/**
 * NATT-OS WAREHOUSE CELL - EDA CONTRACT
 */
export const WAREHOUSE_CONTRACT = {
  cellId: 'warehouse-cell',
  emits: ['warehouse.goods.received', 'warehouse.goods.released', 'warehouse.inventory.updated'],
  consumes: ['order.created', 'production.completed']
} as const;
