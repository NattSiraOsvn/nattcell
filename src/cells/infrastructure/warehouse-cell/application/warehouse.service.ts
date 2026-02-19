/**
 * NATT-OS — Warehouse Cell
 * Application Service: WarehouseService
 * Facade cho toàn bộ luồng kho vật tư Tâm Luxury
 *
 * Giao thức mở: người dùng tự thêm danh mục qua RegisterCategoryCommand
 */

import { WarehouseItem, WarehouseItemProps } from '../entities/warehouse.entity';
import { WarehouseEngine } from '../services/warehouse.engine';
import { WarehouseDomainService, QAAuditResult } from '../services/warehouse-domain.service';
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
} from '../../infrastructure/warehouse.contract';

// ═══ COMMAND TYPES ═══

export interface CreateWarehouseItemCommand {
  sku: string;
  name: string;
  categoryCode: string;            // Phải tồn tại trong registry
  unit?: WarehouseUnit;            // Nếu không có → lấy default từ category
  initialQty: number;
  unitCostVND: number;
  location?: WarehouseLocation;    // Nếu không có → lấy default từ category
  locationNote?: string;
  minThreshold?: number;           // Nếu không có → lấy gợi ý từ category
  supplierId?: string;
  notes?: string;
  createdBy: string;
}

export interface ReceiveStockCommand {
  itemId: string;
  quantity: number;
  unitCostVND: number;             // Đơn giá nhập lần này — tính bình quân tự động
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
  private readonly domain: WarehouseDomainService;

  constructor() {
    this.registry = new WarehouseCategoryRegistry();  // Seed defaults tự động
    this.domain = new WarehouseDomainService(this.registry);
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
      type: 'warehouse.category.registered',
      payload: {
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
    const minThreshold = cmd.minThreshold ?? WarehouseEngine.suggestMinThreshold(cmd.categoryCode, this.registry);

    const props: WarehouseItemProps = {
      id,
      sku: cmd.sku.toUpperCase().trim(),
      name: cmd.name.trim(),
      categoryCode: cmd.categoryCode.toUpperCase(),
      unit: cmd.unit ?? cat.defaultUnit,
      quantity: cmd.initialQty,
      unitCostVND: cmd.unitCostVND,
      location: cmd.location ?? cat.defaultLocation,
      locationNote: cmd.locationNote,
      status: WarehouseEngine.computeStatus(cmd.initialQty, minThreshold),
      minThreshold,
      insuranceStatus: cat.requiresInsurance ? 'NOT_COVERED' : 'NOT_COVERED',
      supplierId: cmd.supplierId,
      notes: cmd.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const item = new WarehouseItem(props);
    this.items.set(id, item);

    const event: WarehouseItemCreatedEvent = {
      type: 'warehouse.item.created',
      payload: {
        itemId: id,
        sku: item.sku,
        name: item.name,
        categoryCode: item.categoryCode,
        unit: item.unit,
        initialQty: item.quantity,
        unitCostVND: item.unitCostVND,
        location: item.location,
        createdBy: cmd.createdBy,
        createdAt: new Date().toISOString(),
      },
    };
    this.eventLog.push(event);

    // Phát stock alert ngay nếu khởi tạo với qty thấp
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

    const errors = WarehouseEngine.validateReceive(cmd.quantity, cmd.unitCostVND);
    if (errors.length > 0) return { errors };

    item.receiveStock(cmd.quantity, cmd.unitCostVND, cmd.receivedBy);

    const event: WarehouseItemReceivedEvent = {
      type: 'warehouse.item.received',
      payload: {
        itemId: item.id,
        sku: item.sku,
        quantityReceived: cmd.quantity,
        newTotalQty: item.quantity,
        newUnitCostVND: item.unitCostVND,
        supplierId: cmd.supplierId,
        receivedBy: cmd.receivedBy,
        receivedAt: new Date().toISOString(),
      },
    };
    this.eventLog.push(event);
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
      type: 'warehouse.item.released',
      payload: {
        itemId: item.id,
        sku: item.sku,
        quantityReleased: cmd.quantity,
        remainingQty: item.quantity,
        reason: cmd.reason,
        releasedBy: cmd.releasedBy,
        releasedAt: new Date().toISOString(),
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
      type: 'warehouse.item.adjusted',
      payload: {
        itemId: item.id,
        sku: item.sku,
        previousQty,
        newQty: item.quantity,
        delta: item.quantity - previousQty,
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
    const result = this.domain.runQAAudit(allItems);

    // Emit insurance alerts
    result.insuranceAlerts.forEach(alert => {
      const ev: WarehouseInsuranceAlertEvent = {
        type: 'warehouse.insurance.alert',
        payload: {
          itemId: alert.itemId,
          sku: alert.sku,
          name: alert.name,
          totalValueVND: alert.totalValueVND,
          insuranceStatus: alert.insuranceStatus as 'NOT_COVERED' | 'EXPIRED',
          detectedAt: new Date().toISOString(),
        },
      };
      this.eventLog.push(ev);
    });

    const event: WarehouseQAAuditCompletedEvent = {
      type: 'warehouse.qa.audit.completed',
      payload: {
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
      this.domain.requiresInsurance(i.categoryCode) && i.insuranceStatus !== 'COVERED'
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

  // ─── Internal helpers ───

  private _checkAndEmitStockAlerts(item: WarehouseItem): void {
    if (item.isOutOfStock()) {
      const ev: WarehouseStockOutEvent = {
        type: 'warehouse.stock.out',
        payload: {
          itemId: item.id,
          sku: item.sku,
          name: item.name,
          categoryCode: item.categoryCode,
          location: item.location,
          detectedAt: new Date().toISOString(),
        },
      };
      this.eventLog.push(ev);
    } else if (item.isLowStock()) {
      const ev: WarehouseStockLowEvent = {
        type: 'warehouse.stock.low',
        payload: {
          itemId: item.id,
          sku: item.sku,
          name: item.name,
          currentQty: item.quantity,
          minThreshold: item.minThreshold,
          categoryCode: item.categoryCode,
          location: item.location,
          detectedAt: new Date().toISOString(),
        },
      };
      this.eventLog.push(ev);
    }
  }
}
