export const WAREHOUSE_CONTRACT = {
  cellId: 'WAREHOUSE-cell',
  version: '2.1.0',
  emits: [
    'WAREHOUSE.category.registered',
    'WAREHOUSE.item.created',
    'WAREHOUSE.item.received',
    'WAREHOUSE.item.released',
    'WAREHOUSE.item.adjusted',
    'WAREHOUSE.item.damaged',
    'WAREHOUSE.stock.low',
    'WAREHOUSE.stock.out',
    'WAREHOUSE.insurance.alert',
    'WAREHOUSE.qa.audit.completed',
  ],
  consumes: [
    'order.created',
    'inventory.item.transferred',
  ],
} as const;

export interface WarehouseCategoryRegisteredEvent {
  type: 'WAREHOUSE.category.registered';
  payload: { WAREHOUSEId: string; action: string; code: string; name: string; defaultUnit: string; defaultLocation: string; requiresInsurance: boolean; isConsumable: boolean; registeredBy: string; registeredAt: string; };
}
export interface WarehouseItemCreatedEvent {
  type: 'WAREHOUSE.item.created';
  payload: { WAREHOUSEId: string; action: string; itemId: string; sku: string; name: string; categoryCode: string; initialQty: number; unitCostVND: number; location: string; minTHReshold: number; createdBy: string; createdAt: string; };
}
export interface WarehouseItemReceivedEvent {
  type: 'WAREHOUSE.item.received';
  payload: { WAREHOUSEId: string; action: string; itemId: string; quantity: number; unitCostVND: number; supplierId?: string; receivedBy: string; receivedAt: string; newAvgCost: number; };
}
export interface WarehouseItemReleasedEvent {
  type: 'WAREHOUSE.item.released';
  payload: { WAREHOUSEId: string; action: string; itemId: string; quantity: number; reason: string; releasedBy: string; releasedAt: string; remainingQty: number; };
}
export interface WarehouseItemAdjustedEvent {
  type: 'WAREHOUSE.item.adjusted';
  payload: { WAREHOUSEId: string; action: string; itemId: string; oldQuantity: number; newQuantity: number; reason: string; adjustedBy: string; adjustedAt: string; };
}
export interface WarehouseStockLowEvent {
  type: 'WAREHOUSE.stock.low';
  payload: { WAREHOUSEId: string; action: string; itemId: string; sku: string; currentQty: number; tHReshold: number; };
}
export interface WarehouseStockOutEvent {
  type: 'WAREHOUSE.stock.out';
  payload: { WAREHOUSEId: string; action: string; itemId: string; sku: string; };
}
export interface WarehouseInsuranceAlertEvent {
  type: 'WAREHOUSE.insurance.alert';
  payload: { WAREHOUSEId: string; action: string; itemId: string; sku: string; status: string; };
}
export interface WarehouseQAAuditCompletedEvent {
  type: 'WAREHOUSE.qa.audit.completed';
  payload: { WAREHOUSEId: string; action: string; healthScore: number; totalItems: number; totalValueVND: number; stockAlertCount: number; insuranceAlertCount: number; unregisteredCategoryCount: number; auditedBy: string; auditedAt: string; };
}
export type WarehouseEmittedEvent =
  | WarehouseCategoryRegisteredEvent | WarehouseItemCreatedEvent
  | WarehouseItemReceivedEvent | WarehouseItemReleasedEvent
  | WarehouseItemAdjustedEvent | WarehouseStockLowEvent
  | WarehouseStockOutEvent | WarehouseInsuranceAlertEvent
  | WarehouseQAAuditCompletedEvent;
