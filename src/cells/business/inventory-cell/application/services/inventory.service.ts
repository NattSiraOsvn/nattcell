/**
 * NATT-OS — Inventory Cell
 * Application Service: Facade cho tất cả use cases
 * Điểm vào duy nhất cho cells khác gọi qua EDA
 */

import { InventoryItem } from '../../domain/entities/inventory-item.entity';
import { StockManagementEngine, StockAlert } from '../../domain/services/stock-management.engine';
import { ReservationEngine } from '../../domain/services/reservation.engine';
import { executeCheckAvailability, CheckAvailabilityInput, CheckAvailabilityOutput } from '../use-cases/check-availability';
import { executeReserveItem, ReserveItemInput } from '../use-cases/reserve-item';
import { executeDeductItem, DeductItemInput, DeductItemOutput } from '../use-cases/deduct-item';
import { executeReleaseReservation, ReleaseReservationInput, ReleaseReservationOutput } from '../use-cases/release-reservation';
import { ReservationResult } from '../../domain/services/reservation.engine';

export class InventoryService {
  private items: InventoryItem[] = [];

  // --- Use Cases ---

  checkAvailability(input: CheckAvailabilityInput): CheckAvailabilityOutput {
    return executeCheckAvailability(this.items, input);
  }

  reserveItem(input: ReserveItemInput): ReservationResult {
    return executeReserveItem(this.items, input);
  }

  deductItem(input: DeductItemInput): DeductItemOutput {
    return executeDeductItem(this.items, input);
  }

  releaseReservation(input: ReleaseReservationInput): ReleaseReservationOutput {
    return executeReleaseReservation(this.items, input);
  }

  // --- Operational ---

  /**
   * Quét và giải phóng reservation hết hạn
   */
  cleanupExpiredReservations(): { releasedCount: number; items: string[] } {
    const released = ReservationEngine.scanExpiredReservations(this.items);
    return {
      releasedCount: released.length,
      items: released.map(i => `${i.productName} (${i.serialNumber})`),
    };
  }

  /**
   * Sinh cảnh báo tồn kho
   */
  getStockAlerts(): StockAlert[] {
    return StockManagementEngine.generateAlerts(this.items);
  }

  /**
   * Tổng quan tồn kho toàn hệ thống
   */
  getSystemOverview(): {
    totalItems: number;
    totalRetailValue: number;
    byBranch: { hanoi: number; hcmc: number };
    byStatus: Record<string, number>;
  } {
    const statusCounts: Record<string, number> = {};
    let hanoi = 0;
    let hcmc = 0;

    for (const item of this.items) {
      statusCounts[item.status] = (statusCounts[item.status] ?? 0) + 1;
      if (item.locationCode.includes('HN')) hanoi++;
      if (item.locationCode.includes('HCM')) hcmc++;
    }

    return {
      totalItems: this.items.length,
      totalRetailValue: this.items.reduce((sum, i) => sum + i.retailPrice, 0),
      byBranch: { hanoi, hcmc },
      byStatus: statusCounts,
    };
  }
}
