/**
 * NATT-OS — Warehouse Cell
 * EDA Event Contracts v2.1.0
 * Quản lý kho vật tư, nguyên liệu, công cụ Tâm Luxury
 */

import { CellContract } from '../../../infrastructure/shared-contracts-cell/domain/contract.types';

export const WAREHOUSE_CONTRACT: CellContract<
  readonly [
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
  readonly [
    'order.created',
    'inventory.item.transferred',
  ]
> = {
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

// ─── Event Payloads ───

export interface WarehouseCategoryRegisteredEvent {
  type: 'warehouse.category.registered';
  payload: {
    code: string;
    name: string;
    defaultUnit: string;
    defaultLocation: string;
    requiresInsurance: boolean;
    isConsumable: boolean;
    registeredBy: string;
    registeredAt: string;
  };
}

export interface WarehouseItemCreatedEvent {
  type: 'warehouse.item.created';
  payload: {
    itemId: string;
    sku: string;
    name: string;
    categoryCode: string;
    unit: string;
    initialQty: number;
    unitCostVND: number;
    location: string;
    createdBy: string;
    createdAt: string;
  };
}

export interface WarehouseItemReceivedEvent {
  type: 'warehouse.item.received';
  payload: {
    itemId: string;
    sku: string;
    quantityReceived: number;
    newTotalQty: number;
    newUnitCostVND: number;     // Giá bình quân mới sau nhập
    supplierId?: string;
    receivedBy: string;
    receivedAt: string;
  };
}

export interface WarehouseItemReleasedEvent {
  type: 'warehouse.item.released';
  payload: {
    itemId: string;
    sku: string;
    quantityReleased: number;
    remainingQty: number;
    reason: string;
    releasedBy: string;
    releasedAt: string;
  };
}

export interface WarehouseItemAdjustedEvent {
  type: 'warehouse.item.adjusted';
  payload: {
    itemId: string;
    sku: string;
    previousQty: number;
    newQty: number;
    delta: number;
    reason: string;
    adjustedBy: string;
    adjustedAt: string;
  };
}

export interface WarehouseStockLowEvent {
  type: 'warehouse.stock.low';
  payload: {
    itemId: string;
    sku: string;
    name: string;
    currentQty: number;
    minThreshold: number;
    categoryCode: string;
    location: string;
    detectedAt: string;
  };
}

export interface WarehouseStockOutEvent {
  type: 'warehouse.stock.out';
  payload: {
    itemId: string;
    sku: string;
    name: string;
    categoryCode: string;
    location: string;
    detectedAt: string;
  };
}

export interface WarehouseInsuranceAlertEvent {
  type: 'warehouse.insurance.alert';
  payload: {
    itemId: string;
    sku: string;
    name: string;
    totalValueVND: number;
    insuranceStatus: 'NOT_COVERED' | 'EXPIRED';
    detectedAt: string;
  };
}

export interface WarehouseQAAuditCompletedEvent {
  type: 'warehouse.qa.audit.completed';
  payload: {
    healthScore: number;
    totalItems: number;
    totalValueVND: number;
    stockAlertCount: number;
    insuranceAlertCount: number;
    unregisteredCategoryCount: number;
    auditedBy: string;
    auditedAt: string;
  };
}

export type WarehouseEmittedEvent =
  | WarehouseCategoryRegisteredEvent
  | WarehouseItemCreatedEvent
  | WarehouseItemReceivedEvent
  | WarehouseItemReleasedEvent
  | WarehouseItemAdjustedEvent
  | WarehouseStockLowEvent
  | WarehouseStockOutEvent
  | WarehouseInsuranceAlertEvent
  | WarehouseQAAuditCompletedEvent;
