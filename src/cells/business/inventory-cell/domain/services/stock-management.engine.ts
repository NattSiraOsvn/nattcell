/**
 * NATT-OS — Inventory Cell
 * Domain Service: Stock Management Engine
 * Domain: Tâm Luxury — Quản lý tồn kho trang sức cao cấp
 *
 * Engine xử lý logic nghiệp vụ cốt lõi:
 * - Kiểm tra tồn kho theo chi nhánh
 * - Nhập hàng mới
 * - Chuyển kho giữa chi nhánh
 * - Kiểm kê (inventory audit)
 * - Cảnh báo tồn kho
 *
 * Nguyên tắc: "correctness over speed" — mỗi thao tác PHẢI validate
 */

import { InventoryItem, InventoryItemProps } from '../entities/inventory-item.entity';
import { ItemStatus, IN_STOCK_STATUSES } from '../value-objects/item-status';
import { LOCATIONS, isValidLocation, isCrossBranchTransfer, BranchLocation } from '../value-objects/location-codes';
import { SERIAL_NUMBER_THRESHOLD } from '../value-objects/reservation-rules';

// --- Result Types ---

export interface StockCheckResult {
  locationCode: string;
  locationName: string;
  totalItems: number;
  available: number;
  reserved: number;
  maintenance: number;
  quarantine: number;
  inTransit: number;
  totalRetailValue: number;    // Tổng giá bán lẻ (VNĐ)
  totalCostValue: number;      // Tổng giá vốn (VNĐ)
}

export interface StockAlert {
  type: 'LOW_STOCK' | 'HIGH_VALUE_IDLE' | 'LONG_RESERVATION' | 'AUDIT_OVERDUE';
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  message: string;
  itemId?: string;
  locationCode?: string;
}

export interface TransferRequest {
  itemId: string;
  fromLocation: string;
  toLocation: string;
  reason: string;
  requestedBy: string;
}

export interface TransferResult {
  success: boolean;
  requiresApproval: boolean;
  message: string;
}

export interface ReceiveItemInput {
  sku: string;
  serialNumber: string;
  productName: string;
  categoryCode: string;
  goldType?: string;
  weightGram?: number;
  stoneValue?: number;
  retailPrice: number;
  costPrice: number;
  condition: 'NEW' | 'LIKE_NEW' | 'USED' | 'REFURBISHED';
  locationCode: string;
  notes?: string;
}

// --- Thresholds & Constants ---

/** Ngưỡng cảnh báo tồn kho thấp theo hạng mục */
const LOW_STOCK_THRESHOLDS: Record<string, number> = {
  BONG_TAI:    10,
  DAY_CHUYEN:  5,
  MAT_DAY:     8,
  VONG_TAY:    5,
  LAC_TAY:     5,
  NHAN_CUOI:   10,
  NHAN_KET:    8,
  NHAN_NAM:    5,
  NHAN_NU:     8,
  PHU_KIEN:    15,
};

/** Item trên 50 triệu VNĐ không bán trong 30 ngày = cảnh báo */
const HIGH_VALUE_IDLE_THRESHOLD_VND = 50_000_000;
const HIGH_VALUE_IDLE_DAYS = 30;

/** Reservation > 72h chưa chốt = cảnh báo */
const LONG_RESERVATION_HOURS = 72;

/** Kiểm kê phải thực hiện mỗi 30 ngày */
const AUDIT_INTERVAL_DAYS = 30;

// --- Engine ---

export class StockManagementEngine {
  /**
   * Kiểm tra tồn kho tại 1 vị trí
   */
  static checkStockByLocation(
    items: InventoryItem[],
    locationCode: string,
  ): StockCheckResult {
    const location = LOCATIONS[locationCode];
    const locationItems = items.filter(
      i => i.locationCode === locationCode && IN_STOCK_STATUSES.includes(i.status)
    );

    const byStatus = (status: ItemStatus) =>
      locationItems.filter(i => i.status === status).length;

    return {
      locationCode,
      locationName: location?.name ?? locationCode,
      totalItems: locationItems.length,
      available: byStatus('AVAILABLE'),
      reserved: byStatus('RESERVED'),
      maintenance: byStatus('MAINTENANCE'),
      quarantine: byStatus('QUARANTINE'),
      inTransit: byStatus('IN_TRANSIT'),
      totalRetailValue: locationItems.reduce((sum, i) => sum + i.retailPrice, 0),
      totalCostValue: locationItems.reduce((sum, i) => sum + i.costPrice, 0),
    };
  }

  /**
   * Kiểm tra tồn kho theo chi nhánh (gộp tất cả vị trí)
   */
  static checkStockByBranch(
    items: InventoryItem[],
    branch: 'HANOI' | 'HCMC',
  ): StockCheckResult[] {
    const branchLocations = Object.values(LOCATIONS)
      .filter(loc => loc.branch === branch);

    return branchLocations.map(loc =>
      this.checkStockByLocation(items, loc.code)
    );
  }

  /**
   * Tìm item theo SKU hoặc Serial Number
   */
  static findItem(
    items: InventoryItem[],
    query: { sku?: string; serialNumber?: string; locationCode?: string },
  ): InventoryItem[] {
    return items.filter(item => {
      if (query.sku && item.sku !== query.sku) return false;
      if (query.serialNumber && item.serialNumber !== query.serialNumber) return false;
      if (query.locationCode && item.locationCode !== query.locationCode) return false;
      return true;
    });
  }

  /**
   * Validate nhập hàng mới
   * @returns danh sách lỗi (rỗng = hợp lệ)
   */
  static validateReceiveItem(input: ReceiveItemInput): string[] {
    const errors: string[] = [];

    if (!input.sku || input.sku.trim() === '') {
      errors.push('SKU không được để trống');
    }

    if (!input.serialNumber || input.serialNumber.trim() === '') {
      errors.push('Serial Number không được để trống (bắt buộc cho luxury)');
    }

    if (input.retailPrice < 0 || input.costPrice < 0) {
      errors.push('Giá không được âm');
    }

    if (input.retailPrice > 0 && input.retailPrice < input.costPrice) {
      errors.push(`Giá bán (${input.retailPrice.toLocaleString()}) < Giá vốn (${input.costPrice.toLocaleString()}) — kiểm tra lại`);
    }

    if (!isValidLocation(input.locationCode)) {
      errors.push(`Mã vị trí không hợp lệ: ${input.locationCode}`);
    }

    // Item >= 5 triệu phải có serial
    if (input.retailPrice >= SERIAL_NUMBER_THRESHOLD && !input.serialNumber) {
      errors.push(`Item >= ${SERIAL_NUMBER_THRESHOLD.toLocaleString()} VNĐ phải có Serial Number`);
    }

    return errors;
  }

  /**
   * Validate chuyển kho
   */
  static validateTransfer(
    item: InventoryItem,
    request: TransferRequest,
  ): TransferResult {
    // Item phải AVAILABLE mới chuyển được
    if (item.status !== 'AVAILABLE') {
      return {
        success: false,
        requiresApproval: false,
        message: `Không thể chuyển kho — item đang ở trạng thái ${item.status}`,
      };
    }

    if (!isValidLocation(request.toLocation)) {
      return {
        success: false,
        requiresApproval: false,
        message: `Vị trí đích không hợp lệ: ${request.toLocation}`,
      };
    }

    if (request.fromLocation === request.toLocation) {
      return {
        success: false,
        requiresApproval: false,
        message: 'Vị trí nguồn và đích trùng nhau',
      };
    }

    // Chuyển kho cross-branch cần Gatekeeper phê duyệt
    const crossBranch = isCrossBranchTransfer(request.fromLocation, request.toLocation);

    return {
      success: true,
      requiresApproval: crossBranch,
      message: crossBranch
        ? `Chuyển kho liên chi nhánh — cần Gatekeeper phê duyệt`
        : `Chuyển kho nội bộ — thực hiện ngay`,
    };
  }

  /**
   * Sinh cảnh báo tồn kho
   */
  static generateAlerts(items: InventoryItem[]): StockAlert[] {
    const alerts: StockAlert[] = [];
    const now = new Date();

    // 1. Cảnh báo tồn kho thấp theo hạng mục × chi nhánh
    const branches: Array<'HANOI' | 'HCMC'> = ['HANOI', 'HCMC'];
    for (const branch of branches) {
      const branchCodes = Object.values(LOCATIONS)
        .filter(l => l.branch === branch)
        .map(l => l.code);

      const branchItems = items.filter(
        i => branchCodes.includes(i.locationCode) && i.status === 'AVAILABLE'
      );

      for (const [category, threshold] of Object.entries(LOW_STOCK_THRESHOLDS)) {
        const count = branchItems.filter(i => i.categoryCode === category).length;
        if (count < threshold) {
          alerts.push({
            type: 'LOW_STOCK',
            severity: count === 0 ? 'CRITICAL' : 'WARNING',
            message: `${branch}: ${category} còn ${count}/${threshold} items`,
            locationCode: branch,
          });
        }
      }
    }

    // 2. Item giá trị cao nằm lâu không bán
    for (const item of items) {
      if (item.status === 'AVAILABLE' && item.retailPrice >= HIGH_VALUE_IDLE_THRESHOLD_VND) {
        const daysSinceImport = Math.floor(
          (now.getTime() - item.importDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysSinceImport > HIGH_VALUE_IDLE_DAYS) {
          alerts.push({
            type: 'HIGH_VALUE_IDLE',
            severity: 'WARNING',
            message: `${item.productName} (${item.retailPrice.toLocaleString()} VNĐ) — ${daysSinceImport} ngày chưa bán`,
            itemId: item.id,
            locationCode: item.locationCode,
          });
        }
      }
    }

    // 3. Reservation quá lâu
    for (const item of items) {
      if (item.status === 'RESERVED' && item.reservedUntil) {
        const hoursReserved = Math.floor(
          (now.getTime() - (item.reservedUntil.getTime() - LONG_RESERVATION_HOURS * 3600000)) / 3600000
        );
        if (hoursReserved > LONG_RESERVATION_HOURS) {
          alerts.push({
            type: 'LONG_RESERVATION',
            severity: 'WARNING',
            message: `${item.productName} giữ hàng ${hoursReserved}h — vượt ${LONG_RESERVATION_HOURS}h`,
            itemId: item.id,
          });
        }
      }
    }

    // 4. Kiểm kê quá hạn
    for (const item of items) {
      if (item.lastAuditDate && !item.isTerminal()) {
        const daysSinceAudit = Math.floor(
          (now.getTime() - item.lastAuditDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysSinceAudit > AUDIT_INTERVAL_DAYS) {
          alerts.push({
            type: 'AUDIT_OVERDUE',
            severity: 'INFO',
            message: `${item.productName} — kiểm kê cuối: ${daysSinceAudit} ngày trước`,
            itemId: item.id,
          });
        }
      }
    }

    return alerts;
  }
}
