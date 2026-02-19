export const WAREHOUSE_CONTRACT = {
  cellId: 'warehouse-cell',
  version: '2.1.0',
  emits: [
    'warehouse.category.registered',
    'warehouse.item.created',
    'warehouse.item.received',
    'warehouse.item.released',
    'warehouse.item.adjusted',
    'warehouse.item.damaged',
    'warehouse.stock.low',
    'warehouse.stock.out',
    'warehouse.insurance.alert',
    'warehouse.qa.audit.completed',
  ],
  consumes: [
    'order.created',
    'inventory.item.transferred',
  ],
} as const;

export interface WarehouseCategoryRegisteredEvent {
  type: 'warehouse.category.registered';
  payload: { warehouseId: string; action: string; code: string; name: string; defaultUnit: string; defaultLocation: string; requiresInsurance: boolean; isConsumable: boolean; registeredBy: string; registeredAt: string; };
}
export interface WarehouseItemCreatedEvent {
  type: 'warehouse.item.created';
  payload: { warehouseId: string; action: string; itemId: string; sku: string; name: string; categoryCode: string; initialQty: number; unitCostVND: number; location: string; minThreshold: number; createdBy: string; createdAt: string; };
}
export interface WarehouseItemReceivedEvent {
  type: 'warehouse.item.received';
  payload: { warehouseId: string; action: string; itemId: string; quantity: number; unitCostVND: number; supplierId?: string; receivedBy: string; receivedAt: string; newAvgCost: number; };
}
export interface WarehouseItemReleasedEvent {
  type: 'warehouse.item.released';
  payload: { warehouseId: string; action: string; itemId: string; quantity: number; reason: string; releasedBy: string; releasedAt: string; remainingQty: number; };
}
export interface WarehouseItemAdjustedEvent {
  type: 'warehouse.item.adjusted';
  payload: { warehouseId: string; action: string; itemId: string; oldQuantity: number; newQuantity: number; reason: string; adjustedBy: string; adjustedAt: string; };
}
export interface WarehouseStockLowEvent {
  type: 'warehouse.stock.low';
  payload: { warehouseId: string; action: string; itemId: string; sku: string; currentQty: number; threshold: number; };
}
export interface WarehouseStockOutEvent {
  type: 'warehouse.stock.out';
  payload: { warehouseId: string; action: string; itemId: string; sku: string; };
}
export interface WarehouseInsuranceAlertEvent {
  type: 'warehouse.insurance.alert';
  payload: { warehouseId: string; action: string; itemId: string; sku: string; status: string; };
}
export interface WarehouseQAAuditCompletedEvent {
  type: 'warehouse.qa.audit.completed';
  payload: { warehouseId: string; action: string; healthScore: number; totalItems: number; totalValueVND: number; stockAlertCount: number; insuranceAlertCount: number; unregisteredCategoryCount: number; auditedBy: string; auditedAt: string; };
}
export type WarehouseEmittedEvent =
  | WarehouseCategoryRegisteredEvent | WarehouseItemCreatedEvent
  | WarehouseItemReceivedEvent | WarehouseItemReleasedEvent
  | WarehouseItemAdjustedEvent | WarehouseStockLowEvent
  | WarehouseStockOutEvent | WarehouseInsuranceAlertEvent
  | WarehouseQAAuditCompletedEvent;
