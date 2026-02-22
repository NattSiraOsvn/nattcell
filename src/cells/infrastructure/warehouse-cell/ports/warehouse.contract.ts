/**
 * NATT-OS WAREHOUSE CELL - EDA CONTRACT
 */
export const WAREHOUSE_CONTRACT = {
  cellId: 'WAREHOUSE-cell',
  emits: ['WAREHOUSE.goods.received', 'WAREHOUSE.goods.released', 'WAREHOUSE.inventory.updated'],
  consumes: ['order.created', 'production.completed']
} as const;
