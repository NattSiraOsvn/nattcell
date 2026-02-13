export const EVENT_CLAIM_SUBMITTED = 'warranty.claim.submitted';
export const EVENT_CLAIM_APPROVED = 'warranty.claim.approved';
export const EVENT_CLAIM_REJECTED = 'warranty.claim.rejected';
export const EVENT_REPAIR_STARTED = 'warranty.repair.started';
export const EVENT_REPAIR_COMPLETED = 'warranty.repair.completed';
export const EVENT_ITEM_RETURNED = 'warranty.item.returned';
export const CONSUME_ORDER_COMPLETED = 'order.completed';
export const CONSUME_INVENTORY_MAINTENANCE = 'inventory.item.maintenance';

export const WARRANTY_CONTRACT = {
  cellId: 'warranty-cell', version: '2.0.0',
  emits: [EVENT_CLAIM_SUBMITTED, EVENT_CLAIM_APPROVED, EVENT_CLAIM_REJECTED, EVENT_REPAIR_STARTED, EVENT_REPAIR_COMPLETED, EVENT_ITEM_RETURNED],
  consumes: [CONSUME_ORDER_COMPLETED, CONSUME_INVENTORY_MAINTENANCE],
} as const;
