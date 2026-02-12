/**
 * NATT-OS — Inventory Cell
 * Use Case: Check Availability
 * Kiểm tra tồn kho — Read-only operation
 */

import { InventoryItem } from '../../domain/entities/inventory-item.entity';
import { StockManagementEngine, StockCheckResult } from '../../domain/services/stock-management.engine';

export interface CheckAvailabilityInput {
  sku?: string;
  serialNumber?: string;
  locationCode?: string;
  branch?: 'HANOI' | 'HCMC';
}

export interface CheckAvailabilityOutput {
  found: boolean;
  item?: ReturnType<InventoryItem['toJSON']>;
  stockSummary?: StockCheckResult | StockCheckResult[];
}

export function executeCheckAvailability(
  items: InventoryItem[],
  input: CheckAvailabilityInput,
): CheckAvailabilityOutput {
  // Tìm item cụ thể
  if (input.serialNumber || input.sku) {
    const found = StockManagementEngine.findItem(items, {
      sku: input.sku,
      serialNumber: input.serialNumber,
      locationCode: input.locationCode,
    });

    if (found.length === 0) {
      return { found: false };
    }

    // Nếu tìm theo serial → trả 1 item
    if (input.serialNumber && found.length === 1) {
      return {
        found: true,
        item: found[0].toJSON(),
      };
    }

    // Nếu tìm theo SKU → có thể nhiều items cùng SKU
    return {
      found: true,
      item: found[0].toJSON(),
      stockSummary: input.locationCode
        ? StockManagementEngine.checkStockByLocation(items, input.locationCode)
        : undefined,
    };
  }

  // Kiểm tra tồn kho theo location hoặc branch
  if (input.branch) {
    return {
      found: true,
      stockSummary: StockManagementEngine.checkStockByBranch(items, input.branch),
    };
  }

  if (input.locationCode) {
    return {
      found: true,
      stockSummary: StockManagementEngine.checkStockByLocation(items, input.locationCode),
    };
  }

  return { found: false };
}
