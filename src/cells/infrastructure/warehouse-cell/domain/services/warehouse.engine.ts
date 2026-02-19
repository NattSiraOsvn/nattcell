/**
 * NATT-OS — Warehouse Cell
 * Domain Engine: WarehouseEngine
 * Pure business rules — không có side effects
 */

import { WarehouseItem } from '../entities/warehouse.entity';
import { WarehouseCategoryRegistry } from '../value-objects/warehouse-category.registry';

export class WarehouseEngine {

  // ─── Validation ───

  static validateNewItem(
    sku: string,
    name: string,
    categoryCode: string,
    quantity: number,
    unitCostVND: number,
    registry: WarehouseCategoryRegistry,
  ): string[] {
    const errors: string[] = [];
    if (!sku?.trim()) errors.push('SKU không được để trống');
    if (!name?.trim()) errors.push('Tên mặt hàng không được để trống');
    if (!categoryCode?.trim()) errors.push('Danh mục không được để trống');
    if (!registry.exists(categoryCode))
      errors.push(`Danh mục "${categoryCode}" chưa đăng ký — dùng RegisterCategoryCommand trước`);
    if (quantity < 0) errors.push('Số lượng ban đầu không thể âm');
    if (unitCostVND < 0) errors.push('Đơn giá không thể âm');
    return errors;
  }

  static validateReceive(quantity: number, unitCost: number): string[] {
    const errors: string[] = [];
    if (quantity <= 0) errors.push('Số lượng nhập phải lớn hơn 0');
    if (unitCost < 0) errors.push('Đơn giá không thể âm');
    return errors;
  }

  static validateRelease(item: WarehouseItem, quantity: number): string[] {
    const errors: string[] = [];
    if (quantity <= 0) errors.push('Số lượng xuất phải lớn hơn 0');
    if (quantity > item.quantity) errors.push(`Tồn kho không đủ: có ${item.quantity}, yêu cầu ${quantity}`);
    if (item.status === 'DAMAGED') errors.push('Mặt hàng đang bị hư hỏng — không thể xuất');
    if (item.status === 'DISCONTINUED') errors.push('Mặt hàng đã ngưng sử dụng');
    return errors;
  }

  // ─── Category auto-suggest ───

  static suggestMinThreshold(categoryCode: string, registry: WarehouseCategoryRegistry): number {
    const cat = registry.findByCode(categoryCode);
    return cat?.minStockAlert ?? 5;
  }

  static suggestInsuranceStatus(
    categoryCode: string,
    registry: WarehouseCategoryRegistry,
  ): 'COVERED' | 'NOT_COVERED' {
    const cat = registry.findByCode(categoryCode);
    // Nguyên liệu quý → cần bảo hiểm → default NOT_COVERED (để admin bổ sung)
    return cat?.requiresInsurance ? 'NOT_COVERED' : 'NOT_COVERED';
  }

  // ─── Stock status logic ───

  static computeStatus(quantity: number, minThreshold: number): WarehouseItem['status'] {
    if (quantity === 0) return 'OUT_OF_STOCK';
    if (quantity <= minThreshold) return 'LOW_STOCK';
    return 'AVAILABLE';
  }

  // ─── Weighted average cost ───

  static computeNewAvgCost(
    currentQty: number,
    currentCost: number,
    incomingQty: number,
    incomingCost: number,
  ): number {
    const total = currentQty + incomingQty;
    if (total === 0) return 0;
    return Math.round((currentQty * currentCost + incomingQty * incomingCost) / total);
  }
}
