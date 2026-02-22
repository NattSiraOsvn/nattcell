/**
 * NATT-OS — Warehouse Cell
 * Application Service: WarehouseService
 * Facade cho toàn bộ luồng kho vật tư Tâm Luxury
 *
 * Giao thức mở: người dùng tự thêm danh mục qua RegisterCategoryCommand
 */

import { WarehouseItem } from '../entities/warehouse.entity';
import { WarehouseEngine } from '../services/warehouse.engine';
import { WarehouseDomainService, QAAuditResult } from '../domain/services/WarehouseDomainService';
import {
  WarehouseCategoryRegistry,
  RegisterCategoryCommand,
  CategoryDefinition,
  WarehouseUnit,
  WarehouseLocation,
} from '../value-objects/warehouse-category.registry';
import {
  WarehouseEmittedEvent,
  WarehouseCategoryRegisteredEvent,
  WarehouseItemCreatedEvent,
  WarehouseItemReceivedEvent,
  WarehouseItemReleasedEvent,
  WarehouseItemAdjustedEvent,
  WarehouseStockLowEvent,
  WarehouseStockOutEvent,
  WarehouseInsuranceAlertEvent,
  WarehouseQAAuditCompletedEvent,
} from '../infrastructure/ports/warehouse.contract';

// ═══ COMMAND TYPES ═══

export interface CreateWarehouseItemCommand {
  sku: string;
  name: string;
  categoryCode: string;
  unit?: WarehouseUnit;
  initialQty: number;
  unitCostVND: number;
  location?: WarehouseLocation;
  locationNote?: string;
  minTHReshold?: number;
  supplierId?: string;
  notes?: string;
  createdBy: string;
}

export interface ReceiveStockCommand {
  itemId: string;
  quantity: number;
  unitCostVND: number;
  supplierId?: string;
  notes?: string;
  receivedBy: string;
}

export interface ReleaseStockCommand {
  itemId: string;
  quantity: number;
  reason: string;
  releasedBy: string;
}

export interface AdjustStockCommand {
  itemId: string;
  newQuantity: number;
  reason: string;
  adjustedBy: string;
}

export interface MarkDamagedCommand {
  itemId: string;
  notes: string;
  markedBy: string;
}

export interface UpdateInsuranceCommand {
  itemId: string;
  status: 'COVERED' | 'NOT_COVERED' | 'EXPIRED';
  updatedBy: string;
}

// ═══ SERVICE ═══

export class WarehouseService {
  private items: Map<string, WarehouseItem> = new Map();
  private eventLog: WarehouseEmittedEvent[] = [];

  readonly registry: WarehouseCategoryRegistry;

  constructor() {
    this.registry = new WarehouseCategoryRegistry();  // Seed defaults tự động
  }

  // ═══ GIAO THỨC MỞ — Người dùng tự thêm danh mục ═══

  registerCategory(cmd: RegisterCategoryCommand): {
    success: boolean;
    category?: CategoryDefinition;
    error?: string;
    event?: WarehouseCategoryRegisteredEvent;
  } {
    const result = this.registry.register(cmd);
    if (!result.success) return { success: false, error: result.error };

    const category = this.registry.findByCode(cmd.code)!;
    const event: WarehouseCategoryRegisteredEvent = {
      type: 'WAREHOUSE.category.registered',
      payload: {
        WAREHOUSEId: 'system',
        action: 'register',
        code: category.code,
        name: category.name,
        defaultUnit: category.defaultUnit,
        defaultLocation: category.defaultLocation,
        requiresInsurance: category.requiresInsurance,
        isConsumable: category.isConsumable,
        registeredBy: cmd.createdBy,
        registeredAt: new Date().toISOString(),
      },
    };
    this.eventLog.push(event);
    return { success: true, category, event };
  }

  getCategories(): CategoryDefinition[] {
    return this.registry.getActive();
  }

  // ═══ ITEM MANAGEMENT ═══

  createItem(cmd: CreateWarehouseItemCommand): {
    item?: WarehouseItem;
    errors: string[];
    event?: WarehouseItemCreatedEvent;
  } {
    const errors = WarehouseEngine.validateNewItem(
      cmd.sku, cmd.name, cmd.categoryCode, cmd.initialQty, cmd.unitCostVND, this.registry,
    );
    if (errors.length > 0) return { errors };

    const cat = this.registry.findByCode(cmd.categoryCode)!;
    const id = `WH-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const minTHReshold = cmd.minTHReshold ?? WarehouseEngine.suggestMinTHReshold(cmd.categoryCode, this.registry);

    const props = {
      id,
      sku: cmd.sku.toUpperCase().trim(),
      name: cmd.name.trim(),
      categoryCode: cmd.categoryCode.toUpperCase(),
      unit: cmd.unit ?? cat.defaultUnit,
      quantity: cmd.initialQty,
      unitCostVND: cmd.unitCostVND,
      location: cmd.location ?? cat.defaultLocation,
      locationNote: cmd.locationNote,
      minTHReshold,
      supplierId: cmd.supplierId,
      notes: cmd.notes,
      insuranceStatus: cat.requiresInsurance ? 'NOT_COVERED' : 'NOT_COVERED',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: cmd.createdBy,
    };

    const item = new WarehouseItem(props);
    this.items.set(id, item);

    const event: WarehouseItemCreatedEvent = {
      type: 'WAREHOUSE.item.created',
      payload: {
        WAREHOUSEId: id,
        action: 'create',
        itemId: id,
        sku: item.sku,
        name: item.name,
        categoryCode: item.categoryCode,
        initialQty: item.quantity,
        unitCostVND: item.unitCostVND,
        location: item.location,
        minTHReshold: item.minTHReshold,
        createdBy: cmd.createdBy,
        createdAt: new Date().toISOString(),
      },
    };
    this.eventLog.push(event);

    this._checkAndEmitStockAlerts(item);
    return { item, errors: [], event };
  }

  // ─── Nhập kho ───

  receiveStock(cmd: ReceiveStockCommand): {
    item?: WarehouseItem;
    errors: string[];
    event?: WarehouseItemReceivedEvent;
  } {
    const item = this.items.get(cmd.itemId);
    if (!item) return { errors: [`Không tìm thấy mặt hàng: ${cmd.itemId}`] };

    const errors = WarehouseEngine.validateReceive(cmd.quantity);
    if (errors.length > 0) return { errors };

    item.receiveStock(cmd.quantity, cmd.unitCostVND, cmd.receivedBy);

    const event: WarehouseItemReceivedEvent = {
      type: 'WAREHOUSE.item.received',
      payload: {
        WAREHOUSEId: cmd.itemId,
        action: 'receive',
        itemId: item.id,
        quantity: cmd.quantity,
        unitCostVND: cmd.unitCostVND,
        supplierId: cmd.supplierId,
        receivedBy: cmd.receivedBy,
        receivedAt: new Date().toISOString(),
        newAvgCost: item.unitCostVND,
      },
    };
    this.eventLog.push(event);
    this._checkAndEmitStockAlerts(item);
    return { item, errors: [], event };
  }

  // ─── Xuất kho ───

  releaseStock(cmd: ReleaseStockCommand): {
    item?: WarehouseItem;
    errors: string[];
    event?: WarehouseItemReleasedEvent;
  } {
    const item = this.items.get(cmd.itemId);
    if (!item) return { errors: [`Không tìm thấy mặt hàng: ${cmd.itemId}`] };

    const errors = WarehouseEngine.validateRelease(item, cmd.quantity);
    if (errors.length > 0) return { errors };

    item.releaseStock(cmd.quantity, cmd.reason, cmd.releasedBy);

    const event: WarehouseItemReleasedEvent = {
      type: 'WAREHOUSE.item.released',
      payload: {
        WAREHOUSEId: cmd.itemId,
        action: 'release',
        itemId: item.id,
        quantity: cmd.quantity,
        reason: cmd.reason,
        releasedBy: cmd.releasedBy,
        releasedAt: new Date().toISOString(),
        remainingQty: item.quantity,
      },
    };
    this.eventLog.push(event);
    this._checkAndEmitStockAlerts(item);
    return { item, errors: [], event };
  }

  // ─── Kiểm kê / Điều chỉnh ───

  adjustStock(cmd: AdjustStockCommand): {
    item?: WarehouseItem;
    errors: string[];
    event?: WarehouseItemAdjustedEvent;
  } {
    const item = this.items.get(cmd.itemId);
    if (!item) return { errors: [`Không tìm thấy mặt hàng: ${cmd.itemId}`] };
    if (cmd.newQuantity < 0) return { errors: ['Số lượng điều chỉnh không thể âm'] };

    const previousQty = item.quantity;
    item.adjustStock(cmd.newQuantity, cmd.reason, cmd.adjustedBy);

    const event: WarehouseItemAdjustedEvent = {
      type: 'WAREHOUSE.item.adjusted',
      payload: {
        WAREHOUSEId: cmd.itemId,
        action: 'adjust',
        itemId: item.id,
        oldQuantity: previousQty,
        newQuantity: item.quantity,
        reason: cmd.reason,
        adjustedBy: cmd.adjustedBy,
        adjustedAt: new Date().toISOString(),
      },
    };
    this.eventLog.push(event);
    this._checkAndEmitStockAlerts(item);
    return { item, errors: [], event };
  }

  // ─── Đánh dấu hư hỏng ───

  markDamaged(cmd: MarkDamagedCommand): { success: boolean; error?: string } {
    const item = this.items.get(cmd.itemId);
    if (!item) return { success: false, error: `Không tìm thấy mặt hàng: ${cmd.itemId}` };
    item.markDamaged(cmd.notes);
    return { success: true };
  }

  // ─── Cập nhật bảo hiểm ───

  updateInsurance(cmd: UpdateInsuranceCommand): { success: boolean; error?: string } {
    const item = this.items.get(cmd.itemId);
    if (!item) return { success: false, error: `Không tìm thấy mặt hàng: ${cmd.itemId}` };
    item.updateInsurance(cmd.status);
    return { success: true };
  }

  // ═══ ANALYTICS ═══

  runQAAudit(auditedBy: string): QAAuditResult & { event: WarehouseQAAuditCompletedEvent } {
    const allItems = Array.from(this.items.values());
    const result = WarehouseDomainService.runQAAudit(allItems);

    result.insuranceAlerts.forEach(alert => {
      const ev: WarehouseInsuranceAlertEvent = {
        type: 'WAREHOUSE.insurance.alert',
        payload: {
          WAREHOUSEId: alert.itemId,
          action: 'alert',
          itemId: alert.itemId,
          sku: alert.sku,
          status: alert.insuranceStatus,
        },
      };
      this.eventLog.push(ev);
    });

    const event: WarehouseQAAuditCompletedEvent = {
      type: 'WAREHOUSE.qa.audit.completed',
      payload: {
        WAREHOUSEId: 'system',
        action: 'audit',
        healthScore: result.healthScore,
        totalItems: result.totalItems,
        totalValueVND: result.totalValueVND,
        stockAlertCount: result.stockAlerts.length,
        insuranceAlertCount: result.insuranceAlerts.length,
        unregisteredCategoryCount: result.unregisteredCategories.length,
        auditedBy,
        auditedAt: new Date().toISOString(),
      },
    };
    this.eventLog.push(event);
    return { ...result, event };
  }

  getDailyReceipts(date: Date): WarehouseItem[] {
    return Array.from(this.items.values()).filter(item =>
      item.movements.some(m =>
        m.type === 'IN' &&
        m.timestamp.toDateString() === date.toDateString()
      )
    );
  }

  getItemsByCategory(categoryCode: string): WarehouseItem[] {
    return Array.from(this.items.values())
      .filter(i => i.categoryCode === categoryCode.toUpperCase());
  }

  getItemsByLocation(location: WarehouseLocation): WarehouseItem[] {
    return Array.from(this.items.values()).filter(i => i.location === location);
  }

  getLowStockItems(): WarehouseItem[] {
    return Array.from(this.items.values()).filter(i => i.isLowStock() || i.isOutOfStock());
  }

  getInsuranceRequired(): WarehouseItem[] {
    return Array.from(this.items.values()).filter(i =>
      WarehouseDomainService.requiresInsurance(i.categoryCode) && i.insuranceStatus !== 'COVERED'
    );
  }

  findBySku(sku: string): WarehouseItem | null {
    return Array.from(this.items.values()).find(i => i.sku === sku.toUpperCase()) ?? null;
  }

  findById(id: string): WarehouseItem | null {
    return this.items.get(id) ?? null;
  }

  getEventLog(): WarehouseEmittedEvent[] {
    return [...this.eventLog];
  }

  private _checkAndEmitStockAlerts(item: WarehouseItem): void {
    if (item.isOutOfStock()) {
      const ev: WarehouseStockOutEvent = {
        type: 'WAREHOUSE.stock.out',
        payload: {
          WAREHOUSEId: item.id,
          action: 'alert',
          itemId: item.id,
          sku: item.sku,
        },
      };
      this.eventLog.push(ev);
    } else if (item.isLowStock()) {
      const ev: WarehouseStockLowEvent = {
        type: 'WAREHOUSE.stock.low',
        payload: {
          WAREHOUSEId: item.id,
          action: 'alert',
          itemId: item.id,
          sku: item.sku,
          currentQty: item.quantity,
          tHReshold: item.minTHReshold,
        },
      };
      this.eventLog.push(ev);
    }
  }
}


// WarehouseProvider - compatibility alias
export class WarehouseProvider {
  static getAllInventory(): unknown[] { return []; }
  private static service = new WarehouseService();
  
  static getInstance() { return this.service; }
  
  static async getItems() {
    return this.service.getAllItems ? this.service.getAllItems() : [];
  }
}
