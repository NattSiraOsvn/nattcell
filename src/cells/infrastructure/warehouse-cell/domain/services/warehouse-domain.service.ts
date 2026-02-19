/**
 * NATT-OS — Warehouse Cell
 * Domain Service: WarehouseDomainService
 */

import { WarehouseItem } from '../entities/warehouse.entity';
import { WarehouseCategoryRegistry } from '../value-objects/warehouse-category.registry';

export interface StockAlert {
  itemId: string;
  sku: string;
  name: string;
  categoryCode: string;
  currentQty: number;
  minThreshold: number;
  severity: 'OUT_OF_STOCK' | 'LOW_STOCK';
}

export interface InsuranceAlert {
  itemId: string;
  sku: string;
  name: string;
  totalValueVND: number;
  insuranceStatus: string;
}

export interface QAAuditResult {
  healthScore: number;               // 0-100
  totalItems: number;
  totalValueVND: number;
  stockAlerts: StockAlert[];
  insuranceAlerts: InsuranceAlert[];
  unregisteredCategories: string[];  // Category codes không có trong registry
}

export class WarehouseDomainService {
  constructor(private readonly registry: WarehouseCategoryRegistry) {}

  // ─── Validation ───

  validateItem(item: WarehouseItem): string[] {
    const errors: string[] = [];
    if (!item.sku?.trim()) errors.push('SKU không được để trống');
    if (!item.name?.trim()) errors.push('Tên mặt hàng không được để trống');
    if (item.quantity < 0) errors.push('Số lượng không thể âm');
    if (item.unitCostVND < 0) errors.push('Đơn giá không thể âm');
    if (!this.registry.exists(item.categoryCode))
      errors.push(`Danh mục ${item.categoryCode} chưa đăng ký trong registry`);
    return errors;
  }

  canRelease(item: WarehouseItem, quantity: number): boolean {
    return item.quantity >= quantity && item.status !== 'DAMAGED' && item.status !== 'DISCONTINUED';
  }

  // ─── Stock alerts ───

  getStockAlerts(items: WarehouseItem[]): StockAlert[] {
    return items
      .filter(i => i.isOutOfStock() || i.isLowStock())
      .map(i => ({
        itemId: i.id,
        sku: i.sku,
        name: i.name,
        categoryCode: i.categoryCode,
        currentQty: i.quantity,
        minThreshold: i.minThreshold,
        severity: i.isOutOfStock() ? 'OUT_OF_STOCK' : 'LOW_STOCK',
      }));
  }

  // ─── Insurance audit ───

  getInsuranceAlerts(items: WarehouseItem[]): InsuranceAlert[] {
    return items.filter(i => {
      const cat = this.registry.findByCode(i.categoryCode);
      return cat?.requiresInsurance && i.insuranceStatus !== 'COVERED';
    }).map(i => ({
      itemId: i.id,
      sku: i.sku,
      name: i.name,
      totalValueVND: i.totalValueVND,
      insuranceStatus: i.insuranceStatus,
    }));
  }

  // ─── QA Audit — từ v2 WarehouseEngine.runQAAudit() ───

  runQAAudit(items: WarehouseItem[]): QAAuditResult {
    const stockAlerts = this.getStockAlerts(items);
    const insuranceAlerts = this.getInsuranceAlerts(items);

    const unregisteredCategories = [...new Set(
      items
        .filter(i => !this.registry.exists(i.categoryCode))
        .map(i => i.categoryCode)
    )];

    const totalValueVND = items.reduce((sum, i) => sum + i.totalValueVND, 0);

    // Health score: -10 mỗi OUT_OF_STOCK, -5 mỗi LOW_STOCK, -15 mỗi insurance alert
    const deductions =
      stockAlerts.filter(a => a.severity === 'OUT_OF_STOCK').length * 10 +
      stockAlerts.filter(a => a.severity === 'LOW_STOCK').length * 5 +
      insuranceAlerts.length * 15 +
      unregisteredCategories.length * 5;

    const healthScore = Math.max(0, 100 - deductions);

    return {
      healthScore,
      totalItems: items.length,
      totalValueVND,
      stockAlerts,
      insuranceAlerts,
      unregisteredCategories,
    };
  }

  // ─── Category helpers ───

  getSuggestedUnit(categoryCode: string): string {
    return this.registry.findByCode(categoryCode)?.defaultUnit ?? 'CAI';
  }

  getSuggestedLocation(categoryCode: string): string {
    return this.registry.findByCode(categoryCode)?.defaultLocation ?? 'KHO_VAT_TU';
  }

  requiresInsurance(categoryCode: string): boolean {
    return this.registry.findByCode(categoryCode)?.requiresInsurance ?? false;
  }
}
